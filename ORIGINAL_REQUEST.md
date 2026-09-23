# Original User Request

## 2026-09-21T01:32:26+05:30

AuroMakeover is a premium 48-hour home makeover service targeting Hyderabad's high-rise flat market. This is a complete Phase 1 homepage redesign of an existing Next.js 15 + Tailwind CSS v4 + Framer Motion 13 codebase. The goal is a stunning, cinematic, conversion-focused landing page that feels unmistakably luxury. The existing business logic engines (`src/lib/engines.ts`) and component structure must be preserved and extended — do not break existing functionality.

Working directory: `c:\Users\vigilare\Aura\auro-makeover`

Integrity mode: demo (team may add npm packages; do not copy core logic from other open-source projects)

**Design system — strictly enforce throughout:**
- Colors: `#1C130B` (dark espresso), `#C5A880` (warm gold), `#8A5836` (terracotta brown), `#FAF8F5` (linen off-white), `#15803D` (WhatsApp green)
- Headings: `font-['Syne']` (bold/black weight)
- Body: `font-['Plus_Jakarta_Sans']` (medium weight)
- Corners: `rounded-2xl` or `rounded-3xl` only — no sharp corners anywhere
- Imagery: use gradient placeholders (dark-to-gold) for before/after images — real photos will be swapped in later

## Requirements

### R1. Cinematic Hero Section
Replace the current hero with a full-screen section. The headline "Premium Home Makeovers in 48 Hours." must animate in with a Framer Motion word-by-word stagger reveal on load. The background should use a dark `#1C130B` base with animated ambient gold gradient blobs (using CSS animation or Framer Motion). Add 3 floating animated stat pills that appear with a stagger delay (e.g., "247 Flats Done", "4.9★ Rating", "48hr Guarantee"). Keep the two CTA buttons and trust badges from the existing component.

### R2. Before/After Interactive Showcase Section
Add a new section below the hero titled "The AuroMakeover Difference". Build a draggable clip-path or CSS-based before/after slider for at least 2 room types (Living Room, Bedroom). The "before" side shows a plain gradient (grey/white tones, label "Builder Finish") and the "after" side shows a warm luxury gradient (gold/brown tones, label "After AuroMakeover"). The slider handle must be draggable on both desktop (mouse) and mobile (touch). Add a tab or toggle to switch between room types.

### R3. Upgraded Design Gallery (Masonry + Tilt)
Upgrade the existing `DesignGallery.tsx` to a masonry-style grid (alternating card heights, e.g., `aspect-[4/5]` and `aspect-[3/4]`). Add a CSS 3D tilt effect on hover (use `react-tilt` or a custom Framer Motion `useMotionValue` + `rotateX/rotateY` approach). Expand design entries to 8 items covering all 4 categories (Botanical, Fluted Louver, Neo-Classical, Temple Pichwai — 2 per category). Keep the category filter with a smooth animated indicator underline.

### R4. Society-Specific Value Section
Add a new section titled **"Your Society, Pre-Measured"** with a horizontal scroll of 4 cards for: My Home Bhooja, Aparna Sarovar Zenith, Rajapushpa Provincia, Prestige High Fields. Each card must show: society name, a fire emoji stat ("47 flats done 🔥"), unit type ("3BHK Standard"), and a pre-estimated price range (e.g., "Est. ₹38,000–₹55,000") with a "Check My Flat →" button that scrolls to the estimator.

### R5. Animated Ticker + 3-Step Estimator Wizard
Add a horizontally auto-scrolling ticker above the estimator section showing rotating stats and micro-testimonials (e.g., "Priya K., My Home Bhooja — '5 stars, done in 1 day!'"). Redesign the `EstimatorGateway.tsx` into a 3-step wizard with a step progress indicator at the top (Step 1: Room Size, Step 2: Finish Tier, Step 3: Book). The price display must animate the number counting up when the value changes (use Framer Motion `animate` or a counter animation). The WhatsApp CTA button must open `https://wa.me/919700675637` with a pre-filled message containing the estimate details. Do not break the underlying pricing/nesting engine logic.

### R6. Footer + Metadata + Global Polish
Redesign the footer with the AuroMakeover logo, a "2-Year Warranty" badge, service areas list (Kokapet, Tellapur, Financial District, Nallagandla, Gachibowli), copyright, and social link placeholders. Update `layout.tsx` metadata: title = "AuroMakeover — Premium Home Makeovers in 48 Hours | Hyderabad", description = "Luxury wallpapers, fluted louvers & smart blinds installed in 48 hours. Zero civil work. Serving Kokapet, Tellapur & Financial District." Fix the `LayoutProps<"/">` TypeScript error — replace with `{ children: React.ReactNode }`. Add Google Fonts import for Syne and Plus Jakarta Sans if not already loading correctly.

## Acceptance Criteria

### Build
- [ ] `npm run build` completes with zero errors from the `c:\Users\vigilare\Aura\auro-makeover` directory
- [ ] `npx tsc --noEmit` reports zero TypeScript errors

### Animations & Interactivity
- [ ] Hero headline animates word-by-word on page load (visible stagger, not instant)
- [ ] Before/after slider handle is draggable and the clip-path or reveal updates in real time
- [ ] Design gallery cards show a visible 3D tilt on mouse hover
- [ ] Estimator price number visibly animates/counts when sliders change

### Functionality
- [ ] Category filter in gallery correctly shows/hides cards without page reload
- [ ] "Get Instant Quote" / "Check My Flat →" buttons scroll smoothly to the estimator
- [ ] WhatsApp button opens `https://wa.me/919700675637` with a pre-filled text containing the estimate amount
- [ ] Estimator wizard step navigation (Next / Back) works correctly

### Design Consistency
- [ ] No color outside the defined palette (`#1C130B`, `#C5A880`, `#8A5836`, `#FAF8F5`, `#15803D`) on any component
- [ ] No sharp corners (`rounded` or `rounded-sm`) — all elements use `rounded-2xl` or larger
- [ ] Syne font renders on all headings, Plus Jakarta Sans on all body text

### Correctness
- [ ] No `LayoutProps<"/">` TypeScript usage anywhere in the codebase
- [ ] All images use Next.js `<Image>` with `alt` text and proper `sizes` prop

---

> **Expecting:** Full team build — multiple components being rebuilt and added in parallel.
