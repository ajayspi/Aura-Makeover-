# AuroMakeover — Next.js 16 + Tailwind CSS v4 Project

## Development Commands
- `npm run dev` — start Next.js 16 dev server (default: http://localhost:3000)
- `npm run build` — Next.js build
- `npm run start` — Next.js start production server
- `npm run lint` — ESLint (runs before typecheck/build)
- `node scripts/test-e2e.mjs` — opaque-box E2E suite (93 tests, **not** an npm script; exit 0 = all pass)
- `npx tsc --noEmit` — typecheck; together with `build` + the E2E suite these are the three acceptance gates
- CI: `.github/workflows/ci.yml` (repo root `Aura/`) runs all 4 gates on push/PR to `main`; `DEPLOY.md` has the deploy runbook (migration PENDING REVIEW, `SALES_AGENTS_JSON` seeding, demo purge, `919700675637` fallback)

## Verification — trust the runner, not the reports
- **E2E suite is green**: `node scripts/test-e2e.mjs` → **99/99** (verified 2026-09-23: 70/70 → 74/74 → 77/77 → 81/81 → 84/84 → 88/88 → 93/93 w/ R10 GSAP layer → 99/99 w/ R11 WhatsApp-handoff lead capture). `TEST_READY.md`/`PROJECT.md` milestone statuses are planning-time snapshots — ignore their claims, run the suite.
- Fonts load via `next/font/google` in `layout.tsx` (`Syne` + `Plus_Jakarta_Sans`, weights 400–800, variables `--font-syne`/`--font-plus-jakarta`). A redundant Google-Fonts `@import` also sits at the top of `globals.css` and triggers a LightningCSS `@import order` build warning — harmless, but the `@import` line can be deleted; do NOT remove the `next/font` imports (test R6.3 asserts on them).
- `next build` warns about duplicate lockfiles (workspace root inferred as `C:/Users/vigilare/Aura`); set `turbopack.root` or remove the root lockfile to silence it.
- Notion docs hub (status, research, roadmap live here): https://app.notion.com/p/AuroMakeover-Project-Documentation-3e38162475868186b45cf59f63907290

## Project Structure
- `src/app/` — Next.js 16 App Router: `layout.tsx`, `page.tsx`, `globals.css`, plus Phase 2 routes `quiz/page.tsx`, `api/leads/quiz/route.ts`, `api/leads/estimator/route.ts`, `api/ai/restyle/route.ts`, `api/ai/restyle/[jobId]/route.ts`, `[city]/page.tsx` + `[city]/CityLanding.tsx`
- `src/components/` — Feature sections (R1–R9):
  - `HeroSection.tsx` (R1), `BeforeAfterShowcase.tsx` (R2), `DesignGallery.tsx` (R3)
  - `SocietyPreMeasured.tsx` (R4), `StatsTicker.tsx` (R5), `EstimatorGateway.tsx` (R5)
  - `Footer.tsx` (R6) plus admin/technician subfolders
  - Phase 2: `StyleQuiz.tsx` (quiz stepper), `VisualizeRoom.tsx` (AI restyle modal)
  - Phase 3+: `HowItWorks.tsx` (R7, 48-Hour Method), `OfferBanner.tsx` (R7, sticky+dismiss), `Reviews.tsx` (R8, trust section), `PackageRecommender.tsx` (R9, questionnaire→package)
  - GSAP layer (R10, additive over framer-motion): `AnimatedCounter.tsx` (count-up figures, Warm Gold digits), `GoldDivider.tsx` (self-drawing gold seam line), `src/lib/gsap.ts` (singleton: registers ScrollTrigger once, SSR-guarded, re-exports `gsap`/`ScrollTrigger`/`useGSAP`)
- `src/lib/engines.ts` — Pure calculation engines (see below); **do not alter function signatures** without updating callers
- `src/lib/` Phase 2: `quiz-to-tags.ts` (quiz answers → WhatsApp/estimator payload), `cities.ts` (city configs: societies, WhatsApp numbers, service areas), `lead-router.ts` (pure routeLead: city→weight→24h round-robin), `lead-assign.ts` (server assignment w/ fail-closed fallback), `package-recommender.ts` (pure scoring + recommendToPrefill)
- R11 WhatsApp-handoff lead capture (2026-09-23): **every WhatsApp open is gated on captured name + phone**. Shared validators in `src/lib/lead-details.ts` (`normalizeLeadPhone` → 10-digit Indian mobile, `isValidLeadPhone` 6–9 start, `isValidLeadName` ≥2 chars). Quiz gained a 6th step "Your Details" (`STEPS.length` = 6 — SSR shows "Step 1 of 6"); estimator Step 3 got a "Your Contact Details" card; both CTAs `disabled` until valid; `/api/leads/{quiz,estimator}` persist real `customerName`/`phone` (fallbacks `'Walk-in (…)'`/`'UNKNOWN'`). WhatsApp messages carry the name (`tagsToWhatsAppMessage(tags, society?, customerName?)` + `• Customer Name`/`• Contact Number` lines). Tests R11.1–R11.6.

## Key Interfaces — `src/lib/engines.ts`
Three pure functions with fixed interfaces; any changes require updating all callers:

- `calculateRollNesting(input)` → `{ totalVerticalDrops, matchingWasteInches, requiredContinuousMeters, totalSqFtRequired, totalSqFtWithBuffer }`
  - Note: Applies min 11% safety buffer over exact wall size (`Math.max(totalSqFtRequired, exactWallSqFt * 1.11)`)
- `analyzeSolarLux(input)` → `{ highSolarHeatRadiation, recommendedBlindType }`
  - `recommendedBlindType` is a discriminant union: `'Standard Translucent Sheer' | '100% Blackout Motorized Blinds' | 'Double-cell Honeycomb Blinds'`
- `calculateDynamicPricing(input)` → `{ materialCost, primerCost, installationLaborCost, subtotal, gstAmount, totalRetailPrice, escrowTranches }`
  - GST is 18%; escrow tranches are 10/60/30 of totalRetailPrice
  - `isSmartMotorized` adds a flat ₹15000 surcharge

## Design System Tokens (from `src/app/globals.css` and `PROJECT.md`)
- **Palette**: Dark Espresso `#1C130B`, Warm Gold `#C5A880`, Terracotta Brown `#8A5836`, Linen Off-White `#FAF8F5`, WhatsApp Green `#15803D`
- **Typography**: Headings → `font-['Syne']` bold/black 700-800; Body → `font-['Plus_Jakarta_Sans']` regular/medium/semibold 400-700
  - Exception (2026-09-23): the "Your Society, Pre-Measured" h2 (R4) uses `font-['Yeseva_One']` (curvy display serif, weight 400 only — no `font-black` on it). Loaded via `next/font/google` in `layout.tsx` as `--font-yeseva`. R6.3 still requires Syne + Plus Jakarta in layout — keep all three.
- **Corners**: Only `rounded-2xl`, `rounded-3xl`, or `rounded-full`. Zero `rounded-sm` or basic `rounded`.
- **Colors CSS vars**: `--color-espresso`, `--color-gold`, `--color-terracotta`, `--color-linen`, `--color-whatsapp`

## Framer Motion 13 Animations
- Stagger entries, spring animations, marquee tickers, 3D tilt transformations
- `motion` components from `framer-motion` are used throughout; preserve animation props when refactoring

## GSAP 3 Interaction Layer (R10)
- Deps: `gsap@^3.15` + `@gsap/react@^2` (free since GSAP 3.13 — no license concerns).
- **Always import through `src/lib/gsap.ts`** (`gsap`, `ScrollTrigger`, `useGSAP`, `registerGsap`) — it registers ScrollTrigger exactly once and guards SSR via `typeof window`. Call `registerGsap()` at the top of every `useGSAP` callback.
- All GSAP work lives inside `useGSAP` in `"use client"` components; scope with `{ scope: ref }` and return a cleanup (kill tweens/triggers).
- R10 tests (opaque, `scripts/test-e2e.mjs`): R10.1 gsap dep + setup module · R10.2 AnimatedCounter (`useGSAP`, `gsap.to`, `#C5A880`, ScrollTrigger) · R10.3 GoldDivider (`strokeDash`, gold palette, scroll-trigger) · R10.4 page seams + Reviews counter · R10.5 hero parallax (`yPercent`/`scrub`).
- Don't touch hero stat-pill literals (R1.4 pins `247 Flats Done` etc.) — GSAP additions around them are additive only.

## Tailwind CSS v4
- Configured via `tailwind.config.ts`; PostCSS plugin `@tailwindcss/postcss` v4
- `clsx` is used for conditional class joining
- `tailwind-merge` v3 for class conflict resolution
- **Do not upgrade Tailwind without reviewing `tailwind.config.ts`** — v4 has breaking changes from v3

## Prisma ORM
- `@prisma/client` v7.10.0; `prisma` v8.0.0-rc.15
- `postinstall` script runs `prisma skills sync || exit 0`
- Schema lives in `prisma/` — generate client with `npx prisma generate`

## Critical Integration Points (from `PROJECT.md`)
- `src/lib/engines.ts` ↔ `EstimatorGateway.tsx`: pass engine outputs as estimator inputs
- Anchor target `#estimator` in `src/app/page.tsx`
- Event: `window.dispatchEvent(new CustomEvent('auro:select-society', { detail: { society: string } }))` for pre-selecting society in wizard

## Milestones (from `PROJECT.md`)
- M1: Global Foundation & Layout typing, Google fonts, Tailwind v4 theme
- M2: Hero with word stagger & blobs, Before/After draggable slider
- M3: Masonry grid with 3D tilt, 4 society cards with smooth scroll
- M4: Auto-scrolling ticker, 3-step estimator wizard, luxury footer
- M5: 100% E2E test suite pass + adversarial coverage hardening

## Things Agents Often Get Wrong
- **Tailwind class order**: With Tailwind v4, class ordering and `tailwind-merge` usage matters more than v3; incorrect merges cause unexpected overrides
- **Test grade the contract, not duplication**: tests like R8.1 assert a reusable `StarRow` aria-label template + `REVIEWS.map` (single definition), NOT N copies of the markup — don't "fix" them by inlining components N times
- **Every `/images/*` path must exist on disk** (R9.4 guard test scans `src/` and walks `public/images`); don't add dead image config — `cities.ts` society entries carry no `image` field
- **Framer Motion props**: `whileHover`, `whileTap`, `transition` props are version-specific; check the `framer-motion` v13 docs before adding new animations
- **`next/font` Google fonts**: `layout.tsx` loads `Syne` + `Plus_Jakarta_Sans` (weights 400–800) as `--font-syne`/`--font-plus-jakarta` — test R6.3 asserts on these imports, don't remove them. The extra CSS `@import` of the same families in `globals.css` is redundant (and causes a build warning); the `next/font` setup is the source of truth.
- **Engines function purity**: `src/lib/engines.ts` functions are pure — no side effects, no DB calls. Treat as utility library; do not convert to async unless needed
- **Runtime-verifying client flows without a browser**: SSR HTML contains React `<!-- -->` comment markers at every expression boundary (so `Contains('Step 1 of 6')` fails on `Step <!-- -->1<!-- --> of <!-- -->6`) and em-dashes in JSX text render as `-`. Match with tolerant regexes/stripped whitespace, not literals. Node 24 runs erasable-TS modules directly (type stripping) — `node -e`/`.mjs` can `import` `src/lib/*.ts` for pure-logic behavior tests (used for R11 validators, 16/16).
- **Local lead APIs fail by design**: no local `prisma generate`, so `/api/leads/{quiz,estimator}` 503/500 locally — the quiz page's `.catch()` opens WhatsApp with default `919700675637` and the estimator falls through to the default number. Expected locally; real name/phone persistence happens on Vercel after the deploy runbook (migration PENDING REVIEW).