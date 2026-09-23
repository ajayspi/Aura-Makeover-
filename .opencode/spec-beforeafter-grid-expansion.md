# Spec — Homepage Expansion: Generated-Image Before/After Expansion (R13)

Slug: `spec-beforeafter-grid-expansion`
Status: **DRAFT — AWAITING SIGN-OFF 2026-09-23** (current session; prior gate statuses supersede nothing)
Scope: **HOME PAGE ONLY** (additive sections to `src/app/page.tsx` + new components + generated `public/images/` files). No changes to routing, engines, or other routes.

---

## 1. Production-Build Gates (must stay green after this work)

Four gates, unchanged base counts, **new R13 group pinned by this work**:
- Gate A — `node scripts/test-e2e.mjs` → currently **108/108**; target **108 + R13 group** (R13.1–R13.9 below).
- Gate B — `npx tsc --noEmit` (clean).
- Gate C — `npm run lint` (0 errors; 6 pre-existing warnings untouched files untouched).
- Gate D — `npm run build` (next build).

---

## 2. Decision Summary (RESOLVED — user answered 2026-09-22)

- **D1 = GENERATED images, submitted via the user's real Pollinations key** (`sk_…` saved to gitignored
  `\.secrets\image-keys.json`) using the **`/v1/images/edits` multipart endpoint** — the *only* technique
  that yields true same-space pairs: generate the builder-finish room once, then edit that exact JPEG with
  the makeover prompt. Anonymous legacy tier and agentkey were both probed and rejected (see §3 evidence).
- **D2 = 16-card 4×4 grid** of before/after pairs (per user: "add more before after sections 4 by 4 grids
  are various styles"). Cards span 7 style families: **Blinds, Wallpapers, Lights, Drapes/Curtains, Pooja
  Room (temple), Kids Room, Balcony** — 7 categories + 1 CTA card = 16 cells (4 cols × 4 rows ≈ "4 by 4").
  Wait — user picked **16 cards (4×4, style variants)** AND **7 total categories**: so 7 families ×
  2–3 style variants each, 16 cards in a 4-column responsive grid (4/2/1 cols) — interior: does not break
  `ROOMS`/`DEFAULT_ROOMS` compatibility because it is a NEW component, additive, not a change to the pinned
  `BeforeAfterShowcase.tsx` interacción. See §4.2.
- **D3 = each card is a true mini draggable before/after slider** (same `clipPath`+pointer technique as the
  flagship R2 slider, but self-contained per-card `sliderPosition` state). Non-draggable fallback: hover-swap.
- **D4 = generated images replace the shared "real" photos for these 16 pairs.** Kept: existing `before.jpg` /
  `after.jpg` / `neoclassical.jpg` already used by the flagship + gallery (R2/R3 pins reference them; do not
  regress). Generated colors follow the **royal gold / metallic / espresso palette** (D3 tokens) so cards
  match the site's luxury language.
- **No new npm dependencies** (image fetch + gen is a one-off `scripts/` node script using Node 24 global
  `fetch`, no deps to add). Files committed as static `public/images/ba-*.jpg` — R9.4-compliant.
- **Every `/images/*` path on disk** (R9.4/R12.7 guard): when a card is generated its files are downloaded
  and verified (magic `FFD8` + size > 10KB) BEFORE being referenced in code.

---

## 3. Research Evidence (what was actually tested, 2026-09-22)

1. **Anonymous legacy `image.pollinations.ai`**: real JPEGs return (`FFD8`, 84–107KB), but (a) same `seed`
   → **identical cached image regardless of prompt** (pairing by seed is impossible — composite splits and
   same-seed pairs both returned byte-identical 107KB/35KB files); (b) burst → `429 Per-user limit of 300 RPM`
   + `lykon/dreamshaper-8-lcm` fallback model; (c) avg RGB ~56,65,58 → dark, flat, green-cast on the default
   tier — NOT award-winning. **Rejected.**
2. **AgentKey catalog**: `find_tools` across 2,000+ tools — `pollinations`, `dalle`, `grok-imagine`, `flux`,
   `image gen`, `sd`, `ideogram` → **zero image-GENERATION tools** (only image *search*/TikHub). Not a source.
3. **Keyed `gen.pollinations.ai`**: same anonymous-tier limits on JSON bodies; but **`/v1/images/edits`
   (multipart form-data `-F image=@…`)** returns distinct 76KB FFD8 JPEGs — **true before/after pairing
   confirmed**. Requires the user's key (provided, saved to `\.secrets\image-keys.json`).
4. **Pexels / Pixabay hint keys**: `429`/invalid → NOT usable as drop-in real sources. (Pexels `Authorization:
   <key>`, Pixabay `?key=<key>` are the real schemas; the provided strings fail auth in both.)
5. **Model quality on keyed `flux`**: 76KB edit JPEG has warm, well-exposed histogram vs the dark anonymous
   tier — the keyed tier is production-grade for this use.

Verdict: **use the user's Pollinations key + `/v1/images/edits` for all 16 pairs.**

---

## 4. Work to be done

### 4.1 Build the Section (new component)

New file `src/components/BeforeAfterGrid.tsx` ("use client"), self-contained, exports nothing the R2 test
pins. Renders a section `id="transformations"` with:
- Heading per site style: eyebrow `TRANSFORMATIONS`, h2 `font-['Space_Grotesk']` gold-gradient — e.g.
  **"From Builder Blah to Luxury Blah"** (keeps R12 em-dash→`-` tolerant so ok).
- **4-column responsive grid** of 16 cards (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`).
- Each card: a **self-contained draggable before/after slider** (reuses the exact pointer/clipPath pattern
  from `BeforeAfterShowcase.tsx` but with its own `useState` per card via a `BeforeAfterCard` subcomponent).
  Labels "Builder Finish" / "After AuroMakeover" (consistency), `pointer-events-none`, clamped 0–100%,
  touch + mouse. Non-POINTER fallback: hover swaps to after.
- Card 16 = CTA card "Your Home, Transformed → Get Free Estimate" linking `#estimator`.

### 4.2 16-card content matrix (7 style families × variants)

| # | Family | Style variant | Prompt strategy (before → after, same seed+edits) |
|---|---|---|---|
| 1 | Blinds | Blackout Roller | builder window → motorized blackout + sheer curtain, warm gold rod |
| 2 | Blinds | Wooden Venetian | builder window → walnut venetian blinds, soft light play |
| 3 | Wallpapers | Botanical | bare distemper wall → botanical gold wallpaper accent wall |
| 4 | Wallpapers | Fluted Louver | bare wall → fluted timber louver panels, warm cove light |
| 5 | Wallpapers | Neo-Classical | bare wall → moulded panels, brass picture rail |
| 6 | Lights | Cove LED | tube light ceiling → recessed warm cove lighting + pendant |
| 7 | Lights | Concealed Gold | plain ceiling → concealed gold cove strips, dimmable |
| 8 | Drapes | Velvet Portrait | bare window → terracotta velvet drapes + pelmet |
| 9 | Drapes | Silk Sheer | bare window → ivory silk sheers, tie backs |
| 10 | Pooja | Temple Pichwai | empty corner → carved teak pooja with Pichwai door panel |
| 11 | Pooja | Brass Accent | empty corner → brass + gold pooja unit, diya shelf |
| 12 | Kids | Playful Mural | plain kids wall → sky/space mural, hideaway bed |
| 13 | Kids | Study Nook | bare wall → built-in study nook, warm task light |
| 14 | Balcony | Green Oasis | bare balcony → vertical garden + string lights + rattan |
| 15 | Balcony | Jacuzzi Lounge | bare balcony → hot-tub lounge, privacy slats, lanterns |
| 16 | — | **CTA card** | "Your space is next → Get a free estimate" → `#estimator` |

Before prompts: "builder finish [room], bare grey distemper walls, plain white ceiling, concrete floor,
no furnishings, photorealistic interior photography" — consistent tone across all 15.
After prompts: "the exact same [room] now transformed with [FAMILY]: [feature], warm gold cove lighting,
[AuroMakeover palette gold/terracotta/espresso], photorealistic, wide angle" — submitted as **edits of the
before JPEG** so geometry matches.

### 4.3 Placement

`src/app/page.tsx` — insert `<BeforeAfterGrid />` immediately after `<BeforeAfterShowcase />` (keeps the
gold-divider / section rhythm aligned with R12.9 page-seam constraints). New section uses linen `#FAF8F5`
repeating, so `SocietyPreMeasured` etc. unshifted.

### 4.4 Generate script + files

New `scripts/generate-before-after.mjs` (Node 24, global fetch, no deps): reads key from `\.secrets\...`,
for each of 15 pairs: (1) generate builder-finish image via `/v1/images/generations` (keyed), (2) edit that
exact file via `/v1/images/edits` multipart into the after, (3) verify magic bytes + min size, (4) write
`public/images/ba-01-before.jpg`…`ba-15-after.jpg` (16 cells incl CTA n/a). Retry w/ backoff on 429.
Not part of the app bundle. Runs once at build-prep time.

---

## 5. Tests to add (append before SUMMARY block in `scripts/test-e2e.mjs`)

- **R13.1** — `BeforeAfterGrid` file exists + section title includes "Luxury" or "Transformation".
- **R13.2** — grid uses 4-col responsive classes (`lg:grid-cols-4`).
- **R13.3** — grid contains ≥ 16 before/after card slots (count `before:` refs ≥ 15 + CTA).
- **R13.4** — mini-slider card implements drag: `onPointerDown`/`onPointerUp`/`clipPath` per card.
- **R13.5** — labels use `pointer-events-none` + clamp 0/100 (`Math.max(0`/`Math.min(100`).
- **R13.6** — CTA card links `#estimator`.
- **R13.7** — every `/images/ba-*` reference resolves to a real file on disk (extend R9.4 pattern to `ba-*`).
- **R13.8** — generated images are real JPEGs on disk (walk `public/images/ba-*` → magic `FFD8`, size > 10KB).
- **R13.9** — page seams/alternation: `BeforeAfterGrid` sits between the showcase and `DesignGallery`
  divisions, no double-linen-adjacent break.

Tier-2 boundary additions: slider per-card clamps (0%, 100%), touch normalization, tab-switch preserves
position, intro animation has `viewport={{ once: true }}`.

---

## 6. Non-goals / Do not touch

- No changes to `src/components/BeforeAfterShowcase.tsx` (R2 pins: `Living Room`, `Bedroom`, drag labels,
  clamps, touch, width: reveal).
- No changes to `DesignGallery`/`Reviews`/`ProductShowcase`/`SocietyRegionBand`/`FAQSection`/
  `UrgencyBanner48`/`TestimonialMarquee`/`HowItWorks`.
- No new npm deps, no Leaflet/map libs, no API calls at runtime (images are static files; key is build-time only).
- No editing of `src/lib/engines.ts` signatures; no `prisma` generate; no changes to `[city]` pages or leads.
- No committing `.secrets/` (gitignored). Keys never appear in `<img src>` or page source.

---

## 7. Rollout order

1. Write `scripts/generate-before-after.mjs` + run (creates 30 JPEGs into `public/images/ba-*`).
2. Build `BeforeAfterGrid.tsx` (component + section). 3. Wire into `page.tsx`. 4. Add R13 tests.
5. Run all 4 gates. 6. Update `.opencode/spec…` status to IMPLEMENTED + `AGENTS.md` counts/fonts map.

---

_Sign-off required before any implementation. Awaiting approval._
