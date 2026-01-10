# /api-test - Test OpenRouter API Connectivity

Test the OpenRouter API connection and model availability.

## Instructions

### 1. Check API Key
```bash
grep -q "OPENROUTER_API_KEY" .env && echo "API key found" || echo "API key missing"
```

### 2. Run API Test Script
If `test_openrouter.py` exists, run it:
```bash
python test_openrouter.py
```

If it doesn't exist, create a simple test:
```python
import asyncio
import os
from dotenv import load_dotenv
import httpx

load_dotenv()
api_key = os.getenv("OPENROUTER_API_KEY")

async def test():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}"},
            json={
                "model": "google/gemini-2.5-flash",
                "messages": [{"role": "user", "content": "Say 'API working' in 3 words"}]
            },
            timeout=30.0
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("API Connection: SUCCESS")
            print(f"Response: {response.json()['choices'][0]['message']['content']}")
        else:
            print(f"Error: {response.text}")

asyncio.run(test())
```

### 3. Report Results
- API Key: Present/Missing
- Connection: Success/Failed
- Response Time: Xms
- Any errors encountered
