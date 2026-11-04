# Core Library & Calculation Engines (`src/lib`)

## Overview
Foundation libraries, deterministic math calculation engines, client-safe GSAP wrappers, dynamic Prisma proxies, and lead assignment routing algorithms powering the AuroMakeover platform.

## Interface
- `calculateRollNesting(input)`: Computes vertical drops, pattern matching waste, total linear meters, and 11% safety buffer area.
- `analyzeSolarLux(input)`: Analyzes compass degrees and floor height to recommend cellular or 100% motorized blackout blinds.
- `calculateDynamicPricing(input)`: Computes base material, ₹15 primer, ₹25 labor, 18% GST, and 10/60/30 escrow tranche splits.
- `registerGsap()`: Client-side singleton registering GSAP core and ScrollTrigger plugin safely without SSR hydration errors.
- `prisma`: Dynamic resilient Prisma proxy providing fallback mock resolution during static builds and active PostgreSQL querying in production.
- `routeLead(roster, criteria)`: Pure round-robin and weighted sales agent assignment algorithm.
- `normalizeLeadPhone(phone)` & `isValidLeadPhone(phone)`: Indian phone number normalization handling +91 prefixes and 10-digit formats.
- `recommendPackage(answers)` & `recommendToPrefill(pkg)`: Maps style questionnaire answers to curated finish tiers and budget floors.
- Subdirectories:
  - [Services](./services/README.md): Customer lifecycle state machines, AiSensy WhatsApp dispatch, and lead scoring.
  - [Infrastructure](./infrastructure/README.md): Asynchronous pub/sub Domain Event Bus and event listeners.

## Invariants
- `engines.ts`: All calculation functions are pure, mathematical, and deterministic with zero database, disk, or network I/O.
- `calculateRollNesting`: Always applies a minimum 11% safety buffer over exact wall dimensions (`wallWidthFt * wallHeightFt * 1.11`).
- `calculateDynamicPricing`: Tranche 1 (10%) + Tranche 2 (60%) + Tranche 3 (30%) strictly equals `totalRetailPrice`.
- `gsap.ts`: Never executes plugin registration when `typeof window === 'undefined'`.

## Side Effects
- `prisma.ts`: Connects to PostgreSQL database via connection pooling when valid database credentials exist.

## Verification
- Run: `node scripts/test-e2e.mjs`
