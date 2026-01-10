import ReactMarkdown from 'react-markdown';
import './Stage3.css';

export default function Stage3({ finalResponse }) {
  if (!finalResponse) {
    return null;
  }

  return (
    <div className="stage stage3 animate-fade-in-up">
      <div className="stage-header">
        <div className="stage-badge stage3-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <text x="12" y="16" textAnchor="middle" fill="currentColor" stroke="none" fontSize="12" fontWeight="600">3</text>
          </svg>
        </div>
        <div className="stage-header-text">
          <h3 className="stage-title">Final Council Answer</h3>
          <p className="stage-subtitle">Synthesized response</p>
        </div>
        <div className="council-verdict">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span>Consensus Reached</span>
        </div>
      </div>

      <div className="final-response">
        <div className="chairman-info">
          <div className="chairman-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 14l9-5-9-5-9 5 9 5z"/>
              <path d="M12 14l6.16-3.422a12.083 12.083 0 0 1 .665 6.479A11.952 11.952 0 0 0 12 20.055a11.952 11.952 0 0 0-6.824-2.998 12.078 12.078 0 0 1 .665-6.479L12 14z"/>
              <path d="M12 14l9-5-9-5-9 5 9 5z"/>
              <path d="M12 14v7"/>
            </svg>
          </div>
          <div className="chairman-details">
            <span className="chairman-role">Chairman Model</span>
            <span className="chairman-model">{finalResponse.model.split('/')[1] || finalResponse.model}</span>
          </div>
        </div>

        <div className="final-content markdown-content">
          <ReactMarkdown>{finalResponse.response}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
