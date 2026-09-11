import type { RegionMetric, RegionTrendPoint } from '@/types'

// Static analytical dataset (AshyqData layer) — Kazakhstan regional NICU metrics.
export const REGIONS: RegionMetric[] = [
  {
    region: 'Almaty',
    facility: 'Almaty Perinatal Center',
    bedOccupancy: 88,
    mortalityRatePer1000: 6.1,
    admissions30d: 142,
    avgLengthOfStayDays: 14.2,
    ventilatorUtilization: 71,
    regionalAvgMortality: 6.8,
  },
  {
    region: 'Astana',
    facility: 'National Research Center for Maternal & Child Health',
    bedOccupancy: 76,
    mortalityRatePer1000: 5.2,
    admissions30d: 118,
    avgLengthOfStayDays: 12.8,
    ventilatorUtilization: 64,
    regionalAvgMortality: 6.8,
  },
  {
    region: 'Shymkent',
    facility: 'Shymkent City Perinatal Center',
    bedOccupancy: 94,
    mortalityRatePer1000: 8.4,
    admissions30d: 167,
    avgLengthOfStayDays: 15.9,
    ventilatorUtilization: 82,
    regionalAvgMortality: 6.8,
  },
  {
    region: 'Karaganda',
    facility: 'Karaganda Regional Perinatal Center',
    bedOccupancy: 69,
    mortalityRatePer1000: 7.0,
    admissions30d: 96,
    avgLengthOfStayDays: 13.5,
    ventilatorUtilization: 58,
    regionalAvgMortality: 6.8,
  },
  {
    region: 'Aktobe',
    facility: 'Aktobe Medical Center',
    bedOccupancy: 72,
    mortalityRatePer1000: 6.6,
    admissions30d: 88,
    avgLengthOfStayDays: 12.1,
    ventilatorUtilization: 61,
    regionalAvgMortality: 6.8,
  },
  {
    region: 'Pavlodar',
    facility: 'Pavlodar Regional Hospital',
    bedOccupancy: 63,
    mortalityRatePer1000: 5.9,
    admissions30d: 74,
    avgLengthOfStayDays: 11.7,
    ventilatorUtilization: 52,
    regionalAvgMortality: 6.8,
  },
]

export const REGION_TRENDS: Record<string, RegionTrendPoint[]> = Object.
  fromEntries(
    REGIONS.map((r) => [
      r.region,
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => ({
        month,
        mortalityRatePer1000: Number(
          (r.mortalityRatePer1000 + Math.sin(i) * 0.9 - i * 0.15).toFixed(1),
        ),
        bedOccupancy: Math.round(
          Math.min(99, r.bedOccupancy + Math.cos(i) * 6 - i),
        ),
        admissions: Math.round(r.admissions30d / 4 + Math.sin(i) * 6),
      })),
    ]),
  )
