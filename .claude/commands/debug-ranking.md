# /debug-ranking - Debug Ranking Parse Issues

Analyze and debug ranking parsing issues in Stage 2 evaluations.

## Arguments
- `$ARGUMENTS`: Optional conversation ID to analyze

## Instructions

### 1. Find Recent Conversations
If no conversation ID provided:
```bash
ls -lt data/conversations/ | head -5
```

### 2. Analyze Ranking Data
Read the conversation file and for each Stage 2 evaluation:
1. Show the raw ranking text
2. Show the parsed_ranking result
3. Identify any parse failures

### 3. Common Issues to Check
- Missing "FINAL RANKING:" header
- Incorrect numbering format
- Extra text after ranking
- Model using different label format

### 4. Suggest Fixes
If parsing issues found:
- Show what the model actually wrote
- Explain why parsing failed
- Suggest improvements to `parse_ranking_from_text()` in council.py

### 5. Test Parser
Run the parser directly on problematic text:
```python
from backend.council import parse_ranking_from_text
result = parse_ranking_from_text("""<paste problematic text>""")
print(result)
```
