import { Radio, PauseCircle } from 'lucide-react'
import { useLivePatients } from '@/hooks/useLivePatients'
import { cn } from '@/lib/utils'

export function StreamStatus() {
  const { streaming, toggleStreaming } = useLivePatients()
  return (
    <button
      onClick={toggleStreaming}
      className={cn(
        'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
        streaming
          ? 'border-risk-low/40 bg-risk-low/10 text-risk-low'
          : 'border-border bg-muted text-muted-foreground',
      )}
      title={streaming ? 'Live bedside stream active' : 'Stream paused'}
    >
      {streaming ? (
        <>
          <Radio className="h-3.5 w-3.5 animate-pulse-soft" />
          Live stream
        </>
      ) : (
        <>
          <PauseCircle className="h-3.5 w-3.5" />
          Stream paused
        </>
      )}
    </button>
  )
}
