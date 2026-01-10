import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './Stage2.css';

function deAnonymizeText(text, labelToModel) {
  if (!labelToModel) return text;

  let result = text;
  Object.entries(labelToModel).forEach(([label, model]) => {
    const modelShortName = model.split('/')[1] || model;
    result = result.replace(new RegExp(label, 'g'), `**${modelShortName}**`);
  });
  return result;
}

export default function Stage2({ rankings, labelToModel, aggregateRankings }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!rankings || rankings.length === 0) {
    return null;
  }

  return (
    <div className="stage stage2 animate-fade-in-up">
      <div className="stage-header">
        <div className="stage-badge stage2-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <text x="12" y="16" textAnchor="middle" fill="currentColor" stroke="none" fontSize="12" fontWeight="600">2</text>
          </svg>
        </div>
        <div className="stage-header-text">
          <h3 className="stage-title">Peer Rankings</h3>
          <p className="stage-subtitle">Anonymous cross-evaluation</p>
        </div>
      </div>

      {/* Aggregate Rankings - Show first as it's the summary */}
      {aggregateRankings && aggregateRankings.length > 0 && (
        <div className="aggregate-rankings">
          <div className="aggregate-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 20V10"/>
              <path d="M18 20V4"/>
              <path d="M6 20v-4"/>
            </svg>
            <div>
              <h4>Aggregate Rankings</h4>
              <span>Combined peer evaluations (lower is better)</span>
            </div>
          </div>
          <div className="aggregate-list">
            {aggregateRankings.map((agg, index) => (
              <div
                key={index}
                className={`aggregate-item ${index === 0 ? 'top-ranked' : ''}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className={`rank-position rank-${index + 1}`}>
                  {index === 0 ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                  ) : (
                    `#${index + 1}`
                  )}
                </span>
                <span className="rank-model">
                  {agg.model.split('/')[1] || agg.model}
                </span>
                <div className="rank-stats">
                  <span className="rank-score">
                    {agg.average_rank.toFixed(2)}
                  </span>
                  <span className="rank-count">
                    {agg.rankings_count} votes
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Evaluations */}
      <div className="evaluations-section">
        <div className="section-header">
          <h4>Raw Evaluations</h4>
          <p className="stage-description">
            Model names shown in <strong>bold</strong> were anonymized during evaluation.
          </p>
        </div>

        <div className="tabs-container">
          <div className="tabs">
            {rankings.map((rank, index) => (
              <button
                key={index}
                className={`tab ${activeTab === index ? 'active' : ''}`}
                onClick={() => setActiveTab(index)}
              >
                <span className="tab-indicator" />
                <span className="tab-label">{rank.model.split('/')[1] || rank.model}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="tab-content">
          <div className="model-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 12l2 2 4-4"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <span>{rankings[activeTab].model}</span>
          </div>
          <div className="ranking-content markdown-content">
            <ReactMarkdown>
              {deAnonymizeText(rankings[activeTab].ranking, labelToModel)}
            </ReactMarkdown>
          </div>

          {rankings[activeTab].parsed_ranking &&
           rankings[activeTab].parsed_ranking.length > 0 && (
            <div className="parsed-ranking">
              <div className="parsed-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                </svg>
                <span>Extracted Ranking</span>
              </div>
              <ol className="parsed-list">
                {rankings[activeTab].parsed_ranking.map((label, i) => (
                  <li key={i}>
                    <span className="parsed-position">{i + 1}</span>
                    <span className="parsed-model">
                      {labelToModel && labelToModel[label]
                        ? labelToModel[label].split('/')[1] || labelToModel[label]
                        : label}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
