"""Configuration for the LLM Council."""

import os
from dotenv import load_dotenv

load_dotenv()

# OpenRouter API key
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# OpenRouter API endpoint
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Data directory for conversation storage
DATA_DIR = "data/conversations"

# ═══════════════════════════════════════════════════════════════════════════
# Council Modes Configuration
# ═══════════════════════════════════════════════════════════════════════════

# Chat Mode - General purpose council (default)
CHAT_COUNCIL_MODELS = [
    "openai/gpt-5.1",
    "google/gemini-3-pro-preview",
    "anthropic/claude-sonnet-4.5",
    "x-ai/grok-4",
]
CHAT_CHAIRMAN_MODEL = "google/gemini-3-pro-preview"

# Code Mode - Programming and development council
CODE_COUNCIL_MODELS = [
    "anthropic/claude-sonnet-4.5",          # Claude excels at code understanding
    "qwen/qwen3-coder",                      # Qwen3 Coder 480B - specialized for agentic coding
    "deepseek/deepseek-r1-distill-qwen-32b", # DeepSeek R1 - strong reasoning for code
    "openai/gpt-5.1",                        # GPT-5.1 - excellent code generation
]
CODE_CHAIRMAN_MODEL = "anthropic/claude-sonnet-4.5"

# Image Mode - Image generation council
IMAGE_COUNCIL_MODELS = [
    "openai/gpt-5-image",                    # GPT-5 with image generation
    "google/gemini-3-pro-image-preview",     # Nano Banana Pro - Gemini 3 Pro Image
    "google/gemini-2.5-flash-image",         # Nano Banana - Gemini 2.5 Flash Image
    "qwen/qwen-vl-max",                      # Qwen VL for vision/image tasks
]
IMAGE_CHAIRMAN_MODEL = "google/gemini-3-pro-image-preview"  # Nano Banana Pro as chairman

# Image generation specific settings
IMAGE_GENERATION_CONFIG = {
    "modalities": ["text", "image"],  # Enable both text and image output
    "image_config": {
        "aspect_ratio": "1:1",         # Default aspect ratio
    }
}

# ═══════════════════════════════════════════════════════════════════════════
# Helper functions to get mode-specific configuration
# ═══════════════════════════════════════════════════════════════════════════

def get_council_models(mode: str = "chat"):
    """Get council models for the specified mode."""
    mode = mode.lower()
    if mode == "code":
        return CODE_COUNCIL_MODELS
    elif mode == "image":
        return IMAGE_COUNCIL_MODELS
    else:
        return CHAT_COUNCIL_MODELS

def get_chairman_model(mode: str = "chat"):
    """Get chairman model for the specified mode."""
    mode = mode.lower()
    if mode == "code":
        return CODE_CHAIRMAN_MODEL
    elif mode == "image":
        return IMAGE_CHAIRMAN_MODEL
    else:
        return CHAT_CHAIRMAN_MODEL

# Legacy aliases for backward compatibility
COUNCIL_MODELS = CHAT_COUNCIL_MODELS
CHAIRMAN_MODEL = CHAT_CHAIRMAN_MODEL
