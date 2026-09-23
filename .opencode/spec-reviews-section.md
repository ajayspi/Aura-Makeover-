# Spec: Reviews Trust Section (Nav-Level Social Proof)

**Status:** IMPLEMENTED 2026-09-23 — all gates green (tests 88/88, tsc 0, lint 0 errors, build exit 0). Reviews shipped between StatsTicker and HowItWorks; footer #reviews link added. Confirmed: 6 review cards (3-col grid desktop), gold stars via #C5A880, aria-labels, framing stagger. Test note: R8.1 grades the reusable StarRow aria-label template (single definition + REVIEWS.map), not duplicated markup.
**Date:** 2026-09-23
**Rank:** Backlog #4 (Decorilla/Havenly pattern). Next after lead auto-routing (shipped).

## Goal
Add a dedicated Reviews section as a nav-level trust surface between StatsTicker and Estimator — matching the Decorilla/Havenly pattern where reviews/ratings are surfaced at nav level, not just buried in hero badges or ticker pills.

## Non-goals
- No new routes (section on `/`, not a separate page).
- No CMS; review content is hardcoded constants in the component.
- No backend for review submission (display only, for now).
- No pagination/carousel — fixed grid of 3–6 reviews.

## Research (already done — do not redo)
- Current page order: Hero → BeforeAfter → Gallery → Society → Ticker → **HowItWorks** → **Estimator** → Footer. Reviews section goes **between Ticker and HowItWorks** (trust before process, process before estimator).
- Decorilla pattern: reviews as first-class nav item, star ratings + avatar + name + location + quote + project type.
- Havenly pattern: 5-star rating with reviewer name, room type, location, project scope.
- Design tokens: palette, Syne/Plus Jakarta, rounded-2xl/3xl only (R6-B4/B5 audit existing).
- Framer Motion: stagger reveal on scroll (reuses StatsTicker/HowItWorks patterns).
- Opaque-box tests assert on literal strings — new Tier 1 tests for section presence, star rendering, reviewer attributes.

## Affected files
| Action | Path |
|---|---|
| Create | `src/components/Reviews.tsx` — 4–6 review cards (star rating + avatar/initials + name + location + quote + project type tag), Framer stagger reveal |
| Edit | `src/app/page.tsx` — mount `<Reviews/>` between StatsTicker and HowItWorks |
| Edit | `src/components/Footer.tsx` — add `#reviews` to QUICK_LINKS (if array exists) |
| Edit | `scripts/test-e2e.mjs` — Tier 1 tests: section mounted, ≥3 reviews rendered, stars present, reviewer name+location+quote present |
| Update | Notion Roadmap (backlog #4 → shipped) + Architecture module map |

## Expected behavior
1. Section renders between StatsTicker and HowItWorks (anchor `#reviews`).
2. 4–6 review cards in responsive grid (1 col mobile, 2 tablet, 3 desktop).
3. Each card: 5 gold stars, reviewer initials avatar, name, location, 5-star rating, quote, project tag (e.g., "3BHK Luxury").
3. Framer stagger reveal on scroll (reuses StatsTicker/HowItWorks pattern).
4. Mobile: single column; desktop: 3-col grid.
4. Anchor `#reviews` on section; footer link targets it.
4. Zero console errors; no layout shift.

## Acceptance criteria
- [ ] `node scripts/test-e2e.mjs` green (incl. new Tier 1 tests for section/banner/anchor)
- [ ] `npx tsc --noEmit` 0 errors · `npm run lint` 0 errors · `npm run build` exit 0
- [ ] Section verified at 360px and 1440px (screenshots or Playwright, not eyeballing)
- [ ] Notion Roadmap + Architecture updated; build log appended

## Risks
| Risk | Mitigation |
|---|---|
| Star rendering (gold color from palette) | Use `#C5A880` directly; no new colors |
| Test string-match brittleness on review text | Keep reviewer text as constants; tests assert on literal strings from constants |
| Accessibility (star rating semantics) | Use `role="img" aria-label="5 out of 5 stars"` on star group |
| Scope creep into review submission | Hard boundary: display only, no form/backend |