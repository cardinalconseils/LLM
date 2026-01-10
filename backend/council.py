"""3-stage LLM Council orchestration with multi-mode support."""

from typing import List, Dict, Any, Tuple, Optional
try:
    from .openrouter import query_models_parallel, query_model
    from .config import (
        COUNCIL_MODELS, CHAIRMAN_MODEL,
        get_council_models, get_chairman_model
    )
    from .web_search import get_search_context
except ImportError:
    from openrouter import query_models_parallel, query_model
    from config import (
        COUNCIL_MODELS, CHAIRMAN_MODEL,
        get_council_models, get_chairman_model
    )
    from web_search import get_search_context


# ═══════════════════════════════════════════════════════════════════════════
# Mode-specific prompt templates
# ═══════════════════════════════════════════════════════════════════════════

CODE_MODE_SYSTEM_PROMPT = """You are an expert software engineer participating in a code review council.
Focus on:
- Code correctness and best practices
- Security considerations
- Performance optimization
- Clean, maintainable code
- Clear explanations of your reasoning

Provide your response with code examples when appropriate, using proper markdown code blocks."""

IMAGE_MODE_SYSTEM_PROMPT = """You are a creative AI artist participating in an image generation council.
Focus on:
- Interpreting the user's creative vision
- Generating high-quality, detailed images
- Artistic composition and aesthetics
- Following the prompt instructions precisely

Generate an image based on the user's description."""


async def stage1_collect_responses(
    user_query: str,
    search_context: Optional[str] = None,
    mode: str = "chat",
    custom_models: Optional[List[str]] = None
) -> List[Dict[str, Any]]:
    """
    Stage 1: Collect individual responses from all council models.

    Args:
        user_query: The user's question
        search_context: Optional web search results to include
        mode: Council mode - "chat", "code", or "image"
        custom_models: Optional list of models to override defaults

    Returns:
        List of dicts with 'model', 'response', and optional 'images' keys
    """
    # Get mode-specific models or use custom models if provided
    council_models = custom_models if custom_models else get_council_models(mode)
    enable_image_generation = (mode == "image")

    # Build the prompt based on mode
    if mode == "code":
        system_prompt = CODE_MODE_SYSTEM_PROMPT
        prompt = f"Code Task:\n\n{user_query}"
    elif mode == "image":
        system_prompt = IMAGE_MODE_SYSTEM_PROMPT
        prompt = f"Image Generation Request:\n\n{user_query}"
    else:
        system_prompt = None
        # Build the prompt, optionally including search context
        if search_context:
            prompt = f"""The following web search results may be helpful for answering the question:

{search_context}

---

Question: {user_query}

Please provide a comprehensive answer, using the search results above if relevant."""
        else:
            prompt = user_query

    # Build messages with optional system prompt
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    # Query all models in parallel
    responses = await query_models_parallel(
        council_models,
        messages,
        enable_image_generation=enable_image_generation
    )

    # Format results
    stage1_results = []
    for model, response in responses.items():
        if response is not None:  # Only include successful responses
            result = {
                "model": model,
                "response": response.get('content', '')
            }
            # Include images if present (for image mode)
            if response.get('images'):
                result['images'] = response['images']
            stage1_results.append(result)

    return stage1_results


async def stage2_collect_rankings(
    user_query: str,
    stage1_results: List[Dict[str, Any]],
    mode: str = "chat",
    custom_models: Optional[List[str]] = None
) -> Tuple[List[Dict[str, Any]], Dict[str, str]]:
    """
    Stage 2: Each model ranks the anonymized responses.

    Args:
        user_query: The original user query
        stage1_results: Results from Stage 1
        mode: Council mode - "chat", "code", or "image"
        custom_models: Optional list of models to override defaults

    Returns:
        Tuple of (rankings list, label_to_model mapping)
    """
    # Get mode-specific models or use custom models if provided
    council_models = custom_models if custom_models else get_council_models(mode)

    # Create anonymized labels for responses (Response A, Response B, etc.)
    labels = [chr(65 + i) for i in range(len(stage1_results))]  # A, B, C, ...

    # Create mapping from label to model name
    label_to_model = {
        f"Response {label}": result['model']
        for label, result in zip(labels, stage1_results)
    }

    # Build the response text based on mode
    if mode == "image":
        # For image mode, include both text and image info
        responses_text = "\n\n".join([
            f"Response {label}:\n{result['response']}" +
            (f"\n[Generated {len(result.get('images', []))} image(s)]" if result.get('images') else "")
            for label, result in zip(labels, stage1_results)
        ])
        mode_context = "image generation task"
        evaluation_criteria = """
- Quality and accuracy of the generated image
- Adherence to the prompt instructions
- Artistic composition and aesthetics
- Creativity and interpretation"""
    elif mode == "code":
        responses_text = "\n\n".join([
            f"Response {label}:\n{result['response']}"
            for label, result in zip(labels, stage1_results)
        ])
        mode_context = "code generation/review task"
        evaluation_criteria = """
- Code correctness and functionality
- Best practices and clean code principles
- Security considerations
- Performance and efficiency
- Clarity of explanations"""
    else:
        responses_text = "\n\n".join([
            f"Response {label}:\n{result['response']}"
            for label, result in zip(labels, stage1_results)
        ])
        mode_context = "question"
        evaluation_criteria = """
- Accuracy and correctness
- Comprehensiveness and depth
- Clarity of explanation
- Practical usefulness"""

    ranking_prompt = f"""You are evaluating different responses to the following {mode_context}:

Question: {user_query}

Here are the responses from different models (anonymized):

{responses_text}

Your task:
1. First, evaluate each response individually based on:{evaluation_criteria}
2. Then, at the very end of your response, provide a final ranking.

IMPORTANT: Your final ranking MUST be formatted EXACTLY as follows:
- Start with the line "FINAL RANKING:" (all caps, with colon)
- Then list the responses from best to worst as a numbered list
- Each line should be: number, period, space, then ONLY the response label (e.g., "1. Response A")
- Do not add any other text or explanations in the ranking section

Example of the correct format for your ENTIRE response:

Response A provides good detail on X but misses Y...
Response B is accurate but lacks depth on Z...
Response C offers the most comprehensive answer...

FINAL RANKING:
1. Response C
2. Response A
3. Response B

Now provide your evaluation and ranking:"""

    messages = [{"role": "user", "content": ranking_prompt}]

    # Get rankings from all council models in parallel
    responses = await query_models_parallel(council_models, messages)

    # Format results
    stage2_results = []
    for model, response in responses.items():
        if response is not None:
            full_text = response.get('content', '')
            parsed = parse_ranking_from_text(full_text)
            stage2_results.append({
                "model": model,
                "ranking": full_text,
                "parsed_ranking": parsed
            })

    return stage2_results, label_to_model


async def stage3_synthesize_final(
    user_query: str,
    stage1_results: List[Dict[str, Any]],
    stage2_results: List[Dict[str, Any]],
    mode: str = "chat",
    chairman_model: Optional[str] = None
) -> Dict[str, Any]:
    """
    Stage 3: Chairman synthesizes final response.

    Args:
        user_query: The original user query
        stage1_results: Individual model responses from Stage 1
        stage2_results: Rankings from Stage 2
        mode: Council mode - "chat", "code", or "image"
        chairman_model: Optional specific chairman model to use

    Returns:
        Dict with 'model' and 'response' keys
    """
    # Get the chairman model (custom or mode-specific)
    chair = chairman_model if chairman_model else get_chairman_model(mode)
    enable_image_generation = (mode == "image")

    # Build comprehensive context for chairman (mode-specific)
    if mode == "image":
        stage1_text = "\n\n".join([
            f"Model: {result['model']}\nDescription: {result['response']}" +
            (f"\n[Generated {len(result.get('images', []))} image(s)]" if result.get('images') else "")
            for result in stage1_results
        ])
    else:
        stage1_text = "\n\n".join([
            f"Model: {result['model']}\nResponse: {result['response']}"
            for result in stage1_results
        ])

    stage2_text = "\n\n".join([
        f"Model: {result['model']}\nRanking: {result['ranking']}"
        for result in stage2_results
    ])

    # Mode-specific chairman prompts
    if mode == "code":
        chairman_prompt = f"""You are the Lead Architect of a Code Council. Multiple expert developers have provided solutions to a coding task, and then reviewed each other's code.

Original Code Task: {user_query}

STAGE 1 - Individual Solutions:
{stage1_text}

STAGE 2 - Peer Reviews:
{stage2_text}

Your task as Lead Architect is to synthesize all solutions into the BEST possible implementation. Consider:
- Code correctness from all submissions
- Best practices identified in reviews
- Security and performance optimizations suggested
- The consensus of peer rankings

Provide the definitive solution with clean, well-documented code:"""
    elif mode == "image":
        chairman_prompt = f"""You are the Creative Director of an Image Council. Multiple AI artists have created interpretations of an image request, and then evaluated each other's work.

Original Image Request: {user_query}

STAGE 1 - Individual Creations:
{stage1_text}

STAGE 2 - Peer Evaluations:
{stage2_text}

Your task as Creative Director is to create the DEFINITIVE image that best represents the user's vision. Consider:
- The most praised elements from each submission
- The artistic insights from peer evaluations
- The consensus on what works best
- The original user intent

Generate the final, best interpretation of the user's request:"""
    else:
        chairman_prompt = f"""You are the Chairman of an LLM Council. Multiple AI models have provided responses to a user's question, and then ranked each other's responses.

Original Question: {user_query}

STAGE 1 - Individual Responses:
{stage1_text}

STAGE 2 - Peer Rankings:
{stage2_text}

Your task as Chairman is to synthesize all of this information into a single, comprehensive, accurate answer to the user's original question. Consider:
- The individual responses and their insights
- The peer rankings and what they reveal about response quality
- Any patterns of agreement or disagreement

Provide a clear, well-reasoned final answer that represents the council's collective wisdom:"""

    messages = [{"role": "user", "content": chairman_prompt}]

    # Query the chairman model
    response = await query_model(
        chair,
        messages,
        enable_image_generation=enable_image_generation
    )

    if response is None:
        # Fallback if chairman fails
        return {
            "model": chair,
            "response": "Error: Unable to generate final synthesis."
        }

    result = {
        "model": chair,
        "response": response.get('content', '')
    }

    # Include images if generated (for image mode)
    if response.get('images'):
        result['images'] = response['images']

    return result


def parse_ranking_from_text(ranking_text: str) -> List[str]:
    """
    Parse the FINAL RANKING section from the model's response.

    Args:
        ranking_text: The full text response from the model

    Returns:
        List of response labels in ranked order
    """
    import re

    # Look for "FINAL RANKING:" section
    if "FINAL RANKING:" in ranking_text:
        # Extract everything after "FINAL RANKING:"
        parts = ranking_text.split("FINAL RANKING:")
        if len(parts) >= 2:
            ranking_section = parts[1]
            # Try to extract numbered list format (e.g., "1. Response A")
            # This pattern looks for: number, period, optional space, "Response X"
            numbered_matches = re.findall(r'\d+\.\s*Response [A-Z]', ranking_section)
            if numbered_matches:
                # Extract just the "Response X" part
                return [re.search(r'Response [A-Z]', m).group() for m in numbered_matches]

            # Fallback: Extract all "Response X" patterns in order
            matches = re.findall(r'Response [A-Z]', ranking_section)
            return matches

    # Fallback: try to find any "Response X" patterns in order
    matches = re.findall(r'Response [A-Z]', ranking_text)
    return matches


def calculate_aggregate_rankings(
    stage2_results: List[Dict[str, Any]],
    label_to_model: Dict[str, str]
) -> List[Dict[str, Any]]:
    """
    Calculate aggregate rankings across all models.

    Args:
        stage2_results: Rankings from each model
        label_to_model: Mapping from anonymous labels to model names

    Returns:
        List of dicts with model name and average rank, sorted best to worst
    """
    from collections import defaultdict

    # Track positions for each model
    model_positions = defaultdict(list)

    for ranking in stage2_results:
        ranking_text = ranking['ranking']

        # Parse the ranking from the structured format
        parsed_ranking = parse_ranking_from_text(ranking_text)

        for position, label in enumerate(parsed_ranking, start=1):
            if label in label_to_model:
                model_name = label_to_model[label]
                model_positions[model_name].append(position)

    # Calculate average position for each model
    aggregate = []
    for model, positions in model_positions.items():
        if positions:
            avg_rank = sum(positions) / len(positions)
            aggregate.append({
                "model": model,
                "average_rank": round(avg_rank, 2),
                "rankings_count": len(positions)
            })

    # Sort by average rank (lower is better)
    aggregate.sort(key=lambda x: x['average_rank'])

    return aggregate


async def generate_conversation_title(user_query: str) -> str:
    """
    Generate a short title for a conversation based on the first user message.

    Args:
        user_query: The first user message

    Returns:
        A short title (3-5 words)
    """
    title_prompt = f"""Generate a very short title (3-5 words maximum) that summarizes the following question.
The title should be concise and descriptive. Do not use quotes or punctuation in the title.

Question: {user_query}

Title:"""

    messages = [{"role": "user", "content": title_prompt}]

    # Use gemini-2.5-flash for title generation (fast and cheap)
    response = await query_model("google/gemini-2.5-flash", messages, timeout=30.0)

    if response is None:
        # Fallback to a generic title
        return "New Conversation"

    title = response.get('content', 'New Conversation').strip()

    # Clean up the title - remove quotes, limit length
    title = title.strip('"\'')

    # Truncate if too long
    if len(title) > 50:
        title = title[:47] + "..."

    return title


async def run_full_council(
    user_query: str,
    mode: str = "chat",
    custom_models: Optional[List[str]] = None,
    chairman_model: Optional[str] = None
) -> Tuple[List, List, Dict, Dict]:
    """
    Run the complete 3-stage council process.

    Args:
        user_query: The user's question
        mode: Council mode - "chat", "code", or "image"
        custom_models: Optional list of models to override defaults
        chairman_model: Optional specific chairman model to use

    Returns:
        Tuple of (stage1_results, stage2_results, stage3_result, metadata)
    """
    # Check if web search would help and fetch context
    search_context = await get_search_context(user_query)

    # Stage 1: Collect individual responses (with search context if available)
    stage1_results = await stage1_collect_responses(
        user_query, search_context, mode=mode, custom_models=custom_models
    )

    # If no models responded successfully, return error
    if not stage1_results:
        return [], [], {
            "model": "error",
            "response": "All models failed to respond. Please try again."
        }, {}

    # Stage 2: Collect rankings
    stage2_results, label_to_model = await stage2_collect_rankings(
        user_query, stage1_results, mode=mode, custom_models=custom_models
    )

    # Calculate aggregate rankings
    aggregate_rankings = calculate_aggregate_rankings(stage2_results, label_to_model)

    # Stage 3: Synthesize final answer
    stage3_result = await stage3_synthesize_final(
        user_query,
        stage1_results,
        stage2_results,
        mode=mode,
        chairman_model=chairman_model
    )

    # Prepare metadata
    metadata = {
        "label_to_model": label_to_model,
        "aggregate_rankings": aggregate_rankings,
        "web_search_used": search_context is not None,
        "search_context": search_context,
        "mode": mode,
        "council_models": custom_models if custom_models else get_council_models(mode),
        "chairman_model": chairman_model if chairman_model else get_chairman_model(mode)
    }

    return stage1_results, stage2_results, stage3_result, metadata
