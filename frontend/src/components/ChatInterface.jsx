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
      <main className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
        <div className="w-full max-w-5xl">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in-up">
            {/* Council Logo */}
            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-20 blur-3xl rounded-full animate-pulse-glow" />
              <div className="relative flex items-center justify-center w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-2xl">
                <Users className="w-16 h-16" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl font-bold text-foreground mb-4 tracking-tight">
              LLM Council
            </h1>
            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto leading-relaxed">
              Where the world's most advanced AI models gather to deliberate, debate, and deliver excellence
            </p>
          </div>

          {/* Mode Selector - Premium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {Object.entries(modes).map(([key, { icon: Icon, name, tagline, description, color }], index) => (
              <button
                key={key}
                onClick={() => onModeChange(key)}
                className={cn(
                  'group relative overflow-hidden',
                  'flex flex-col p-8 rounded-2xl text-left',
                  'bg-white border border-border-light',
                  'shadow-md hover:shadow-xl',
                  'transition-all duration-400',
                  mode === key ? 'ring-2 ring-primary ring-offset-4 ring-offset-background scale-105' : 'hover:scale-102',
                  'animate-council-gather'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background Gradient (subtle) */}
                <div
                  className={cn(
                    'absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-400',
                    'bg-gradient-to-br',
                    color
                  )}
                />

                {/* Icon */}
                <div
                  className={cn(
                    'relative z-10 flex items-center justify-center w-14 h-14 rounded-2xl mb-4',
                    'transition-all duration-300 shadow-lg',
                    mode === key
                      ? 'bg-gradient-to-br from-primary to-primary-hover text-white scale-110'
                      : 'bg-background-secondary text-foreground-tertiary group-hover:bg-background-tertiary group-hover:scale-105'
                  )}
                >
                  <Icon className="w-7 h-7" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex-1">
                  <div className="text-sm font-semibold text-accent mb-1">{tagline}</div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{name}</h3>
                  <p className="text-sm text-foreground-tertiary leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Selection Indicator */}
                {mode === key && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5">
                    <span className="text-xs font-medium text-accent">Active</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-glow" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Configure Button */}
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowModelSelector(true)}
              className="gap-2 px-6 py-3 text-base font-medium shadow-md hover:shadow-lg border-2"
            >
              <Settings className="w-5 h-5" />
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
    <main className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-background via-background-secondary/30 to-background">
        <div className="max-w-5xl mx-auto px-8 py-8 w-full">
          {conversation.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in-up">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-background-tertiary to-background-secondary text-foreground-tertiary mb-6 shadow-md">
                <MessageSquare className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                The Council Awaits
              </h2>
              <p className="text-foreground-secondary text-lg max-w-md">
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
                    <div className="flex gap-5 justify-end">
                      <div className="flex-1 max-w-3xl">
                        <div className="text-xs font-semibold text-foreground-tertiary mb-2 text-right">
                          You
                        </div>
                        <Card className="shadow-lg border-2 border-border-light bg-white">
                          <div className="markdown-content text-base">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        </Card>
                      </div>
                      <div className="flex items-start justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-foreground-tertiary to-foreground text-white shrink-0 shadow-lg">
                        <User className="w-6 h-6 mt-3" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-5">
                      <div className="flex items-start justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-white shrink-0 shadow-lg animate-pulse-glow">
                        <Users className="w-6 h-6 mt-3" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-6 max-w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">The Council</span>
                          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
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
      <div className="border-t-2 border-border-light bg-white shadow-2xl">
        <form
          onSubmit={handleSubmit}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="max-w-5xl mx-auto px-8 py-6 w-full"
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
                className="gap-2 px-6 py-3 h-auto text-base font-medium shadow-lg"
              >
                <Square className="w-5 h-5 fill-current" />
                Stop
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!input.trim()}
                className="gap-2 px-6 py-3 h-auto text-base font-medium bg-gradient-to-r from-primary to-primary-hover shadow-lg hover:shadow-xl disabled:opacity-50"
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
        'flex items-center gap-4 p-5 rounded-2xl shadow-md border',
        variant === 'success'
          ? 'bg-success-bg border-success-border/30'
          : 'bg-background-secondary border-border-light'
      )}
    >
      <div className="flex gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
        <span
          className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"
          style={{ animationDelay: '200ms' }}
        />
        <span
          className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"
          style={{ animationDelay: '400ms' }}
        />
      </div>
      <div>
        <span className="font-bold text-foreground">Stage {stage}</span>
        <span className="text-foreground-secondary ml-2 text-sm">{text}</span>
      </div>
    </div>
  )
}
