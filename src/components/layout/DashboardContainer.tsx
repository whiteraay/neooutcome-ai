import * as React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { SafetyHeader } from './SafetyHeader'
import { SideRail, MobileNav } from './SideRail'
import { StreamStatus } from './StreamStatus'
import { Button } from '@/components/ui/button'

const TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Welcome Dashboard',
    subtitle: 'Active NICU status at a glance',
  },
  '/patient': {
    title: 'NICU Patient Command Center',
    subtitle: 'Individual 24-hour outcome prediction',
  },
  '/regional': {
    title: 'Regional Insight Dashboard',
    subtitle: 'AshyqData analytical layer',
  },
}

function useDarkMode() {
  const [dark, setDark] = React.useState(false)
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])
  return { dark, toggle: () => setDark((d) => !d) }
}

/**
 * DashboardContainer — the application shell that hosts the switchable views
 * (Welcome, Patient Command Center, Regional Insight) behind a persistent
 * Safety Header and navigation rail.
 */
export function DashboardContainer() {
  const { pathname } = useLocation()
  const { dark, toggle } = useDarkMode()
  const meta =
    TITLES[pathname] ??
    (pathname.startsWith('/patient') ? TITLES['/patient'] : TITLES['/'])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SafetyHeader />
      <div className="flex flex-1 overflow-hidden">
        <SideRail />
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex items-center justify-between gap-3 border-b bg-card px-4 py-3 md:px-6">
            <div>
              <h1 className="text-lg font-semibold leading-tight">
                {meta.title}
              </h1>
              <p className="text-xs text-muted-foreground">{meta.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <StreamStatus />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggle}
                aria-label="Toggle color theme"
              >
                {dark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </header>
          <MobileNav />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
