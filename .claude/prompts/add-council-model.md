# Add New Council Model

## Task
Add a new model to the LLM Council configuration.

## Model: $ARGUMENTS

## Steps
1. Validate the model identifier format (provider/model-name)
2. Open `backend/config.py`
3. Add the model to the `COUNCIL_MODELS` list
4. Verify no duplicate entries
5. Remind user to restart backend

## Validation
- Model ID should match pattern: `[a-z0-9-]+/[a-z0-9-]+`
- Check if model already exists in list
- Suggest checking OpenRouter docs for valid model names

## After Adding
Report:
- New model added: [model name]
- Total council members: [count]
- Backend restart required: Yes
