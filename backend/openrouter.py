"""OpenRouter API client for making LLM requests."""

import httpx
from typing import List, Dict, Any, Optional
from .config import OPENROUTER_API_KEY, OPENROUTER_API_URL, IMAGE_GENERATION_CONFIG


async def query_model(
    model: str,
    messages: List[Dict[str, str]],
    timeout: float = 120.0,
    enable_image_generation: bool = False
) -> Optional[Dict[str, Any]]:
    """
    Query a single model via OpenRouter API.

    Args:
        model: OpenRouter model identifier (e.g., "openai/gpt-4o")
        messages: List of message dicts with 'role' and 'content'
        timeout: Request timeout in seconds
        enable_image_generation: Enable image generation modalities

    Returns:
        Response dict with 'content', optional 'reasoning_details', and optional 'images'
    """
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": model,
        "messages": messages,
    }

    # Add image generation configuration if enabled
    if enable_image_generation:
        payload["modalities"] = IMAGE_GENERATION_CONFIG["modalities"]
        payload["image_config"] = IMAGE_GENERATION_CONFIG["image_config"]

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(
                OPENROUTER_API_URL,
                headers=headers,
                json=payload
            )
            response.raise_for_status()

            data = response.json()
            message = data['choices'][0]['message']

            result = {
                'content': message.get('content'),
                'reasoning_details': message.get('reasoning_details')
            }

            # Extract images if present (base64 encoded in content blocks)
            if enable_image_generation and message.get('content'):
                images = extract_images_from_content(message.get('content'))
                if images:
                    result['images'] = images

            return result

    except Exception as e:
        print(f"Error querying model {model}: {e}")
        return None


def extract_images_from_content(content: Any) -> List[str]:
    """
    Extract base64 image data URLs from model response content.

    OpenRouter returns images as base64 data URLs within the content.
    This function extracts them for separate handling.
    """
    images = []

    if isinstance(content, list):
        # Content might be a list of content blocks
        for block in content:
            if isinstance(block, dict):
                if block.get('type') == 'image_url':
                    url = block.get('image_url', {}).get('url', '')
                    if url.startswith('data:image'):
                        images.append(url)
                elif block.get('type') == 'image':
                    # Alternative format
                    if 'data' in block:
                        images.append(f"data:image/png;base64,{block['data']}")
    elif isinstance(content, str):
        # Check for embedded base64 images in markdown format
        import re
        pattern = r'data:image/[^;]+;base64,[A-Za-z0-9+/=]+'
        matches = re.findall(pattern, content)
        images.extend(matches)

    return images


async def query_models_parallel(
    models: List[str],
    messages: List[Dict[str, str]],
    enable_image_generation: bool = False
) -> Dict[str, Optional[Dict[str, Any]]]:
    """
    Query multiple models in parallel.

    Args:
        models: List of OpenRouter model identifiers
        messages: List of message dicts to send to each model
        enable_image_generation: Enable image generation modalities

    Returns:
        Dict mapping model identifier to response dict (or None if failed)
    """
    import asyncio

    # Create tasks for all models
    tasks = [
        query_model(model, messages, enable_image_generation=enable_image_generation)
        for model in models
    ]

    # Wait for all to complete
    responses = await asyncio.gather(*tasks)

    # Map models to their responses
    return {model: response for model, response in zip(models, responses)}
