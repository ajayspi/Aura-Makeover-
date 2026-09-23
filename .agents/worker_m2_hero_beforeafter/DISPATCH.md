## 2026-09-21T01:45:10+05:30

Worker M2 Assignment:
Cinematic Hero Section and Before/After Interactive Showcase.

Working directory: c:\Users\vigilare\Aura\auro-makeover\.agents\worker_m2_hero_beforeafter
Project directory: c:\Users\vigilare\Aura\auro-makeover
Original Request: c:\Users\vigilare\Aura\auro-makeover\.agents\ORIGINAL_REQUEST.md
Project Scope: c:\Users\vigilare\Aura\auro-makeover\PROJECT.md
Survey Handoff to read: c:\Users\vigilare\Aura\auro-makeover\.agents\explorer_survey_3\handoff.md

EXCLUSIVE FILE OWNERSHIP:
- `src/components/HeroSection.tsx`
- `src/components/BeforeAfterShowcase.tsx`
Do NOT modify any other files.

TASKS:
1. `src/components/HeroSection.tsx` (R1):
   - Replace current hero with full-screen section (`min-h-screen`, `bg-[#1C130B]`, text `#FAF8F5`, `rounded-b-[2.5rem] md:rounded-b-[3.5rem]`).
   - Headline: "Premium Home Makeovers in 48 Hours." animating in with Framer Motion word-by-word stagger reveal on load. Words "48 Hours." highlighted in `#C5A880`.
   - Background: dark `#1C130B` base with animated ambient gold/terracotta gradient blobs (using Framer Motion `<motion.div>` loops with blur).
   - 3 floating animated stat pills appearing with stagger delay:
     - "247 Flats Done"
     - "4.9★ Rating"
     - "48hr Guarantee"
     - Styled with `bg-[#FAF8F5]/10 border border-[#C5A880]/30 rounded-2xl` and floating animation.
   - Keep 2 CTA buttons:
     - "Get Instant Quote" -> smoothly scrolls to `#estimator`.
     - "View Lookbook" -> smoothly scrolls to `#gallery`.
   - Keep 3 trust badges in `rounded-2xl` containers:
     - 48-Hour Install (`Clock`)
     - Zero Civil Work (`ShieldCheck`)
     - Design-on-Wheels (`Truck`)
   - Strict palette: only `#1C130B`, `#C5A880`, `#8A5836`, `#FAF8F5`, `#15803D`.
   - Corners: strictly `rounded-2xl` or `rounded-3xl` (no `rounded-sm` or basic `rounded`).

2. `src/components/BeforeAfterShowcase.tsx` (R2):
   - Section titled "The AuroMakeover Difference" with subtitle describing 48hr transformation.
   - Draggable clip-path / CSS before/after slider for at least 2 room types: "Living Room" and "Bedroom".
   - Room switcher tabs with animated pill toggle.
   - "Before" side shows plain gradient (grey/white tones, badge "Builder Finish (Bare Distemper)").
   - "After" side shows warm luxury gradient (gold/brown/espresso tones, badge "After AuroMakeover (Luxury Suite)").
   - Draggable handle in center with grab icon, draggable on desktop (mouse: `onMouseDown`, global mousemove/mouseup) and mobile (touch: `onTouchStart`, `onTouchMove`, `onTouchEnd`).
   - Corners: `rounded-3xl` container, `rounded-2xl` badges and buttons.

VERIFICATION:
- Run `npx tsc --noEmit` to verify type safety.
- Update `progress.md` with timestamps.
- Write handoff report to `c:\Users\vigilare\Aura\auro-makeover\.agents\worker_m2_hero_beforeafter\handoff.md`.
- Send completion message via `send_message` to orchestrator.
