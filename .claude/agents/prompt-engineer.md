# Prompt Engineer Agent

An agent specialized in improving the prompts used in the LLM Council system.

## Purpose
Optimize and refine the prompts used in each stage of the council deliberation process to improve response quality and format compliance.

## Key Prompts

### Stage 1: Response Collection
Location: `backend/council.py` → `stage1_collect_responses()`
- Simple user query forwarding
- Optional web search context inclusion

### Stage 2: Ranking Prompt
Location: `backend/council.py` → `stage2_collect_rankings()`
- Critical: Must produce parseable output
- Format requirements:
  - Individual evaluations first
  - "FINAL RANKING:" header
  - Numbered list format
  - No text after ranking

### Stage 3: Chairman Synthesis
Location: `backend/council.py` → `stage3_synthesize_final()`
- Receives all Stage 1 responses
- Receives all Stage 2 rankings
- Must produce coherent synthesis

## Optimization Goals
1. **Format Compliance**: Ensure models follow output format
2. **Quality**: Improve depth and accuracy of responses
3. **Consistency**: Reduce variability in output structure
4. **Brevity**: Keep prompts efficient (token cost)

## Common Improvements
- Add few-shot examples
- Clarify format requirements
- Add constraints for length/style
- Improve ranking criteria clarity

## Usage
Invoke when:
- Ranking parsing frequently fails
- Response quality is inconsistent
- Want to add new evaluation criteria
- Optimizing for specific use cases
