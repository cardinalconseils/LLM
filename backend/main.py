"""FastAPI backend for LLM Council."""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uuid
import json
import asyncio
import httpx

from . import storage
from .council import run_full_council, generate_conversation_title, stage1_collect_responses, stage2_collect_rankings, stage3_synthesize_final, calculate_aggregate_rankings
from .config import (
    OPENROUTER_API_KEY,
    get_council_models,
    get_chairman_model,
    CHAT_COUNCIL_MODELS,
    CODE_COUNCIL_MODELS,
    IMAGE_COUNCIL_MODELS,
    CHAT_CHAIRMAN_MODEL,
    CODE_CHAIRMAN_MODEL,
    IMAGE_CHAIRMAN_MODEL,
)

app = FastAPI(title="LLM Council API", version="0.2.0")

# CORS configuration - extend with FRONTEND_URL for production
allowed_origins = ["http://localhost:5173", "http://localhost:3000"]
if os.environ.get("FRONTEND_URL"):
    # Support comma-separated list of URLs
    urls = os.environ["FRONTEND_URL"].split(",")
    allowed_origins.extend([url.strip() for url in urls])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CreateConversationRequest(BaseModel):
    """Request to create a new conversation."""
    pass


class SendMessageRequest(BaseModel):
    """Request to send a message in a conversation."""
    content: str
    mode: Optional[str] = "chat"  # chat, code, or image
    custom_models: Optional[List[str]] = None  # Override default models
    chairman_model: Optional[str] = None  # Override chairman model


class ConversationMetadata(BaseModel):
    """Conversation metadata for list view."""
    id: str
    created_at: str
    title: str
    message_count: int


class Conversation(BaseModel):
    """Full conversation with all messages."""
    id: str
    created_at: str
    title: str
    messages: List[Dict[str, Any]]


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "service": "LLM Council API"}


@app.get("/api/conversations", response_model=List[ConversationMetadata])
async def list_conversations():
    """List all conversations (metadata only)."""
    return storage.list_conversations()


@app.post("/api/conversations", response_model=Conversation)
async def create_conversation(request: CreateConversationRequest):
    """Create a new conversation."""
    conversation_id = str(uuid.uuid4())
    conversation = storage.create_conversation(conversation_id)
    return conversation


@app.get("/api/conversations/{conversation_id}", response_model=Conversation)
async def get_conversation(conversation_id: str):
    """Get a specific conversation with all its messages."""
    conversation = storage.get_conversation(conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


@app.post("/api/conversations/{conversation_id}/message")
async def send_message(conversation_id: str, request: SendMessageRequest):
    """
    Send a message and run the 3-stage council process.
    Returns the complete response with all stages.
    """
    # Check if conversation exists
    conversation = storage.get_conversation(conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Check if this is the first message
    is_first_message = len(conversation["messages"]) == 0

    # Add user message
    storage.add_user_message(conversation_id, request.content)

    # If this is the first message, generate a title
    if is_first_message:
        title = await generate_conversation_title(request.content)
        storage.update_conversation_title(conversation_id, title)

    # Run the 3-stage council process with mode and custom models
    stage1_results, stage2_results, stage3_result, metadata = await run_full_council(
        request.content,
        mode=request.mode or "chat",
        custom_models=request.custom_models,
        chairman_model=request.chairman_model
    )

    # Add assistant message with all stages
    storage.add_assistant_message(
        conversation_id,
        stage1_results,
        stage2_results,
        stage3_result
    )

    # Return the complete response with metadata
    return {
        "stage1": stage1_results,
        "stage2": stage2_results,
        "stage3": stage3_result,
        "metadata": metadata
    }


@app.post("/api/conversations/{conversation_id}/message/stream")
async def send_message_stream(conversation_id: str, request: SendMessageRequest):
    """
    Send a message and stream the 3-stage council process.
    Returns Server-Sent Events as each stage completes.
    """
    # Check if conversation exists
    conversation = storage.get_conversation(conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Check if this is the first message
    is_first_message = len(conversation["messages"]) == 0

    async def event_generator():
        try:
            # Add user message
            storage.add_user_message(conversation_id, request.content)

            # Start title generation in parallel (don't await yet)
            title_task = None
            if is_first_message:
                title_task = asyncio.create_task(generate_conversation_title(request.content))

            # Get mode and custom models from request
            mode = request.mode or "chat"
            custom_models = request.custom_models
            chairman = request.chairman_model

            # Stage 1: Collect responses
            yield f"data: {json.dumps({'type': 'stage1_start', 'mode': mode})}\n\n"
            stage1_results = await stage1_collect_responses(
                request.content, mode=mode, custom_models=custom_models
            )
            yield f"data: {json.dumps({'type': 'stage1_complete', 'data': stage1_results})}\n\n"

            # Stage 2: Collect rankings
            yield f"data: {json.dumps({'type': 'stage2_start'})}\n\n"
            stage2_results, label_to_model = await stage2_collect_rankings(
                request.content, stage1_results, mode=mode, custom_models=custom_models
            )
            aggregate_rankings = calculate_aggregate_rankings(stage2_results, label_to_model)
            yield f"data: {json.dumps({'type': 'stage2_complete', 'data': stage2_results, 'metadata': {'label_to_model': label_to_model, 'aggregate_rankings': aggregate_rankings, 'mode': mode}})}\n\n"

            # Stage 3: Synthesize final answer
            yield f"data: {json.dumps({'type': 'stage3_start'})}\n\n"
            stage3_result = await stage3_synthesize_final(
                request.content, stage1_results, stage2_results,
                mode=mode, chairman_model=chairman
            )
            yield f"data: {json.dumps({'type': 'stage3_complete', 'data': stage3_result})}\n\n"

            # Wait for title generation if it was started
            if title_task:
                title = await title_task
                storage.update_conversation_title(conversation_id, title)
                yield f"data: {json.dumps({'type': 'title_complete', 'data': {'title': title}})}\n\n"

            # Save complete assistant message
            storage.add_assistant_message(
                conversation_id,
                stage1_results,
                stage2_results,
                stage3_result
            )

            # Send completion event
            yield f"data: {json.dumps({'type': 'complete'})}\n\n"

        except Exception as e:
            # Send error event
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


# ═══════════════════════════════════════════════════════════════════════════
# Model Management Endpoints
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/api/models/available")
async def list_available_models():
    """
    Fetch available models from OpenRouter API.
    Returns a curated list of popular text generation models.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://openrouter.ai/api/v1/models",
                headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}"},
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()

            # Filter and format models
            models = []
            for model in data.get("data", []):
                model_id = model.get("id", "")
                # Filter out embedding, moderation, and deprecated models
                if any(x in model_id.lower() for x in ["embed", "moderation", "deprecated"]):
                    continue

                models.append({
                    "id": model_id,
                    "name": model.get("name", model_id),
                    "description": model.get("description", ""),
                    "context_length": model.get("context_length", 0),
                    "pricing": {
                        "prompt": model.get("pricing", {}).get("prompt", 0),
                        "completion": model.get("pricing", {}).get("completion", 0),
                    },
                    "top_provider": model.get("top_provider", {}).get("max_completion_tokens", 0),
                })

            # Sort by name
            models.sort(key=lambda x: x["name"].lower())

            return {"models": models, "count": len(models)}

    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch models: {str(e)}")


@app.get("/api/models/config")
async def get_council_config():
    """
    Get the current council configuration for all modes.
    """
    return {
        "modes": {
            "chat": {
                "name": "Chat",
                "description": "General purpose conversation",
                "council_models": CHAT_COUNCIL_MODELS,
                "chairman_model": CHAT_CHAIRMAN_MODEL,
                "icon": "chat"
            },
            "code": {
                "name": "Code",
                "description": "Programming and development",
                "council_models": CODE_COUNCIL_MODELS,
                "chairman_model": CODE_CHAIRMAN_MODEL,
                "icon": "code"
            },
            "image": {
                "name": "Image",
                "description": "Image generation and analysis",
                "council_models": IMAGE_COUNCIL_MODELS,
                "chairman_model": IMAGE_CHAIRMAN_MODEL,
                "icon": "image"
            }
        },
        "default_mode": "chat"
    }


@app.get("/api/models/popular")
async def get_popular_models():
    """
    Get a curated list of popular models for quick selection.
    """
    return {
        "popular": [
            {"id": "openai/gpt-5.1", "name": "GPT-5.1", "provider": "OpenAI"},
            {"id": "openai/gpt-4o", "name": "GPT-4o", "provider": "OpenAI"},
            {"id": "anthropic/claude-sonnet-4.5", "name": "Claude Sonnet 4.5", "provider": "Anthropic"},
            {"id": "anthropic/claude-opus-4.5", "name": "Claude Opus 4.5", "provider": "Anthropic"},
            {"id": "google/gemini-3-pro-preview", "name": "Gemini 3 Pro", "provider": "Google"},
            {"id": "google/gemini-2.5-flash-preview", "name": "Gemini 2.5 Flash", "provider": "Google"},
            {"id": "x-ai/grok-4", "name": "Grok 4", "provider": "xAI"},
            {"id": "meta-llama/llama-4-maverick", "name": "Llama 4 Maverick", "provider": "Meta"},
            {"id": "deepseek/deepseek-r1", "name": "DeepSeek R1", "provider": "DeepSeek"},
            {"id": "qwen/qwen3-coder", "name": "Qwen3 Coder", "provider": "Alibaba"},
            {"id": "mistralai/mistral-large-2411", "name": "Mistral Large", "provider": "Mistral"},
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
