import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { BarChart3, CheckCircle, ClipboardList, Star } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'

function deAnonymizeText(text, labelToModel) {
  if (!labelToModel) return text

  let result = text
  Object.entries(labelToModel).forEach(([label, model]) => {
    const modelShortName = model.split('/')[1] || model
    result = result.replace(new RegExp(label, 'g'), `**${modelShortName}**`)
  })
  return result
}

export default function Stage2({ rankings, labelToModel, aggregateRankings }) {
  const [activeTab, setActiveTab] = useState(rankings?.[0]?.model || '')

  if (!rankings || rankings.length === 0) {
    return null
  }

  return (
    <Card className="animate-fade-in-up overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-5 border-b border-border-light">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-info/10 text-info">
          <span className="text-sm font-semibold">2</span>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">
            Peer Rankings
          </h3>
          <p className="text-xs text-foreground-tertiary">
            Anonymous cross-evaluation
          </p>
        </div>
      </div>

      <CardContent className="p-5 space-y-5">
        {/* Aggregate Rankings */}
        {aggregateRankings && aggregateRankings.length > 0 && (
          <div className="bg-background-secondary rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-foreground-tertiary" />
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  Aggregate Rankings
                </h4>
                <span className="text-xs text-foreground-tertiary">
                  Combined peer evaluations (lower is better)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {aggregateRankings.map((agg, index) => {
                const modelName = agg.model.split('/')[1] || agg.model
                return (
                  <div
                    key={agg.model}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg transition-colors',
                      index === 0
                        ? 'bg-background-tertiary border border-primary/20'
                        : 'bg-white border border-border-light'
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className={cn(
                        'flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold',
                        index === 0
                          ? 'bg-primary text-white'
                          : 'bg-background-tertiary text-foreground-secondary'
                      )}
                    >
                      {index === 0 ? (
                        <Star className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        `#${index + 1}`
                      )}
                    </div>
                    <span className="flex-1 text-sm font-medium text-foreground">
                      {modelName}
                    </span>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-semibold text-foreground">
                        {agg.average_rank.toFixed(2)}
                      </span>
                      <span className="text-foreground-tertiary">
                        {agg.rankings_count} votes
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Raw Evaluations */}
        <div>
          <div className="mb-3">
            <h4 className="text-sm font-medium text-foreground">
              Raw Evaluations
            </h4>
            <p className="text-xs text-foreground-tertiary">
              Model names shown in <strong>bold</strong> were anonymized during evaluation.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full flex-wrap h-auto gap-1 p-1">
              {rankings.map((rank) => {
                const modelName = rank.model.split('/')[1] || rank.model
                return (
                  <TabsTrigger
                    key={rank.model}
                    value={rank.model}
                    className="flex-1 min-w-[100px]"
                  >
                    {modelName}
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {rankings.map((rank) => (
              <TabsContent key={rank.model} value={rank.model}>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-foreground-tertiary" />
                  <Badge variant="secondary">{rank.model}</Badge>
                </div>

                <div className="bg-background-secondary rounded-xl">
                  <div className="markdown-content">
                    <ReactMarkdown>
                      {deAnonymizeText(rank.ranking, labelToModel)}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Extracted Ranking */}
                {rank.parsed_ranking && rank.parsed_ranking.length > 0 && (
                  <div className="mt-4 p-4 bg-background-secondary rounded-xl border border-border-light">
                    <div className="flex items-center gap-2 mb-3">
                      <ClipboardList className="w-4 h-4 text-foreground-tertiary" />
                      <span className="text-sm font-medium text-foreground">
                        Extracted Ranking
                      </span>
                    </div>
                    <ol className="space-y-1.5">
                      {rank.parsed_ranking.map((label, i) => {
                        const modelName = labelToModel && labelToModel[label]
                          ? labelToModel[label].split('/')[1] || labelToModel[label]
                          : label
                        return (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-background-tertiary text-foreground text-xs font-medium">
                              {i + 1}
                            </span>
                            <span className="text-foreground">
                              {modelName}
                            </span>
                          </li>
                        )
                      })}
                    </ol>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
