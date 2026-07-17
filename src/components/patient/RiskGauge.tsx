import {
  RadialBar,
  RadialBarChart,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'
import { getRiskDescriptor } from '@/lib/risk'
import { cn } from '@/lib/utils'

interface RiskGaugeProps {
  score: number
  baseline?: number
}

/**
 * The Outcome Gauge — primary widget visualizing the 24-hour prediction risk
 * percentage on a soft, non-alarming gauge.
 */
export function RiskGauge({ score, baseline }: RiskGaugeProps) {
  const d = getRiskDescriptor(score)
  const data = [{ name: 'risk', value: score, fill: d.colorVar }]

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="72%"
          outerRadius="100%"
          barSize={16}
          data={data}
          startAngle={220}
          endAngle={-40}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: 'hsl(var(--muted))' }}
            dataKey="value"
            cornerRadius={12}
            angleAxisId={0}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-5xl font-bold tabular-nums', d.textClass)}>
          {Math.round(score)}
          <span className="text-2xl">%</span>
        </span>
        <span className={cn('text-sm font-semibold uppercase', d.textClass)}>
          {d.label} risk
        </span>
        <span className="mt-1 text-xs text-muted-foreground">
          24h adverse-outcome probability
        </span>
        {baseline !== undefined && (
          <span className="mt-0.5 text-[11px] text-muted-foreground">
            Model baseline {Math.round(baseline)}%
          </span>
        )}
      </div>
    </div>
  )
}
