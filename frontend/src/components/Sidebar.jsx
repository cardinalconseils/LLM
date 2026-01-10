import { MessageSquare, Plus, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { cn } from '@/lib/utils'

export default function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  isOpen,
}) {
  return (
    <aside
      className={cn(
        'flex flex-col h-full w-72 bg-white border-r border-[var(--color-border-light)] transition-transform duration-300',
        'max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:shadow-xl',
        isOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'
      )}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 p-5 border-b border-[var(--color-border-light)]">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-blue-600 text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-semibold text-[var(--color-foreground)]">
              LLM Council
            </h1>
            <span className="text-xs text-[var(--color-foreground-tertiary)]">
              Collective Intelligence
            </span>
          </div>
        </div>

        {/* New Conversation Button */}
        <Button
          onClick={onNewConversation}
          className="w-full justify-start gap-2"
          variant="secondary"
        >
          <Plus className="w-4 h-4" />
          <span>New Conversation</span>
        </Button>
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--color-background-secondary)] text-[var(--color-foreground-tertiary)] mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-[var(--color-foreground-secondary)]">
                No conversations yet
              </p>
              <span className="text-xs text-[var(--color-foreground-tertiary)] mt-1">
                Start a new conversation to consult the council
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {conversations.map((conv, index) => (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={cn(
                    'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-all duration-200',
                    'hover:bg-[var(--color-background-secondary)]',
                    conv.id === currentConversationId
                      ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                      : 'text-[var(--color-foreground)]'
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <MessageSquare
                    className={cn(
                      'w-4 h-4 shrink-0',
                      conv.id === currentConversationId
                        ? 'text-[var(--color-primary)]'
                        : 'text-[var(--color-foreground-tertiary)]'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {conv.title || 'New Conversation'}
                    </div>
                    <div className="text-xs text-[var(--color-foreground-tertiary)]">
                      {conv.message_count} {conv.message_count === 1 ? 'message' : 'messages'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--color-border-light)]">
        <div className="flex items-center gap-2 text-xs text-[var(--color-foreground-tertiary)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
          <span>Powered by OpenRouter</span>
        </div>
      </div>
    </aside>
  )
}
