import * as React from 'react'
import type { Patient } from '@/types'
import { PATIENTS } from '@/data/patients'

/**
 * State strategy
 * --------------
 * LIVE STREAMED PATIENT DATA lives here. Vitals are treated as a hot, mutating
 * stream: this provider simulates a bedside monitor feed and re-publishes vitals
 * on an interval. Components subscribe via `useLivePatients()` and always render
 * the freshest snapshot.
 *
 * By contrast, the ANALYTICAL / REGIONAL dataset (see `@/data/regional`) is cold,
 * static and imported directly where needed — it never streams, so it is kept out
 * of this provider to make the live-vs-static boundary explicit.
 */

interface LivePatientsContextValue {
  patients: Patient[]
  streaming: boolean
  lastTick: number
  getPatient: (id: string) => Patient | undefined
  toggleStreaming: () => void
}

const LivePatientsContext = React.createContext<LivePatientsContextValue | null>(
  null,
)

function jitter(value: number, amount: number, min: number, max: number) {
  const next = value + (Math.random() - 0.5) * amount
  return Math.max(min, Math.min(max, next))
}

function streamVitals(patient: Patient): Patient {
  const v = patient.vitals
  return {
    ...patient,
    vitals: {
      heartRate: Math.round(jitter(v.heartRate, 6, 90, 210)),
      spo2: Math.round(jitter(v.spo2, 2.5, 82, 100)),
      temperature: Number(jitter(v.temperature, 0.2, 35, 39).toFixed(1)),
      respiratoryRate: Math.round(jitter(v.respiratoryRate, 4, 25, 80)),
      meanBloodPressure: Math.round(jitter(v.meanBloodPressure, 2, 20, 60)),
    },
  }
}

export function LivePatientsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [patients, setPatients] = React.useState<Patient[]>(PATIENTS)
  const [streaming, setStreaming] = React.useState(true)
  const [lastTick, setLastTick] = React.useState(() => Date.now())

  React.useEffect(() => {
    if (!streaming) return
    const id = window.setInterval(() => {
      setPatients((prev) => prev.map(streamVitals))
      setLastTick(Date.now())
    }, 3000)
    return () => window.clearInterval(id)
  }, [streaming])

  const value = React.useMemo<LivePatientsContextValue>(
    () => ({
      patients,
      streaming,
      lastTick,
      getPatient: (id: string) => patients.find((p) => p.id === id),
      toggleStreaming: () => setStreaming((s) => !s),
    }),
    [patients, streaming, lastTick],
  )

  return (
    <LivePatientsContext.Provider value={value}>
      {children}
    </LivePatientsContext.Provider>
  )
}

export function useLivePatients() {
  const ctx = React.useContext(LivePatientsContext)
  if (!ctx)
    throw new Error('useLivePatients must be used within LivePatientsProvider')
  return ctx
}
