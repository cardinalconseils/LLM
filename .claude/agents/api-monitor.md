# API Monitor Agent

An agent specialized in monitoring and testing the OpenRouter API integration.

## Purpose
Monitor API health, test model availability, and diagnose connectivity issues with the OpenRouter API.

## Capabilities
- Test API connectivity with simple queries
- Verify model availability and pricing
- Monitor rate limits and quota usage
- Debug API error responses

## Key Files
- `backend/openrouter.py` - API client implementation
- `backend/config.py` - API key and model configuration
- `.env` - Environment variables (API key storage)

## Diagnostic Steps

### 1. Check API Key
```bash
grep OPENROUTER_API_KEY .env | head -c 30
```
(Shows first chars to verify format without exposing full key)

### 2. Test Basic Connectivity
```python
import httpx
response = await client.get("https://openrouter.ai/api/v1/models")
```

### 3. Test Model Availability
For each model in COUNCIL_MODELS, send a minimal test query.

### 4. Check Error Patterns
Common OpenRouter errors:
- 401: Invalid API key
- 429: Rate limited
- 503: Model temporarily unavailable
- Timeout: Network issues or slow model

## Usage
Invoke this agent when:
- Council queries are failing silently
- Specific models aren't responding
- You see API-related errors in responses
