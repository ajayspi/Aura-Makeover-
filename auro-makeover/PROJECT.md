# Project: AuroMakeover Phase 1 Homepage Redesign

## Architecture
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind CSS v4 (@tailwindcss/postcss) + Custom @theme design tokens
- **Animations**: Framer Motion 13 (spring animations, staggered entry reveals, marquee tickers, 3D tilt transformations)
- **Business Logic Engines**: `src/lib/engines.ts` (Pure functions: `calculateRollNesting`, `analyzeSolarLux`, `calculateDynamicPricing`)
- **Page Composition**: `src/app/page.tsx` assembling modular client/server components:
  1. `HeroSection.tsx` (R1)
  2. `BeforeAfterShowcase.tsx` (R2)
  3. `DesignGallery.tsx` (R3)
  4. `SocietyPreMeasured.tsx` (R4)
  5. `StatsTicker.tsx` (R5)
  6. `EstimatorGateway.tsx` (R5)
  7. `Footer.tsx` (R6)

## Design System Tokens
- **Palette**:
  - Dark Espresso: `#1C130B`
  - Warm Gold: `#C5A880`
  - Terracotta Brown: `#8A5836`
  - Linen Off-White: `#FAF8F5`
  - WhatsApp Green: `#15803D`
- **Typography**:
  - Headings: `font-['Syne']` (bold/black 700-800)
  - Body: `font-['Plus_Jakarta_Sans']` (regular/medium/semibold 400-700)
- **Corners**: Strictly `rounded-2xl` or `rounded-3xl` (or `rounded-full` for circular icons/pill badges). Zero `rounded-sm` or basic `rounded`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | R6.LayoutPropsFix | Fix `LayoutProps<"/">` TypeScript compilation blocker in `src/app/layout.tsx` | M1 | ORIGINAL_REQUEST §R6 |
| 2 | R6.GoogleFonts | Load Syne & Plus Jakarta Sans via `next/font/google` and `@import` in globals.css | M1 | ORIGINAL_REQUEST §R6 |
| 3 | R6.DesignTokens | Register strict color palette (`#1C130B`, `#C5A880`, `#8A5836`, `#FAF8F5`, `#15803D`) and base styles | M1 | ORIGINAL_REQUEST §R6 |
| 4 | R6.Metadata | Update title and description metadata for Hyderabad high-rise positioning | M1 | ORIGINAL_REQUEST §R6 |
| 5 | R1.HeroFullscreen | Full-screen hero section with dark `#1C130B` base | M2 | ORIGINAL_REQUEST §R1 |
| 6 | R1.HeroAmbientBlobs | Animated ambient gold gradient blobs in hero background | M2 | ORIGINAL_REQUEST §R1 |
| 7 | R1.HeroWordStagger | Word-by-word stagger reveal animation for "Premium Home Makeovers in 48 Hours." | M2 | ORIGINAL_REQUEST §R1 |
| 8 | R1.HeroStatPills | 3 floating animated stat pills ("247 Flats Done", "4.9★ Rating", "48hr Guarantee") with stagger | M2 | ORIGINAL_REQUEST §R1 |
| 9 | R1.HeroCTAsAndBadges | Preserve 2 CTA buttons (scroll to estimator/gallery) and 3 trust badges (48hr, zero civil, swatch van) | M2 | ORIGINAL_REQUEST §R1 |
| 10 | R2.BeforeAfterSlider | Draggable clip-path / CSS before/after slider with mouse & touch drag support | M2 | ORIGINAL_REQUEST §R2 |
| 11 | R2.BeforeAfterRoomToggle | Tab toggle switching between Living Room and Bedroom | M2 | ORIGINAL_REQUEST §R2 |
| 12 | R2.BeforeAfterGradients | Builder finish (grey/white tones) vs After AuroMakeover (gold/brown luxury tones) | M2 | ORIGINAL_REQUEST §R2 |
| 13 | R3.MasonryGallery | Masonry-style grid with alternating card heights (`aspect-[4/5]` and `aspect-[3/4]`) | M3 | ORIGINAL_REQUEST §R3 |
| 14 | R3.3DTiltEffect | CSS 3D tilt effect on card hover using Framer Motion motion values | M3 | ORIGINAL_REQUEST §R3 |
| 15 | R3.ExpandedCatalog | 8 design items covering all 4 categories (Botanical, Fluted Louver, Neo-Classical, Temple Pichwai — 2 each) | M3 | ORIGINAL_REQUEST §R3 |
| 16 | R3.AnimatedFilterUnderline | Category filter with smooth animated indicator underline | M3 | ORIGINAL_REQUEST §R3 |
| 17 | R4.SocietyCards | Horizontal scroll of 4 society cards (My Home Bhooja, Aparna Sarovar Zenith, Rajapushpa Provincia, Prestige High Fields) | M3 | ORIGINAL_REQUEST §R4 |
| 18 | R4.SocietyStatsAndCTA | Each card shows name, "47 flats done 🔥", unit type, est price range, and "Check My Flat →" button | M3 | ORIGINAL_REQUEST §R4 |
| 19 | R5.AutoScrollingTicker | Horizontally auto-scrolling ticker above estimator with rotating stats and micro-testimonials | M4 | ORIGINAL_REQUEST §R5 |
| 20 | R5.EstimatorWizard | Redesign `EstimatorGateway.tsx` into 3-step wizard (Step 1: Room Size, Step 2: Finish Tier, Step 3: Book) | M4 | ORIGINAL_REQUEST §R5 |
| 21 | R5.AnimatedPriceCounter | Price display animates number counting up when value changes | M4 | ORIGINAL_REQUEST §R5 |
| 22 | R5.WhatsAppDirectCTA | WhatsApp button opens `https://wa.me/919700675637` with pre-filled estimate details | M4 | ORIGINAL_REQUEST §R5 |
| 23 | R5.PreserveEngines | 100% preservation of mathematical logic in `src/lib/engines.ts` | M4 | ORIGINAL_REQUEST §R5 |
| 24 | R6.LuxuryFooter | Redesigned footer with logo, "2-Year Warranty" badge, 5 service areas, copyright, social links | M4 | ORIGINAL_REQUEST §R6 |
| 25 | R6.PageComposition | Full homepage integration in `src/app/page.tsx` with smooth section scrolling | M4 | ORIGINAL_REQUEST §R6 |
| 26 | E2E.SuiteVerification | Pass 100% of opaque-box E2E test suite (Tiers 1-4) | M5 | Acceptance Criteria |
| 27 | E2E.AdversarialHardening | Tier 5 adversarial stress testing and coverage hardening | M5 | Project Pattern Phase 2 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Global Foundation & Polish | Fix layout typing, load Google fonts, setup Tailwind v4 theme & base typography | none | PLANNED |
| M2 | Hero & Before/After Showcase | Build cinematic hero with word stagger & blobs, build before/after draggable slider | M1 | PLANNED |
| M3 | Design Gallery & Society Section | Build masonry grid with 3D tilt & 8 items, build 4 society cards with smooth scroll | M1 | PLANNED |
| M4 | Ticker, Estimator Wizard & Footer | Build auto-scrolling ticker, 3-step wizard with animated price counter & WhatsApp, luxury footer | M1, M2, M3 | PLANNED |
| M5 | Final E2E Integration & Verification | Pass 100% E2E test suite, adversarial coverage hardening, zero build/type errors | M1, M2, M3, M4 | PLANNED |

## Interface Contracts
### `src/lib/engines.ts` ↔ `EstimatorGateway.tsx`
- `calculateRollNesting(input: RollNestingInput): RollNestingOutput`
  - Input: `{ wallWidthFt: number, wallHeightFt: number, rollWidthInches: number, patternRepeatInches: number }`
  - Output: `{ totalVerticalDrops, matchingWasteInches, requiredContinuousMeters, totalSqFtRequired, totalSqFtWithBuffer }`
- `calculateDynamicPricing(input: PricingInput): PricingOutput`
  - Input: `{ rawMaterialBasePerSqFt: number, totalSqFtRequired: number, isSmartMotorized: boolean }`
  - Output: `{ materialCost, primerCost, installationLaborCost, subtotal, gstAmount, totalRetailPrice, escrowTranches: { deposit10, materialRelease60, postQAUnlock30 } }`

### Hero / Society Cards ↔ Estimator
- Anchor target: `#estimator` in `src/app/page.tsx`
- Event dispatch: `window.dispatchEvent(new CustomEvent('auro:select-society', { detail: { society: string } }))` for pre-selecting society in wizard.

## Code Layout
- `src/app/layout.tsx`: Root layout, Google fonts, metadata, global HTML tags
- `src/app/globals.css`: Tailwind v4 import, font imports, @theme palette tokens, base typography
- `src/app/page.tsx`: Landing page composition
- `src/components/HeroSection.tsx`: R1 Cinematic Hero
- `src/components/BeforeAfterShowcase.tsx`: R2 Before/After interactive slider
- `src/components/DesignGallery.tsx`: R3 Masonry gallery with 3D tilt
- `src/components/SocietyPreMeasured.tsx`: R4 Society pre-measured cards
- `src/components/StatsTicker.tsx`: R5 Auto-scrolling micro-testimonial ticker
- `src/components/EstimatorGateway.tsx`: R5 3-step estimator wizard with animated price counter
- `src/components/Footer.tsx`: R6 Luxury footer with warranty badge & corridor list
- `src/lib/engines.ts`: Unchanged calculation engines
