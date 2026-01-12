import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { User, Sparkle } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'

export default function Stage1({ responses }) {
  const [activeTab, setActiveTab] = useState(responses?.[0]?.model || '')

  if (!responses || responses.length === 0) {
    return null
  }

  return (
    <Card className="animate-council-gather overflow-hidden shadow-lg border-2 border-border-light">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b-2 border-border-light bg-gradient-to-r from-background-secondary/50 to-transparent">
        <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 text-primary shadow-md">
          <span className="text-lg font-bold">I</span>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-foreground mb-1">
            Individual Deliberations
          </h3>
          <p className="text-sm text-foreground-tertiary">
            {responses.length} council {responses.length === 1 ? 'member' : 'members'} responded
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
          <span className="text-xs font-semibold text-accent">Active</span>
        </div>
      </div>

      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Model Selector - Premium Pills */}
          <div className="mb-6 overflow-x-auto">
            <TabsList className="inline-flex gap-2 p-1.5 bg-background-secondary rounded-xl border border-border-light shadow-sm">
              {responses.map((resp, index) => {
                const modelName = resp.model.split('/').pop() || resp.model
                const shortName = modelName.length > 15 ? modelName.slice(0, 15) + '...' : modelName
                return (
                  <TabsTrigger
                    key={resp.model}
                    value={resp.model}
                    className={cn(
                      'relative px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-250',
                      'data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md',
                      'data-[state=inactive]:text-foreground-tertiary hover:text-foreground',
                      'animate-council-gather'
                    )}
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    {shortName}
                    {activeTab === resp.model && (
                      <div className="absolute inset-0 rounded-lg ring-2 ring-primary/20" />
                    )}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>

          {/* Response Content */}
          {responses.map((resp) => {
            const modelName = resp.model.split('/').pop() || resp.model
            return (
              <TabsContent key={resp.model} value={resp.model} className="mt-0 animate-fade-in">
                {/* Model Badge */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 shadow-sm">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs font-semibold">
                      <Sparkle className="w-3 h-3" />
                      {resp.model}
                    </Badge>
                  </div>
                </div>

                {/* Response Card */}
                <div className="bg-white rounded-2xl border-2 border-border-light shadow-sm p-1">
                  <div className="bg-gradient-to-br from-background-secondary/30 to-background/30 rounded-xl">
                    <div className="markdown-content text-base leading-relaxed">
                      <ReactMarkdown>{resp.response}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </CardContent>
    </Card>
  )
}
