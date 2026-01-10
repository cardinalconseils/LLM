# /dev - Start Development Environment

Start the LLM Council development environment with both backend and frontend servers.

## Instructions

1. First, check if any processes are already running on ports 8001 (backend) or 5173 (frontend)
2. Start the backend server in the background:
   ```bash
   cd /Users/pierre-marccardinal/Documents/llm-council && python -m backend.main &
   ```
3. Start the frontend development server:
   ```bash
   cd /Users/pierre-marccardinal/Documents/llm-council/frontend && npm run dev
   ```
4. Report the URLs:
   - Backend API: http://localhost:8001
   - Frontend UI: http://localhost:5173

## Important Notes
- Backend MUST run on port 8001 (not 8000)
- Always run backend as `python -m backend.main` from project root
- Ensure OPENROUTER_API_KEY is set in .env file
