# Project Context

Essential knowledge about the LLM Council project that all agents should understand.

## Project Overview

**LLM Council** is a 3-stage deliberation system where multiple LLMs collaboratively answer user questions. The key innovation is **anonymized peer review** in Stage 2, which prevents models from favoring themselves or known competitors.

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│                      Port 5173 (dev)                         │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP/SSE
┌─────────────────────────▼───────────────────────────────────┐
│                     Backend (FastAPI)                        │
│                       Port 8001                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Stage 1: Query all council models in parallel       │    │
│  │  Stage 2: Anonymized peer ranking                    │    │
│  │  Stage 3: Chairman synthesizes final answer          │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    OpenRouter API                            │
│              (Multiple LLM providers)                        │
└─────────────────────────────────────────────────────────────┘
```

## Key Files

| File | Purpose |
|------|---------|
| `backend/config.py` | Model configuration, API keys |
| `backend/council.py` | Core 3-stage logic |
| `backend/openrouter.py` | LLM API client |
| `backend/web_search.py` | Tavily search integration |
| `backend/main.py` | FastAPI routes |
| `frontend/src/App.jsx` | Main React component |
| `frontend/src/components/` | Stage display components |

## Critical Rules

### Backend
1. **Port 8001** - NOT 8000 (conflict with another app)
2. **Relative imports** - Always use `from .module import x`
3. **Run command**: `python -m backend.main` from project root
4. **Graceful degradation**: Continue if some models fail

### Frontend
1. **ReactMarkdown wrapper**: Always use `className="markdown-content"`
2. **CSS Variables**: Use tokens from `index.css`
3. **Light theme**: Project uses light mode (not dark)
4. **Primary color**: `#4a90e2` (blue)

### Stage 2 Anonymization
- Models receive "Response A", "Response B", etc.
- De-anonymization is CLIENT-SIDE only
- Backend maintains `label_to_model` mapping
- This prevents bias in peer review

## Environment Variables

| Variable | Service | Purpose |
|----------|---------|---------|
| `OPENROUTER_API_KEY` | Backend | LLM API access |
| `TAVILY_API_KEY` | Backend | Web search |
| `FRONTEND_URL` | Backend | CORS origins |
| `VITE_API_URL` | Frontend | API endpoint |

## Data Flow

1. User submits question
2. (Optional) Tavily web search for real-time info
3. Stage 1: All council models answer in parallel
4. Stage 2: Models rank anonymized responses
5. Aggregate rankings calculated
6. Stage 3: Chairman synthesizes final answer
7. Frontend displays all stages with tabs

## Don't Forget

- Metadata (rankings, mappings) is NOT persisted
- Conversations stored as JSON in `data/conversations/`
- Frontend streaming uses Server-Sent Events (SSE)
- All async operations use `asyncio`
