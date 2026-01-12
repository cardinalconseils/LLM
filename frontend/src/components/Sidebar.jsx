import { MessageSquare, Plus, Users, Clock, Scroll } from 'lucide-react'
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
  // Group conversations by date for better organization
  const groupedConversations = conversations.reduce((groups, conv) => {
    const date = new Date(conv.created_at)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    let label
    if (date.toDateString() === today.toDateString()) {
      label = 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      label = 'Yesterday'
    } else {
      label = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    }

    if (!groups[label]) groups[label] = []
    groups[label].push(conv)
    return groups
  }, {})

  return (
    <aside
      className={cn(
        'flex flex-col h-full w-80 bg-gradient-to-b from-white to-background-secondary border-r-2 border-border shadow-lg transition-transform duration-300',
        'max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:shadow-2xl',
        isOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'
      )}
    >
      {/* Header */}
      <div className="flex flex-col gap-5 p-6 border-b-2 border-border-light">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-20 blur-xl rounded-2xl" />
            <Users className="relative w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              LLM Council
            </h1>
            <span className="text-xs text-foreground-tertiary font-medium">
              Council Archive
            </span>
          </div>
        </div>

        {/* New Session Button */}
        <Button
          onClick={onNewConversation}
          className="w-full justify-center gap-2.5 h-12 text-base font-semibold shadow-md hover:shadow-lg bg-gradient-to-r from-primary to-primary-hover"
          variant="default"
        >
          <Plus className="w-5 h-5" />
          <span>New Council Session</span>
        </Button>
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in-up">
              <div className="flex items-center justify-center w-18 h-18 rounded-2xl bg-background-tertiary/50 text-foreground-muted mb-5">
                <Scroll className="w-9 h-9" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">
                No Sessions Yet
              </h3>
              <p className="text-sm text-foreground-tertiary leading-relaxed">
                Begin a new council session to start deliberating with AI minds
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {Object.entries(groupedConversations).map(([label, convs]) => (
                <div key={label} className="space-y-2 animate-slide-in-right">
                  {/* Date Header */}
                  <div className="flex items-center gap-2 px-3 py-1">
                    <Clock className="w-3.5 h-3.5 text-accent" />
                    <span className="text-xs font-bold text-accent uppercase tracking-wide">
                      {label}
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                  </div>

                  {/* Conversations */}
                  {convs.map((conv, index) => (
                    <button
                      key={conv.id}
                      onClick={() => onSelectConversation(conv.id)}
                      className={cn(
                        'group relative flex items-start gap-3 w-full px-4 py-4 rounded-xl text-left',
                        'transition-all duration-250',
                        'hover:shadow-md',
                        conv.id === currentConversationId
                          ? 'bg-gradient-to-br from-primary/8 to-accent/5 shadow-md ring-2 ring-primary/20'
                          : 'bg-white hover:bg-background-secondary border border-border-light hover:border-primary/30'
                      )}
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      {/* Icon */}
                      <div
                        className={cn(
                          'flex items-center justify-center w-9 h-9 rounded-lg shrink-0',
                          'transition-all duration-250',
                          conv.id === currentConversationId
                            ? 'bg-gradient-to-br from-primary to-primary-hover text-white shadow-md'
                            : 'bg-background-secondary text-foreground-tertiary group-hover:bg-background-tertiary'
                        )}
                      >
                        <MessageSquare className="w-4.5 h-4.5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div
                          className={cn(
                            'text-sm font-semibold truncate mb-1.5 leading-tight',
                            conv.id === currentConversationId
                              ? 'text-primary'
                              : 'text-foreground group-hover:text-primary'
                          )}
                        >
                          {conv.title || 'Untitled Session'}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-foreground-tertiary">
                          <span className="font-medium">
                            {conv.message_count} {conv.message_count === 1 ? 'exchange' : 'exchanges'}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-foreground-muted" />
                          <span>
                            {new Date(conv.created_at).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Active Indicator */}
                      {conv.id === currentConversationId && (
                        <div className="absolute right-4 top-4">
                          <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-5 border-t-2 border-border-light bg-background-secondary/50">
        <div className="flex items-center gap-3 px-3 py-2 bg-white rounded-xl border border-border-light shadow-sm">
          <div className="flex items-center justify-center w-2 h-2 rounded-full bg-success animate-pulse" />
          <div className="flex-1">
            <div className="text-xs font-semibold text-foreground">System Active</div>
            <div className="text-[10px] text-foreground-tertiary">Powered by OpenRouter</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
