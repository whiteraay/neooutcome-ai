import * as React from 'react'
import { Link } from 'react-router-dom'
import { Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * LandingNav — a minimalist marketing-page bar. It stays transparent over the
 * hero and condenses into a solid, blurred bar once the viewer scrolls, so the
 * dense in-app navigation (the side rail) is reserved for the dashboard.
 */
export function LandingNav() {
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={cn(
        'transition-all duration-300',
        scrolled
          ? 'border-b bg-background/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            NeoOutcome AI
          </span>
        </Link>
        <Link
          to="/app"
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-colors',
            scrolled
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'text-primary hover:bg-primary/10',
          )}
        >
          Enter Dashboard
        </Link>
      </div>
    </div>
  )
}
