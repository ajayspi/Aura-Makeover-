# AuroMakeover Phase 1 Redesign — Test Infrastructure (`TEST_INFRA.md`)

## 1. Testing Architecture & Methodology
The testing infrastructure for AuroMakeover Phase 1 Redesign is built upon an **Opaque-Box E2E Testing Protocol**. The test suite tests the system strictly against functional requirements (R1 through R6), mathematical contracts (`src/lib/engines.ts`), design system constraints (palette and corner radii), and acceptance criteria specified in `ORIGINAL_REQUEST.md` and `PROJECT.md`.

### Core Testing Pillars:
1. **Opaque-Box Independence**: Test cases are derived strictly from user requirements and acceptance criteria rather than matching implementation artifacts.
2. **Progressive Testability & Zero Regressions**: Mathematical engines and static interfaces are verified alongside dynamic state transitions.
3. **Deterministic Execution**: The test runner runs in pure Node.js (ESM native) without external mocking or unstable network dependencies.
4. **Adversarial Verification**: Edge boundaries, extreme dimensions (5ft to 30ft width, 8ft to 15ft height), negative/zero inputs, clamp thresholds (0% and 100% slider positions), and palette/corner audits are rigorously validated.

---

## 2. Test Suite Structure (70 Tests across 4 Tiers)

| Tier | Name | Target Scope | Min Required | Implemented |
|---|---|---|---|---|
| **Tier 1** | Feature Coverage | Primary behavior across R1-R6 (Hero, Before/After, Gallery, Society, Estimator & Ticker, Footer & Layout) | 30 (>=5 per feature) | **30** |
| **Tier 2** | Boundary & Corner Cases | Min/max dimensions, extreme inputs, clamp thresholds, touch/pointer coordinates, financial invariants, token & corner audits | 5 per feature | **30** |
| **Tier 3** | Cross-Feature Combinations | Pairwise integration: society pre-population, tier pricing updates, motorized add-ons, WhatsApp formatting, anchor scrolling | 4 | **6** |
| **Tier 4** | Real-World Scenarios | End-to-end resident workflows: My Home Bhooja, Rajapushpa Provincia, Aparna Sarovar Zenith, Prestige High Fields | 4 | **4** |
| **Total** | **Full Opaque-Box Suite** | **Comprehensive coverage of Phase 1 Homepage Redesign** | **>=40** | **70** |

---

## 3. Test Files & Artifacts

- **Primary E2E Test Runner**: `c:\Users\vigilare\Aura\auro-makeover\scripts\test-e2e.mjs`
  - Self-contained, runnable ECMAScript Module executable via native Node.js.
  - Generates colored terminal output, detailed failure tracing, and tier summary statistics.
- **TypeScript Specification Test**: `c:\Users\vigilare\Aura\auro-makeover\tests\e2e-requirements.test.ts`
  - Strongly-typed test harness importing pure types and calculation functions from `src/lib/engines.ts`.
- **Readiness & Execution Report**: `c:\Users\vigilare\Aura\auro-makeover\TEST_READY.md`

---

## 4. How to Run the Tests

To execute the full 70-test opaque-box test suite:

```bash
node scripts/test-e2e.mjs
```

Or from project root:
```powershell
node .\scripts\test-e2e.mjs
```

### Exit Codes:
- `0`: All test assertions passed (100% pass rate).
- `1`: One or more test assertions failed (outputs error descriptions and affected tier).

---

## 5. Requirement Mapping Matrix (R1 - R6)

### Feature R1: Cinematic Hero Section
- **T1.1 (R1.1)**: Full-screen container with `#1C130B` dark espresso base, Syne heading, Plus Jakarta Sans body.
- **T1.2 (R1.2)**: Headline "Premium Home Makeovers in 48 Hours." with Framer Motion `staggerChildren` reveal.
- **T1.3 (R1.3)**: Ambient gold/terracotta blur blobs (`#C5A880`, `#8A5836`) providing cinematic backdrop.
- **T1.4 (R1.4)**: 3 floating animated stat pills: "247 Flats Done", "4.9★ Rating", "48hr Guarantee".
- **T1.5 (R1.5)**: 2 CTA buttons ("Get Instant Quote" -> `#estimator`, "View Lookbook" -> `#gallery`) + 3 trust badges (48-Hour Install, Zero Civil Work, Design-on-Wheels).
- **T2.1 (R1-B1)**: Stat pill stagger delays are strictly positive and monotonic (0.8s < 1.0s < 1.2s).
- **T2.2 (R1-B2)**: Headline tokenization handles multi-word phrases and punctuation without word drops.
- **T2.3 (R1-B3)**: Hero container has `overflow-hidden` to avoid viewport scrollbar jitter from blurred blobs.
- **T2.4 (R1-B4)**: Trust badges grid collapses to `grid-cols-1 sm:grid-cols-3` for responsive mobile viewports.
- **T2.5 (R1-B5)**: Hero buttons use `rounded-2xl` corner radius conforming to strict token rules.

### Feature R2: Before/After Interactive Showcase
- **T1.6 (R2.1)**: Section title "The AuroMakeover Difference" presence and structure.
- **T1.7 (R2.2)**: Room switcher supporting at least Living Room and Bedroom.
- **T1.8 (R2.3)**: "Before" side uses builder finish styling with plain grey/white distemper tones.
- **T1.9 (R2.4)**: "After" side uses warm luxury finish styling with gold/terracotta tones.
- **T1.10 (R2.5)**: Draggable slider handle supporting both desktop mouse and mobile touch drag events.
- **T2.6 (R2-B1)**: Slider drag position clamped at minimum boundary 0% (`Math.max(0, ...)`).
- **T2.7 (R2-B2)**: Slider drag position clamped at maximum boundary 100% (`Math.min(100, ...)`).
- **T2.8 (R2-B3)**: Room tab toggling preserves slider position state independently.
- **T2.9 (R2-B4)**: Touch event client coordinate extraction handles multi-touch events safely.
- **T2.10 (R2-B5)**: Overlay badges and specifications use `pointer-events-none` to prevent drag disruption.

### Feature R3: Upgraded Design Gallery (Masonry + 3D Tilt)
- **T1.11 (R3.1)**: Masonry-style grid layout with alternating card aspect ratios (`aspect-[4/5]` and `aspect-[3/4]`).
- **T1.12 (R3.2)**: 3D tilt effect on hover using Framer Motion `useMotionValue` + `rotateX`/`rotateY`.
- **T1.13 (R3.3)**: Catalog contains exactly 8 items across all 4 categories (Botanical: 2, Fluted Louver: 2, Neo-Classical: 2, Temple Pichwai: 2).
- **T1.14 (R3.4)**: Category filter contains ["All", "Botanical", "Fluted Louver", "Neo-Classical", "Temple Pichwai"] with animated underline (`layoutId`).
- **T1.15 (R3.5)**: Client-side category filtering updates displayed cards without page reload.
- **T2.11 (R3-B1)**: Alternating card heights follow strict parity alternation pattern.
- **T2.12 (R3-B2)**: Tilt calculation bounds normalized mouse coordinates within `[-0.5, 0.5]` offset range.
- **T2.13 (R3-B3)**: Mouse leave restores card rotation back to neutral (0deg, 0deg).
- **T2.14 (R3-B4)**: Next.js `<Image>` tags all define `fill`, `alt`, and responsive `sizes` attribute.
- **T2.15 (R3-B5)**: Category filter branch for "All" returns the full 8-item catalog.

### Feature R4: Society-Specific Value Section
- **T1.16 (R4.1)**: Section header "Your Society, Pre-Measured" and horizontal scroll container.
- **T1.17 (R4.2)**: All 4 marquee societies featured (My Home Bhooja, Aparna Sarovar Zenith, Rajapushpa Provincia, Prestige High Fields).
- **T1.18 (R4.3)**: Fire emoji flat count stats (e.g. "47 flats done 🔥") and unit types.
- **T1.19 (R4.4)**: Pre-estimated price range on each card (e.g. "Est. ₹38,000–₹55,000").
- **T1.20 (R4.5)**: "Check My Flat →" button triggers smooth scroll to `#estimator`.
- **T2.16 (R4-B1)**: Horizontal scroll container supports keyboard/touch snap alignment (`snap-x`).
- **T2.17 (R4-B2)**: Fire emoji stat strictly matches format `/\d+\s+flats done\s*🔥/`.
- **T2.18 (R4-B3)**: Price estimates contain Rupee currency symbol `₹`.
- **T2.19 (R4-B4)**: Society pre-selection dispatches CustomEvent `auro:select-society`.
- **T2.20 (R4-B5)**: Card container uses `rounded-3xl` and buttons use `rounded-2xl`.

### Feature R5: Animated Ticker + 3-Step Estimator Wizard
- **T1.21 (R5.1)**: Horizontally auto-scrolling ticker with micro-testimonials and gold `✦` separators.
- **T1.22 (R5.2)**: 3-step estimator wizard with progress bar (Step 1: Room Size, Step 2: Finish Tier, Step 3: Book).
- **T1.23 (R5.3)**: 100% preservation of `calculateRollNesting` engine (drops, waste, continuous meters, >=11% buffer).
- **T1.24 (R5.4)**: 100% preservation of `calculateDynamicPricing` engine (material, primer ₹15, labor ₹25, GST 18%, 10/60/30 tranches).
- **T1.25 (R5.5)**: Animated price counter and WhatsApp button targeting `https://wa.me/919700675637`.
- **T2.21 (R5-B1)**: Min wall dimensions boundary (5ft width, 8ft height) produces 2 drops and >=44.4 sqft.
- **T2.22 (R5-B2)**: Max wall dimensions boundary (30ft width, 15ft height) produces 9 drops and >=499.5 sqft.
- **T2.23 (R5-B3)**: Zero/empty dimensions boundary handled without division by zero or NaN.
- **T2.24 (R5-B4)**: Fractional dimensions (10.5ft x 9.25ft) calculate precise linear continuous meters.
- **T2.25 (R5-B5)**: Escrow tranche financial invariant: `deposit10 + materialRelease60 + postQAUnlock30 === totalRetailPrice`.

### Feature R6: Footer + Metadata + Global Polish
- **T1.26 (R6.1)**: Metadata title and description in `src/app/layout.tsx` match exact Hyderabad positioning.
- **T1.27 (R6.2)**: TypeScript layout typing fixed to `{ children: React.ReactNode }` with zero `LayoutProps<"/">`.
- **T1.28 (R6.3)**: Google Fonts `Syne` and `Plus_Jakarta_Sans` imported and applied.
- **T1.29 (R6.4)**: Luxury footer with brand logo, "2-Year Warranty" badge, 5 service areas, copyright, social links.
- **T1.30 (R6.5)**: Tailwind CSS v4 design tokens and color palette configured in `globals.css`.
- **T2.26 (R6-B1)**: Zero occurrences of broken `LayoutProps<"/">` throughout entire codebase.
- **T2.27 (R6-B2)**: Warranty badge explicitly states "2-Year Warranty".
- **T2.28 (R6-B3)**: Service area list includes Kokapet, Tellapur, Financial District, Nallagandla, and Gachibowli.
- **T2.29 (R6-B4)**: Strict palette audit: zero prohibited colors in components.
- **T2.30 (R6-B5)**: Corner radius audit: zero occurrences of forbidden `rounded-sm` or basic unadorned `rounded`.

### Tier 3: Cross-Feature Combinations
- **T3.1 (R-C1)**: Society Card Click -> Estimator Wizard pre-population via `auro:select-society`.
- **T3.2 (R-C2)**: Finish tier change immediately recalculates subtotal, 18% GST, and 10% escrow deposit.
- **T3.3 (R-C3)**: Smart Motorized blinds toggle applies flat ₹15,000 add-on fee with GST.
- **T3.4 (R-C4)**: Estimator result generates formatted WhatsApp URL with society, dimensions, tier, and pricing.
- **T3.5 (R-C5)**: Hero "View Lookbook" CTA scrolls directly to Design Gallery (`#gallery`).
- **T3.6 (R-C6)**: 3-step wizard enforces sequential forward navigation and direct backward navigation.

### Tier 4: Real-World Application Scenarios
- **T4.1 (R-W1)**: My Home Bhooja 3BHK Living Room Accent Wall (16ft x 10ft, 5 drops, Belgian Luxury @ ₹250/sqft, WhatsApp booking).
- **T4.2 (R-W2)**: Rajapushpa Provincia 14th Floor West Penthouse (24ft x 11ft, SolarLux high heat detection -> Double-cell Honeycomb, Smart Motorized + ₹15,000 fee).
- **T4.3 (R-W3)**: Aparna Sarovar Zenith Master Bedroom (12ft x 9ft, 4 drops, Standard Canvas @ ₹120/sqft, 11% buffer, WhatsApp concierge).
- **T4.4 (R-W4)**: Prestige High Fields Full Customer Journey (Hero guarantees -> Before/After slider -> Botanical gallery filter -> Prestige High Fields card -> Estimator Steps 1-3 -> Swatch Van WhatsApp dispatch).
