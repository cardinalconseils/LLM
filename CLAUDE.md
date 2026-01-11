# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LLM Council is a 3-stage deliberation system where multiple LLMs collaboratively answer user questions. The key innovation is anonymized peer review in Stage 2, preventing models from playing favorites.

## Development Commands

### Setup
**Backend:**
```bash
uv sync
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

**Environment:**
Create `.env` file in project root:
```bash
OPENROUTER_API_KEY=sk-or-v1-...
TAVILY_API_KEY=tvly-...  # Optional for web search
```

### Running Locally
**Option 1: Use start script**
```bash
./start.sh
```

**Option 2: Manual (two terminals)**
```bash
# Terminal 1 - Backend
uv run python -m backend.main

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Then open http://localhost:5173

### Building Frontend
```bash
cd frontend
npm run build    # Builds to dist/
npm run preview  # Preview production build locally
```

## Multi-Mode Council System

The LLM Council supports three specialized modes, each with its own council of expert models:

### Chat Mode (Default)
- **Purpose**: General purpose conversation and Q&A
- **Council Models**: GPT-5.1, Gemini 3 Pro, Claude Sonnet 4.5, Grok 4
- **Chairman**: Gemini 3 Pro
- **Use Case**: Knowledge questions, analysis, explanations

### Code Mode
- **Purpose**: Programming and software development
- **Council Models**: Claude Sonnet 4.5, Qwen3 Coder 480B, DeepSeek R1, GPT-5.1
- **Chairman**: Claude Sonnet 4.5
- **Features**: System prompt optimized for code review, security analysis, best practices
- **Use Case**: Code generation, debugging, refactoring, architecture review

### Image Mode
- **Purpose**: Image generation and creative tasks
- **Council Models**: GPT-5 Image, Gemini Flash Image (Nano ChatGPT), Qwen VL Max
- **Chairman**: GPT-5 Image
- **Features**: Uses `modalities: ["text", "image"]` for image output
- **Use Case**: Image generation from text descriptions

### Mode Selection
- Claude Desktop-like toggle at top of chat interface
- API supports `mode` parameter in request body
- Each mode has optimized prompts for its domain

## Architecture

### Backend Structure (`backend/`)

**`config.py`** - Multi-Mode Configuration
- Contains mode-specific model lists:
  - `CHAT_COUNCIL_MODELS` / `CHAT_CHAIRMAN_MODEL`
  - `CODE_COUNCIL_MODELS` / `CODE_CHAIRMAN_MODEL`
  - `IMAGE_COUNCIL_MODELS` / `IMAGE_CHAIRMAN_MODEL`
- Helper functions: `get_council_models(mode)`, `get_chairman_model(mode)`
- `IMAGE_GENERATION_CONFIG`: Settings for image output (modalities, aspect ratio)
- Uses environment variable `OPENROUTER_API_KEY` from `.env`
- Uses environment variable `TAVILY_API_KEY` from `.env` (for web search)
- Backend runs on **port 8001** (NOT 8000 - user had another app on 8000)

**`openrouter.py`** - OpenRouter API Client
- `query_model()`: Single async model query, supports `enable_image_generation` flag
- `query_models_parallel()`: Parallel queries using `asyncio.gather()`
- `extract_images_from_content()`: Extracts base64 image data from responses
- Returns dict with 'content', optional 'reasoning_details', and optional 'images'
- Graceful degradation: returns None on failure, continues with successful responses

**`council.py`** - The Core Logic (Multi-Mode Support)
- All stage functions accept `mode` parameter: "chat", "code", or "image"
- Mode-specific system prompts: `CODE_MODE_SYSTEM_PROMPT`, `IMAGE_MODE_SYSTEM_PROMPT`
- `stage1_collect_responses(mode)`: Parallel queries with mode-appropriate prompts
- `stage2_collect_rankings(mode)`: Mode-specific evaluation criteria
- `stage3_synthesize_final(mode)`: Role-based synthesis (Chairman, Lead Architect, Creative Director)
- `parse_ranking_from_text()`: Extracts "FINAL RANKING:" section
- `calculate_aggregate_rankings()`: Computes average rank position
- `run_full_council(mode, custom_models, chairman_model)`: Orchestrates all stages with mode support

**`web_search.py`** - Tavily Web Search Integration
- `needs_web_search()`: Detects if query needs real-time information (keywords: "today", "latest", "2025", "price", "news", etc.)
- `search_web()`: Calls Tavily API to fetch search results
- `format_search_results()`: Formats results into context string for LLMs
- `get_search_context()`: Main entry point - returns formatted search context or None
- Uses environment variable `TAVILY_API_KEY` from `.env`
- All council models receive identical search context for fair comparison

**`storage.py`**
- JSON-based conversation storage in `data/conversations/`
- Each conversation: `{id, created_at, messages[]}`
- Assistant messages contain: `{role, stage1, stage2, stage3}`
- Note: metadata (label_to_model, aggregate_rankings) is NOT persisted to storage, only returned via API

**`main.py`** - FastAPI Endpoints
- FastAPI app with CORS enabled for localhost:5173 and localhost:3000
- POST `/api/conversations/{id}/message` - Send message with optional mode
  - Request body: `{content, mode, custom_models, chairman_model}`
- POST `/api/conversations/{id}/message/stream` - **SSE streaming endpoint (primary method)**
  - Returns Server-Sent Events as each stage completes
  - Frontend uses this by default for progressive UI updates
  - Events: `stage1_start`, `stage1_complete`, `stage2_start`, `stage2_complete`, `stage3_start`, `stage3_complete`, `title_complete`, `complete`, `error`
- GET `/api/models/config` - Returns mode-specific council configurations
- GET `/api/models/available` - Lists all available OpenRouter models
- GET `/api/models/popular` - Curated list of popular models

### Frontend Structure (`frontend/src/`)

**`App.jsx`**
- Main orchestration: manages conversations list and current conversation
- State: `councilMode`, `customModels`, `chairmanModel` for mode configuration
- **Streaming Support**: Uses `api.sendMessageStream()` for progressive UI updates
  - Optimistically adds user message to UI
  - Updates assistant message as each stage completes
  - Handles loading states per stage (`loading.stage1`, `loading.stage2`, `loading.stage3`)
- Important: metadata is stored in the UI state for display but not persisted to backend JSON

**`components/ModeToggle.jsx`** - Claude Desktop Style Toggle
- Three-button toggle: Chat, Code, Image
- Animated sliding indicator
- Mode-specific icons and descriptions
- Disabled state during loading

**`components/ModelSelector.jsx`** - Model Configuration Modal
- View/modify council models per mode
- Select from available OpenRouter models
- Override default chairman model

**`components/ChatInterface.jsx`**
- Multiline textarea (3 rows, resizable)
- Enter to send, Shift+Enter for new line
- Mode selector grid in empty state
- User messages wrapped in markdown-content class for padding

**`components/Stage1.jsx`**
- Tab view of individual model responses
- ReactMarkdown rendering with markdown-content wrapper

**`components/Stage2.jsx`**
- **Critical Feature**: Tab view showing RAW evaluation text from each model
- De-anonymization happens CLIENT-SIDE for display (models receive anonymous labels)
- Shows "Extracted Ranking" below each evaluation so users can validate parsing
- Aggregate rankings shown with average position and vote count
- Explanatory text clarifies that boldface model names are for readability only

**`components/Stage3.jsx`**
- Final synthesized answer from chairman
- Green-tinted background (#f0fff0) to highlight conclusion

**Styling (`*.css`)**
- Light mode theme (not dark mode)
- Primary color: #4a90e2 (blue)
- Global markdown styling in `index.css` with `.markdown-content` class
- 12px padding on all markdown content to prevent cluttered appearance

## Key Design Decisions

### Stage 2 Prompt Format
The Stage 2 prompt is very specific to ensure parseable output:
```
1. Evaluate each response individually first
2. Provide "FINAL RANKING:" header
3. Numbered list format: "1. Response C", "2. Response A", etc.
4. No additional text after ranking section
```

This strict format allows reliable parsing while still getting thoughtful evaluations.

### De-anonymization Strategy
- Models receive: "Response A", "Response B", etc.
- Backend creates mapping: `{"Response A": "openai/gpt-5.1", ...}`
- Frontend displays model names in **bold** for readability
- Users see explanation that original evaluation used anonymous labels
- This prevents bias while maintaining transparency

### Error Handling Philosophy
- Continue with successful responses if some models fail (graceful degradation)
- Never fail the entire request due to single model failure
- Log errors but don't expose to user unless all models fail

### UI/UX Transparency
- All raw outputs are inspectable via tabs
- Parsed rankings shown below raw text for validation
- Users can verify system's interpretation of model outputs
- This builds trust and allows debugging of edge cases

## Important Implementation Details

### Relative Imports
All backend modules use relative imports (e.g., `from .config import ...`) not absolute imports. This is critical for Python's module system to work correctly when running as `python -m backend.main`.

### Port Configuration
- Backend: 8001 (changed from 8000 to avoid conflict)
- Frontend: 5173 (Vite default)
- Frontend API URL is configured via `VITE_API_URL` env var (defaults to `http://localhost:8001`)
- Update `backend/main.py` CORS middleware if changing frontend URL

### Markdown Rendering
All ReactMarkdown components must be wrapped in `<div className="markdown-content">` for proper spacing. This class is defined globally in `index.css`.

### Model Configuration
Models are hardcoded in `backend/config.py`. Chairman can be same or different from council members. The current default is Gemini as chairman per user preference.

## Common Gotchas

1. **Module Import Errors**: Always run backend as `python -m backend.main` from project root, not from backend directory
2. **CORS Issues**: Frontend must match allowed origins in `main.py` CORS middleware
3. **Ranking Parse Failures**: If models don't follow format, fallback regex extracts any "Response X" patterns in order
4. **Missing Metadata**: Metadata is ephemeral (not persisted), only available in API responses
5. **Web Search Not Working**: Check `TAVILY_API_KEY` is set; search only triggers for specific keywords

## Deployment (Railway)

### Environment Variables Required
**Backend service:**
- `OPENROUTER_API_KEY` - For LLM API calls
- `TAVILY_API_KEY` - For web search (optional but recommended)
- `FRONTEND_URL` - Comma-separated allowed origins for CORS (e.g., `https://llm.example.com`)

**Frontend service:**
- `VITE_API_URL` - Backend API URL (e.g., `https://backend-production-xxx.up.railway.app`)
- `NIXPACKS_NODE_VERSION` - Set to `22` for Vite 7 and @vitejs/plugin-react@5.x compatibility

### Railway Configuration
- Backend: Root directory `/` (uses root `railway.toml`)
- Frontend: Root directory `frontend` (uses `frontend/railway.toml`)

## Future Enhancement Ideas

- ~~Configurable council/chairman via UI instead of config file~~ ✅ Implemented (ModelSelector)
- ~~Streaming responses instead of batch loading~~ ✅ Implemented (SSE streaming)
- ~~Mode-specific councils (chat, code, image)~~ ✅ Implemented
- Export conversations to markdown/PDF
- Model performance analytics over time
- Custom ranking criteria (not just accuracy/insight)
- Support for reasoning models (o1, etc.) with special handling
- Image gallery view for image mode results
- Code syntax highlighting in code mode responses

## Testing Notes

Use `test_openrouter.py` to verify API connectivity and test different model identifiers before adding to council. The script tests both streaming and non-streaming modes.

## Data Flow Summary

```
User Query + Mode Selection (chat/code/image)
    ↓
Mode-Specific Model Selection → [get_council_models(mode)]
    ↓
[Chat only] Web Search Check → [if keywords detected]
    ↓
[Chat only] Tavily Search → [formatted search context]
    ↓
Stage 1: Parallel queries → [individual responses + images for image mode]
    ├─ Chat: Standard prompts
    ├─ Code: CODE_MODE_SYSTEM_PROMPT (code review focus)
    └─ Image: IMAGE_MODE_SYSTEM_PROMPT (image generation)
    ↓
Stage 2: Anonymize → Parallel ranking queries
    ├─ Chat: Accuracy & comprehensiveness criteria
    ├─ Code: Correctness, security, performance criteria
    └─ Image: Quality, aesthetics, adherence criteria
    ↓
Aggregate Rankings Calculation → [sorted by avg position]
    ↓
Stage 3: Role-based synthesis
    ├─ Chat: Chairman synthesizes
    ├─ Code: Lead Architect synthesizes best implementation
    └─ Image: Creative Director synthesizes best interpretation
    ↓
Return: {stage1, stage2, stage3, metadata (mode, council_models, chairman_model)}
    ↓
Frontend: Display with mode-specific UI
```

The entire flow is async/parallel where possible to minimize latency.

### Web Search Integration
- Automatically triggers for queries needing real-time information
- All council models receive **identical** search context (ensures fair comparison)
- Metadata includes `web_search_used` boolean and `search_context` string
- Graceful degradation: if Tavily fails or no API key, council proceeds without search

## Claude Code Configuration (`.claude/`)

The project includes Claude Code configuration files for enhanced development workflows.

### Directory Structure
```
.claude/
├── settings.json              # Project settings and code style preferences
├── hooks.json                 # Pre/post edit and commit hooks
├── mcp.json                   # MCP server configurations
├── commands/                  # Custom slash commands
│   ├── dev.md                 # /dev - Start development servers
│   ├── status.md              # /status - Check system status
│   ├── models.md              # /models - View/manage council models
│   ├── api-test.md            # /api-test - Test OpenRouter connectivity
│   ├── test-council.md        # /test-council - Run test query through council
│   └── debug-ranking.md       # /debug-ranking - Debug ranking parse issues
├── agents/                    # Specialized agent definitions
│   ├── council-debugger.md        # Debug council response issues
│   ├── api-monitor.md             # Monitor API connectivity
│   ├── frontend-helper.md         # Frontend React/CSS assistance
│   ├── prompt-engineer.md         # Optimize council prompts
│   ├── documentation-librarian.md # Documentation & knowledge management
│   └── deployment-specialist.md   # Railway, GitHub Actions, CI/CD
├── prompts/                   # Reusable prompt templates
│   ├── add-council-model.md       # Add new model to council
│   ├── analyze-conversation.md    # Analyze conversation quality
│   └── optimize-stage2-prompt.md  # Improve ranking prompt
└── shared-instructions/       # Common agent guidelines
    ├── README.md                  # Overview of shared instructions
    ├── code-standards.md          # Coding standards and style guide
    ├── project-context.md         # Essential project knowledge
    └── safety-guidelines.md       # Security and safety protocols
```

### Available Commands
- `/dev` - Start both backend and frontend servers
- `/status` - Check server status, config, and API key
- `/models` - View or modify council model configuration
- `/api-test` - Test OpenRouter API connectivity
- `/test-council` - Run a test query through the full pipeline
- `/debug-ranking` - Analyze ranking parse failures

### Hooks
- **PreEdit**: Reminds about relative imports for backend files
- **PostEdit**: Warns when config.py changes require restart
- **PreCommit**: Prevents committing .env files or API keys

### Agents

| Agent | Purpose |
|-------|---------|
| `@council-debugger` | Debug 3-stage pipeline issues |
| `@api-monitor` | Monitor OpenRouter API connectivity |
| `@frontend-helper` | Frontend React/CSS assistance |
| `@prompt-engineer` | Optimize council prompts |
| `@documentation-librarian` | Documentation & knowledge management |
| `@deployment-specialist` | Railway, GitHub Actions, CI/CD |

### Shared Instructions

The `shared-instructions/` folder contains common guidelines all agents should follow:

- **code-standards.md**: Python/JavaScript style guide, commit conventions
- **project-context.md**: Essential project architecture knowledge
- **safety-guidelines.md**: Security protocols, secrets management
