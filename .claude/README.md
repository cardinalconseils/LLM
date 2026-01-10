# Claude Code Configuration for LLM Council

This directory contains Claude Code configuration files that enhance the development experience for the LLM Council project.

## Quick Start

### Common Commands
```
/dev              # Start backend + frontend servers
/status           # Check if everything is running
/models           # View/modify council configuration
/api-test         # Test OpenRouter API connection
/test-council     # Run a test deliberation
/debug-ranking    # Debug ranking parse issues
```

### Agents
Reference specialized agents for focused assistance:
- `@council-debugger` - Debug council pipeline issues
- `@api-monitor` - API connectivity problems
- `@frontend-helper` - React/CSS questions
- `@prompt-engineer` - Improve council prompts

## Directory Structure

```
.claude/
├── settings.json       # Project-wide settings
├── hooks.json          # Automated checks and reminders
├── mcp.json            # MCP server configs (future)
├── commands/           # Slash commands
├── agents/             # Specialized agent definitions
├── prompts/            # Reusable prompt templates
└── *.local.*           # Local-only files (gitignored)
```

## Files Explained

### settings.json
Project settings including:
- Preferred model for Claude Code
- Context paths (files always loaded)
- Code style preferences

### hooks.json
Automated hooks:
- **PreEdit**: Reminders for backend files
- **PostEdit**: Config change notifications
- **PreCommit**: Prevent committing secrets

### commands/
Markdown files that define slash commands. Each file:
- Title becomes the command name
- Content provides instructions to Claude
- `$ARGUMENTS` captures user input

### agents/
Specialized agent definitions for focused tasks:
- Each agent has a specific domain
- Contains relevant file paths and patterns
- Includes common issues and solutions

### prompts/
Reusable prompt templates for common tasks.

## Local Files

Files ending in `.local.*` are machine-specific and should be gitignored:
- `settings.local.json` - Personal settings overrides
- `ralph-loop.local.md` - Ralph loop state (if using)

## Customization

### Adding a New Command
1. Create `.claude/commands/mycommand.md`
2. Add title, description, and instructions
3. Use `$ARGUMENTS` for user input
4. Command available as `/mycommand`

### Adding a New Hook
1. Edit `.claude/hooks.json`
2. Add hook to appropriate lifecycle event
3. Use `pathPattern` to match specific files

## Tips

- Commands are project-specific shortcuts
- Agents provide focused expertise
- Hooks automate reminders and checks
- Keep prompts DRY with templates
