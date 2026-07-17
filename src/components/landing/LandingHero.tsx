import * as React from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown } from 'lucide-react'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { ParticleField } from './ParticleField'

/**
 * LandingHero — Phase 1 of the entry sequence.
 *
 * A tall section is pinned while its inner stage is scrubbed by scroll
 * progress: the concentric "signal" rings expand and rotate, the ECG-style
 * waveform draws itself in, and the wordmark settles into place. The whole
 * stage then eases back and fades as the viewer scrolls toward the
 * scrollytelling section — a seamless, Apple-style scroll-linked intro.
 *
 * GSAP ScrollTrigger drives the scrubbed timeline; reduced-motion users get
 * the fully-resolved end state with no scroll pinning.
 */
export function LandingHero() {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const stageRef = React.useRef<HTMLDivElement>(null)
  const wavePathRef = React.useRef<SVGPathElement>(null)

  React.useLayoutEffect(() => {
    const path = wavePathRef.current
    const length = path?.getTotalLength() ?? 0
    if (path) {
      path.style.strokeDasharray = String(length)
      path.style.strokeDashoffset = String(length)
    }

    if (prefersReducedMotion()) {
      if (path) path.style.strokeDashoffset = '0'
      return
    }

    const ctx = gsap.context(() => {
      // Entrance: plays once on load so the hero is compelling at first paint.
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
      intro
        .from('[data-hero-ring]', {
          scale: 0.4,
          opacity: 0,
          stagger: 0.12,
          duration: 0.9,
        })
        .from(
          '[data-hero-word]',
          { yPercent: 120, opacity: 0, stagger: 0.1, duration: 0.8 },
          '-=0.5',
        )
        .to(path, { strokeDashoffset: 0, duration: 1, ease: 'none' }, '-=0.6')
        .to('[data-hero-tagline]', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')

      // Scroll-linked morph: the signal rings rotate/expand and the whole
      // stage recedes as the viewer scrolls through the pinned section.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: '+=140%',
            scrub: 0.6,
            pin: stageRef.current,
            anticipatePin: 1,
          },
        })
        .to('[data-hero-ring]', {
          rotate: (i: number) => (i % 2 ? -45 : 45),
          scale: 1.15,
          transformOrigin: 'center',
          ease: 'none',
        })
        .to(
          '[data-hero-stage-inner]',
          { scale: 0.82, opacity: 0, y: -40, ease: 'power2.in' },
          0.3,
        )
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      className="relative h-[240vh] bg-gradient-to-b from-background via-background to-accent/20"
    >
      <div
        ref={stageRef}
        className="relative flex h-screen flex-col items-center justify-center overflow-hidden"
      >
        <ParticleField className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />

        <div
          data-hero-stage-inner
          className="relative z-10 flex flex-col items-center px-6 text-center"
        >
          {/* Morphing signal visual */}
          <div className="relative mb-10 h-56 w-56">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                data-hero-ring
                className="absolute inset-0 rounded-full border"
                style={{
                  borderColor: 'hsl(var(--primary))',
                  opacity: 0.15 + i * 0.12,
                  inset: `${i * 22}px`,
                }}
              />
            ))}
            <svg
              viewBox="0 0 200 200"
              className="absolute inset-0 h-full w-full"
              fill="none"
            >
              <path
                ref={wavePathRef}
                d="M10 100 H60 L72 60 L88 140 L104 84 L118 116 L132 100 H190"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-primary">
            Neonatal Outcome Intelligence
          </p>
          <h1 className="flex flex-wrap justify-center gap-x-4 text-5xl font-semibold tracking-tight text-foreground md:text-7xl">
            {['NeoOutcome', 'AI'].map((word) => (
              <span key={word} className="overflow-hidden">
                <span data-hero-word className="inline-block">
                  {word}
                </span>
              </span>
            ))}
          </h1>
          <p
            data-hero-tagline
            className="mt-6 max-w-xl translate-y-4 text-lg text-muted-foreground opacity-0"
          >
            Clarity at the bedside. Decision support that stays out of the way —
            until it matters.
          </p>

          <div className="mt-10 flex items-center gap-4">
            <Link
              to="/app"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03]"
            >
              Enter Dashboard
            </Link>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <ArrowDown className="h-4 w-4 animate-bounce" />
              Scroll to explore
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
