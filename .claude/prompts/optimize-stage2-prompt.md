# Optimize Stage 2 Ranking Prompt

## Current Issue
Models sometimes fail to follow the FINAL RANKING format, causing parse failures.

## Task
Analyze and improve the Stage 2 prompt in `backend/council.py`.

## Current Prompt Analysis
1. Read the current `ranking_prompt` in `stage2_collect_rankings()`
2. Identify potential ambiguities
3. Check format specification clarity

## Improvement Strategies

### Format Enforcement
- Add explicit examples
- Use stronger directive language
- Add format validation reminders

### Structure Improvements
- Clear section separators
- Numbered step instructions
- Format template at end

### Example Enhancement
```
Your response MUST end with this exact format:

FINAL RANKING:
1. Response [letter]
2. Response [letter]
...

Do not include ANY text after the ranking list.
```

## Testing
After changes:
1. Test with each council model individually
2. Verify parsing success rate
3. Check response quality maintained
