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
        'flex flex-col h-full w-80 bg-gradient-to-b from-white via-background-secondary/30 to-background-secondary border-r-2 border-border shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-transform duration-300',
        'max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:shadow-[0_16px_64px_rgba(0,0,0,0.15)]',
        isOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'
      )}
    >
      {/* Header */}
      <div className="flex flex-col gap-6 p-6 border-b-2 border-border-light bg-gradient-to-br from-white to-background-secondary/50">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-primary-hover to-accent text-white shadow-[0_8px_24px_rgba(45,53,97,0.25)]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-25 blur-2xl rounded-2xl" />
            <Users className="relative w-8 h-8 drop-shadow-lg" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              LLM Council
            </h1>
            <span className="text-xs text-foreground-tertiary font-bold uppercase tracking-wide">
              Council Archive
            </span>
          </div>
        </div>

        {/* New Session Button */}
        <Button
          onClick={onNewConversation}
          className="w-full justify-center gap-3 h-14 text-base font-bold shadow-[0_6px_20px_rgba(45,53,97,0.15)] hover:shadow-[0_8px_28px_rgba(45,53,97,0.25)] bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary transition-all duration-300"
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
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fade-in-up">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-background-tertiary to-background-secondary text-foreground-muted mb-6 shadow-lg">
                <Scroll className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-extrabold text-foreground mb-3">
                No Sessions Yet
              </h3>
              <p className="text-sm text-foreground-tertiary leading-relaxed max-w-[220px]">
                Begin a new council session to start deliberating with AI minds
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-7">
              {Object.entries(groupedConversations).map(([label, convs]) => (
                <div key={label} className="space-y-3 animate-slide-in-right">
                  {/* Date Header */}
                  <div className="flex items-center gap-2.5 px-3 py-1.5">
                    <Clock className="w-4 h-4 text-accent" />
                    <span className="text-xs font-extrabold text-accent uppercase tracking-wider">
                      {label}
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-accent/30 to-transparent" />
                  </div>

                  {/* Conversations */}
                  {convs.map((conv, index) => (
                    <button
                      key={conv.id}
                      onClick={() => onSelectConversation(conv.id)}
                      className={cn(
                        'group relative flex items-start gap-3.5 w-full px-4 py-4 rounded-2xl text-left',
                        'transition-all duration-300',
                        conv.id === currentConversationId
                          ? 'bg-gradient-to-br from-primary/10 to-accent/8 shadow-[0_4px_16px_rgba(45,53,97,0.12)] ring-2 ring-primary/30 scale-[1.01]'
                          : 'bg-white hover:bg-gradient-to-br hover:from-background-secondary hover:to-background-tertiary/50 border-2 border-border-light hover:border-primary/40 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
                      )}
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      {/* Icon */}
                      <div
                        className={cn(
                          'flex items-center justify-center w-10 h-10 rounded-xl shrink-0',
                          'transition-all duration-300',
                          conv.id === currentConversationId
                            ? 'bg-gradient-to-br from-primary to-primary-hover text-white shadow-[0_4px_12px_rgba(45,53,97,0.2)]'
                            : 'bg-gradient-to-br from-background-secondary to-background-tertiary text-foreground-tertiary group-hover:from-background-tertiary group-hover:to-background-secondary group-hover:text-foreground-secondary group-hover:scale-105'
                        )}
                      >
                        <MessageSquare className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div
                          className={cn(
                            'text-sm font-extrabold truncate mb-1.5 leading-tight',
                            conv.id === currentConversationId
                              ? 'text-primary'
                              : 'text-foreground group-hover:text-primary'
                          )}
                        >
                          {conv.title || 'Untitled Session'}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-foreground-tertiary font-medium">
                          <span>
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
                          <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_10px_rgba(212,165,116,0.6)] animate-pulse-glow" />
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
      <div className="p-5 border-t-2 border-border-light bg-gradient-to-br from-background-secondary/50 to-background-tertiary/30">
        <div className="flex items-center gap-4 px-4 py-3 bg-white rounded-2xl border-2 border-border-light shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-center w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_8px_rgba(74,157,111,0.5)] animate-pulse" />
          <div className="flex-1">
            <div className="text-xs font-extrabold text-foreground">System Active</div>
            <div className="text-[10px] text-foreground-tertiary font-medium">Powered by OpenRouter</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
