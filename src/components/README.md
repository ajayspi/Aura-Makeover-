# Component Package (`src/components`)

## Overview
Presentation components executing the AuroMakeover design system, interactive showcases, mathematical quoting widgets, and trust engineering surfaces.

## Interface
- `HeroSection`: Full-screen espresso section with word-by-word stagger headline, gold blur gradients, and stat pills.
- `BeforeAfterShowcase`: Touch and mouse draggable image comparison slider revealing the AuroMakeover difference over builder distemper.
- `BeforeAfterGrid`: 16-cell 4x4 master showcase grid of 15 verified same-space paired transformations plus 1 estimator CTA card.
- `DesignGallery`: Masonry gallery grid featuring 3D card tilt physics and client-side category filtering.
- `SocietyPreMeasured`: Horizontal snapping scroll band of pre-measured high-rise floor plans with live event dispatching.
- `EstimatorGateway`: 3-step live pricing wizard embedding the deterministic nesting and dynamic pricing calculation engines.
- `ProductShowcase`: Metallic foil finished cards featuring luxury materials on a deep royal bronze background.
- `HowItWorks`: Step-by-step visual roadmap breaking down the zero-civil transformation method.
- `Reviews` & `TestimonialMarquee`: 5-star customer testimonials with verified gated society resident reviews.
- `OfferBanner`: Sticky top notification banner with session-persisted dismissal.
- `Footer`: Site footer with 2-Year Warranty badge, 5 marquee Hyderabad West localities, and quick navigation anchors.
- `RenovationComparator` (Required Phase 1): Side-by-side civil vs zero-civil disruption and financial delta comparator.
- `RentalYieldCalculator` (Required Phase 2): Kokapet/Financial District landlord capex payback and rental appreciation model.
- `StickyBOMDrawer` (Required Phase 3): Docked real-time Bill of Materials tray with 10/60/30 escrow telemetry.
- `SwatchVanBookingModal` (Required Phase 4): High-rise society slot booking and 1-tap WhatsApp MyGate entry pass handoff.
- Subdirectories:
  - [Estimator](./estimator/README.md): Decomposed 3-step wizard steps and animated price counters.
  - [Animations](./animations/README.md): GSAP ScrollTrigger counters and visual pacing elements.
  - [Admin](./admin/README.md): Internal ops board and pipeline management.
  - [Technician](./technician/README.md): On-site intake and measurement tools.

## Invariants
- Palette compliance: All components strictly adhere to designated design tokens (`#1C130B`, `#C5A880`, `#8A5836`, `#FAF8F5`, `#15803D`, `#3E2C1E`, `#C9CDD4`).
- Geometry compliance: Zero occurrences of sharp `rounded-sm`; exclusively `rounded-2xl`, `rounded-3xl`, and `rounded-full`.
- Image asset integrity: Every referenced `/images/*` path must exist on disk in `public/images/`.

## Side Effects
- Dispatches custom browser events (`auro:select-society`, `auro:estimator-prefill`) for seamless cross-component communication.

## Verification
- Run: `node scripts/test-e2e.mjs`
