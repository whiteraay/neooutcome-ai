import { ShieldCheck } from 'lucide-react'

/**
 * The Safety Header — a permanent, non-intrusive clinical disclaimer that must
 * appear on every page of NeoOutcome AI.
 */
export function SafetyHeader() {
  return (
    <div
      role="note"
      className="flex items-center justify-center gap-2 border-b border-primary/20 bg-accent/60 px-4 py-1.5 text-center text-xs font-medium text-accent-foreground"
    >
      <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>
        NeoOutcome AI is a decision-support tool.{' '}
        <span className="font-semibold">Clinical judgment takes priority.</span>
      </span>
    </div>
  )
}
