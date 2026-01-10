# Code Standards

Common coding standards and style guidelines for all agents working on the LLM Council project.

## Python (Backend)

### Style
- Follow PEP 8 guidelines
- Maximum line length: 100 characters
- Use type hints for function parameters and returns
- Use Google-style docstrings

### Imports
- **Always use relative imports** within the backend package
- Example: `from .config import COUNCIL_MODELS` (NOT `from backend.config`)
- Group imports: stdlib, third-party, local
- Sort alphabetically within groups

### Async/Await
- Use `async/await` for all I/O operations
- Use `asyncio.gather()` for parallel operations
- Handle exceptions gracefully with try/except

### Naming
- Functions: `snake_case`
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Private: prefix with `_`

## JavaScript/React (Frontend)

### Style
- Use functional components with hooks
- Use semicolons
- Use single quotes for strings
- JSX uses double quotes for attributes

### Component Structure
```jsx
// 1. Imports
import { useState, useEffect } from 'react';
import './Component.css';

// 2. Constants
const MAX_VALUE = 100;

// 3. Component
export default function Component({ prop1, prop2 }) {
  // 3a. State
  const [state, setState] = useState(null);

  // 3b. Effects
  useEffect(() => {}, []);

  // 3c. Handlers
  const handleClick = () => {};

  // 3d. Render
  return <div />;
}
```

### CSS
- Use CSS variables from `index.css`
- Class names: kebab-case (`.my-class`)
- Organize by component in separate `.css` files
- Mobile-first responsive design

## Markdown

### Headers
- Use ATX style (`#` not underlines)
- Single H1 per document
- Logical hierarchy (don't skip levels)

### Code Blocks
- Always specify language
- Keep examples runnable
- Use appropriate indentation

### Tables
- Use for structured data
- Align columns for readability
- Keep simple (avoid nested content)

## Git Commits

### Format
```
<type>: <short description>

<optional longer description>

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `refactor`: Code change that neither fixes nor adds
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## Error Handling

### Python
```python
try:
    result = await risky_operation()
except SpecificError as e:
    logger.error(f"Operation failed: {e}")
    return None  # Graceful degradation
```

### JavaScript
```javascript
try {
  const result = await riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
  // Handle gracefully
}
```

## Security

- Never commit secrets or API keys
- Validate all user inputs
- Use environment variables for configuration
- Sanitize data before display
- Follow OWASP guidelines
