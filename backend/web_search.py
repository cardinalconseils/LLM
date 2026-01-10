"""Web search integration using Tavily API."""

import os
import re
from typing import Optional, Dict, Any
import httpx

TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY")
TAVILY_SEARCH_URL = "https://api.tavily.com/search"

# Keywords that suggest a query needs current/real-time information
CURRENT_INFO_PATTERNS = [
    r'\b(today|tonight|yesterday|this week|this month|this year)\b',
    r'\b(latest|recent|current|new|breaking|update)\b',
    r'\b(2024|2025|2026)\b',
    r'\b(price|cost|stock|weather|news|score|result)\b',
    r'\b(who is|what is the current|what happened)\b',
    r'\b(how much does|where can i buy|is .+ open)\b',
]


def needs_web_search(query: str) -> bool:
    """
    Determine if a query would benefit from web search.

    Args:
        query: The user's question

    Returns:
        True if web search would likely help answer the query
    """
    if not TAVILY_API_KEY:
        return False

    query_lower = query.lower()

    for pattern in CURRENT_INFO_PATTERNS:
        if re.search(pattern, query_lower, re.IGNORECASE):
            return True

    return False


async def search_web(query: str, max_results: int = 5) -> Optional[Dict[str, Any]]:
    """
    Search the web using Tavily API.

    Args:
        query: Search query
        max_results: Maximum number of results to return

    Returns:
        Dict with search results or None if search fails
    """
    if not TAVILY_API_KEY:
        return None

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                TAVILY_SEARCH_URL,
                json={
                    "api_key": TAVILY_API_KEY,
                    "query": query,
                    "max_results": max_results,
                    "include_answer": True,
                    "include_raw_content": False,
                    "search_depth": "basic"
                }
            )

            if response.status_code == 200:
                return response.json()
            else:
                print(f"Tavily search failed: {response.status_code} - {response.text}")
                return None

    except Exception as e:
        print(f"Tavily search error: {e}")
        return None


def format_search_results(results: Dict[str, Any]) -> str:
    """
    Format search results into a context string for the LLM.

    Args:
        results: Raw search results from Tavily

    Returns:
        Formatted string with search context
    """
    if not results:
        return ""

    parts = []

    # Include Tavily's AI-generated answer if available
    if results.get("answer"):
        parts.append(f"**Quick Answer:** {results['answer']}")

    # Include individual search results
    search_results = results.get("results", [])
    if search_results:
        parts.append("\n**Web Search Results:**")
        for i, result in enumerate(search_results[:5], 1):
            title = result.get("title", "No title")
            content = result.get("content", "")[:500]  # Limit content length
            url = result.get("url", "")
            parts.append(f"\n{i}. **{title}**")
            parts.append(f"   {content}")
            if url:
                parts.append(f"   Source: {url}")

    return "\n".join(parts)


async def get_search_context(query: str) -> Optional[str]:
    """
    Get formatted search context for a query if web search would be helpful.

    Args:
        query: The user's question

    Returns:
        Formatted search context string, or None if search not needed/failed
    """
    if not needs_web_search(query):
        return None

    results = await search_web(query)
    if not results:
        return None

    return format_search_results(results)
