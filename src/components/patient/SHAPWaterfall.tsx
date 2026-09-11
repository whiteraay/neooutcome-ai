import * as React from 'react'
import { Lightbulb, ArrowRight } from 'lucide-react'
import type { ShapFeature } from '@/types'
import { cn } from '@/lib/utils'

interface SHAPWaterfallProps {
  baseline: number
  features: ShapFeature[]
  finalScore: number
}

interface WaterfallStep {
  feature: ShapFeature
  start: number
  end: number
}

/**
 * SHAPWaterfall — an interactive Feature Contribution waterfall. Each bar shows
 * how a feature pushes the prediction up (coral) or down (mint) from the model
 * baseline. Selecting a bar reveals a brief Clinical Insight.
 */
export function SHAPWaterfall({
  baseline,
  features,
  finalScore,
}: SHAPWaterfallProps) {
  const [selected, setSelected] = React.useState<string>(features[0]?.feature)

  const ordered = React.useMemo(
    () =>
      [...features].sort(
        (a, b) => Math.abs(b.contribution) - Math.abs(a.contribution),
      ),
    [features],
  )

  const steps = React.useMemo<WaterfallStep[]>(() => {
    let running = baseline
    return ordered.map((feature) => {
      const start = running
      running += feature.contribution
      return { feature, start, end: running }
    })
  }, [ordered, baseline])

  const domainMax = Math.max(
    100,
    finalScore,
    ...steps.map((s) => Math.max(s.start, s.end)),
  )
  const scale = (v: number) => `${(v / domainMax) * 100}%`

  const active =
    features.find((f) => f.feature === selected) ?? features[0]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Baseline{' '}
          <span className="font-semibold tabular-nums text-foreground">
            {Math.round(baseline)}%
          </span>
        </span>
        <span>
          Prediction{' '}
          <span className="font-semibold tabular-nums text-foreground">
            {Math.round(finalScore)}%
          </span>
        </span>
      </div>

      <div className="space-y-2">
        {steps.map(({ feature, start, end }) => {
          const positive = feature.contribution >= 0
          const left = Math.min(start, end)
          const width = Math.abs(end - start)
          const isSelected = feature.feature === selected
          return (
            <button
              key={feature.feature}
              onClick={() => setSelected(feature.feature)}
              className={cn(
                'group grid w-full grid-cols-[130px_1fr_54px] items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors',
                isSelected ? 'bg-accent/60 ring-1 ring-primary/30' : 'hover:bg-muted',
              )}
            >
              <span className="truncate text-xs font-medium">
                {feature.label}
              </span>
              <span className="relative block h-5 rounded bg-muted/60">
                <span
                  className={cn(
                    'absolute top-0 h-5 rounded transition-all',
                    positive ? 'bg-risk-high/80' : 'bg-risk-low/80',
                  )}
                  style={{ left: scale(left), width: scale(width) }}
                />
              </span>
              <span
                className={cn(
                  'text-right text-xs font-semibold tabular-nums',
                  positive ? 'text-risk-high' : 'text-risk-low',
                )}
              >
                {positive ? '+' : ''}
                {feature.contribution}
              </span>
            </button>
          )
        })}
      </div>

      {active && (
        <div className="rounded-lg border border-primary/20 bg-accent/40 p-4">
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-accent-foreground">
            <Lightbulb className="h-4 w-4" />
            Clinical Insight — {active.label}
          </div>
          <p className="text-sm text-foreground/90">{active.insight}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            Current value
            <ArrowRight className="h-3 w-3" />
            <span className="font-medium text-foreground">{active.value}</span>
          </div>
        </div>
      )}
    </div>
  )
}
