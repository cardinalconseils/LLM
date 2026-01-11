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
        'flex flex-col h-full w-80 bg-white border-r border-border-light shadow-sm transition-transform duration-300',
        'max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:shadow-xl',
        isOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'
      )}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 p-6 border-b border-border-light bg-background-secondary/40">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-white shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground">
              LLM Council
            </h1>
            <span className="text-xs text-foreground-tertiary">
              Collective Intelligence
            </span>
          </div>
        </div>

        {/* New Conversation Button */}
        <Button
          onClick={onNewConversation}
          className="w-full justify-center gap-2 h-11 text-base font-medium shadow-sm"
          variant="default"
        >
          <Plus className="w-5 h-5" />
          <span>New Conversation</span>
        </Button>
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-background-secondary text-foreground-tertiary mb-4 shadow-sm">
                <MessageSquare className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">
                No conversations yet
              </p>
              <span className="text-xs text-foreground-tertiary">
                Start a new conversation to consult the council
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {conversations.map((conv, index) => (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={cn(
                    'flex items-start gap-3 w-full px-4 py-3.5 rounded-xl text-left transition-all duration-200',
                    'hover:bg-background-secondary hover:shadow-sm',
                    conv.id === currentConversationId
                      ? 'bg-primary/5 text-primary border border-primary/20 shadow-sm'
                      : 'text-foreground border border-transparent'
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <MessageSquare
                    className={cn(
                      'w-4 h-4 shrink-0 mt-0.5',
                      conv.id === currentConversationId
                        ? 'text-primary'
                        : 'text-foreground-tertiary'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate mb-1">
                      {conv.title || 'New Conversation'}
                    </div>
                    <div className="text-xs text-foreground-tertiary">
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
      <div className="p-5 border-t border-border-light bg-background-secondary/30">
        <div className="flex items-center gap-2.5 text-xs text-foreground-tertiary">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="font-medium">Powered by OpenRouter</span>
        </div>
      </div>
    </aside>
  )
}
