import { useState, useEffect } from 'react'
import { api } from '../api'
import { X, MessageSquare, Code, Image, Star, Search, Check, RotateCcw, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'

const modeIcons = {
  chat: MessageSquare,
  code: Code,
  image: Image,
}

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
  const [councilConfig, setCouncilConfig] = useState(null)
  const [popularModels, setPopularModels] = useState([])
  const [allModels, setAllModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAllModels, setShowAllModels] = useState(false)
  const [loadingAllModels, setLoadingAllModels] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadConfig()
    }
  }, [isOpen])

  const loadConfig = async () => {
    setLoading(true)
    try {
      const [config, popular] = await Promise.all([
        api.getCouncilConfig(),
        api.getPopularModels(),
      ])
      setCouncilConfig(config)
      setPopularModels(popular.popular || [])
    } catch (error) {
      console.error('Failed to load model config:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAllModels = async () => {
    if (allModels.length > 0) return
    setLoadingAllModels(true)
    try {
      const data = await api.getAvailableModels()
      setAllModels(data.models || [])
    } catch (error) {
      console.error('Failed to load all models:', error)
    } finally {
      setLoadingAllModels(false)
    }
  }

  const handleShowAllModels = () => {
    setShowAllModels(true)
    loadAllModels()
  }

  const toggleModel = (modelId) => {
    const currentModels = customModels || []
    if (currentModels.includes(modelId)) {
      onModelsChange(currentModels.filter((m) => m !== modelId))
    } else {
      onModelsChange([...currentModels, modelId])
    }
  }

  const isModelSelected = (modelId) => {
    if (customModels && customModels.length > 0) {
      return customModels.includes(modelId)
    }
    if (councilConfig?.modes?.[mode]) {
      return councilConfig.modes[mode].council_models.includes(modelId)
    }
    return false
  }

  const resetToDefaults = () => {
    onModelsChange(null)
    onChairmanChange(null)
  }

  const filteredAllModels = allModels.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isOpen) return null

  const modeConfig = councilConfig?.modes?.[mode]
  const activeModels = customModels || modeConfig?.council_models || []
  const activeChairman = chairmanModel || modeConfig?.chairman_model || ''

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border-light)]">
          <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
            Council Configuration
          </h2>
          <Button variant="ghost" size="iconSm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
            <span className="text-sm text-[var(--color-foreground-secondary)]">
              Loading configuration...
            </span>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[calc(85vh-65px)]">
            <div className="p-5 space-y-6">
              {/* Mode Selection */}
              <section>
                <h3 className="text-sm font-semibold text-[var(--color-foreground)] mb-1">
                  Council Mode
                </h3>
                <p className="text-xs text-[var(--color-foreground-tertiary)] mb-3">
                  Choose a specialized council for your task
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(councilConfig?.modes || {}).map(([key, config]) => {
                    const Icon = modeIcons[key] || MessageSquare
                    return (
                      <button
                        key={key}
                        onClick={() => onModeChange(key)}
                        className={cn(
                          'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
                          mode === key
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                            : 'border-[var(--color-border-light)] hover:border-[var(--color-border)] bg-white'
                        )}
                      >
                        <div
                          className={cn(
                            'flex items-center justify-center w-10 h-10 rounded-xl transition-colors',
                            mode === key
                              ? 'bg-[var(--color-primary)] text-white'
                              : 'bg-[var(--color-background-secondary)] text-[var(--color-foreground-secondary)]'
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-[var(--color-foreground)]">
                            {config.name}
                          </div>
                          <div className="text-[10px] text-[var(--color-foreground-tertiary)] line-clamp-1">
                            {config.description}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Active Council Models */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
                      Council Members
                    </h3>
                    <p className="text-xs text-[var(--color-foreground-tertiary)]">
                      {activeModels.length} models will deliberate on your question
                    </p>
                  </div>
                  {customModels && (
                    <Button variant="ghost" size="sm" onClick={resetToDefaults} className="gap-1.5">
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeModels.map((modelId) => (
                    <div
                      key={modelId}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-primary)]/10 rounded-full border border-[var(--color-primary)]/20"
                    >
                      <span className="text-sm font-medium text-[var(--color-primary)]">
                        {modelId.split('/').pop()}
                      </span>
                      <span className="text-xs text-[var(--color-primary)]/60">
                        {modelId.split('/')[0]}
                      </span>
                      {customModels && (
                        <button
                          onClick={() => toggleModel(modelId)}
                          className="p-0.5 hover:bg-[var(--color-primary)]/20 rounded-full transition-colors"
                        >
                          <X className="w-3 h-3 text-[var(--color-primary)]" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Chairman Model */}
              <section>
                <h3 className="text-sm font-semibold text-[var(--color-foreground)] mb-1">
                  Chairman Model
                </h3>
                <p className="text-xs text-[var(--color-foreground-tertiary)] mb-3">
                  The chairman synthesizes the final answer
                </p>
                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-[var(--color-warning-bg)] to-transparent rounded-xl border border-[var(--color-warning)]/20">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-warning)] text-white">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-[var(--color-foreground)]">
                      {activeChairman.split('/').pop()}
                    </span>
                    <span className="text-xs text-[var(--color-foreground-tertiary)]">
                      {activeChairman.split('/')[0]}
                    </span>
                  </div>
                </div>
              </section>

              {/* Add Models */}
              <section>
                <h3 className="text-sm font-semibold text-[var(--color-foreground)] mb-1">
                  Add Models
                </h3>
                <p className="text-xs text-[var(--color-foreground-tertiary)] mb-3">
                  Click to add models to the council
                </p>

                {/* Popular Models */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {popularModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        if (!customModels) {
                          const defaults = [...(modeConfig?.council_models || [])]
                          if (!defaults.includes(model.id)) {
                            defaults.push(model.id)
                          }
                          onModelsChange(defaults)
                        } else {
                          toggleModel(model.id)
                        }
                      }}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-xl border transition-all duration-200 text-left',
                        isModelSelected(model.id)
                          ? 'border-[var(--color-success)] bg-[var(--color-success-bg)]'
                          : 'border-[var(--color-border-light)] hover:border-[var(--color-border)] bg-white'
                      )}
                    >
                      <div>
                        <div className="text-sm font-medium text-[var(--color-foreground)]">
                          {model.name}
                        </div>
                        <div className="text-xs text-[var(--color-foreground-tertiary)]">
                          {model.provider}
                        </div>
                      </div>
                      {isModelSelected(model.id) && (
                        <Check className="w-4 h-4 text-[var(--color-success)]" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Show All Models Toggle */}
                {!showAllModels && (
                  <Button
                    variant="outline"
                    onClick={handleShowAllModels}
                    className="w-full gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Browse All OpenRouter Models
                  </Button>
                )}

                {/* All Models Search */}
                {showAllModels && (
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-foreground-tertiary)]" />
                      <input
                        type="text"
                        placeholder="Search models..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-[var(--color-background-secondary)] border border-[var(--color-border-light)] rounded-xl text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      />
                    </div>

                    {loadingAllModels ? (
                      <div className="flex items-center justify-center gap-2 py-8">
                        <Loader2 className="w-5 h-5 text-[var(--color-primary)] animate-spin" />
                        <span className="text-sm text-[var(--color-foreground-secondary)]">
                          Loading models...
                        </span>
                      </div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto space-y-1 rounded-xl border border-[var(--color-border-light)] p-1">
                        {filteredAllModels.slice(0, 50).map((model) => (
                          <button
                            key={model.id}
                            onClick={() => {
                              if (!customModels) {
                                const defaults = [...(modeConfig?.council_models || [])]
                                if (!defaults.includes(model.id)) {
                                  defaults.push(model.id)
                                }
                                onModelsChange(defaults)
                              } else {
                                toggleModel(model.id)
                              }
                            }}
                            className={cn(
                              'flex items-center justify-between w-full p-2.5 rounded-lg transition-colors text-left',
                              isModelSelected(model.id)
                                ? 'bg-[var(--color-success-bg)]'
                                : 'hover:bg-[var(--color-background-secondary)]'
                            )}
                          >
                            <div>
                              <div className="text-sm font-medium text-[var(--color-foreground)]">
                                {model.name}
                              </div>
                              <div className="text-xs text-[var(--color-foreground-tertiary)]">
                                {model.id}
                              </div>
                            </div>
                            {isModelSelected(model.id) && (
                              <Check className="w-4 h-4 text-[var(--color-success)]" />
                            )}
                          </button>
                        ))}
                        {filteredAllModels.length > 50 && (
                          <div className="text-center py-2 text-xs text-[var(--color-foreground-tertiary)]">
                            +{filteredAllModels.length - 50} more models. Refine your search.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
