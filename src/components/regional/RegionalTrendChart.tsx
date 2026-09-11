import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { RegionTrendPoint } from '@/types'

interface RegionalTrendChartProps {
  data: RegionTrendPoint[]
  regionalAvg: number
  showComparison: boolean
  facilityLabel: string
}

/**
 * RegionalTrendChart — mortality-rate trend for the selected facility with an
 * optional "Regional Average" comparison overlay (the Comparison Engine).
 */
export function RegionalTrendChart({
  data,
  regionalAvg,
  showComparison,
  facilityLabel,
}: RegionalTrendChartProps) {
  const withAvg = data.map((d) => ({ ...d, regionalAvg }))

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={withAvg} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="facilityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="mortalityRatePer1000"
            name={facilityLabel}
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#facilityFill)"
          />
          {showComparison && (
            <Line
              type="monotone"
              dataKey="regionalAvg"
              name="Regional average"
              stroke="hsl(var(--risk-elevated))"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
