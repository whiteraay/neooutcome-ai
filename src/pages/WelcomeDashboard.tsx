import { AlertTriangle, Activity, Users, ClipboardList } from 'lucide-react'
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useLivePatients } from '@/hooks/useLivePatients'
import { StatCard } from '@/components/dashboard/StatCard'
import { PatientCard } from '@/components/patient/PatientCard'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getRiskDescriptor } from '@/lib/risk'

export function WelcomeDashboard() {
  const { patients } = useLivePatients()

  const critical = patients.filter((p) => p.status === 'critical').length
  const avgRisk = Math.round(
    patients.reduce((sum, p) => sum + p.riskScore, 0) / patients.length,
  )
  const sorted = [...patients].sort((a, b) => b.riskScore - a.riskScore)

  const chartData = sorted.map((p) => ({
    name: p.id.replace('NEO-', '#'),
    risk: Math.round(p.riskScore),
    color: getRiskDescriptor(p.riskScore).colorVar,
  }))

  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Active patients"
          value={String(patients.length)}
          hint="NICU Level III"
        />
        <StatCard
          icon={AlertTriangle}
          label="Critical status"
          value={String(critical)}
          hint="Require close monitoring"
          accentClass="text-risk-high bg-risk-high/10"
        />
        <StatCard
          icon={Activity}
          label="Mean 24h risk"
          value={`${avgRisk}%`}
          hint="Across active ward"
          accentClass="text-risk-moderate bg-risk-moderate/10"
        />
        <StatCard
          icon={ClipboardList}
          label="Review queue"
          value="3"
          hint="Pending clinician review"
          accentClass="text-primary bg-primary/10"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Active patients — by risk</CardTitle>
            <CardDescription>
              Highest predicted 24h adverse-outcome risk first. Select a patient
              to open the Command Center.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {sorted.map((p) => (
              <PatientCard
                key={p.id}
                patient={p}
                href={`/patient/${p.id}`}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ward risk distribution</CardTitle>
            <CardDescription>
              Non-alarming gradient — mint to coral.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ left: -20 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{
                      background: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="risk" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
