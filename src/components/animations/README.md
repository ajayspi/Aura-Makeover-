# Animation Components (`src/components/animations`)

## Overview
High-performance visual interaction primitives driven by GSAP 3.15 ScrollTrigger and Framer Motion for scroll-linked telemetry and visual pacing.

## Interface
- `AnimatedCounter`: GSAP ScrollTrigger-driven numeric tween counting upwards with Warm Gold digits upon entering the viewport.
- `AnimatedIcon`: Framer Motion micro-interaction wrapper for SVG icons.
- `HyperframeSequence`: Canvas / sequence player for frame-by-frame product exploration.

## Invariants
- `AnimatedCounter`: Must register ScrollTrigger once via `registerGsap()` and respect system reduced-motion preferences.
- Zero layout shifts (CLS) on initial mount.

## Side Effects
- Mutates DOM node textContent and SVG transform attributes during scroll execution.

## Verification
- Run: `node scripts/test-e2e.mjs`
