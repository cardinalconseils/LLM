import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Stage1 from './Stage1';
import Stage2 from './Stage2';
import Stage3 from './Stage3';
import ModelSelector from './ModelSelector';
import './ChatInterface.css';

const MAX_CHARS = 10000;

export default function ChatInterface({
  conversation,
  onSendMessage,
  onStopGeneration,
  isLoading,
  mode,
  onModeChange,
  customModels,
  onModelsChange,
  chairmanModel,
  onChairmanChange,
}) {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
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

  // Auto-resize textarea
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setInput(value);
    }
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  };

  // File handling
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
  };

  const addFiles = (files) => {
    const validFiles = files.filter(file => {
      const isValid = file.size <= 10 * 1024 * 1024; // 10MB limit
      if (!isValid) {
        console.warn(`File ${file.name} exceeds 10MB limit`);
      }
      return isValid;
    });

    setAttachments(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (file) => {
    const type = file.type;
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('text/') || type.includes('json')) return '📄';
    if (type.includes('pdf')) return '📕';
    if (type.includes('zip') || type.includes('tar')) return '📦';
    return '📎';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getModeIcon = (modeKey) => {
    switch (modeKey) {
      case 'chat':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        );
      case 'code':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
        );
      case 'image':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getModeInfo = (modeKey) => {
    const modes = {
      chat: { name: 'Chat', description: 'General conversation with multiple AI models' },
      code: { name: 'Code', description: 'Programming help from expert models' },
      image: { name: 'Image', description: 'Creative image generation council' },
    };
    return modes[modeKey] || { name: modeKey, description: '' };
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

          {/* Mode Selector */}
          <div className="empty-features mode-selector-grid">
            {['chat', 'code', 'image'].map((modeKey) => {
              const info = getModeInfo(modeKey);
              return (
                <button
                  key={modeKey}
                  className={`feature mode-feature ${mode === modeKey ? 'active' : ''}`}
                  onClick={() => onModeChange(modeKey)}
                >
                  <div className={`feature-icon ${mode === modeKey ? 'active' : ''}`}>
                    {getModeIcon(modeKey)}
                  </div>
                  <div className="feature-text">
                    <span className="feature-name">{info.name}</span>
                    <span className="feature-description">{info.description}</span>
                  </div>
                  {mode === modeKey && (
                    <div className="active-indicator">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Settings Button */}
          <button
            className="config-button"
            onClick={() => setShowModelSelector(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Configure Council Models
          </button>
        </div>

        {/* Model Selector Modal */}
        <ModelSelector
          isOpen={showModelSelector}
          onClose={() => setShowModelSelector(false)}
          mode={mode}
          onModeChange={onModeChange}
          customModels={customModels}
          onModelsChange={onModelsChange}
          chairmanModel={chairmanModel}
          onChairmanChange={onChairmanChange}
        />
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

      {/* Input Form - Always visible */}
      <form
        className={`input-form ${isDragOver ? 'drag-over' : ''}`}
        onSubmit={handleSubmit}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        {isDragOver && (
          <div className="drag-overlay">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>Drop files here</span>
          </div>
        )}

        {/* File attachments preview */}
        {attachments.length > 0 && (
          <div className="attachments-preview">
            {attachments.map((file, index) => (
              <div key={index} className="attachment-chip">
                <span className="attachment-icon">{getFileIcon(file)}</span>
                <span className="attachment-name">{file.name}</span>
                <span className="attachment-size">{formatFileSize(file.size)}</span>
                <button
                  type="button"
                  className="attachment-remove"
                  onClick={() => removeAttachment(index)}
                  aria-label="Remove file"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="input-container">
          {/* Input toolbar */}
          <div className="input-toolbar">
            {/* Mode Badge */}
            <div className={`mode-badge ${mode}`}>
              {getModeIcon(mode)}
              <span>{mode}</span>
            </div>

            {/* Settings Button */}
            <button
              type="button"
              className="toolbar-button"
              onClick={() => setShowModelSelector(true)}
              title="Configure council models"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>

            {/* File Attachment */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="file-input-hidden"
              accept=".txt,.md,.json,.csv,.pdf,.png,.jpg,.jpeg,.gif,.webp"
            />
            <button
              type="button"
              className="toolbar-button"
              onClick={triggerFileInput}
              title="Attach files (max 10MB each)"
              disabled={isLoading || attachments.length >= 5}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
          </div>

          {/* Main input area */}
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              className="message-input"
              placeholder={conversation.messages.length === 0
                ? "Ask your question to consult the LLM Council..."
                : "Continue the conversation..."}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
            />
          </div>

          {/* Action buttons */}
          <div className="input-actions">
            {isLoading ? (
              <button
                type="button"
                className="stop-button"
                onClick={onStopGeneration}
                title="Stop generation"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
                <span>Stop</span>
              </button>
            ) : (
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
            )}
          </div>
        </div>

        {/* Footer with hints and counter */}
        <div className="input-footer">
          <div className="input-hint">
            <kbd>Enter</kbd> to send, <kbd>Shift + Enter</kbd> for new line
          </div>
          <div className={`char-counter ${input.length > MAX_CHARS * 0.9 ? 'warning' : ''}`}>
            {input.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </div>
        </div>
      </form>

      {/* Model Selector Modal */}
      <ModelSelector
        isOpen={showModelSelector}
        onClose={() => setShowModelSelector(false)}
        mode={mode}
        onModeChange={onModeChange}
        customModels={customModels}
        onModelsChange={onModelsChange}
        chairmanModel={chairmanModel}
        onChairmanChange={onChairmanChange}
      />
    </main>
  );
}
