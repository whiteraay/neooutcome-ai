import * as React from 'react'
import { BedDouble, HeartPulse, Wind, Layers } from 'lucide-react'
import { REGIONS, REGION_TRENDS } from '@/data/regional'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { StatCard } from '@/components/dashboard/StatCard'
import {
  RegionalMap,
  type MetricKey,
} from '@/components/regional/RegionalMap'
import { RegionTable } from '@/components/regional/RegionTable'
import { RegionalTrendChart } from '@/components/regional/RegionalTrendChart'
import { RegionMultiSelect } from '@/components/regional/RegionMultiSelect'
import {
  DateRangePicker,
  type DateRange,
} from '@/components/regional/DateRangePicker'

const METRIC_OPTIONS: { value: MetricKey; label: string }[] = [
  { value: 'bedOccupancy', label: 'Bed occupancy' },
  { value: 'mortalityRatePer1000', label: 'Mortality rate' },
  { value: 'ventilatorUtilization', label: 'Ventilator utilization' },
  { value: 'admissions30d', label: 'Admissions (30d)' },
]

const ALL_REGIONS = REGIONS.map((r) => r.region)

export function RegionalDashboard() {
  const [metric, setMetric] = React.useState<MetricKey>('bedOccupancy')
  const [regionFilter, setRegionFilter] = React.useState<string[]>([])
  const [selected, setSelected] = React.useState<string>('Almaty')
  const [showComparison, setShowComparison] = React.useState(true)
  const [range, setRange] = React.useState<DateRange>({
    from: '2026-01-01',
    to: '2026-06-30',
  })

  const visibleRegions =
    regionFilter.length === 0
      ? REGIONS
      : REGIONS.filter((r) => regionFilter.includes(r.region))

  React.useEffect(() => {
    if (!visibleRegions.some((r) => r.region === selected)) {
      setSelected(visibleRegions[0]?.region ?? 'Almaty')
    }
  }, [visibleRegions, selected])

  const selectedRegion =
    REGIONS.find((r) => r.region === selected) ?? REGIONS[0]

  const nationalOccupancy = Math.round(
    visibleRegions.reduce((s, r) => s + r.bedOccupancy, 0) /
      visibleRegions.length,
  )
  const nationalMortality = (
    visibleRegions.reduce((s, r) => s + r.mortalityRatePer1000, 0) /
    visibleRegions.length
  ).toFixed(1)
  const totalAdmissions = visibleRegions.reduce(
    (s, r) => s + r.admissions30d,
    0,
  )

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <DateRangePicker value={range} onChange={setRange} />
        <RegionMultiSelect
          options={ALL_REGIONS}
          selected={regionFilter}
          onChange={setRegionFilter}
        />
        <Select
          value={metric}
          onValueChange={(v) => setMetric(v as MetricKey)}
        >
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {METRIC_OPTIONS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Aggregate stats */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Layers}
          label="Regions in view"
          value={String(visibleRegions.length)}
          hint="AshyqData layer"
        />
        <StatCard
          icon={BedDouble}
          label="Avg bed occupancy"
          value={`${nationalOccupancy}%`}
          hint="Selected regions"
          accentClass="text-risk-moderate bg-risk-moderate/10"
        />
        <StatCard
          icon={HeartPulse}
          label="Avg mortality ‰"
          value={nationalMortality}
          hint="Per 1000 live births"
          accentClass="text-risk-high bg-risk-high/10"
        />
        <StatCard
          icon={Wind}
          label="Admissions (30d)"
          value={String(totalAdmissions)}
          hint="Across selected regions"
        />
      </section>

      {/* Map / Table */}
      <Card>
        <CardHeader>
          <CardTitle>Regional health metrics</CardTitle>
          <CardDescription>
            Shaded by {METRIC_OPTIONS.find((m) => m.value === metric)?.label}.
            Select a region to drive the comparison below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="map">
            <TabsList>
              <TabsTrigger value="map">Map</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
            <TabsContent value="map">
              <RegionalMap
                regions={visibleRegions}
                metric={metric}
                selected={selected}
                onSelect={setSelected}
              />
            </TabsContent>
            <TabsContent value="table">
              <RegionTable
                regions={visibleRegions}
                selected={selected}
                onSelect={setSelected}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Comparison engine */}
      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle>Mortality trend — {selectedRegion.region}</CardTitle>
            <CardDescription>{selectedRegion.facility}</CardDescription>
          </div>
          <Tabs
            value={showComparison ? 'compare' : 'facility'}
            onValueChange={(v) => setShowComparison(v === 'compare')}
          >
            <TabsList>
              <TabsTrigger value="facility">Facility</TabsTrigger>
              <TabsTrigger value="compare">vs Regional avg</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <RegionalTrendChart
            data={REGION_TRENDS[selectedRegion.region]}
            regionalAvg={selectedRegion.regionalAvgMortality}
            showComparison={showComparison}
            facilityLabel={selectedRegion.region}
          />
        </CardContent>
      </Card>
    </div>
  )
}
