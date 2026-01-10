import { createContext, forwardRef, useContext, useState } from 'react'
import { cn } from '@/lib/utils'

const TabsContext = createContext(null)

const Tabs = forwardRef(({ className, defaultValue, value, onValueChange, ...props }, ref) => {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = value ?? internalValue

  const handleValueChange = (newValue) => {
    if (onValueChange) {
      onValueChange(newValue)
    } else {
      setInternalValue(newValue)
    }
  }

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div ref={ref} className={cn('w-full', className)} {...props} />
    </TabsContext.Provider>
  )
})
Tabs.displayName = 'Tabs'

const TabsList = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'inline-flex h-11 items-center justify-center rounded-xl bg-background-tertiary p-1 text-foreground-secondary',
      className
    )}
    role="tablist"
    {...props}
  />
))
TabsList.displayName = 'TabsList'

const TabsTrigger = forwardRef(({ className, value, ...props }, ref) => {
  const context = useContext(TabsContext)
  const isActive = context?.value === value

  return (
    <button
      ref={ref}
      role="tab"
      aria-selected={isActive}
      onClick={() => context?.onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-white text-foreground shadow-sm'
          : 'text-foreground-secondary hover:text-foreground',
        className
      )}
      {...props}
    />
  )
})
TabsTrigger.displayName = 'TabsTrigger'

const TabsContent = forwardRef(({ className, value, ...props }, ref) => {
  const context = useContext(TabsContext)
  const isActive = context?.value === value

  if (!isActive) return null

  return (
    <div
      ref={ref}
      role="tabpanel"
      className={cn(
        'mt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        className
      )}
      {...props}
    />
  )
})
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }
