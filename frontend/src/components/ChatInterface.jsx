import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { MessageSquare, Code, Image, Settings, Paperclip, Send, Square, User, Sparkles, X } from 'lucide-react'
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
  chat: { icon: MessageSquare, name: 'Chat', description: 'General conversation with multiple AI models' },
  code: { icon: Code, name: 'Code', description: 'Programming help from expert models' },
  image: { icon: Image, name: 'Image', description: 'Creative image generation council' },
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
      <main className="flex-1 flex flex-col items-center justify-center p-8 bg-background-secondary">
        <div className="w-full max-w-2xl text-center">
          {/* Logo */}
          <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-3xl bg-primary text-white mb-6 shadow-lg">
            <Sparkles className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Welcome to LLM Council
          </h2>
          <p className="text-foreground-secondary mb-8">
            Harness the collective intelligence of multiple AI models
          </p>

          {/* Mode Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {Object.entries(modes).map(([key, { icon: Icon, name, description }]) => (
              <button
                key={key}
                onClick={() => onModeChange(key)}
                className={cn(
                  'relative flex flex-col items-start gap-3 p-5 rounded-2xl text-left transition-all duration-200',
                  'border-2 bg-white hover:shadow-md',
                  mode === key
                    ? 'border-primary shadow-md'
                    : 'border-transparent hover:border-border'
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-xl transition-colors',
                    mode === key
                      ? 'bg-primary text-white'
                      : 'bg-background-secondary text-foreground-secondary'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{name}</div>
                  <div className="text-xs text-foreground-tertiary mt-1">
                    {description}
                  </div>
                </div>
                {mode === key && (
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>

          {/* Settings Button */}
          <Button
            variant="outline"
            onClick={() => setShowModelSelector(true)}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            Configure Council Models
          </Button>
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
    <main className="flex-1 flex flex-col h-full bg-background-secondary overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {conversation.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-background-tertiary text-foreground-tertiary mb-4">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Start a conversation
              </h2>
              <p className="text-foreground-secondary">
                Ask a question to consult the LLM Council
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {conversation.messages.map((msg, index) => (
                <div
                  key={index}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {msg.role === 'user' ? (
                    <div className="flex gap-4">
                      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-foreground text-white shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-foreground-secondary mb-1">
                          You
                        </div>
                        <Card className="inline-block max-w-full">
                          <div className="markdown-content">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-4">
                        <div className="text-xs font-medium text-foreground-secondary">
                          LLM Council
                        </div>

                        {/* Stage 1 */}
                        {msg.loading?.stage1 && (
                          <LoadingState stage={1} text="Collecting individual responses..." />
                        )}
                        {msg.stage1 && <Stage1 responses={msg.stage1} />}

                        {/* Stage 2 */}
                        {msg.loading?.stage2 && (
                          <LoadingState stage={2} text="Running peer rankings..." />
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
                          <LoadingState stage={3} text="Synthesizing final answer..." variant="success" />
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
      <div className="border-t border-border-light bg-white p-4">
        <form
          onSubmit={handleSubmit}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="max-w-4xl mx-auto"
        >
          {/* Drag Overlay */}
          {isDragOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/5 border-2 border-dashed border-primary rounded-2xl z-10">
              <div className="text-primary font-medium">Drop files here</div>
            </div>
          )}

          {/* File Attachments */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 bg-background-secondary rounded-lg text-sm"
                >
                  <Paperclip className="w-3 h-3 text-foreground-tertiary" />
                  <span className="text-foreground">{file.name}</span>
                  <span className="text-foreground-tertiary">
                    {formatFileSize(file.size)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="p-0.5 hover:bg-background-tertiary rounded"
                  >
                    <X className="w-3 h-3 text-foreground-tertiary" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Container */}
          <div className="flex items-end gap-3">
            {/* Toolbar */}
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="gap-1.5 px-2.5 py-1">
                <ModeIcon className="w-3 h-3" />
                <span className="capitalize">{mode}</span>
              </Badge>

              <Button
                type="button"
                variant="ghost"
                size="iconSm"
                onClick={() => setShowModelSelector(true)}
                title="Configure council models"
              >
                <Settings className="w-4 h-4" />
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
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>

            {/* Textarea */}
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                placeholder={
                  conversation.messages.length === 0
                    ? 'Ask your question to consult the LLM Council...'
                    : 'Continue the conversation...'
                }
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                rows={1}
                className="min-h-[44px] max-h-[200px] py-2.5"
              />
            </div>

            {/* Send/Stop Button */}
            {isLoading ? (
              <Button
                type="button"
                variant="destructive"
                onClick={onStopGeneration}
                className="gap-2"
              >
                <Square className="w-4 h-4 fill-current" />
                Stop
              </Button>
            ) : (
              <Button type="submit" disabled={!input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Footer Hints */}
          <div className="flex items-center justify-between mt-2 text-xs text-foreground-tertiary">
            <div className="flex items-center gap-3">
              <span>
                <kbd className="px-1.5 py-0.5 bg-background-secondary rounded text-[10px]">
                  Enter
                </kbd>{' '}
                to send
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-background-secondary rounded text-[10px]">
                  Shift+Enter
                </kbd>{' '}
                for new line
              </span>
            </div>
            <div className={cn(input.length > MAX_CHARS * 0.9 && 'text-warning')}>
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
        'flex items-center gap-3 p-4 rounded-2xl',
        variant === 'success'
          ? 'bg-success-bg'
          : 'bg-background-secondary'
      )}
    >
      <div className="flex gap-1">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span
          className="w-2 h-2 rounded-full bg-primary animate-pulse"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="w-2 h-2 rounded-full bg-primary animate-pulse"
          style={{ animationDelay: '300ms' }}
        />
      </div>
      <div>
        <span className="font-medium text-foreground">Stage {stage}</span>
        <span className="text-foreground-secondary ml-2">{text}</span>
      </div>
    </div>
  )
}
