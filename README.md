# NeoOutcome AI — NICU Clinical Decision Support (Frontend)

A production-oriented frontend for **NeoOutcome AI**, a critical-care
decision-support system for NICU clinicians. It pairs an individual **24-hour
outcome prediction** view with an analytical **regional insight** dashboard,
designed around a *cognitive-load-balanced*, safety-first UX.

> **NeoOutcome AI is a decision-support tool. Clinical judgment takes priority.**
> This disclaimer is rendered as a permanent Safety Header on every page.

## Tech stack

- **React 19 + TypeScript**
- **Vite 6** (build/dev)
- **Tailwind CSS 3** + shadcn/UI-style component primitives (Radix UI)
- **Recharts** for medical data plotting
- **Lucide React** for iconography
- **React Router** for view switching
- **GSAP (ScrollTrigger)** for the scroll-linked landing hero
- **Framer Motion** for UI/element transitions

## Entry sequence — landing (`/`) → dashboard (`/app`)

The entry point (`/`) is a high-impact, scroll-linked landing page that flows
into the clinical dashboard. It is intentionally separate from the dense in-app
navigation (which only appears once inside `/app`), so the marketing surface
stays clean and the workstation UI stays high-density.

- **Phase 1 — `LandingHero.tsx`** — an entrance timeline plays on load (signal
  rings scale in, wordmark rises, ECG waveform draws itself), then a
  **GSAP ScrollTrigger** *pins* the stage and scrubs a morph (rings rotate/
  expand, stage recedes) tied directly to scroll progress. A canvas
  `ParticleField` gives a subtle medical-tech lattice.
- **Phase 2 — `FeatureScrollSection.tsx`** — "scrollytelling". The metric visual
  stays pinned (sticky) while narrative steps scroll past; ScrollTrigger reports
  the centered step and Framer Motion cross-fades the metric ("6h" → "SHAP" →
  "6 regions"). One idea at a time = progressive disclosure.
- **Phase 3 — `DashboardTransition.tsx`** — a single focused CTA ("Analyze
  Patient Risk") plays a premium full-bleed expansion (Framer Motion) before
  handing off to the Patient Command Center.

**Accessibility / ethics:** the whole sequence honors
`prefers-reduced-motion` — reduced-motion users get the fully-resolved states
with no pinning, scrubbing, or expansion, and navigate immediately. No
gamified motion; animation only guides the eye toward the primary action.

The Safety Header disclaimer remains pinned above every phase of the landing,
and the closing CTA restates it alongside the synthetic-data notice.

## Getting started

```bash
npm install
npm run dev        # start dev server (http://localhost:5173)
npm run build      # typecheck + production build
npm run lint       # eslint
npm run typecheck  # tsc project references, no emit
```

## UI/UX logic flow — presenting complex medical data safely

The interface is built to **reduce operator error** and avoid *alarm fatigue*:

1. **Safety first, always visible.** A permanent, non-intrusive Safety Header
   states that the tool supports — never replaces — clinical judgment.
2. **Non-alarming risk encoding.** Risk is shown on a soft **Mint → Amber →
   Muted Coral** gradient (`--risk-low/moderate/elevated/high`) rather than
   harsh red alerts, so elevated risk reads as *attention needed* not *panic*.
   The same scale is reused everywhere (gauge, indicator, charts, map) so a
   color means the same thing on every screen.
3. **Progressive disclosure.** Clinicians land on a **Welcome Dashboard**
   (ward-at-a-glance) before deep-diving into an individual patient. Within a
   patient, the headline number (Outcome Gauge) comes first, then the
   *why* (SHAP contributions), then the raw context (vitals).
4. **Explainability over black-box scores.** The SHAP waterfall shows how each
   factor moves the prediction from the model baseline, and every factor exposes
   a plain-language **Clinical Insight** so the number is auditable.
5. **Legibility.** Tabular numerals, large touch targets for bedside tablets,
   and high-density layouts for workstations (responsive grid/flex).
6. **Actionability with guardrails.** "Flag for Review" enqueues a task with an
   explicit priority and note, and the dialog reminds staff it does not replace
   direct escalation for emergencies.

## Dashboard layout (skeleton)

```
┌───────────────────────── Safety Header (permanent) ─────────────────────────┐
├──────────┬──────────────────────────────────────────────────────────────────┤
│ Side     │  Topbar: page title · Live-stream status · theme toggle          │
│ Rail     ├──────────────────────────────────────────────────────────────────┤
│ (nav)    │  <Outlet/> — switchable view                                     │
│ Welcome  │   • Welcome:  stat cards grid + patient list + risk distribution │
│ Patient  │   • Patient:  [roster | gauge + SHAP | vitals context sidebar]   │
│ Regional │   • Regional: filters + stats + map/table + comparison trend     │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

Layout uses responsive CSS Grid/Flexbox: the side-rail collapses to a top
`MobileNav` on small screens, and content columns reflow to single-column.

## Core components

| Component | Responsibility |
| --- | --- |
| `landing/LandingHero.tsx` | Scroll-linked (GSAP ScrollTrigger) hero — Phase 1 |
| `landing/FeatureScrollSection.tsx` | Scrollytelling clinical-value section — Phase 2 |
| `landing/DashboardTransition.tsx` | Premium "Enter Dashboard" hand-off — Phase 3 |
| `landing/ParticleField.tsx` | Canvas medical-tech node lattice (reduced-motion aware) |
| `landing/LandingNav.tsx` | Minimalist marketing bar (solidifies on scroll) |
| `layout/SafetyHeader.tsx` | Permanent clinical disclaimer |
| `layout/DashboardContainer.tsx` | Shell hosting the switchable views + nav + theme |
| `patient/RiskIndicator.tsx` | Compact, highly legible risk-score widget |
| `patient/RiskGauge.tsx` | The primary "Outcome Gauge" (24h risk) |
| `patient/SHAPWaterfall.tsx` | Interactive feature-contribution waterfall + insights |
| `patient/VitalsPanel.tsx` | Live vitals + HR sparkline |
| `patient/PatientCard.tsx` | Patient summary card / roster row |
| `patient/FlagForReview.tsx` | Actionability → hypothetical review queue |
| `regional/RegionalMap.tsx` | Choropleth tile-map of Kazakhstan regions |
| `regional/RegionTable.tsx` | Dense tabular view of regional metrics |
| `regional/RegionalTrendChart.tsx` | Facility trend + Regional-average comparison |
| `dashboard/StatCard.tsx` | KPI summary tiles |

## State strategy — live stream vs. static analytics

The app deliberately separates two data lifecycles:

- **Live streamed patient data** — hot, mutating. Managed by
  `hooks/useLivePatients.tsx`, which simulates a bedside monitor feed and
  re-publishes vitals on an interval. Every patient view subscribes to this
  provider and re-renders on each tick. The header exposes a Live/Pause toggle.
- **Static analytical dataset (AshyqData layer)** — cold, immutable. Regional
  metrics live in `data/regional.ts` and are imported directly where needed.
  They never stream, which keeps the live-vs-static boundary explicit and
  prevents analytical panels from re-rendering on vitals ticks.

The `lib/reviewQueue.ts` stub represents the backend task-queue integration.

## Notes

All patient and regional data in this repo is **synthetic mock data** for
demonstration only.
