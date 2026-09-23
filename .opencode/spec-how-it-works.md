# Spec: How-it-Works Page Section ("The 48-Hour Method" + Sticky Offer Banner)

**Status:** IMPLEMENTED 2026-09-23 — all gates green (tests 77/77, tsc 0, lint 0 errors, build exit 0). Deviation: no new hero link (banner CTA + footer link suffice).
**Date:** 2026-09-23
**Rank:** Backlog #3 (Decorilla pattern). Next after shop-the-look (shipped 2026-09-23).

## Goal
Add a dedicated How-it-Works section to the homepage that brands the process as **"The 48-Hour Method"**, plus a sticky offer banner — mirroring the Decorilla pattern (named differentiator + persistent promo surface). Must read as the missing "process + offer" trust layer between social proof and the estimator.

## Non-goals
- No new routes (section on `/`, not a separate page).
- No pricing/engine changes; no estimator logic changes.
- No CMS; all copy is hardcoded constants in the component.
- No new backend endpoints.

## Research (already done — do not redo)
- `src/app/page.tsx` order: Hero → BeforeAfter → `#gallery` → Society → Ticker → `#estimator` → Footer. No process section, no banner, anchors are `#gallery`/`#estimator` only.
- Design tokens enforced by tests: palette `#1C130B/#C5A880/#8A5836/#FAF8F5/#15803D`, Syne headings / Plus Jakarta body, `rounded-2xl/3xl/full` only (R6-B4/B5 audits fail the suite on violations).
- Framer Motion 13 patterns: `whileInView` reveals, stagger containers (see HeroSection/StatsTicker).
- Opaque-box tests assert on literal strings/classes — any new copy must be added to `scripts/test-e2e.mjs` Tier 1 in the same change.

## Affected files
| Action | Path |
|---|---|
| Create | `src/components/HowItWorks.tsx` — 4-step timeline (Measure → Make → Move-in? per ORIGINAL_REQUEST 48h narrative) + differentiator callouts (zero civil work, escrow, warranty) |
| Create | `src/components/OfferBanner.tsx` — sticky top banner: offer text + CTA scrolling to `#estimator`, dismissible (sessionStorage flag) |
| Edit | `src/app/page.tsx` — mount `<OfferBanner/>` above Hero; insert `<HowItWorks/>` between StatsTicker and `#estimator` (process immediately precedes pricing, Decorilla order) |
| Edit | `src/components/Footer.tsx` — add `#how-it-works` to quick links if a links array exists there |
| Edit | `scripts/test-e2e.mjs` — Tier 1 tests: section mounted, 4 steps present, banner CTA targets `#estimator`, token compliance (rely on existing R6-B4/B5 audits, no new audit needed) |
| Update | Notion Roadmap (backlog #3 → shipped) + Architecture module map |

## Expected behavior
1. Banner sticks to viewport top on all breakpoints, does not cover hero CTA on 360px wide screens, dismiss persists for the session.
2. Section renders 4 numbered steps with icons, each with title + one-line copy; Framer stagger reveal on scroll into view.
3. Anchor `#how-it-works` on the section; smooth-scroll reachable from banner CTA, footer link, and (new) hero-adjacent link — no anchor collisions with `#gallery`/`#estimator`.
4. Mobile: timeline collapses to vertical; banner text truncates with full CTA tappable (min 44px target).
5. Zero console errors; no layout shift after fonts load.

## Acceptance criteria
- [ ] `node scripts/test-e2e.mjs` green (incl. ≥3 new Tier 1 tests for section/banner/anchor)
- [ ] `npx tsc --noEmit` 0 errors · `npm run lint` 0 errors · `npm run build` exit 0
- [ ] Banner + section verified at 360px and 1440px (screenshots or Playwright, not eyeballing)
- [ ] Notion Roadmap + Architecture updated; build log appended

## Risks
| Risk | Mitigation |
|---|---|
| Sticky banner + smooth-scroll anchor offset (banner covers section head) | `scroll-margin-top` on anchored sections equal to banner height |
| Test string-match brittleness on new copy | Keep step titles as exported constants; tests import nothing (opaque-box) — assert on the same constants' literals |
| Scope creep into estimator/pricing | Hard boundary: this spec touches no engine, price, or WhatsApp logic |
