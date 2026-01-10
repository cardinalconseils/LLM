import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-white',
        secondary:
          'bg-background-tertiary text-foreground-secondary',
        outline:
          'border border-border text-foreground',
        success:
          'bg-success-bg text-success border border-success/20',
        warning:
          'bg-warning-bg text-warning border border-warning/20',
        destructive:
          'bg-error-bg text-error border border-error/20',
        info:
          'bg-info-bg text-info border border-info/20',
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
