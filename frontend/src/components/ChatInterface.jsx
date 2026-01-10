import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Stage1 from './Stage1';
import Stage2 from './Stage2';
import Stage3 from './Stage3';
import './ChatInterface.css';

export default function ChatInterface({
  conversation,
  onSendMessage,
  isLoading,
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!conversation) {
    return (
      <main className="chat-interface">
        <div className="empty-state">
          <div className="empty-icon-large">
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
          <h2>Welcome to LLM Council</h2>
          <p>Harness the collective intelligence of multiple AI models</p>
          <div className="empty-features">
            <div className="feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span>Multi-model deliberation</span>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </div>
              <span>Anonymous peer review</span>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 3v18M3 12h18"/>
                  <circle cx="12" cy="12" r="9"/>
                </svg>
              </div>
              <span>Synthesized answers</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="chat-interface">
      <div className="messages-container">
        {conversation.messages.length === 0 ? (
          <div className="empty-state compact">
            <div className="empty-icon-medium">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h2>Start a conversation</h2>
            <p>Ask a question to consult the LLM Council</p>
          </div>
        ) : (
          conversation.messages.map((msg, index) => (
            <div key={index} className="message-group animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
              {msg.role === 'user' ? (
                <div className="user-message">
                  <div className="message-avatar user-avatar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div className="message-wrapper">
                    <div className="message-label">You</div>
                    <div className="message-content user-bubble">
                      <div className="markdown-content">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="assistant-message">
                  <div className="message-avatar assistant-avatar">
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.9"/>
                      <circle cx="12" cy="6" r="1.5" fill="currentColor" opacity="0.6"/>
                      <circle cx="16" cy="9" r="1.5" fill="currentColor" opacity="0.6"/>
                      <circle cx="16" cy="15" r="1.5" fill="currentColor" opacity="0.6"/>
                      <circle cx="12" cy="18" r="1.5" fill="currentColor" opacity="0.6"/>
                      <circle cx="8" cy="15" r="1.5" fill="currentColor" opacity="0.6"/>
                      <circle cx="8" cy="9" r="1.5" fill="currentColor" opacity="0.6"/>
                    </svg>
                  </div>
                  <div className="message-wrapper full-width">
                    <div className="message-label">LLM Council</div>

                    {/* Stage 1 */}
                    {msg.loading?.stage1 && (
                      <div className="stage-loading">
                        <div className="loading-pulse">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <div className="loading-text">
                          <strong>Stage 1</strong>
                          <span>Collecting individual responses...</span>
                        </div>
                      </div>
                    )}
                    {msg.stage1 && <Stage1 responses={msg.stage1} />}

                    {/* Stage 2 */}
                    {msg.loading?.stage2 && (
                      <div className="stage-loading">
                        <div className="loading-pulse">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <div className="loading-text">
                          <strong>Stage 2</strong>
                          <span>Running peer rankings...</span>
                        </div>
                      </div>
                    )}
                    {msg.stage2 && (
                      <Stage2
                        rankings={msg.stage2}
                        labelToModel={msg.metadata?.label_to_model}
                        aggregateRankings={msg.metadata?.aggregate_rankings}
                      />
                    )}

                    {/* Stage 3 */}
                    {msg.loading?.stage3 && (
                      <div className="stage-loading success">
                        <div className="loading-pulse">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <div className="loading-text">
                          <strong>Stage 3</strong>
                          <span>Synthesizing final answer...</span>
                        </div>
                      </div>
                    )}
                    {msg.stage3 && <Stage3 finalResponse={msg.stage3} />}
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        <div ref={messagesEndRef} />
      </div>

      {conversation.messages.length === 0 && (
        <form className="input-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <textarea
              className="message-input"
              placeholder="Ask your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
            />
            <div className="input-hint">
              <kbd>Enter</kbd> to send, <kbd>Shift + Enter</kbd> for new line
            </div>
          </div>
          <button
            type="submit"
            className="send-button"
            disabled={!input.trim() || isLoading}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            <span>Send</span>
          </button>
        </form>
      )}
    </main>
  );
}
