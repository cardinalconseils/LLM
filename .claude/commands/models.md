# /models - Manage Council Models

View and manage the LLM Council model configuration.

## Instructions

### View Current Configuration
1. Read `backend/config.py`
2. Display the current council members and chairman
3. Format as a clear list showing:
   - Council Members (voting models)
   - Chairman (synthesis model)

### Arguments
- No args: Show current configuration
- `$ARGUMENTS` contains any user-provided arguments

### If User Wants to Modify
If the user provides new model names or wants to change the configuration:
1. Validate model names look like OpenRouter identifiers (provider/model-name)
2. Edit `backend/config.py` to update COUNCIL_MODELS or CHAIRMAN_MODEL
3. Warn that backend needs restart for changes to take effect

### Model Naming Convention
OpenRouter models use format: `provider/model-name`
Examples:
- openai/gpt-4o
- anthropic/claude-sonnet-4
- google/gemini-2.5-pro
- x-ai/grok-3
