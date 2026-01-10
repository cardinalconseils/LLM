import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const ScrollArea = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      <div className="h-full w-full overflow-auto scrollbar-thin">
        {children}
      </div>
    </div>
  )
})
ScrollArea.displayName = 'ScrollArea'

export { ScrollArea }
