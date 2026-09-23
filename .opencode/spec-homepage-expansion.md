# Spec — Homepage Expansion: Award-Winning Metallic Redesign

Slug: `spec-homepage-expansion`
Status: **IMPLEMENTED & VERIFIED 2026-09-23** — all 4 gates green (108/108 E2E, tsc, lint, build); live in `main`-bound working tree, awaiting `/verify` + deploy per `DEPLOY.md`.
Scope: **HOME PAGE ONLY** (`src/app/page.tsx` + its components). No other routes, APIs, engines, or lead flows.

---

## 1. Goal

Turn the current compact 13-block homepage into a long-form, award-winning experience following the
`AuroMakeover Homepage — React/Next.js Component Architecture` reference: **alternating section
rhythms, royal + metallic color language (gold / silver / metallic hues), more bling, and expansion
(the page should not feel small)**. Done per the design-token laws already enforced by the E2E gates.

## 2. What already exists (researched — do not recreate)

Current homepage order: OfferBanner → Hero(R1) → BeforeAfterShowcase(R2) → DesignGallery×8(R3) →
SocietyPreMeasured×4 societies, Yeseva One(R4) → StatsTicker(R5) → Reviews(R8) → GoldDivider →
HowItWorks(R7) → GoldDivider → PackageRecommender(R9) → Estimator + heading(R5/R11) → Footer(R6).

| Arch-doc section | Status | Action |
|---|---|---|
| 1 Hero | ✅ built | keep (R1.4 stat-pill literals pinned) |
| 2 BeforeAfterShowcase | ✅ built | keep |
| 3 ProductShowcase | ❌ missing | **NEW** showroom/category carousel section |
| 4 ProcessTimeline | ⚠️ partial | expand HowItWorks into richer 4/5-step timeline w/ metallic accents |
| 5 TestimonialWall | ⚠️ partial | keep Reviews (R8 pins `REVIEWS.map`), add wall-of-love marquee strip |
| 6 InteractiveEstimator | ✅ built | keep (#estimator anchor, R11 gating) |
| 7 SocietiesMap | ⚠️ cards, no map | **NEW** stylized "regional band" (NO Leaflet dep — R9.4/no-dep budget) |
| 8 FAQSection | ❌ missing | **NEW** accordion (gold-trim, token corners) |
| 9 UrgencyBanner | ⚠️ sticky only | **NEW** dedicated 48h-countdown urgency section w/ shimmer |
| 10 FooterSection | ✅ built | keep |

## 3. Non-goals

- No dependency additions (no leaflet/shacn/react-hook-form/tanstack — violates repo budget & R9.4 risk).
- New royalty-free photos ARE shipped (user directive): downloaded from free/CC-licensed web sources into
  `public/images/` — real files satisfy R9.4. No paid stock, no watermarked assets, no runtime hotlinking.
- No changes to `src/lib/engines.ts`, lead APIs, WhatsApp gating, quiz, `[city]` pages, GSAP layer (additive only).
- No removal of existing anchors: `#gallery`, `#societies`, `#how-it-works`, `#reviews`, `#estimator` stay.

## 4. Decisions — RESOLVED (sign-off 2026-09-23)

- **D1 = (a) Space Grotesk site-wide.** Replace Syne headings everywhere with **Space Grotesk**
  (`next/font/google`, weights 500–700); body stays Plus Jakarta Sans (+ Yeseva One on R4 h2).
  Deliberate test updates: **R1.2 and R6.3** (gated by this sign-off).
- **D2 = full set (all 6):** ProductShowcase + SocietyRegionBand + FAQSection + UrgencyBanner48 +
  ProcessTimeline expand + TestimonialMarquee.
- **D3 = Silver + deep bronze:** `--color-silver: #C9CDD4`, `--color-royal: #3E2C1E`, plus gold-foil
  gradient/shimmer utilities (R6-B4-safe — no raw primary-RGB hexes).
- **IMAGES = royalty-free web downloads** (user directive 2026-09-23): source real, license-clean
  photos from free web sources into `public/images/` as real files — no hand-written SVG stand-ins.

## 5. Affected files (planned)

- `src/app/page.tsx` — interleave new sections in alternating bg rhythm (linen ↔ espresso ↔ deep royal).
- `src/app/globals.css` — new `@theme` tokens (D3), shimmer/keyframes, metallic utility classes.
- `src/app/layout.tsx` — font import only if D1=(a).
- `public/images/` — new royalty-free downloads (showcase category photos; verified on disk pre-wire).
- New components under `src/components/`:
  - `ProductShowcase.tsx` — luxury showroom: 4 categories, foil-gradient cards, reuse gallery imagery (R3.3 gallery ✗ untouched),
  - `SocietyRegionBand.tsx` — corridor "map-ish" band (CSS-drawn Hyderabad West corridors, progress bars),
  - `FAQSection.tsx` — accordion (native `<details>` or client state; `rounded-2xl`, gold borders),
  - `UrgencyBanner48.tsx` — 48h countdown w/ shimmer underline + `#estimator` CTA (R5.5 fallback number preserved),
  - `TestimonialMarquee.tsx` — auto-scroll wall-of-love strip reusing existing REVIEWS content (additive to Reviews).
- `scripts/test-e2e.mjs` — **only** if the conventions require a new R12 group asserting the new sections
  (additive; existing 99 tests stay green, count grows).

## 6. Expected behavior

- Homepage length grows substantially; sections alternate dark/light/royal backgrounds with gold dividers (GoldDivider re-used).
- Metallic language: gold `#C5A880` (existing) + silver `#C9CDD4` + deep bronze `#3E2C1E` accents, foil gradient
  text on key CTAs, subtle shimmer on urgency/CTA elements (no heavy animation — Framer Motion + GSAP existing patterns only).
- Indian-premium psychology: royalty/darbar regalia cues (bronze/gold), paisa-vasool guarantees, 48h countdown,
  society progress ("X/50 flats done"), festival-agnostic urgency — all using existing verified data.

## 7. Acceptance-criteria checklist — VERIFIED 2026-09-23

- [x] **All 4 gates green** (repo root): `node scripts/test-e2e.mjs` → **108/108** (99 + 9 new R12 tests, exit 0) · `npx tsc --noEmit` clean · `npm run lint` 0 errors (6 pre-existing warnings in untouched files; one new-file error — `react-hooks/set-state-in-effect` on UrgencyBanner48's synchronous `setLeft()` — fixed by driving state purely from the interval callback, SSR-safe `--` placeholder) · `npm run build` ✓ (11 static pages, no new routes).
- [x] New sections mounted in alternating bg rhythm: Banner→Hero(dark)→BeforeAfter→Gallery(linen)→**ProductShowcase(royal)**→Societies(linen)→**RegionBand(white belt)**→Ticker(espresso)→Reviews(linen)→**TestimonialMarquee(espresso)**→Divider→HowItWorks(linen)→Divider→PackageRecommender(espresso)→**FAQ(linen)**→**UrgencyBanner48(espresso)**→Estimator(linen)→Footer(dark). Page substantially longer.
- [x] Metallic tokens in `globals.css`: `--color-silver: #C9CDD4`, `--color-royal: #3E2C1E`, `.text-foil`/`.bg-foil-card`/`.shimmer-bar` + `foil-sheen` keyframe; R6-B4 forbidden-hex audit green on the 7 audited components (new sections also stay on-palette).
- [x] R9.4: every `/images/*` ref resolves on disk; 13 distinct jpgs (7 original + 6 new `showcase-*.jpg`); no `image:` refs in `src/lib/cities.ts`.
- [x] Zero `rounded-sm`/bare `rounded` anywhere new (only `rounded-2xl/3xl/full`).
- [x] R1.4 stat-pill literals untouched. D1 test updates landed exactly as sanctioned: **R1.1** (Hero `Syne` assert) and **R6.3** (layout `Syne` assert) → `Space_Grotesk`; R1.2 (headline stagger) untouched as planned.
- [x] All anchors `#gallery/#societies/#how-it-works/#reviews/#estimator` + new `#showcase/#corridors/#faq` intact; WhatsApp fallback `919700675637` (R5.5) and R11 lead-capture gating untouched.
- [x] Build: `/` prerendered (static) + only existing routes (/, quiz, [city]×3, 4 APIs); `package.json` unchanged (zero new deps — Pexels photos are static files, not packages).

**Post-verify notes (2026-09-23):** HowItWorks kept exactly 4 steps (`Step 1–4`) to satisfy R7.1's `>= 4` regex while gaining a gold `.bg-foil-card` timeline, when-chips and a metallic **48H** seal strip. RegionBand corridor totals (78+62+55+52 = 247) reconcile with the pinned R1.4 stat. `Reviews.tsx` now `export const REVIEWS` so TestimonialMarquee reuses the catalog (single definition — R8.1 `REVIEWS.map` intact, R12.6 guards against duplicated `name:` markup).

## 8. Risks

- Downloaded images must be verified: non-zero size, correct format, license-clean source; a broken/failed
  download must never ship — check on disk before wiring `/images/*` refs (R9.4 guard).
- A much longer page can hurt LCP: hero image stays `priority`, everything else lazy; GSAP scrubbed animations kept light.
- Font swap (if D1=a) touches R1.2/R6.3 — deliberate, documented test changes gated on this sign-off.
- Countdown/shimmer must respect `prefers-reduced-motion`.

## 9. Out of scope (parked, separate specs)

- Supabase database setup (env wiring + pending `pending_lead_routing` migration review).
- Full "have we built everything" audit deliverable.