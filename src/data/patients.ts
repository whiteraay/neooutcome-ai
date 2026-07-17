import type { Patient, VitalTrendPoint } from '@/types'

function mkHistory(
  base: { hr: number; spo2: number; temp: number },
  points = 12,
): VitalTrendPoint[] {
  return Array.from({ length: points }, (_, i) => {
    const drift = Math.sin(i / 2) * 3
    return {
      t: `-${(points - i) * 5}m`,
      heartRate: Math.round(base.hr + drift + (i % 3) - 1),
      spo2: Math.max(
        84,
        Math.min(100, Math.round(base.spo2 - Math.abs(drift) / 2)),
      ),
      temperature: Number((base.temp + drift / 20).toFixed(1)),
    }
  })
}

export const PATIENTS: Patient[] = [
  {
    id: 'NEO-0421',
    name: 'Baby A. Nurlan',
    bed: 'Bay 3 · Incubator 12',
    gestationalAgeWeeks: 27,
    birthWeightGrams: 940,
    dayOfLife: 5,
    status: 'critical',
    riskScore: 78,
    riskDelta: 6,
    lastUpdated: '2 min ago',
    baselineRisk: 34,
    vitals: {
      heartRate: 172,
      spo2: 89,
      temperature: 36.2,
      respiratoryRate: 62,
      meanBloodPressure: 28,
    },
    vitalHistory: mkHistory({ hr: 168, spo2: 90, temp: 36.3 }),
    shap: [
      {
        feature: 'fio2',
        label: 'FiO₂ requirement',
        contribution: 18,
        value: '0.55',
        insight:
          'High dependency on supplemental oxygen (FiO₂ 0.55) is the dominant driver of the elevated 24h risk. Persistent high FiO₂ correlates with evolving respiratory failure.',
      },
      {
        feature: 'apnea',
        label: 'Apnea episodes (6h)',
        contribution: 12,
        value: '7 events',
        insight:
          'Frequent apnea episodes increase near-term deterioration risk. Consider reviewing caffeine dosing and respiratory support escalation.',
      },
      {
        feature: 'map',
        label: 'Mean arterial pressure',
        contribution: 9,
        value: '28 mmHg',
        insight:
          'Low mean arterial pressure for gestational age contributes to perfusion risk. Trend is downward over the last 3 assessments.',
      },
      {
        feature: 'weight',
        label: 'Birth weight',
        contribution: 6,
        value: '940 g',
        insight:
          'Very low birth weight is a static risk factor incorporated into the baseline model prior.',
      },
      {
        feature: 'feeding',
        label: 'Enteral feeding tolerance',
        contribution: -5,
        value: 'Tolerating',
        insight:
          'Good enteral feeding tolerance slightly reduces predicted risk, indicating preserved gut perfusion.',
      },
    ],
  },
  {
    id: 'NEO-0388',
    name: 'Baby S. Aigerim',
    bed: 'Bay 1 · Incubator 4',
    gestationalAgeWeeks: 31,
    birthWeightGrams: 1520,
    dayOfLife: 11,
    status: 'watch',
    riskScore: 46,
    riskDelta: -3,
    lastUpdated: '4 min ago',
    baselineRisk: 30,
    vitals: {
      heartRate: 158,
      spo2: 94,
      temperature: 36.8,
      respiratoryRate: 48,
      meanBloodPressure: 34,
    },
    vitalHistory: mkHistory({ hr: 156, spo2: 94, temp: 36.7 }),
    shap: [
      {
        feature: 'crp',
        label: 'CRP trend',
        contribution: 11,
        value: '18 mg/L',
        insight:
          'Rising C-reactive protein raises concern for evolving late-onset sepsis. Correlate with clinical exam and culture results.',
      },
      {
        feature: 'fio2',
        label: 'FiO₂ requirement',
        contribution: 7,
        value: '0.30',
        insight:
          'Mild supplemental oxygen requirement contributes modestly to risk.',
      },
      {
        feature: 'hr_variability',
        label: 'Heart-rate variability',
        contribution: 5,
        value: 'Reduced',
        insight:
          'Reduced heart-rate variability can precede clinical deterioration by several hours.',
      },
      {
        feature: 'weight_gain',
        label: 'Weight gain (7d)',
        contribution: -8,
        value: '+120 g',
        insight:
          'Steady weight gain is protective and lowers predicted adverse-outcome risk.',
      },
    ],
  },
  {
    id: 'NEO-0402',
    name: 'Baby D. Timur',
    bed: 'Bay 2 · Incubator 8',
    gestationalAgeWeeks: 34,
    birthWeightGrams: 2180,
    dayOfLife: 3,
    status: 'stable',
    riskScore: 18,
    riskDelta: -2,
    lastUpdated: '1 min ago',
    baselineRisk: 22,
    vitals: {
      heartRate: 144,
      spo2: 97,
      temperature: 36.9,
      respiratoryRate: 42,
      meanBloodPressure: 41,
    },
    vitalHistory: mkHistory({ hr: 143, spo2: 97, temp: 36.9 }),
    shap: [
      {
        feature: 'ga',
        label: 'Gestational age',
        contribution: -10,
        value: '34 wks',
        insight:
          'Later gestational age is strongly protective and reduces baseline outcome risk.',
      },
      {
        feature: 'room_air',
        label: 'Respiratory support',
        contribution: -6,
        value: 'Room air',
        insight:
          'Breathing room air with stable saturations indicates low respiratory risk.',
      },
      {
        feature: 'temp_stability',
        label: 'Thermal stability',
        contribution: 4,
        value: 'Stable',
        insight:
          'Thermal regulation is stable; minor contribution reflects normal transitional physiology.',
      },
    ],
  },
  {
    id: 'NEO-0415',
    name: 'Baby M. Zhanna',
    bed: 'Bay 3 · Incubator 10',
    gestationalAgeWeeks: 29,
    birthWeightGrams: 1180,
    dayOfLife: 8,
    status: 'watch',
    riskScore: 58,
    riskDelta: 4,
    lastUpdated: '3 min ago',
    baselineRisk: 33,
    vitals: {
      heartRate: 165,
      spo2: 92,
      temperature: 37.4,
      respiratoryRate: 55,
      meanBloodPressure: 31,
    },
    vitalHistory: mkHistory({ hr: 162, spo2: 92, temp: 37.2 }),
    shap: [
      {
        feature: 'temp',
        label: 'Temperature instability',
        contribution: 13,
        value: '37.4 °C',
        insight:
          'Temperature instability with an upward trend may indicate early infection. Recommend septic screen review.',
      },
      {
        feature: 'fio2',
        label: 'FiO₂ requirement',
        contribution: 10,
        value: '0.40',
        insight:
          'Moderate oxygen requirement contributes meaningfully to the current risk estimate.',
      },
      {
        feature: 'lactate',
        label: 'Serum lactate',
        contribution: 8,
        value: '3.2 mmol/L',
        insight:
          'Mildly elevated lactate suggests reduced tissue perfusion; trend closely.',
      },
      {
        feature: 'feeding',
        label: 'Feeding tolerance',
        contribution: -4,
        value: 'Tolerating',
        insight: 'Preserved feeding tolerance modestly reduces risk.',
      },
    ],
  },
]
