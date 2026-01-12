import { useState } from 'react'
import { BarChart3, TrendingUp, Award, Star, ChevronDown, Copy, Share, MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { cn } from '@/lib/utils'

export default function RightPanel({
  aggregateRankings,
  labelToModel,
  stage1Responses,
  isVisible = true
}) {
  const [copied, setCopied] = useState(false)

  if (!isVisible) return null

  // Process rankings data for the chart
  const chartData = aggregateRankings?.map((item, index) => ({
    label: item.model?.split('/').pop() || `Model ${index + 1}`,
    fullModel: item.model,
    avgRank: item.avg_rank,
    votes: item.votes,
    // Normalize for bar height (lower rank = better = taller bar)
    height: Math.max(10, 100 - (item.avg_rank - 1) * 25),
  })) || []

  // Get top 2 models for the detail cards
  const topModels = chartData.slice(0, 2)

  // Calculate stats for each model
  const getModelStats = (model, index) => {
    const response = stage1Responses?.find(r => r.model === model.fullModel)
    const wordCount = response?.content?.split(/\s+/).length || 0
    const charCount = response?.content?.length || 0

    return {
      rank: `#${index + 1}`,
      avgScore: (5 - model.avgRank + 1).toFixed(1),
      votes: model.votes,
      wordCount,
      charCount,
    }
  }

  const handleCopy = () => {
    const text = chartData.map(m => `${m.label}: Rank ${m.avgRank.toFixed(2)}`).join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Empty state when no data
  if (!aggregateRankings || aggregateRankings.length === 0) {
    return (
      <aside className="w-[420px] border-l border-border-light bg-white flex flex-col">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-background-secondary flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-foreground-muted" />
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">No Results Yet</h3>
            <p className="text-xs text-foreground-tertiary">
              Council analytics will appear here after a query
            </p>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-[420px] border-l-2 border-border bg-gradient-to-b from-white to-background-secondary flex flex-col overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b-2 border-border-light bg-gradient-to-r from-white to-background-secondary/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center shadow-md">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Council Analytics</h2>
            <p className="text-xs text-foreground-tertiary font-medium">{chartData.length} members ranked</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="iconSm"
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy results"}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="iconSm" title="Share">
            <Share className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="iconSm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Bar Chart Section */}
        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Rankings by Model</h3>
              <span className="text-xs text-foreground-tertiary px-2 py-1 bg-background-secondary rounded-full">
                Avg. Position
              </span>
            </div>

            {/* Chart */}
            <div className="h-[180px] flex items-end justify-around gap-3 pt-4">
              {chartData.map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  {/* Bar */}
                  <div className="relative w-full flex justify-center">
                    <div
                      className={cn(
                        "w-12 rounded-t-xl transition-all duration-500 ease-out shadow-md",
                        index === 0 ? "bg-gradient-to-t from-accent to-accent-hover" :
                        index === 1 ? "bg-gradient-to-t from-primary/70 to-primary" :
                        index === 2 ? "bg-gradient-to-t from-primary/50 to-primary/70" :
                        "bg-gradient-to-t from-background-tertiary to-foreground-muted"
                      )}
                      style={{
                        height: `${item.height}px`,
                        animationDelay: `${index * 100}ms`
                      }}
                    />
                    {/* Value label on top of bar */}
                    <span className="absolute -top-6 text-xs font-bold text-foreground">
                      {item.avgRank.toFixed(1)}
                    </span>
                  </div>
                  {/* Label */}
                  <span className="text-[10px] text-foreground-tertiary text-center truncate w-full px-1 font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t-2 border-border-light">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-md bg-gradient-to-br from-accent to-accent-hover shadow-sm" />
                <span className="text-xs text-foreground-tertiary font-medium">Best</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-md bg-gradient-to-br from-primary to-primary-hover shadow-sm" />
                <span className="text-xs text-foreground-tertiary font-medium">Top 3</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Model Detail Cards */}
        <div className="grid grid-cols-2 gap-3">
          {topModels.map((model, index) => {
            const stats = getModelStats(model, index)
            return (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  {/* Card Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      index === 0 ? "bg-amber-100" : "bg-slate-100"
                    )}>
                      {index === 0 ? (
                        <Award className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Star className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-foreground truncate">
                        {model.label}
                      </h4>
                      <span className={cn(
                        "text-xs font-medium",
                        index === 0 ? "text-amber-600" : "text-foreground-tertiary"
                      )}>
                        {stats.rank} Place
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2">
                    <StatRow
                      label="Avg. Score"
                      value={`${stats.avgScore}/5`}
                      highlight={index === 0}
                    />
                    <StatRow
                      label="Peer Votes"
                      value={stats.votes}
                    />
                    <StatRow
                      label="Response"
                      value={`${stats.wordCount} words`}
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Summary Stats */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-violet-500" />
              <h4 className="text-sm font-semibold text-foreground">Quick Stats</h4>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-background-secondary rounded-xl">
                <div className="text-lg font-bold text-foreground">{chartData.length}</div>
                <div className="text-xs text-foreground-tertiary">Models</div>
              </div>
              <div className="text-center p-3 bg-background-secondary rounded-xl">
                <div className="text-lg font-bold text-foreground">
                  {chartData.reduce((sum, m) => sum + m.votes, 0)}
                </div>
                <div className="text-xs text-foreground-tertiary">Total Votes</div>
              </div>
              <div className="text-center p-3 bg-background-secondary rounded-xl">
                <div className="text-lg font-bold text-violet-600">
                  {chartData[0]?.label?.slice(0, 8) || '-'}
                </div>
                <div className="text-xs text-foreground-tertiary">Winner</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}

function StatRow({ label, value, highlight = false }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-foreground-tertiary">{label}</span>
      <span className={cn(
        "text-xs font-medium",
        highlight ? "text-violet-600" : "text-foreground"
      )}>
        {value}
      </span>
    </div>
  )
}
