# /status - Check System Status

Check the status of the LLM Council system including servers, configuration, and API connectivity.

## Instructions

Perform these checks and report results:

### 1. Check Server Processes
```bash
lsof -i :8001 2>/dev/null || echo "Backend not running"
lsof -i :5173 2>/dev/null || echo "Frontend not running"
```

### 2. Check Backend Health
```bash
curl -s http://localhost:8001/ 2>/dev/null || echo "Backend unreachable"
```

### 3. Check Configuration
- Read `backend/config.py` and report:
  - Number of council models configured
  - Chairman model
  - Whether API key is set (check .env exists, don't show the key)

### 4. Check Data Directory
```bash
ls -la data/conversations/ 2>/dev/null | head -10
```

### Output Format
Provide a clear status summary:
- Backend: Running/Stopped (port 8001)
- Frontend: Running/Stopped (port 5173)
- API Key: Configured/Missing
- Council Models: [count] models
- Chairman: [model name]
- Conversations: [count] stored
