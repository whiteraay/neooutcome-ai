import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Stethoscope } from 'lucide-react'
import { prefersReducedMotion } from '@/lib/gsap'

/**
 * DashboardTransition — Phase 3. A focused call-to-action that guides the eye
 * to the single most important next step, then plays a premium full-bleed
 * expansion (Framer Motion) before handing off to the clinical dashboard.
 * Reduced-motion users navigate immediately without the expansion.
 */
export function DashboardTransition() {
  const navigate = useNavigate()
  const [entering, setEntering] = React.useState(false)

  const enter = () => {
    if (prefersReducedMotion()) {
      navigate('/app/patient/NEO-0421')
      return
    }
    setEntering(true)
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-accent/20 to-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-2xl text-center"
      >
        <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Ready when you are.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg text-muted-foreground">
          Step into the command center. Review live risk, interrogate the
          model, and flag patients for clinical review.
        </p>

        <button
          onClick={enter}
          className="group mt-10 inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-transform hover:scale-[1.04]"
        >
          <Stethoscope className="h-5 w-5" />
          Analyze Patient Risk
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>

        <p className="mt-8 text-xs text-muted-foreground">
          NeoOutcome AI is a decision-support tool. Clinical judgment takes
          priority. All data shown is synthetic.
        </p>
      </motion.div>

      {/* Premium expansion overlay */}
      <AnimatePresence>
        {entering && (
          <motion.div
            key="enter-overlay"
            className="fixed left-1/2 top-1/2 z-50 aspect-square rounded-full bg-primary"
            initial={{ width: 0, height: 0, x: '-50%', y: '-50%', opacity: 0.9 }}
            animate={{ width: '300vmax', height: '300vmax', opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
            onAnimationComplete={() => navigate('/app/patient/NEO-0421')}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
