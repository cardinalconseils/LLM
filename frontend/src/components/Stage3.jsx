import ReactMarkdown from 'react-markdown'
import { CheckCircle2, GraduationCap } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'

export default function Stage3({ finalResponse }) {
  if (!finalResponse) {
    return null
  }

  const modelName = finalResponse.model.split('/')[1] || finalResponse.model

  return (
    <Card className="animate-fade-in-up overflow-hidden border-[var(--color-success)]/20 bg-gradient-to-br from-white to-[var(--color-success-bg)]">
      {/* Header */}
      <div className="flex items-center gap-3 p-5 border-b border-[var(--color-success)]/20">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)]">
          <span className="text-sm font-semibold">3</span>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
            Final Council Answer
          </h3>
          <p className="text-xs text-[var(--color-foreground-tertiary)]">
            Synthesized response
          </p>
        </div>
        <Badge variant="success" className="gap-1.5">
          <CheckCircle2 className="w-3 h-3" />
          Consensus Reached
        </Badge>
      </div>

      <CardContent className="p-5">
        {/* Chairman Info */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-xl border border-[var(--color-border-light)]">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-blue-600 text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs text-[var(--color-foreground-tertiary)]">
              Chairman Model
            </span>
            <span className="text-sm font-medium text-[var(--color-foreground)]">
              {modelName}
            </span>
          </div>
        </div>

        {/* Response Content */}
        <div className="bg-white rounded-xl border border-[var(--color-border-light)]">
          <div className="markdown-content">
            <ReactMarkdown>{finalResponse.response}</ReactMarkdown>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
