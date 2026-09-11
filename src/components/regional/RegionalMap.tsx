import type { RegionMetric } from '@/types'
import { cn } from '@/lib/utils'

export type MetricKey =
  | 'bedOccupancy'
  | 'mortalityRatePer1000'
  | 'ventilatorUtilization'
  | 'admissions30d'

interface RegionalMapProps {
  regions: RegionMetric[]
  metric: MetricKey
  selected: string | null
  onSelect: (region: string) => void
}

const METRIC_UNIT: Record<MetricKey, string> = {
  bedOccupancy: '%',
  mortalityRatePer1000: '‰',
  ventilatorUtilization: '%',
  admissions30d: '',
}

/**
 * RegionalMap — a schematic tile-map (choropleth) of Kazakhstan regions. Each
 * tile is shaded by the selected metric so hotspots are visible at a glance.
 * Tiles are large and touch-friendly for bedside tablets.
 */
export function RegionalMap({
  regions,
  metric,
  selected,
  onSelect,
}: RegionalMapProps) {
  const values = regions.map((r) => r[metric])
  const min = Math.min(...values)
  const max = Math.max(...values)
  const intensity = (v: number) =>
    max === min ? 0.5 : (v - min) / (max - min)

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {regions.map((r) => {
        const t = intensity(r[metric])
        const isSelected = selected === r.region
        return (
          <button
            key={r.region}
            onClick={() => onSelect(r.region)}
            className={cn(
              'flex flex-col items-start rounded-lg border p-3 text-left transition-all hover:shadow-sm',
              isSelected
                ? 'border-primary ring-2 ring-primary/30'
                : 'border-border',
            )}
            style={{
              backgroundColor: `hsl(var(--risk-${
                t < 0.34 ? 'low' : t < 0.67 ? 'moderate' : 'high'
              }) / ${0.12 + t * 0.32})`,
            }}
          >
            <span className="text-sm font-semibold">{r.region}</span>
            <span className="mt-1 text-2xl font-bold tabular-nums">
              {r[metric]}
              <span className="text-sm font-medium">{METRIC_UNIT[metric]}</span>
            </span>
            <span className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
              {r.facility}
            </span>
          </button>
        )
      })}
    </div>
  )
}
