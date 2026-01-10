import { useState, useEffect } from 'react';
import { api } from '../api';
import './ModelSelector.css';

export default function ModelSelector({
  isOpen,
  onClose,
  mode,
  onModeChange,
  customModels,
  onModelsChange,
  chairmanModel,
  onChairmanChange,
}) {
  const [councilConfig, setCouncilConfig] = useState(null);
  const [popularModels, setPopularModels] = useState([]);
  const [allModels, setAllModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllModels, setShowAllModels] = useState(false);
  const [loadingAllModels, setLoadingAllModels] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen]);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const [config, popular] = await Promise.all([
        api.getCouncilConfig(),
        api.getPopularModels(),
      ]);
      setCouncilConfig(config);
      setPopularModels(popular.popular || []);
    } catch (error) {
      console.error('Failed to load model config:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllModels = async () => {
    if (allModels.length > 0) return;
    setLoadingAllModels(true);
    try {
      const data = await api.getAvailableModels();
      setAllModels(data.models || []);
    } catch (error) {
      console.error('Failed to load all models:', error);
    } finally {
      setLoadingAllModels(false);
    }
  };

  const handleShowAllModels = () => {
    setShowAllModels(true);
    loadAllModels();
  };

  const toggleModel = (modelId) => {
    const currentModels = customModels || [];
    if (currentModels.includes(modelId)) {
      onModelsChange(currentModels.filter((m) => m !== modelId));
    } else {
      onModelsChange([...currentModels, modelId]);
    }
  };

  const isModelSelected = (modelId) => {
    if (customModels && customModels.length > 0) {
      return customModels.includes(modelId);
    }
    // Default to mode's default models
    if (councilConfig?.modes?.[mode]) {
      return councilConfig.modes[mode].council_models.includes(modelId);
    }
    return false;
  };

  const resetToDefaults = () => {
    onModelsChange(null);
    onChairmanChange(null);
  };

  const filteredAllModels = allModels.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  const modeConfig = councilConfig?.modes?.[mode];
  const activeModels = customModels || modeConfig?.council_models || [];
  const activeChairman = chairmanModel || modeConfig?.chairman_model || '';

  return (
    <div className="model-selector-overlay" onClick={onClose}>
      <div className="model-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Council Configuration</h2>
          <button className="close-button" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="modal-loading">
            <div className="loading-spinner"></div>
            <span>Loading configuration...</span>
          </div>
        ) : (
          <div className="modal-content">
            {/* Mode Selection */}
            <section className="config-section">
              <h3>Council Mode</h3>
              <p className="section-description">
                Choose a specialized council for your task
              </p>
              <div className="mode-selector">
                {Object.entries(councilConfig?.modes || {}).map(([key, config]) => (
                  <button
                    key={key}
                    className={`mode-button ${mode === key ? 'active' : ''}`}
                    onClick={() => onModeChange(key)}
                  >
                    <div className="mode-icon">
                      {key === 'chat' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                      )}
                      {key === 'code' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <polyline points="16 18 22 12 16 6"/>
                          <polyline points="8 6 2 12 8 18"/>
                        </svg>
                      )}
                      {key === 'image' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      )}
                    </div>
                    <div className="mode-info">
                      <span className="mode-name">{config.name}</span>
                      <span className="mode-description">{config.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Active Council Models */}
            <section className="config-section">
              <div className="section-header">
                <div>
                  <h3>Council Members</h3>
                  <p className="section-description">
                    {activeModels.length} models will deliberate on your question
                  </p>
                </div>
                {customModels && (
                  <button className="reset-button" onClick={resetToDefaults}>
                    Reset to Defaults
                  </button>
                )}
              </div>

              <div className="active-models">
                {activeModels.map((modelId) => (
                  <div key={modelId} className="model-chip active">
                    <span className="model-id">{modelId.split('/').pop()}</span>
                    <span className="model-provider">{modelId.split('/')[0]}</span>
                    {customModels && (
                      <button
                        className="remove-model"
                        onClick={() => toggleModel(modelId)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Chairman Model */}
            <section className="config-section">
              <h3>Chairman Model</h3>
              <p className="section-description">
                The chairman synthesizes the final answer
              </p>
              <div className="chairman-display">
                <div className="model-chip chairman">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7l2-7z"/>
                  </svg>
                  <span className="model-id">{activeChairman.split('/').pop()}</span>
                  <span className="model-provider">{activeChairman.split('/')[0]}</span>
                </div>
              </div>
            </section>

            {/* Add Models */}
            <section className="config-section">
              <h3>Add Models</h3>
              <p className="section-description">
                Click to add models to the council
              </p>

              {/* Popular Models */}
              <div className="model-grid">
                {popularModels.map((model) => (
                  <button
                    key={model.id}
                    className={`model-option ${isModelSelected(model.id) ? 'selected' : ''}`}
                    onClick={() => {
                      if (!customModels) {
                        // Initialize custom models from current mode's defaults
                        const defaults = [...(modeConfig?.council_models || [])];
                        if (!defaults.includes(model.id)) {
                          defaults.push(model.id);
                        }
                        onModelsChange(defaults);
                      } else {
                        toggleModel(model.id);
                      }
                    }}
                  >
                    <span className="model-name">{model.name}</span>
                    <span className="model-provider-tag">{model.provider}</span>
                    {isModelSelected(model.id) && (
                      <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              {/* Show All Models Toggle */}
              {!showAllModels && (
                <button className="show-all-button" onClick={handleShowAllModels}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                  Browse All OpenRouter Models
                </button>
              )}

              {/* All Models Search */}
              {showAllModels && (
                <div className="all-models-section">
                  <div className="search-input-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="Search models..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="model-search-input"
                    />
                  </div>

                  {loadingAllModels ? (
                    <div className="loading-models">
                      <div className="loading-spinner small"></div>
                      <span>Loading models...</span>
                    </div>
                  ) : (
                    <div className="all-models-list">
                      {filteredAllModels.slice(0, 50).map((model) => (
                        <button
                          key={model.id}
                          className={`model-list-item ${isModelSelected(model.id) ? 'selected' : ''}`}
                          onClick={() => {
                            if (!customModels) {
                              const defaults = [...(modeConfig?.council_models || [])];
                              if (!defaults.includes(model.id)) {
                                defaults.push(model.id);
                              }
                              onModelsChange(defaults);
                            } else {
                              toggleModel(model.id);
                            }
                          }}
                        >
                          <div className="model-list-info">
                            <span className="model-list-name">{model.name}</span>
                            <span className="model-list-id">{model.id}</span>
                          </div>
                          {isModelSelected(model.id) && (
                            <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </button>
                      ))}
                      {filteredAllModels.length > 50 && (
                        <div className="more-models-hint">
                          +{filteredAllModels.length - 50} more models. Refine your search.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
