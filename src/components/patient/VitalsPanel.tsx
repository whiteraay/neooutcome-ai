import type { ElementType } from 'react'
import { Heart, Wind, Thermometer, Activity, Gauge } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts'
import type { Patient } from '@/types'
import { cn } from '@/lib/utils'

interface VitalRowProps {
  icon: ElementType
  label: string
  value: string
  unit: string
  ok: boolean
}

function VitalRow({ icon: Icon, label, value, unit, ok }: VitalRowProps) {
  return (
    <div className="flex items-center justify-between rounded-md border bg-background px-3 py-2">
      <div className="flex items-center gap-2.5">
        <Icon
          className={cn('h-4 w-4', ok ? 'text-primary' : 'text-risk-elevated')}
        />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            'text-base font-semibold tabular-nums',
            ok ? 'text-foreground' : 'text-risk-elevated',
          )}
        >
          {value}
        </span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
    </div>
  )
}

export function VitalsPanel({ patient }: { patient: Patient }) {
  const v = patient.vitals
  return (
    <div className="space-y-3">
      <div className="grid gap-2">
        <VitalRow
          icon={Heart}
          label="Heart rate"
          value={String(v.heartRate)}
          unit="bpm"
          ok={v.heartRate >= 100 && v.heartRate <= 180}
        />
        <VitalRow
          icon={Wind}
          label="SpO₂"
          value={String(v.spo2)}
          unit="%"
          ok={v.spo2 >= 90}
        />
        <VitalRow
          icon={Thermometer}
          label="Temperature"
          value={v.temperature.toFixed(1)}
          unit="°C"
          ok={v.temperature >= 36.3 && v.temperature <= 37.2}
        />
        <VitalRow
          icon={Activity}
          label="Respiratory rate"
          value={String(v.respiratoryRate)}
          unit="/min"
          ok={v.respiratoryRate >= 30 && v.respiratoryRate <= 60}
        />
        <VitalRow
          icon={Gauge}
          label="Mean art. pressure"
          value={String(v.meanBloodPressure)}
          unit="mmHg"
          ok={v.meanBloodPressure >= 30}
        />
      </div>

      <div className="rounded-md border bg-background p-3">
        <p className="mb-1 text-xs font-medium text-muted-foreground">
          Heart rate · last 60 min
        </p>
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={patient.vitalHistory}>
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
              <Line
                type="monotone"
                dataKey="heartRate"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
