import { Check, ListFilter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface RegionMultiSelectProps {
  options: string[]
  selected: string[]
  onChange: (next: string[]) => void
}

export function RegionMultiSelect({
  options,
  selected,
  onChange,
}: RegionMultiSelectProps) {
  const toggle = (region: string) => {
    if (selected.includes(region)) {
      onChange(selected.filter((r) => r !== region))
    } else {
      onChange([...selected, region])
    }
  }

  const label =
    selected.length === 0
      ? 'All regions'
      : selected.length === options.length
        ? 'All regions'
        : `${selected.length} region${selected.length > 1 ? 's' : ''}`

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ListFilter className="h-4 w-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-2">
        <div className="mb-1 flex items-center justify-between px-1">
          <span className="text-xs font-medium text-muted-foreground">
            Regions
          </span>
          <button
            className="text-xs text-primary hover:underline"
            onClick={() => onChange([])}
          >
            Clear
          </button>
        </div>
        <div className="space-y-0.5">
          {options.map((region) => {
            const active = selected.includes(region)
            return (
              <button
                key={region}
                onClick={() => toggle(region)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
              >
                <span
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded border',
                    active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input',
                  )}
                >
                  {active && <Check className="h-3 w-3" />}
                </span>
                {region}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
