import { NavLink } from 'react-router-dom'
import { Activity, LayoutDashboard, Stethoscope, Map } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/app', label: 'Welcome', icon: LayoutDashboard, end: true },
  { to: '/app/patient', label: 'Patient Command', icon: Stethoscope, end: false },
  { to: '/app/regional', label: 'Regional Insight', icon: Map, end: false },
]

export function SideRail() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-card md:flex">
      <div className="flex items-center gap-2 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Activity className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">NeoOutcome AI</p>
          <p className="text-xs text-muted-foreground">NICU Decision Support</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t px-5 py-3 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Ward: NICU · Level III</p>
        <p>Shift lead: Dr. A. Karimova</p>
      </div>
    </aside>
  )
}

export function MobileNav() {
  return (
    <nav className="flex items-center gap-1 border-b bg-card px-2 py-1.5 md:hidden">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent',
            )
          }
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
