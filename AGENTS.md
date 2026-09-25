# AuroMakeover — Next.js 16 + Tailwind CSS v4 Project

> **Read this first (2026-09-25):** the working tree is in the middle of an **uncommitted font rollback** and has **untracked new modules**. `git status` shows ~50 modified files reverting headings from Space Grotesk → `font-['Syne']` (globals.css `--font-heading: 'Syne'`; `layout.tsx` loads `Syne + Plus_Jakarta_Sans + Yeseva_One`). The E2E tests **still pin Space Grotesk**: R1.1 asserts HeroSection contains `Space_Grotesk`, R6.3 asserts layout imports `Space_Grotesk`, R12.8 asserts layout+hero use `Space_Grotesk` and hero does NOT contain `font-['Syne']`. **The suite currently FAILS on the working tree** until fonts and tests are reconciled one way or the other. `src/app/[city]/page.tsx` is a rollback artifact: `Syne({ variable: '--font-space-grotesk' })` (variable renamed, font is Syne). Untracked: `src/components/NavBar.tsx` (already imported by `layout.tsx`), `ScrollReveal.tsx`, `src/components/estimator/` (StepRoomSize/StepFinishTier/StepReviewBook split from EstimatorGateway), `src/app/collections/` route, and the R13 pair images (`public/images/*-r13.jpg`, `*-balcony*`, `*-kids*`). Committed HEAD (c217b99) = Space Grotesk + green CI. Commit the rollback + matching test updates together, or the deploy will be red.

## Development Commands
- `npm run dev` — Next.js 16 dev server (default: http://localhost:3000)
- `npm run build` — Next.js build (runs tsc type-strip; a TS error like TS2353 fails it hard)
- `npm run start` — Next.js start production server
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`; ignores `tools/**`, `.kilo/**`; 0 errors is the bar, warnings are tolerated)
- `node scripts/test-e2e.mjs` — self-contained opaque-box E2E suite (**117 tests**, exit 0 = all pass; NOT an npm script). It source-inspects files and imports pure `src/lib/*.ts` directly — no dev server, no DB needed.
- `npx tsc --noEmit` — typecheck (with `build` + the E2E suite + lint these are the four acceptance gates; CI runs them in that order in `.github/workflows/ci.yml`, Node 20, `npm ci`)
- There is **no `npm test` script**. Vitest infra exists (`tests/`, `vitest.config.ts`, jsdom) but the canonical suite is the `.mjs` runner above.

## Verification — trust the runner, not the reports
- **E2E suite = 117/117 green at HEAD** (verified 2026-09-24 on f787caf: 108→117 w/ the R13 tier R13.1–R13.9). `TEST_READY.md`/`PROJECT.md` are planning-time snapshots — ignore their claims and run the suite. The uncommitted font rollback breaks R1.1/R6.3/R12.8 (see warning above).
- Fonts are a **test contract**: `next/font/google` imports in `layout.tsx` are asserted by R6.3, and R1.1/R12.8 pin `Space_Grotesk` in hero/global headings. Renaming the font or the `--font-*` variable without updating these tests fails Gate 1.
- `globals.css` has NO Google-Fonts `@import` (only `@import "tailwindcss"` + `@theme`) — do not re-add one; families come from `next/font`.

## Deploy (Vercel)
- **Production branch = `init-auromakeover-16081128185176046364`** (the repo's only/default branch — there is no `main`; `DEPLOY.md`'s "merge to main" wording is stale). CI yml triggers on push/PR to `main` AND that branch. **Pushing to origin auto-deploys production** (project `designjoom/aura-makeover`, live at https://aura-makeover.vercel.app).
- No local Vercel CLI login/token exists on this machine — auth goes through the GitHub integration. Deployment status shows as the "Vercel" check on commits (`gh api repos/ajayspi/Aura-Makeover-/commits/<sha>/status`).
- Guardrail: `DEPLOY.md` — Prisma migration `prisma/migrations/pending_lead_routing` is **PENDING REVIEW, never blind-apply**; `SalesAgent` seeding via `SALES_AGENTS_JSON` env; demo rows must be purged; WhatsApp fallback number `919700675637`.

## Project Structure
- `src/app/` — App Router: `layout.tsx` (NavBar + OfferBanner + SpeedInsights), `page.tsx`, `globals.css`, `quiz/page.tsx`, `api/leads/{quiz,estimator}/route.ts`, `api/ai/restyle/route.ts` + `[jobId]`, `[city]/page.tsx` + `CityLanding.tsx`, and the new (untracked) `collections/` route.
- `src/components/` — R1–R13 features. R13 2026-09-24: `BeforeAfterGrid.tsx` (16-cell grid = 15 pairs + CTA, `id="before-after-grid"`, gap token must stay `--grid-gap` + a lowercase `grid gap` comment — see gotchas) + `src/data/before-after-pairs.ts` (15 same-space pairs, 7 categories) + `scripts/generate-before-after.mjs` (keyed Pollinations edits; keys read from gitignored `.secrets/image-keys.json`, never inlined).
- Estimator was split (working tree, untracked) into `src/components/estimator/` steps; `NavBar.tsx`, `ScrollReveal.tsx` are new untracked modules.
- Specs/decision records live in `.opencode/*.md` (`spec-homepage-expansion.md`, `spec-beforeafter-grid-expansion.md`, …) — consult before re-deciding a documented decision (e.g. font choice D1).
- `src/lib/engines.ts` — pure calculation engines (see interfaces below); `lead-router.ts`/`lead-assign.ts`/`lead-details.ts`/`quiz-to-tags.ts`/`package-recommender.ts`/`cities.ts` are the pure lead & estimator plumbing.
- `README.md` is boilerplate create-next-app — ignore it. `CLAUDE.md` is `@AGENTS.md`. `.agents/.claude/.cursor/.devin/.kilo` dirs hold `prisma skills sync` output.

## Key Interfaces — `src/lib/engines.ts`
Three pure functions with fixed interfaces; any change requires updating all callers:
- `calculateRollNesting(input)` → `{ totalVerticalDrops, matchingWasteInches, requiredContinuousMeters, totalSqFtRequired, totalSqFtWithBuffer }` (min 11% safety buffer over exact wall size)
- `analyzeSolarLux(input)` → `{ highSolarHeatRadiation, recommendedBlindType }` (discriminant union of 3 blind types)
- `calculateDynamicPricing(input)` → `{ materialCost, primerCost, installationLaborCost, subtotal, gstAmount, totalRetailPrice, escrowTranches }` (GST 18%; escrow 10/60/30; `isSmartMotorized` adds ₹15000)

## Design System Tokens (`globals.css` + `PROJECT.md`)
- **Palette**: Dark Espresso `#1C130B`, Warm Gold `#C5A880`, Terracotta `#8A5836`, Linen `#FAF8F5`, WhatsApp Green `#15803D`, R12 adds Silver `#C9CDD4` + Royal `#3E2C1E`. Utilities: `.text-foil`, `.bg-foil-card`, `.shimmer-bar` (reduced-motion disabled).
- **Typography**: heading font is currently **Syne in the working tree, Space Grotesk at HEAD** (decision D1, mid-rollback — see top warning). Body is Plus Jakarta Sans. Curvy Yeseva One is loaded for the "Your Society, Pre-Measured" headline (`--font-yeseva`).
- **Imagery Rule**: never CSS gradients/blobs/color blocks as interior-photo placeholders — use photorealistic images (`public/images/`).
- **Corners**: only `rounded-2xl` / `rounded-3xl` / `rounded-full` (R6-B5 audits zero `rounded-sm`).
- **Layout**: "Luxury Restraint" — 120px+ section padding, minimal stat pills/badges/CTAs.

## GSAP 3 Interaction Layer (R10)
- Deps `gsap@^3.15` + `@gsap/react@^2` (free). **Always import via `src/lib/gsap.ts`** (registers ScrollTrigger once, SSR-guarded); call `registerGsap()` at the top of every `useGSAP` callback; scope with `{ scope: ref }` and return cleanup. Additive over framer-motion only.

## Tailwind CSS v4 / Prisma
- Tailwind v4 via `@tailwindcss/postcss` + `tailwind.config.ts` (v4 format). Class-merge behavior differs from v3 — check `tailwind-merge` interactions when refactoring class strings.
- `@prisma/client` v7.10.0, `prisma` v8 rc; `postinstall` = `prisma skills sync || exit 0`. No local `prisma generate` → **lead APIs 503/500 locally by design** (`/api/leads/*`); quiz fallback opens WhatsApp with `919700675637`, estimator falls through to default number. Real persistence only on Vercel after the DEPLOY.md runbook.

## Milestones (from `PROJECT.md`)
M1 Foundation & fonts · M2 Hero + draggable before/after · M3 Masonry + society cards · M4 Ticker + 3-step estimator + footer · M5 100% E2E + adversarial hardening (→ superseded by R7–R13 expansions; take milestone claims as history, not spec).

## Things Agents Often Get Wrong
- **Opaque tests grade source, not runtime**: R8.1 asserts a reusable `StarRow` aria-label template + `REVIEWS.map` (single definition) — don't "fix" by inlining copies. R9.4 walks `src/` and guards every `/images/*` path on disk — don't add dead image config; commit new images together with their code or CI Gate 1 fails on checkout.
- **R13.1 case trap**: `BeforeAfterGrid.tsx` must contain the lowercase substring `grid gap` (the `--grid-gap` token + a lowercase `grid gap` comment satisfy it); the custom prop needs `as React.CSSProperties` or `next build` dies with TS2353. (Both broke the Vercel deploy + CI at 20a7002/f787caf — see git log.)
- **SSR markers**: rendered text contains `<!-- -->` at expression boundaries and em-dashes render as `-` — match with tolerant regexes, not literals.
- **Framer Motion props** (`whileHover`, `transition`, …) are v13-specific; check docs before adding.
- **Hero stat-pill literals are pinned** (R1.4: "247 Flats Done" etc.) — GSAP additions around them are additive only.
- **`engines.ts` functions are pure** (no side effects, no DB) — don't make them async.
- **`next build` warns about duplicate lockfiles** (root `package-lock.json` vs workspace inference) — cosmetic; ignored for the gates.
- **Don't touch the `<!-- BEGIN:nextjs-agent-rules -->` block below** — `next dev` regenerates it; committing it with your work keeps the tree clean.