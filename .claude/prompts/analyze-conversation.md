# Analyze Conversation Quality

## Task
Analyze a council conversation for quality and potential issues.

## Conversation ID: $ARGUMENTS

## Analysis Steps

### 1. Load Conversation
Read from `data/conversations/[id].json`

### 2. Stage 1 Analysis
For each model response:
- Response length (tokens/words)
- Key topics covered
- Quality indicators

### 3. Stage 2 Analysis
For each ranking:
- Parse success rate
- Ranking consistency
- Evaluation thoroughness

### 4. Stage 3 Analysis
- Synthesis coverage
- Source attribution
- Final answer quality

### 5. Aggregate Insights
- Model agreement level
- Controversial rankings
- Areas of consensus

## Output Format
Provide a structured analysis with:
- Overall quality score (1-10)
- Per-stage breakdown
- Improvement suggestions
