import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-primary)] text-white',
        secondary:
          'bg-[var(--color-background-tertiary)] text-[var(--color-foreground-secondary)]',
        outline:
          'border border-[var(--color-border)] text-[var(--color-foreground)]',
        success:
          'bg-[var(--color-success-bg)] text-[var(--color-success)] border border-[var(--color-success)]/20',
        warning:
          'bg-[var(--color-warning-bg)] text-[var(--color-warning)] border border-[var(--color-warning)]/20',
        destructive:
          'bg-[var(--color-error-bg)] text-[var(--color-error)] border border-[var(--color-error)]/20',
        info:
          'bg-[var(--color-info-bg)] text-[var(--color-info)] border border-[var(--color-info)]/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
