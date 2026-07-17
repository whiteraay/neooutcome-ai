import type { RegionMetric } from '@/types'
import { cn } from '@/lib/utils'

interface RegionTableProps {
  regions: RegionMetric[]
  selected: string | null
  onSelect: (region: string) => void
}

export function RegionTable({
  regions,
  selected,
  onSelect,
}: RegionTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
            <th className="px-3 py-2 font-medium">Region / Facility</th>
            <th className="px-3 py-2 text-right font-medium">Occupancy</th>
            <th className="px-3 py-2 text-right font-medium">Mortality ‰</th>
            <th className="px-3 py-2 text-right font-medium">Admissions 30d</th>
            <th className="px-3 py-2 text-right font-medium">Avg LOS</th>
            <th className="px-3 py-2 text-right font-medium">Vent. util.</th>
          </tr>
        </thead>
        <tbody>
          {regions.map((r) => (
            <tr
              key={r.region}
              onClick={() => onSelect(r.region)}
              className={cn(
                'cursor-pointer border-b last:border-0 transition-colors hover:bg-muted/40',
                selected === r.region && 'bg-accent/50',
              )}
            >
              <td className="px-3 py-2">
                <div className="font-medium">{r.region}</div>
                <div className="text-xs text-muted-foreground">
                  {r.facility}
                </div>
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {r.bedOccupancy}%
              </td>
              <td
                className={cn(
                  'px-3 py-2 text-right font-medium tabular-nums',
                  r.mortalityRatePer1000 > r.regionalAvgMortality
                    ? 'text-risk-high'
                    : 'text-risk-low',
                )}
              >
                {r.mortalityRatePer1000.toFixed(1)}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {r.admissions30d}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {r.avgLengthOfStayDays.toFixed(1)}d
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {r.ventilatorUtilization}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
