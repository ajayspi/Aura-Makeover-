# Spec: GSAP Interaction Layer (numbers, gold lines, scroll motion)

**Status:** IMPLEMENTED (architect-executed under delegated sign-off, 2026-09-23; gates green 2026-09-23)
**Date:** 2026-09-23
**Rank:** New post-backlog polish item — "add more gsap animations, animated moving numbers, gold animated lines, much more interaction"

## Goal
Layer GSAP (ScrollTrigger + useGSAP) over the existing framer-motion animations to add:
1. **Animated moving numbers** — count-up figures that run when scrolled into view (Reviews "200+" makeovers; reusable for any stat).
2. **Gold animated lines** — self-drawing gold (`#C5A880`) divider rules that draw on scroll, between key sections.
3. **More interaction** — subtle scroll-driven parallax on the hero image + ambient blobs, and a light shine sweep on gold lines.

Framer-motion is NOT removed — it stays for entrances/stagger/tilt; GSAP adds scroll-driven motion. This is additive.

## Non-goals
- No new routes, no schema/DB changes, no engine changes.
- Do NOT touch hero stat-pill literals (`247 Flats Done`, `4.9★ Rating`, `48hr Guarantee`) — R1.4 pins them.
- No changes to the 7 R6-B4/B5-audited components' palette usage: gold-only accents, no new hex colors.
- Not replacing framer-motion (preserve its existing tests).

## Research (verified)
- `package.json` has NO gsap — must install (`gsap` + `@gsap/react` for the `useGSAP` hook; both free since GSAP 3.13).
- Best placement for dividers: `page.tsx` section seams (Reviews→HowItWorks, HowItWorks→PackageRecommender).
- Reviews heading currently says "4.9 / 5 across 200+ 48-hour makeovers" — swap `200+` into an `AnimatedCounter` (R8.1–R8.3 don't pin that string).
- Hero: full-bleed `<Image>` + 2 gold blobs with `animate-pulse` (Tailwind). GSAP adds a scrubbed parallax — pure enhancement, keeps existing markup strings.
- React 19 + Next 16: use `@gsap/react`'s `useGSAP` inside `"use client"` components; guard all DOM work with `typeof window !== 'undefined'` and `ScrollTrigger.refresh()` after mount.

## Design
### New files
| File | Purpose |
|---|---|
| `src/lib/gsap.ts` | Client-safe GSAP singleton: registers `ScrollTrigger` once (idempotent), re-exports `gsap`, `ScrollTrigger`, and `useGSAP` (via @gsap/react) — single import point for all GSAP components. |
| `src/components/AnimatedCounter.tsx` | `"use client"`. Props: `value`, `suffix?`, `prefix?`, `decimals?`, `duration?`. Uses `useGSAP` + a `gsap.to` tween on a ref object → updates state onUpdate; triggers when the element enters viewport via `ScrollTrigger`. Renders value in `#C5A880` gold with `font-['Syne']`. |
| `src/components/GoldDivider.tsx` | `"use client"`. An SVG gold rule (gradient `#C5A880` → `#8A5836` sheen) with `stroke-dasharray` draw-in via ScrollTrigger + a slow shine sweep (`<animate>`/CSS keyframe or gsap yoyo). Also used inline as section seams. |

### Edits
| File | Change |
|---|---|
| `src/app/page.tsx` | Mount `<GoldDivider />` at Reviews→HowItWorks seam and HowItWorks→PackageRecommender seam. |
| `src/components/Reviews.tsx` | Heading stat "200+" → `<AnimatedCounter value={200} suffix="+" />` (keep surrounding copy). |

### Tests — `scripts/test-e2e.mjs` (Tier 3, R10.x)
- R10.1: gsap is a dependency (`package.json` contains `gsap`) and `src/lib/gsap.ts` registers ScrollTrigger.
- R10.2: `AnimatedCounter.tsx` exists, uses `useGSAP` and a `gsap.to` tween, and its rendered value carries a gold `#C5A880` accent.
- R10.3: `GoldDivider.tsx` exists, uses `stroke-dasharray` (or `strokeDashoffset`) draw-in and the gold palette.
- R10.4: `page.tsx` mounts `GoldDivider` (line seams) and `Reviews.tsx` mounts `AnimatedCounter`.
- R10.5: `HeroSection.tsx` drives scrubbed scroll parallax via GSAP (`useGSAP`/`gsap`, `yPercent`/`scrub`).

## Acceptance criteria
- [x] `node scripts/test-e2e.mjs` green (**93/93**, was 88 — 5 new R10 tests; existing tests untouched)
- [x] `npx tsc --noEmit` 0 · `npm run lint` 0 errors (6 pre-existing warnings) · `npm run build` exit 0
- [x] SSR smoke: `/`, `/quiz`, `/hyderabad`, `/bangalore`, `/chennai` all HTTP 200; home HTML contains gold-divider SVG (`linearGradient`) + counter markup (`tabular-nums`, "4.9 / 5 across")
- [x] AGENTS.md updated (gsap in structure + deps); specs marked IMPLEMENTED

## Risks
| Risk | Mitigation |
|---|---|
| ScrollTrigger SSR mismatch | All GSAP DOM work inside `useGSAP` context + mount guard; `gsap.registerPlugin(ScrollTrigger)` client-only in `gsap.ts` |
| Breaking R1.4/R8 literals | Hero/review copy kept literal; only additive elements surround them |
| Token audit false positives | New components use only `#C5A880`/`#8A5836` (both in palette) and `rounded-2xl/3xl/full` (or no rounded at all) |
| Bundle bloat | gsap core is tree-shakeable; importing only `gsap` + `ScrollTrigger`, no bonus plugins |