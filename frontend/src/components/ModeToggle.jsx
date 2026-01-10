/**
 * ModeToggle - Claude Desktop style toggle for switching council modes
 */

import './ModeToggle.css';

const modes = [
  {
    id: 'chat',
    label: 'Chat',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    description: 'General conversation'
  },
  {
    id: 'code',
    label: 'Code',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    description: 'Programming assistance'
  },
  {
    id: 'image',
    label: 'Image',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
    description: 'Image generation'
  }
];

export default function ModeToggle({ mode, onModeChange, disabled }) {
  return (
    <div className="mode-toggle-container">
      <div className="mode-toggle" role="tablist" aria-label="Council mode">
        {modes.map((m) => (
          <button
            key={m.id}
            className={`mode-toggle-btn ${mode === m.id ? 'active' : ''}`}
            onClick={() => onModeChange(m.id)}
            disabled={disabled}
            role="tab"
            aria-selected={mode === m.id}
            title={m.description}
          >
            <span className="mode-icon">{m.icon}</span>
            <span className="mode-label">{m.label}</span>
          </button>
        ))}
        <div
          className="mode-toggle-indicator"
          style={{
            transform: `translateX(${modes.findIndex(m => m.id === mode) * 100}%)`
          }}
        />
      </div>
      <div className="mode-description">
        {modes.find(m => m.id === mode)?.description}
      </div>
    </div>
  );
}
