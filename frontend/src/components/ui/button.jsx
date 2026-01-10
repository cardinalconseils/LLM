import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-primary)] text-white shadow-sm hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)]',
        secondary:
          'bg-[var(--color-background-tertiary)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]',
        outline:
          'border border-[var(--color-border)] bg-transparent text-[var(--color-foreground)] hover:bg-[var(--color-background-secondary)]',
        ghost:
          'text-[var(--color-foreground)] hover:bg-[var(--color-background-secondary)]',
        destructive:
          'bg-[var(--color-error)] text-white hover:bg-[var(--color-error)]/90',
        success:
          'bg-[var(--color-success)] text-white hover:bg-[var(--color-success)]/90',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
        iconSm: 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const Button = forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? 'span' : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
