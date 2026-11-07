# AuroMakeover — Next.js 16 + Tailwind CSS v4 Project

> Regenerated 2026-11-07. Ground truth: HEAD `3af759c` on **main**, E2E suite **117/117 green**, CI "Acceptance gates" **success**, Vercel **success**.

## Development Commands
- `npm run dev` — Next.js 16 dev server (http://localhost:3000)
- `npm run build` — Next.js build
- `npm run start` — production server
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`; ignores `tools/**`; 0 errors is the bar)
- `node scripts/test-e2e.mjs` — canonical opaque-box E2E suite (**117 tests**, exit 0 = all pass; NOT an npm script; no dev server or DB needed)
- `npx tsc --noEmit` — typecheck
- The four acceptance gates (E2E → tsc → lint → build) run in that order in `.github/workflows/ci.yml`.

## Project Structure
- `src/app/` — App Router: `page.tsx` (homepage), `layout.tsx`, `globals.css`, routes for `quiz`, `restyle`, `collections`, `comparator`, `roi`, `projects`, `visualizer`, `smart-shading`, `about`, `pricing`, `services/[slug]`, `[city]`, plus `api/leads/{quiz,estimator}`, `api/ai/restyle`, and the mock `api/v1/*` + `ops/*`/`my/*` dashboards.
- `src/components/` — feature components. Estimator wizard is split into `src/components/estimator/Step{RoomSize,FinishTier,ReviewBook}.tsx`. Radix primitives live in `src/components/ui/` (`accordion`, `dialog`, `slider`, `tabs`) — raw @radix-ui, wired with Tailwind classes, **no `cn()` helper**; keep that style.
- `src/lib/` — pure plumbing: `engines.ts` (see below), `lead-router.ts`, `lead-assign.ts`, `lead-details.ts`, `quiz-to-tags.ts`, `package-recommender.ts`, `cities.ts`, `gsap.ts`.
- Prisma schema in `prisma/`; `postinstall` = `prisma skills sync || exit 0`.
- Specs/decision records live in `.opencode/*.md` — consult before re-deciding a documented decision.

## Key Interfaces — `src/lib/engines.ts`
Three pure functions; any change requires updating all callers:
- `calculateRollNesting(input)` → `{ totalVerticalDrops, matchingWasteInches, requiredContinuousMeters, totalSqFtRequired, totalSqFtWithBuffer }`
- `analyzeSolarLux(input)` → `{ highSolarHeatRadiation, recommendedBlindType }`
- `calculateDynamicPricing(input)` → `{ materialCost, primerCost, installationLaborCost, subtotal, gstAmount, totalRetailPrice, escrowTranches }` (GST 18%; escrow 10/60/30; `isSmartMotorized` adds ₹15000)

## Design System Tokens (`globals.css`)
- **Palette**: Dark Espresso `#1C130B`, Warm Gold `#C5A880`, Terracotta `#8A5836`, Linen `#FAF8F5`, WhatsApp Green `#15803D`, Silver `#C9CDD4`, Royal `#3E2C1E`.
- **Typography** (test contract): `layout.tsx` loads **Syne** (headings, `--font-syne`), Plus Jakarta Sans (body), Yeseva One (`--font-yeseva`). The E2E suite asserts Syne — renaming a font or its `--font-*` variable without updating tests fails Gate 1.
- **Imagery Rule**: never CSS gradients/blobs as interior-photo placeholders — use photorealistic images (`public/images/`, R13 pairs `*-r13.jpg`, `*-balcony*`, `*-kids*`).
- **Corners**: only `rounded-2xl` / `rounded-3xl` / `rounded-full`.
- `globals.css` has NO Google-Fonts `@import` — families come from `next/font`. Removing that warning does not apply: do not re-add one.

## GSAP 3 Interaction Layer (R10)
- Deps `gsap@^3.15` + `@gsap/react`. **Always import via `src/lib/gsap.ts`** (registers ScrollTrigger once, SSR-guarded); call `registerGsap()` at top of every `useGSAP` callback; scope with `{ scope: ref }` and return cleanup.

## Deploy (Vercel)
- **Production = `main`** — pushing auto-deploys (project `designjoom/aura-makeover`, live at https://aura-makeover.vercel.app). Do not push without intent.
- No local Vercel CLI token; deploys go through the GitHub integration. Deployment status = the "Vercel" check on commits (`gh api repos/ajayspi/Aura-Makeover-/commits/<sha>/status`).
- Guardrail: `DEPLOY.md` — Prisma migration `prisma/migrations/pending_lead_routing` is **PENDING REVIEW, never blind-apply**; `SalesAgent` seeding via `SALES_AGENTS_JSON` env; demo rows must be purged; WhatsApp fallback number `919700675637`.
- Vercel runs `next build` only — **no E2E gate**; a red E2E suite can ship unnoticed unless CI is checked.

## Things Agents Often Get Wrong
- **Opaque tests grade source, not runtime** (`scripts/test-e2e.mjs`): R8.1 asserts a reusable `StarRow` aria-label template + `REVIEWS.map` — don't "fix" by inlining copies. R9.4 walks `src/` and guards every `/images/*` path on disk — commit new images together with their code.
- **R13.1 case trap**: `BeforeAfterGrid.tsx` must contain lowercase `grid gap` (the `--grid-gap` token + a lowercase `grid gap` comment satisfies it); the custom prop needs `as React.CSSProperties` or `next build` dies with TS2353.
- **SSR markers**: rendered text contains `<!-- -->` at expression boundaries and em-dashes render as `-` — match with tolerant regexes, not literals.
- **`engines.ts` functions are pure** — don't make them async.
- **`clsx` and `tailwind-merge` are installed but unused** — don't adopt them without intent; delete if pruning.
- **`next build` warns about duplicate lockfiles** (root vs workspace inference) — cosmetic; ignore.
- Don't touch the `<!-- BEGIN:nextjs-agent-rules -->` block in generated files — `next dev` regenerates it; committing it keeps the tree clean.

## Windows Shell Gotchas (this machine)
- This PowerShell has **no `tail`/`wc`/`head`**; `Remove-Item` has **no `-File`** (use `Get-ChildItem -Filter … | Remove-Item -Force`); `2>/dev/null` fails (use `2>$null`; `2>&1 | …` works for piping).
