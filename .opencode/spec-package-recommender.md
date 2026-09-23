# Spec: Package Recommender (Questionnaire → Package Mapping)

**Status:** DRAFT → IMPLEMENTED (executed under delegated sign-off, 2026-09-23)
**Date:** 2026-09-23
**Rank:** Backlog #3 (current ranked list) — "Questionnaire → package recommender on existing Prisma Lead/DesignItem models (livspace shape)"

## Goal
A short questionnaire (room target → style affinity → budget band → project scope) that maps answers to a concrete AuroMakeover package (e.g. "Accent Wall Deluxe" / "Full Room Suite"), displays the recommended package with rationale + what's included, and lets the user jump into the estimator pre-filled with the package's implied finish tier and room type.

## Non-goals
- No new DB tables. Mapping keys live in constants (pure core). Lead capture continues through the existing `/api/leads/quiz`-style channel — the recommender itself is display + prefill only.
- No multi-page flow. Single compact questionnaire card.
- No changes to `engines.ts` signatures.

## Design
### Pure core — `src/lib/package-recommender.ts`
- `PACKAGES`: array of `{ id, name, tagline, tier (finish tier id → maps to estimator tiers), includes[], minBudget, roomTypes[], styles[] }`.
- `recommendPackage(input: { roomType?, style?, budget?, scope? })` → `{ package, matches }`:
  1. Score each package: +2 per matching roomType, +2 per matching style, budget band compatibility check (budget ≥ minBudget), scope bonus for full-room.
  2. Highest score wins; tie-break deterministic (id asc).
  3. Always returns a package (fallback "Signature Accent Wall").
- `recommendToPrefill(pkg)` → `PrefillData`-shaped object compatible with the shared `estimator_prefill` channel (room type, finish tier, scope hint) — mirrors `designToEstimatorPrefill` in `quiz-to-tags.ts`.
- Pure + unit-testable via node (no React, no DB).

### UI — `src/components/PackageRecommender.tsx`
- Section between HowItWorks and Estimator (`id="package-recommender"`).
- 4 single-select questions (room, style, budget band, scope) rendered as chips.
- Recommended package card updates live (same stagger/motion pattern as Reviews/HowItWorks). Shows name, included items, and why it matched.
- "Pre-fill My Estimate →" stores `recommendToPrefill(pkg)` via the shared sessionStorage + query channel and scrolls to `#estimator`.
- Design tokens only (palette, Syne/Plus Jakarta, rounded-2xl/3xl/full).

### Tests — `scripts/test-e2e.mjs` (Tier 3, R9.x)
- R9.1: pure core exists — `recommendPackage` + `PACKAGES` exported; budget guard present.
- R9.2: component exists, exposes `#package-recommender` anchor, renders chips (room/style/budget/scope questions), uses token radii.
- R9.3: page mounts `<PackageRecommender />` between HowItWorks and the estimator block; prefill channel key `estimator_prefill` honored.
- (Characterization: existing R5.5 WhatsApp default + R6-B4/B5 token audits must stay green.)

## Acceptance criteria
- [ ] `node scripts/test-e2e.mjs` green (≥84 → new R9.x pass)
- [ ] Pure core unit-verified via node (≥6 cases: room match, style match, budget floor, full-room bonus, fallback, prefill shape)
- [ ] `npx tsc --noEmit` 0 · `npm run lint` 0 errors · `npm run build` exit 0
- [ ] Notion Roadmap #3 shipped + Architecture/Testing updated; build log appended

## Risks
| Risk | Mitigation |
|---|---|
| Estimator tier ids drift from packages | `recommendToPrefill` maps through an explicit tier-id table mirroring EstimatorGateway quality options |
| Test string brittleness | Assert on identifiers/anchors and constant exports, not copy |