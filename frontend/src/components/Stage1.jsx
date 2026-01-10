import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './Stage1.css';

export default function Stage1({ responses }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!responses || responses.length === 0) {
    return null;
  }

  return (
    <div className="stage stage1 animate-fade-in-up">
      <div className="stage-header">
        <div className="stage-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <text x="12" y="16" textAnchor="middle" fill="currentColor" stroke="none" fontSize="12" fontWeight="600">1</text>
          </svg>
        </div>
        <div className="stage-header-text">
          <h3 className="stage-title">Individual Responses</h3>
          <p className="stage-subtitle">{responses.length} models responded</p>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          {responses.map((resp, index) => (
            <button
              key={index}
              className={`tab ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              <span className="tab-indicator" />
              <span className="tab-label">{resp.model.split('/')[1] || resp.model}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="tab-content">
        <div className="model-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          <span>{responses[activeTab].model}</span>
        </div>
        <div className="response-content markdown-content">
          <ReactMarkdown>{responses[activeTab].response}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
