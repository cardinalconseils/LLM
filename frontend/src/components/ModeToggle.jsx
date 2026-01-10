/**
 * ModeToggle - Apple-style segmented control for switching council modes
 */

import { MessageSquare, Code, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

const modes = [
  {
    id: 'chat',
    label: 'Chat',
    icon: MessageSquare,
    description: 'General conversation',
    color: 'from-[var(--color-primary)] to-blue-600',
  },
  {
    id: 'code',
    label: 'Code',
    icon: Code,
    description: 'Programming assistance',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'image',
    label: 'Image',
    icon: Image,
    description: 'Image generation',
    color: 'from-violet-500 to-violet-600',
  },
];

export default function ModeToggle({ mode, onModeChange, disabled }) {
  const activeIndex = modes.findIndex((m) => m.id === mode);
  const activeMode = modes.find((m) => m.id === mode);

  return (
    <div className="flex flex-col items-center p-4 bg-[var(--color-background-secondary)] border-b border-[var(--color-border-light)]">
      <div
        className="relative flex bg-white border border-[var(--color-border-light)] rounded-2xl p-1 gap-0.5 shadow-sm"
        role="tablist"
        aria-label="Council mode"
      >
        {modes.map((m, index) => {
          const Icon = m.icon;
          const isActive = mode === m.id;

          return (
            <button
              key={m.id}
              className={cn(
                'relative z-10 flex items-center justify-center gap-2 px-5 py-2 rounded-xl',
                'text-sm font-medium transition-colors duration-200',
                'min-w-[90px] max-sm:min-w-[60px]',
                isActive
                  ? 'text-white'
                  : 'text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground)]',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => !disabled && onModeChange(m.id)}
              disabled={disabled}
              role="tab"
              aria-selected={isActive}
              title={m.description}
            >
              <Icon className="w-4 h-4 max-sm:w-4 max-sm:h-4" />
              <span className="max-sm:hidden">{m.label}</span>
            </button>
          );
        })}

        {/* Animated indicator */}
        <div
          className={cn(
            'absolute top-1 left-1 h-[calc(100%-8px)] rounded-xl',
            'bg-gradient-to-br shadow-md transition-all duration-200 ease-out',
            activeMode?.color
          )}
          style={{
            width: `calc(${100 / modes.length}% - 4px)`,
            transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 2}px))`,
          }}
        />
      </div>

      <div className="mt-2 text-xs text-[var(--color-foreground-muted)] uppercase tracking-wider">
        {activeMode?.description}
      </div>
    </div>
  );
}
