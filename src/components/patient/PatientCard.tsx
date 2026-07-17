import { Link } from 'react-router-dom'
import { Baby, ChevronRight } from 'lucide-react'
import type { Patient, PatientStatus } from '@/types'
import { Badge } from '@/components/ui/badge'
import { RiskIndicator } from './RiskIndicator'
import { cn } from '@/lib/utils'

const STATUS: Record<
  PatientStatus,
  { label: string; className: string }
> = {
  stable: { label: 'Stable', className: 'bg-risk-low/15 text-risk-low' },
  watch: {
    label: 'Watch',
    className: 'bg-risk-moderate/15 text-risk-moderate',
  },
  critical: { label: 'Critical', className: 'bg-risk-high/15 text-risk-high' },
}

interface PatientCardProps {
  patient: Patient
  selected?: boolean
  onSelect?: (id: string) => void
  href?: string
}

export function PatientCard({
  patient,
  selected,
  onSelect,
  href,
}: PatientCardProps) {
  const status = STATUS[patient.status]

  const body = (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border bg-card p-3 text-left transition-all hover:border-primary/40 hover:shadow-sm',
        selected && 'border-primary/60 ring-1 ring-primary/30',
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Baby className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold">{patient.name}</p>
          <Badge
            variant="secondary"
            className={cn('shrink-0', status.className)}
          >
            {status.label}
          </Badge>
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {patient.id} · {patient.bed}
        </p>
        <p className="text-xs text-muted-foreground">
          {patient.gestationalAgeWeeks} wks · {patient.birthWeightGrams} g · DOL{' '}
          {patient.dayOfLife}
        </p>
      </div>
      <RiskIndicator score={patient.riskScore} delta={patient.riskDelta} size="sm" />
      {href && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
    </div>
  )

  if (href) {
    return (
      <Link to={href} className="block">
        {body}
      </Link>
    )
  }

  return (
    <button className="block w-full" onClick={() => onSelect?.(patient.id)}>
      {body}
    </button>
  )
}
