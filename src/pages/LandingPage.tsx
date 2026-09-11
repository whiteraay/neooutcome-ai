import { SafetyHeader } from '@/components/layout/SafetyHeader'
import { LandingNav } from '@/components/landing/LandingNav'
import { LandingHero } from '@/components/landing/LandingHero'
import { FeatureScrollSection } from '@/components/landing/FeatureScrollSection'
import { DashboardTransition } from '@/components/landing/DashboardTransition'

/**
 * LandingPage — the high-impact entry point. A scroll-linked hero (Phase 1)
 * flows into scrollytelling (Phase 2) and a premium dashboard hand-off
 * (Phase 3). The permanent Safety Header stays pinned above everything; the
 * dense in-app navigation only appears once inside the dashboard.
 */
export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50">
        <SafetyHeader />
        <LandingNav />
      </div>
      <main>
        <LandingHero />
        <FeatureScrollSection />
        <DashboardTransition />
      </main>
    </div>
  )
}
