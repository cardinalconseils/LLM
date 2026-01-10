# /test-council - Test Council with Sample Query

Run a test query through the LLM Council to verify the full pipeline.

## Arguments
- `$ARGUMENTS`: Optional custom query. If empty, use a default test query.

## Instructions

### 1. Check Prerequisites
- Verify backend is running on port 8001
- If not running, offer to start it

### 2. Prepare Test Query
Default query if none provided:
> "What are the key differences between REST and GraphQL APIs? Keep your response brief."

### 3. Run Test via API
```bash
# Create a test conversation
CONV_ID=$(curl -s -X POST http://localhost:8001/api/conversations \
  -H "Content-Type: application/json" \
  -d '{}' | jq -r '.id')

# Send test message
curl -s -X POST "http://localhost:8001/api/conversations/${CONV_ID}/message" \
  -H "Content-Type: application/json" \
  -d '{"content": "TEST_QUERY_HERE"}' | jq '.'
```

### 4. Report Results
For each stage, report:
- **Stage 1**: Number of responses received, which models responded
- **Stage 2**: Rankings from each model, aggregate rankings
- **Stage 3**: Chairman's synthesis (truncated if long)

### 5. Cleanup
Optionally delete the test conversation from data/conversations/
