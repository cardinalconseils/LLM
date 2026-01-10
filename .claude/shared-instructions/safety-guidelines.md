# Safety Guidelines

Security and safety protocols for all agents working on the LLM Council project.

## Secrets Management

### Never Commit
- `.env` files
- API keys or tokens
- Passwords or credentials
- Private keys
- Database connection strings with credentials

### Environment Variables
- Store all secrets in environment variables
- Use `.env.example` for documentation (without real values)
- Verify `.gitignore` includes sensitive files

### Code Review
- Check diffs for accidental secret exposure
- Use `git diff --cached` before commits
- Remove secrets from git history if accidentally committed

## Input Validation

### Backend
```python
# Validate and sanitize user input
def validate_input(content: str) -> str:
    if not content or not content.strip():
        raise ValueError("Content cannot be empty")
    if len(content) > MAX_CONTENT_LENGTH:
        raise ValueError("Content exceeds maximum length")
    return content.strip()
```

### Frontend
- Sanitize before display
- Validate before API calls
- Use controlled inputs

## API Security

### CORS
- Only allow specific origins in production
- Don't use `allow_origins=["*"]` in production
- Set `FRONTEND_URL` environment variable

### Rate Limiting
- Consider implementing rate limits
- Protect against abuse
- Log suspicious activity

### Authentication
- Currently no auth (future enhancement)
- Plan for auth before public deployment
- Never expose admin functionality without auth

## Error Handling

### Do
- Log errors with context
- Return generic error messages to users
- Implement graceful degradation
- Handle all edge cases

### Don't
- Expose stack traces to users
- Log sensitive data
- Fail silently without logging
- Ignore potential error conditions

## Dependencies

### Updates
- Keep dependencies updated
- Check for security advisories
- Use `npm audit` and `pip audit`
- Pin versions in requirements

### Vetting
- Use well-maintained packages
- Check download counts and stars
- Review package permissions
- Prefer official packages

## File Operations

### Safe Patterns
```python
# Use pathlib for safe path operations
from pathlib import Path

data_dir = Path("data/conversations")
file_path = data_dir / f"{conversation_id}.json"

# Validate path is within expected directory
if not file_path.resolve().is_relative_to(data_dir.resolve()):
    raise ValueError("Invalid path")
```

### Avoid
- Direct string concatenation for paths
- User input in file paths without validation
- Writing to arbitrary locations

## LLM-Specific Safety

### Prompt Injection
- Be aware of prompt injection risks
- Don't include user input directly in system prompts
- Validate and sanitize LLM outputs before use

### Output Handling
- Don't execute code from LLM responses
- Validate JSON responses before parsing
- Treat LLM output as untrusted input

### Cost Control
- Implement token limits
- Monitor API usage
- Set up billing alerts
- Use appropriate models for tasks

## Deployment Safety

### Pre-Deploy
- [ ] No secrets in code
- [ ] Dependencies updated
- [ ] Tests passing
- [ ] Security headers configured

### Production
- [ ] HTTPS only
- [ ] Proper CORS settings
- [ ] Error logging enabled
- [ ] Monitoring configured

## Incident Response

### If Secret Exposed
1. Immediately rotate the secret
2. Check for unauthorized usage
3. Remove from git history if needed
4. Document the incident

### If Vulnerability Found
1. Assess impact and scope
2. Implement fix
3. Deploy patched version
4. Notify affected parties if needed
