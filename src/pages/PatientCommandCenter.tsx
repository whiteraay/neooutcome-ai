import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useLivePatients } from '@/hooks/useLivePatients'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { RiskGauge } from '@/components/patient/RiskGauge'
import { RiskIndicator } from '@/components/patient/RiskIndicator'
import { SHAPWaterfall } from '@/components/patient/SHAPWaterfall'
import { VitalsPanel } from '@/components/patient/VitalsPanel'
import { FlagForReview } from '@/components/patient/FlagForReview'
import { PatientCard } from '@/components/patient/PatientCard'

export function PatientCommandCenter() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const { patients, getPatient } = useLivePatients()

  if (!patientId) {
    return <Navigate to={`/patient/${patients[0].id}`} replace />
  }

  const patient = getPatient(patientId)
  if (!patient) {
    return <Navigate to={`/patient/${patients[0].id}`} replace />
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[240px_1fr_300px]">
      {/* Patient roster */}
      <aside className="space-y-2">
        <p className="px-1 text-xs font-medium uppercase text-muted-foreground">
          NICU roster
        </p>
        {patients.map((p) => (
          <PatientCard
            key={p.id}
            patient={p}
            selected={p.id === patient.id}
            onSelect={(id) => navigate(`/patient/${id}`)}
          />
        ))}
      </aside>

      {/* Main column: gauge + explainability */}
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-xl">{patient.name}</CardTitle>
              <CardDescription>
                {patient.id} · {patient.bed} · updated {patient.lastUpdated}
              </CardDescription>
            </div>
            <FlagForReview patient={patient} />
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-[240px_1fr] md:items-center">
            <RiskGauge score={patient.riskScore} baseline={patient.baselineRisk} />
            <div className="space-y-3">
              <RiskIndicator
                score={patient.riskScore}
                delta={patient.riskDelta}
              />
              <p className="text-sm text-muted-foreground">
                The Outcome Gauge shows the model's 24-hour predicted probability
                of an adverse outcome. Interpret alongside the contributing
                factors and bedside assessment — the model informs, it does not
                decide.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature contributions (SHAP)</CardTitle>
            <CardDescription>
              How each factor moves the prediction from baseline. Select a factor
              for its clinical insight.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SHAPWaterfall
              baseline={patient.baselineRisk}
              features={patient.shap}
              finalScore={patient.riskScore}
            />
          </CardContent>
        </Card>
      </div>

      {/* Context panel: vitals + patient ID */}
      <aside>
        <Card className="xl:sticky xl:top-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Patient context</CardTitle>
              <Badge variant="muted">{patient.id}</Badge>
            </div>
            <CardDescription>Live bedside vitals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-md bg-muted/60 p-2">
                <p className="text-muted-foreground">GA</p>
                <p className="font-semibold">{patient.gestationalAgeWeeks} wks</p>
              </div>
              <div className="rounded-md bg-muted/60 p-2">
                <p className="text-muted-foreground">Weight</p>
                <p className="font-semibold">{patient.birthWeightGrams} g</p>
              </div>
              <div className="rounded-md bg-muted/60 p-2">
                <p className="text-muted-foreground">DOL</p>
                <p className="font-semibold">{patient.dayOfLife}</p>
              </div>
            </div>
            <Separator />
            <VitalsPanel patient={patient} />
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}
