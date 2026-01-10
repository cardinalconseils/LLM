# Frontend Helper Agent

An agent specialized in the React/Vite frontend of LLM Council.

## Purpose
Assist with frontend development, styling, and React component issues.

## Tech Stack
- **Framework**: React 18 with Vite
- **Styling**: Plain CSS (no CSS-in-JS)
- **Markdown**: ReactMarkdown library
- **State**: React useState/useEffect (no Redux)

## Key Files
- `frontend/src/App.jsx` - Main application component
- `frontend/src/api.js` - Backend API client
- `frontend/src/components/` - UI components
  - `ChatInterface.jsx` - Message input
  - `Sidebar.jsx` - Conversation list
  - `Stage1.jsx` - Individual responses
  - `Stage2.jsx` - Rankings display
  - `Stage3.jsx` - Final synthesis

## Styling Conventions
- Light mode theme (NOT dark mode)
- Primary color: `#4a90e2` (blue)
- All markdown wrapped in `.markdown-content` class
- 12px padding on markdown content

## Important Patterns
1. **Markdown Rendering**: Always wrap ReactMarkdown in `<div className="markdown-content">`
2. **Tab Components**: Stage1 and Stage2 use tabbed interfaces
3. **De-anonymization**: Client-side replacement of "Response X" with model names
4. **Input Form**: Always visible, with file attachments, stop button, and character counter
5. **Drag & Drop**: File uploads support drag-and-drop with visual feedback

## Chat Input Features
- **File Attachments**: Up to 5 files, max 10MB each
- **Drag & Drop**: Drop files onto input area
- **Character Limit**: 10,000 characters with visual counter
- **Stop Generation**: Button to abort in-progress requests
- **Auto-resize**: Textarea grows with content up to 200px

## Usage
Invoke for:
- React component bugs
- CSS styling issues
- State management problems
- API integration on frontend
- Chat interface enhancements
