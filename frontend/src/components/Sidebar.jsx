import './Sidebar.css';

export default function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  isOpen,
}) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.9"/>
              <circle cx="12" cy="5" r="2" fill="currentColor" opacity="0.7"/>
              <circle cx="17.5" cy="8" r="2" fill="currentColor" opacity="0.7"/>
              <circle cx="17.5" cy="16" r="2" fill="currentColor" opacity="0.7"/>
              <circle cx="12" cy="19" r="2" fill="currentColor" opacity="0.7"/>
              <circle cx="6.5" cy="16" r="2" fill="currentColor" opacity="0.7"/>
              <circle cx="6.5" cy="8" r="2" fill="currentColor" opacity="0.7"/>
            </svg>
          </div>
          <div className="logo-text">
            <h1>LLM Council</h1>
            <span className="logo-tagline">Collective Intelligence</span>
          </div>
        </div>

        <button className="new-conversation-btn" onClick={onNewConversation}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>New Conversation</span>
        </button>
      </div>

      {/* Conversation List */}
      <div className="conversation-list">
        {conversations.length === 0 ? (
          <div className="empty-conversations">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p>No conversations yet</p>
            <span>Start a new conversation to consult the council</span>
          </div>
        ) : (
          <div className="conversations-wrapper">
            {conversations.map((conv, index) => (
              <div
                key={conv.id}
                className={`conversation-item ${
                  conv.id === currentConversationId ? 'active' : ''
                }`}
                onClick={() => onSelectConversation(conv.id)}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="conversation-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="conversation-details">
                  <div className="conversation-title">
                    {conv.title || 'New Conversation'}
                  </div>
                  <div className="conversation-meta">
                    {conv.message_count} {conv.message_count === 1 ? 'message' : 'messages'}
                  </div>
                </div>
                <div className="conversation-indicator" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="footer-badge">
          <span className="badge-dot" />
          <span>Powered by OpenRouter</span>
        </div>
      </div>
    </aside>
  );
}
