import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { MessageSquare, Code, Image, Settings, Paperclip, Send, Square, User, Sparkles, X, Users } from 'lucide-react'
import Stage1 from './Stage1'
import Stage2 from './Stage2'
import Stage3 from './Stage3'
import ModelSelector from './ModelSelector'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Textarea } from './ui/textarea'
import { cn } from '@/lib/utils'

const MAX_CHARS = 10000

const modes = {
  chat: {
    icon: MessageSquare,
    name: 'Chat Council',
    tagline: 'Collective Wisdom',
    description: 'Harness multiple AI perspectives for comprehensive answers',
    color: 'from-indigo-500 to-blue-600',
  },
  code: {
    icon: Code,
    name: 'Code Council',
    tagline: 'Expert Review',
    description: 'Elite programming models review and refine solutions',
    color: 'from-violet-500 to-purple-600',
  },
  image: {
    icon: Image,
    name: 'Creative Council',
    tagline: 'Visual Excellence',
    description: 'Premier AI artists collaborate on image generation',
    color: 'from-pink-500 to-rose-600',
  },
}

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
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [showModelSelector, setShowModelSelector] = useState(false)
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input)
      setInput('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    if (value.length <= MAX_CHARS) {
      setInput(value)
    }
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    addFiles(files)
  }

  const addFiles = (files) => {
    const validFiles = files.filter((file) => {
      const isValid = file.size <= 10 * 1024 * 1024
      return isValid
    })
    setAttachments((prev) => [...prev, ...validFiles].slice(0, 5))
  }

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    addFiles(files)
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const ModeIcon = modes[mode]?.icon || MessageSquare

  // Empty state - no conversation selected
  if (!conversation) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#fdfbf7] via-[#f5f3ed] to-[#eae7df] relative overflow-hidden">
        {/* Ambient Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="w-full max-w-6xl relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-20 animate-fade-in-up">
            {/* Council Logo */}
            <div className="relative inline-flex items-center justify-center mb-10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-30 blur-3xl rounded-full animate-pulse-glow" />
              <div className="relative flex items-center justify-center w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-primary via-primary-hover to-accent text-white shadow-[0_20px_60px_rgba(45,53,97,0.3)]">
                <Users className="w-20 h-20 drop-shadow-lg" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-7xl font-extrabold text-foreground mb-6 tracking-tight">
              LLM Council
            </h1>
            <p className="text-2xl text-foreground-secondary max-w-3xl mx-auto leading-relaxed font-medium">
              Where the world's most advanced AI models gather to deliberate, debate, and deliver excellence
            </p>
          </div>

          {/* Mode Selector - Premium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {Object.entries(modes).map(([key, { icon: Icon, name, tagline, description, color }], index) => (
              <button
                key={key}
                onClick={() => onModeChange(key)}
                className={cn(
                  'group relative overflow-hidden',
                  'flex flex-col p-10 rounded-3xl text-left',
                  'bg-white border-2',
                  'shadow-[0_8px_30px_rgba(0,0,0,0.08)]',
                  'hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)]',
                  'transition-all duration-500 ease-out',
                  mode === key
                    ? 'border-primary ring-4 ring-primary/20 scale-[1.02] shadow-[0_16px_48px_rgba(45,53,97,0.15)]'
                    : 'border-border-light hover:border-primary/40 hover:scale-[1.01]',
                  'animate-council-gather'
                )}
                style={{ animationDelay: `${index * 120}ms` }}
              >
                {/* Background Gradient (subtle) */}
                <div
                  className={cn(
                    'absolute inset-0 opacity-0 group-hover:opacity-8 transition-opacity duration-500',
                    'bg-gradient-to-br',
                    color
                  )}
                />

                {/* Icon */}
                <div
                  className={cn(
                    'relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl mb-5',
                    'transition-all duration-400 shadow-lg',
                    mode === key
                      ? 'bg-gradient-to-br from-primary to-primary-hover text-white scale-110 shadow-[0_8px_24px_rgba(45,53,97,0.25)]'
                      : 'bg-gradient-to-br from-background-secondary to-background-tertiary text-foreground-tertiary group-hover:from-background-tertiary group-hover:to-background-secondary group-hover:scale-110 group-hover:text-foreground-secondary'
                  )}
                >
                  <Icon className="w-8 h-8" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex-1">
                  <div className="text-sm font-bold text-accent mb-2 uppercase tracking-wide">{tagline}</div>
                  <h3 className="text-xl font-extrabold text-foreground mb-3 leading-tight">{name}</h3>
                  <p className="text-base text-foreground-tertiary leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Selection Indicator */}
                {mode === key && (
                  <div className="absolute top-6 right-6 flex items-center gap-2">
                    <span className="text-xs font-bold text-accent uppercase tracking-wide">Active</span>
                    <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_12px_rgba(212,165,116,0.6)] animate-pulse-glow" />
                  </div>
                )}

                {/* Hover Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </div>
              </button>
            ))}
          </div>

          {/* Configure Button */}
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowModelSelector(true)}
              className="gap-3 px-8 py-4 text-lg font-bold shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] border-2 border-border hover:border-primary/60 bg-white hover:bg-background-secondary/50 transition-all duration-300"
            >
              <Settings className="w-6 h-6" />
              Configure Council Members
            </Button>
          </div>
        </div>

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
    )
  }

  return (
    <main className="flex-1 flex flex-col h-full bg-gradient-to-b from-[#fdfbf7] via-[#f5f3ed] to-[#eae7df] overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-transparent via-white/30 to-transparent">
        <div className="max-w-5xl mx-auto px-8 py-10 w-full">
          {conversation.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in-up">
              <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-background-tertiary to-background-secondary text-foreground-tertiary mb-8 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                <MessageSquare className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-extrabold text-foreground mb-4">
                The Council Awaits
              </h2>
              <p className="text-foreground-secondary text-xl max-w-lg leading-relaxed font-medium">
                Pose your question below and watch as multiple AI minds deliberate to find the answer
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {conversation.messages.map((msg, index) => (
                <div
                  key={index}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {msg.role === 'user' ? (
                    <div className="flex gap-6 justify-end">
                      <div className="flex-1 max-w-3xl">
                        <div className="text-xs font-bold text-foreground-tertiary mb-3 text-right uppercase tracking-wide">
                          You
                        </div>
                        <Card className="shadow-[0_8px_24px_rgba(0,0,0,0.08)] border-2 border-border-light bg-white hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-shadow duration-300">
                          <div className="markdown-content text-base">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        </Card>
                      </div>
                      <div className="flex items-start justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-foreground-tertiary to-foreground text-white shrink-0 shadow-[0_6px_20px_rgba(0,0,0,0.15)]">
                        <User className="w-7 h-7 mt-3.5" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-6">
                      <div className="flex items-start justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-primary-hover to-accent text-white shrink-0 shadow-[0_8px_24px_rgba(45,53,97,0.25)] animate-pulse-glow">
                        <Users className="w-7 h-7 mt-3.5 drop-shadow-lg" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-7 max-w-full">
                        <div className="flex items-center gap-3">
                          <span className="text-base font-extrabold text-foreground">The Council</span>
                          <div className="h-0.5 flex-1 bg-gradient-to-r from-border via-border/50 to-transparent rounded-full" />
                        </div>

                        {/* Stage 1 */}
                        {msg.loading?.stage1 && (
                          <LoadingState stage={1} text="Council members are forming their responses..." />
                        )}
                        {msg.stage1 && <Stage1 responses={msg.stage1} />}

                        {/* Stage 2 */}
                        {msg.loading?.stage2 && (
                          <LoadingState stage={2} text="Peer review in progress..." />
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
                          <LoadingState stage={3} text="Chairman synthesizing the verdict..." variant="success" />
                        )}
                        {msg.stage3 && <Stage3 finalResponse={msg.stage3} />}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t-2 border-border shadow-[0_-8px_40px_rgba(0,0,0,0.06)] bg-gradient-to-b from-white to-background-secondary/30">
        <form
          onSubmit={handleSubmit}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="max-w-5xl mx-auto px-8 py-7 w-full"
        >
          {/* Drag Overlay */}
          {isDragOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-accent/10 border-2 border-dashed border-accent rounded-2xl z-10 backdrop-blur-sm">
              <div className="text-accent font-semibold text-lg">Drop files to attach</div>
            </div>
          )}

          {/* File Attachments */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-background-secondary rounded-xl text-sm border border-border-light shadow-sm"
                >
                  <Paperclip className="w-4 h-4 text-foreground-tertiary" />
                  <span className="text-foreground font-medium">{file.name}</span>
                  <span className="text-foreground-tertiary">
                    {formatFileSize(file.size)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="p-1 hover:bg-background-tertiary rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-foreground-tertiary" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Container */}
          <div className="flex items-end gap-4">
            {/* Toolbar */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-2 px-3 py-1.5 text-sm font-medium">
                <ModeIcon className="w-4 h-4" />
                <span className="capitalize">{modes[mode]?.tagline || mode}</span>
              </Badge>

              <Button
                type="button"
                variant="ghost"
                size="iconSm"
                onClick={() => setShowModelSelector(true)}
                title="Configure council"
                className="hover:bg-accent/10"
              >
                <Settings className="w-5 h-5" />
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept=".txt,.md,.json,.csv,.pdf,.png,.jpg,.jpeg,.gif,.webp"
              />
              <Button
                type="button"
                variant="ghost"
                size="iconSm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || attachments.length >= 5}
                title="Attach files"
                className="hover:bg-accent/10"
              >
                <Paperclip className="w-5 h-5" />
              </Button>
            </div>

            {/* Textarea */}
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                placeholder={
                  conversation.messages.length === 0
                    ? 'Convene the council with your question...'
                    : 'Ask a follow-up question...'
                }
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                rows={1}
                className="min-h-[52px] max-h-[200px] py-3 px-4 text-base border-2 focus:ring-accent focus:border-accent"
              />
            </div>

            {/* Send/Stop Button */}
            {isLoading ? (
              <Button
                type="button"
                variant="destructive"
                onClick={onStopGeneration}
                className="gap-3 px-7 py-4 h-auto text-base font-bold shadow-[0_6px_20px_rgba(199,75,75,0.2)] hover:shadow-[0_8px_28px_rgba(199,75,75,0.3)] transition-all duration-300"
              >
                <Square className="w-5 h-5 fill-current" />
                Stop
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!input.trim()}
                className="gap-3 px-7 py-4 h-auto text-base font-bold bg-gradient-to-r from-primary via-primary-hover to-accent shadow-[0_6px_20px_rgba(45,53,97,0.2)] hover:shadow-[0_8px_28px_rgba(45,53,97,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <Send className="w-5 h-5" />
                Send
              </Button>
            )}
          </div>

          {/* Footer Hints */}
          <div className="flex items-center justify-between mt-3 text-xs text-foreground-tertiary">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 bg-background-secondary rounded-md text-[11px] font-medium border border-border-light">
                  Enter
                </kbd>
                to send
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 bg-background-secondary rounded-md text-[11px] font-medium border border-border-light">
                  Shift+Enter
                </kbd>
                for new line
              </span>
            </div>
            <div className={cn(
              'font-medium',
              input.length > MAX_CHARS * 0.9 && 'text-warning'
            )}>
              {input.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
            </div>
          </div>
        </form>
      </div>

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
  )
}

function LoadingState({ stage, text, variant = 'default' }) {
  return (
    <div
      className={cn(
        'flex items-center gap-5 p-6 rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] border-2',
        variant === 'success'
          ? 'bg-gradient-to-br from-success-bg to-success-bg/50 border-success-border/40'
          : 'bg-gradient-to-br from-background-secondary to-background-tertiary/50 border-border-light'
      )}
    >
      <div className="flex gap-2">
        <span className="w-3 h-3 rounded-full bg-accent shadow-[0_0_8px_rgba(212,165,116,0.4)] animate-pulse" />
        <span
          className="w-3 h-3 rounded-full bg-accent shadow-[0_0_8px_rgba(212,165,116,0.4)] animate-pulse"
          style={{ animationDelay: '200ms' }}
        />
        <span
          className="w-3 h-3 rounded-full bg-accent shadow-[0_0_8px_rgba(212,165,116,0.4)] animate-pulse"
          style={{ animationDelay: '400ms' }}
        />
      </div>
      <div>
        <span className="font-extrabold text-foreground text-base">Stage {stage}</span>
        <span className="text-foreground-secondary ml-3 text-sm font-medium">{text}</span>
      </div>
    </div>
  )
}
