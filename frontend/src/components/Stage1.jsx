import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Layers } from 'lucide-react'
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
    <Card className="animate-fade-in-up overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-5 border-b border-border-light">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
          <span className="text-sm font-semibold">1</span>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">
            Individual Responses
          </h3>
          <p className="text-xs text-foreground-tertiary">
            {responses.length} models responded
          </p>
        </div>
      </div>

      <CardContent className="p-5">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full flex-wrap h-auto gap-1 p-1">
            {responses.map((resp) => {
              const modelName = resp.model.split('/')[1] || resp.model
              return (
                <TabsTrigger
                  key={resp.model}
                  value={resp.model}
                  className="flex-1 min-w-[100px]"
                >
                  {modelName}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {responses.map((resp) => {
            const modelName = resp.model.split('/')[1] || resp.model
            return (
              <TabsContent key={resp.model} value={resp.model}>
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-4 h-4 text-foreground-tertiary" />
                  <Badge variant="secondary">{resp.model}</Badge>
                </div>
                <div className="bg-background-secondary rounded-xl">
                  <div className="markdown-content">
                    <ReactMarkdown>{resp.response}</ReactMarkdown>
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
