import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, Brain, MapPinned } from 'lucide-react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap'

interface Step {
  kicker: string
  title: string
  body: string
  metric: string
  metricLabel: string
  icon: React.ComponentType<{ className?: string }>
}

const STEPS: Step[] = [
  {
    kicker: 'Early signal',
    title: 'From data to decision in 6 hours',
    body: 'Continuously scored 24-hour deterioration risk surfaces concern windows earlier — while there is still time to act.',
    metric: '6h',
    metricLabel: 'prediction horizon lead time',
    icon: Activity,
  },
  {
    kicker: 'Explainable by design',
    title: 'Every score, fully accountable',
    body: 'An interactive SHAP breakdown shows exactly which factors moved a prediction, so clinicians interrogate the model — never obey it.',
    metric: 'SHAP',
    metricLabel: 'per-factor contribution view',
    icon: Brain,
  },
  {
    kicker: 'Zoom out',
    title: 'Regional insight, not just one cot',
    body: 'Bed occupancy, mortality trends and facility-versus-regional comparisons across Kazakhstan turn bedside data into system awareness.',
    metric: '6',
    metricLabel: 'regions in the analytical layer',
    icon: MapPinned,
  },
]

/**
 * FeatureScrollSection — Phase 2 "scrollytelling".
 *
 * The visual column stays pinned (sticky) while narrative steps scroll past.
 * GSAP ScrollTrigger reports which step is centered in the viewport and drives
 * the active index; Framer Motion cross-fades the pinned metric to match.
 * Progressive disclosure: dense clinical data is deferred to the dashboard —
 * here we present one idea at a time.
 */
export function FeatureScrollSection() {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(0)

  React.useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>('[data-feature-step]')
      steps.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) setActive(i)
          },
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const ActiveIcon = STEPS[active].icon

  return (
    <section ref={rootRef} className="relative bg-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-2">
        {/* Pinned visual */}
        <div className="hidden md:block">
          <div className="sticky top-0 flex h-screen items-center">
            <div className="relative aspect-square w-full max-w-md rounded-3xl border bg-gradient-to-br from-accent/40 to-background p-10">
              <div className="flex h-full flex-col items-center justify-center text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, scale: 0.9, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -12 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center"
                  >
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <ActiveIcon className="h-8 w-8" />
                    </div>
                    <p className="text-7xl font-semibold tracking-tight text-primary">
                      {STEPS[active].metric}
                    </p>
                    <p className="mt-3 max-w-[16rem] text-sm text-muted-foreground">
                      {STEPS[active].metricLabel}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* progress rail */}
              <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
                {STEPS.map((s, i) => (
                  <span
                    key={s.kicker}
                    className={
                      'h-1.5 rounded-full transition-all ' +
                      (i === active
                        ? 'w-8 bg-primary'
                        : 'w-3 bg-muted-foreground/30')
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Narrative steps */}
        <div className="py-[12vh]">
          {STEPS.map((step, i) => (
            <div
              key={step.kicker}
              data-feature-step
              className="flex min-h-[70vh] flex-col justify-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.6 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                  0{i + 1} · {step.kicker}
                </span>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                  {step.title}
                </h2>
                <p className="mt-4 max-w-md text-lg text-muted-foreground">
                  {step.body}
                </p>
                {/* Mobile metric (visual column is hidden on small screens) */}
                <div className="mt-6 flex items-center gap-3 md:hidden">
                  <step.icon className="h-6 w-6 text-primary" />
                  <span className="text-3xl font-semibold text-primary">
                    {step.metric}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {step.metricLabel}
                  </span>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
