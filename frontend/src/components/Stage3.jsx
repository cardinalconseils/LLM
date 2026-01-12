import ReactMarkdown from 'react-markdown'
import { Crown, Sparkles, Check, GraduationCap } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { cn } from '@/lib/utils'

export default function Stage3({ finalResponse }) {
  if (!finalResponse) {
    return null
  }

  const modelName = finalResponse.model?.split('/').pop() || finalResponse.model || 'Chairman'

  return (
    <Card className="animate-council-gather overflow-hidden shadow-2xl border-2 border-accent/40">
      {/* Header - Premium Gold Accent */}
      <div className="relative flex items-center gap-4 p-6 border-b-2 border-accent/30 bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent animate-shimmer" />
        </div>

        {/* Crown Icon */}
        <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent-hover text-white shadow-lg">
          <Crown className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success animate-pulse-glow" />
        </div>

        {/* Title */}
        <div className="relative flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-foreground">
              The Verdict
            </h3>
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
          </div>
          <p className="text-sm text-foreground-secondary font-medium">
            Chairman's synthesized conclusion
          </p>
        </div>

        {/* Checkmark Badge */}
        <div className="relative flex items-center gap-2 px-4 py-2 bg-success/10 rounded-xl border border-success/30 shadow-sm">
          <Check className="w-4 h-4 text-success" />
          <span className="text-xs font-bold text-success">Approved</span>
        </div>
      </div>

      {/* Content - Premium Presentation */}
      <CardContent className="p-0">
        <div className="relative bg-gradient-to-br from-accent/3 via-white to-accent/5 p-8">
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-accent/20 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-accent/20 rounded-br-2xl" />

          {/* Chairman Info Badge */}
          <div className="relative z-10 mb-6">
            <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-white rounded-xl border-2 border-accent/20 shadow-md">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-hover text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] text-foreground-tertiary font-semibold uppercase tracking-wide">
                  Presiding Chairman
                </span>
                <span className="text-sm font-bold text-foreground">
                  {modelName}
                </span>
              </div>
            </div>
          </div>

          {/* Response Content */}
          <div className="relative z-10">
            <div className="markdown-content text-base leading-relaxed">
              <ReactMarkdown>{finalResponse.response}</ReactMarkdown>
            </div>
          </div>

          {/* Bottom Seal */}
          <div className="mt-8 pt-6 border-t-2 border-accent/10">
            <div className="flex items-center justify-center gap-3 text-foreground-tertiary">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/20" />
              <div className="flex items-center gap-2 px-4 py-1.5 bg-accent/5 rounded-full">
                <Crown className="w-3 h-3 text-accent" />
                <span className="text-xs font-semibold text-accent">Official Council Decision</span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
