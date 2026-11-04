# Aura Makeover — Master Platform Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Aura Makeover platform from a baseline landing page into an authoritative, agent-driven luxury surface transformation suite featuring all 6 interactive applications, deterministic mathematical engines, live BOM drawer, and verified WhatsApp gate pass workflows.

**Architecture:** 
3-layer separation enforcing the **B.L.A.S.T.** protocol:
1. Pure deterministic math engines in `src/lib/` (roll nesting, solar lux, dynamic pricing, disruption delta, and high-rise rental yield).
2. Next.js 16 App Router presentation components styled with Tailwind CSS v4 design tokens (`#1C130B`, `#C5A880`, `#8A5836`, `#FAF8F5`, `rounded-2xl/3xl`).
3. Resilient API layer on Vercel Serverless with asynchronous GPU inpainting callbacks, PostgreSQL via PgBouncer/Prisma proxy, and direct WhatsApp lead routing (`919700675637`).

**Tech Stack:** Next.js 16.3.5 (App Router + Turbopack) · React 19.2.8 · Tailwind CSS v4 · TypeScript 5 · GSAP 3.15 + ScrollTrigger · Framer Motion 13 · Prisma 7/8 · Lucide React

---

## Global Constraints

- **Palette Invariants:** Only `#1C130B` (Espresso), `#C5A880` (Gold), `#8A5836` (Terracotta), `#FAF8F5` (Linen), `#15803D` (WhatsApp Green), `#3E2C1E` (Royal Bronze), `#C9CDD4` (Silver Alloy).
- **Corner Radii Invariant:** Strictly `rounded-2xl`, `rounded-3xl`, or `rounded-full`. Zero `rounded-sm` anywhere (Test R6-B5).
- **Typography Invariant:** Headings use `Syne` (`var(--font-heading)`), body uses `Plus Jakarta Sans`, editorial accents use `Yeseva One` (`var(--font-yeseva)`).
- **Engine Purity:** Functions in `src/lib/engines.ts` are strictly pure, synchronous, side-effect free, and have fixed signatures (Test R5.3). New calculation engines must live in dedicated files (`disruption-engine.ts`, `roi-engine.ts`).
- **Test Suite Contract:** Never break or delete literal string assertions in `scripts/test-e2e.mjs` (e.g. `"48hr Guarantee"`, `"48 Hours"`, `"48-Hour Method"`, `919700675637`). Retain them in secondary trust badges.
- **Image Disk Rule:** Every image path `/images/*` referenced in JSX must exist on disk in `public/images/` (Test R9.4).
- **Client/Server Boundary:** Interactive UI components must declare `"use client"` at the top; 3D or canvas elements must be guarded against SSR.

---

## Review Focus

1. **Serverless Concurrency & Timeout:** AI diffusion jobs must not block Next.js serverless routes; long jobs must be handled asynchronously via external GPU webhooks and client polling.
2. **Mobile Cross-Platform AR:** Never rely on native WebXR camera passthrough on iOS Safari; use 2.5D client perspective quad (homography) for 100% device compatibility.
3. **Local Dev Resiliency:** All API calls must gracefully handle offline/unseeded local Prisma state with client fallback to direct WhatsApp handoff.
4. **Uninterrupted E2E Gates:** Every task must exit with `node scripts/test-e2e.mjs` (117/117 green), `npx tsc --noEmit` (0 errors), and `npm run lint` (0 errors).
5. **Dye-Lot Splitting Protection:** Contiguous wall surface calculations must validate continuous yardage from a single CMYK lot.

---

## Task Decomposition

### Task 1: Pure Mathematical Computation Engines
**Goal:** Create deterministic calculation engines for civil renovation disruption and West Hyderabad rental ROI without touching the existing `src/lib/engines.ts` signatures.

- [ ] **Step 1.1: Implement `src/lib/disruption-engine.ts`**
  - Define interfaces: `DisruptionInput` (`roomCount`, `isLivingInFlat`, `currentFinishState`, `customMonthlyRent`).
  - Define output: `DisruptionOutput` (`airbnbRelocationCost`, `deepCleaningCost`, `contractorDelayBufferCost`, `productivityLossCost`, `totalCivilDisruptionCost`, `auraZeroCivilCost`, `netRupeeSavings`, `daysDisruptedCivil`, `daysDisruptedAura`).
  - Constants: Base Airbnb rent in Kokapet = ₹2,000/day; civil timeline = 45 days; Aura timeline = 2.5 days; deep cleaning = ₹8,000.
- [ ] **Step 1.2: Implement `src/lib/roi-engine.ts`**
  - Define society constants table:
    - *My Home Bhooja:* Base Rent ₹95,000/mo, Post-Makeover ₹1,15,000/mo (Lift +₹20k/mo).
    - *Rajapushpa Provincia:* Base Rent ₹60,000/mo, Post-Makeover ₹75,000/mo (Lift +₹15k/mo).
    - *Prestige High Fields:* Base Rent ₹55,000/mo, Post-Makeover ₹68,000/mo (Lift +₹13k/mo).
    - *Aparna Sarovar Zenith:* Base Rent ₹50,000/mo, Post-Makeover ₹62,000/mo (Lift +₹12k/mo).
  - Define function: `calculateWestHydRentalROI(input: RentalROIInput): RentalROIOutput`.
  - Computes: Monthly rent premium, capex outlay, payback duration (months), 3-year net wealth gain, and annual yield percentage increase.
- [ ] **Step 1.3: Add Unit Tests in `tests/engines.test.ts`**
  - Verify deterministic math, zero NaN, boundary cases (0 rooms, extreme rent).
- [ ] **Step 1.4: Run Quality Gate 1 & 2**
  - Run: `node scripts/test-e2e.mjs` (117/117).
  - Run: `npx tsc --noEmit` (0 errors).

---

### Task 2: Sticky Live Bill of Materials (BOM) Drawer
**Goal:** Build and integrate a real-time, docking Bill of Materials tray into `EstimatorGateway.tsx` that exposes exact material drops, waste, and 10/60/30 escrow tranche milestones.

- [ ] **Step 2.1: Create `src/components/estimator/StickyBOMDrawer.tsx`**
  - Props: `widthFt`, `heightFt`, `finishTier`, `isSmartMotorized`, `pricingOutput`, `nestingOutput`.
  - State: `isExpanded: boolean` (toggleable floating dock).
  - Visual layout:
    - Collapsed bar: Summary line with dimensions, total price, and 10% booking deposit indicator.
    - Expanded drawer: Full breakdown table showing:
      - Vertical drops count & pattern waste inches
      - Exact wall sq.ft + 11% safety buffer
      - Raw material cost, primer (₹15/sq.ft), labor (₹25/sq.ft), motorization (₹15k)
      - Statutory 18% GST calculation
      - Interactive **Escrow Tranche Progress Bar**: 10% (Deposit) $\rightarrow$ 60% (Material Dispatch) $\rightarrow$ 30% (Post-QA Handover).
- [ ] **Step 2.2: Integrate into `src/components/EstimatorGateway.tsx`**
  - Mount `StickyBOMDrawer` inside `EstimatorGateway.tsx` with smooth Framer Motion slide-up animation.
- [ ] **Step 2.3: Verification**
  - Verify responsive behavior on mobile and desktop.
  - Run: `node scripts/test-e2e.mjs` (117/117).
  - Run: `npx tsc --noEmit` (0 errors).

---

### Task 3: Zero-Civil vs. Traditional Renovation Cost & Disruption Comparator
**Goal:** Build `src/components/RenovationComparator.tsx` featuring an interactive side-by-side financial and lifestyle disruption comparison.

- [ ] **Step 3.1: Create `src/components/RenovationComparator.tsx`**
  - Top Controls:
    - Segmented persona pill: `[● Living in Flat (Owner)]` vs `[○ Vacant Investment (Landlord)]`.
    - Room scope selector: `1 Feature Wall`, `Living + Dining`, `Full 3BHK Master Suite`.
  - Comparison Grid:
    - Left Column (Traditional Civil Renovation): Red warning badges, 45–60 days disruption, noise/demolition debris, society NOC friction, temporary accommodation expenses.
    - Right Column (Aura Zero-Civil Makeover): Warm Gold badges, 2–3 days rapid mechanical mount, zero structural dust, 100% live-in friendly, 2-Year Warranty.
  - Animated Delta Summary:
    - Live comparison counters powered by `calculateRenovationDisruption()`.
    - CTA: "Lock My Zero-Civil Quote →" (smooth-scrolls to `#estimator`).
- [ ] **Step 3.2: Verification**
  - Comply with design tokens: `#1C130B`, `#C5A880`, `#FAF8F5`, `rounded-3xl`.
  - Run: `node scripts/test-e2e.mjs` (117/117).
  - Run: `npx tsc --noEmit` (0 errors).

---

### Task 4: West Hyderabad Rental Yield & ROI Calculator
**Goal:** Build `src/components/RentalYieldCalculator.tsx` specifically tailored for high-rise landlords in Kokapet, Financial District, and Tellapur.

- [ ] **Step 4.1: Create `src/components/RentalYieldCalculator.tsx`**
  - Inputs:
    - High-Rise Society Dropdown (*My Home Bhooja*, *Rajapushpa Provincia*, *Prestige High Fields*, *Aparna Sarovar Zenith*).
    - Unit Configuration (2BHK, 3BHK, 4BHK Penthouse).
    - Transformation Package (*Standard Canvas*, *Executive Fluted Louver*, *Presidential Acoustic Slat*).
  - Output Telemetry Cards:
    - Monthly Rental Lift (e.g. `+ ₹18,000 / month`).
    - Capex Payback Horizon (e.g. `6.8 Months`).
    - 3-Year Net Wealth Generation (`₹5,40,000`).
    - Vacancy Reduction Rating (`94% Faster Tenant Placement`).
  - Terminal Investor CTA:
    - Dedicated "Book Turnkey Investor Consultation" modal trigger (dispatches direct WhatsApp lead with society & unit details).
- [ ] **Step 4.2: Verification**
  - Run: `node scripts/test-e2e.mjs` (117/117).
  - Run: `npx tsc --noEmit` (0 errors).

---

### Task 5: Smart Home Shading & Architectural Lighting Configurator
**Goal:** Build `src/components/SmartLightingConfigurator.tsx` for multi-window Matter/Zigbee motorized shading and surface cove LED extrusions.

- [ ] **Step 5.1: Create `src/components/SmartLightingConfigurator.tsx`**
  - Controls:
    - Window Count Stepper (`1` to `8` windows).
    - Compass Orientation Dial (0° North, 90° East, 180° South, 270° West).
    - Floor Level Selector (`1` to `45` floors).
  - Embedded Intelligence:
    - Runs `analyzeSolarLux({ compassAngleDegrees, floorNumber })`.
    - Automatically recommends *Double-cell Honeycomb Blinds* or *Motorized Blackout* when West/SW high-floor conditions are met.
  - Zero-Ceiling Cove Lighting Add-on:
    - Surface-mounted 3000K warm architectural LED extrusion toggle (running feet selector).
  - Action: Prefills estimator state or triggers quote lock.
- [ ] **Step 5.2: Verification**
  - Run: `node scripts/test-e2e.mjs` (117/117).
  - Run: `npx tsc --noEmit` (0 errors).

---

### Task 6: Swatch Van Dispatch & WhatsApp Gate Pass Flow
**Goal:** Build `src/components/SwatchVanBookingModal.tsx` and the WhatsApp handoff service.

- [ ] **Step 6.1: Create `src/lib/services/AiSensyService.ts`**
  - Direct WhatsApp URL builder with lead payload.
  - Pre-formatted MyGate / NoBrokerHood entry pass template generator:
    ```
    "Visitor: AuroMakeover Mobile Van\nVehicle: TS 09 UB 1234\nTechnician: Ramesh Kumar\nPurpose: Pre-Measured Wall Consultation\nSociety: My Home Bhooja"
    ```
- [ ] **Step 6.2: Create `src/components/SwatchVanBookingModal.tsx`**
  - Date & slot picker (Morning 10 AM – 1 PM, Afternoon 2 PM – 5 PM).
  - Society & flat number input.
  - 1-tap "Copy MyGate Pass" button with clipboard feedback.
  - "Confirm Van Booking via WhatsApp" CTA opening `919700675637`.
- [ ] **Step 6.3: Verification**
  - Run: `node scripts/test-e2e.mjs` (117/117).
  - Run: `npx tsc --noEmit` (0 errors).

---

### Task 7: 2.5D Client Canvas Perspective Visualizer
**Goal:** Build `src/components/HomographyCanvasVisualizer.tsx` providing zero-app, cross-platform wall transformation previewing without WebXR crashes.

- [ ] **Step 7.1: Create `src/components/HomographyCanvasVisualizer.tsx`**
  - File upload / sample room photo selector.
  - Interactive 4-point corner quad overlay (drag points to align with room wall corners).
  - HTML5 2D Canvas perspective matrix transform mapping target swatches (*Fluted Louver*, *Temple Pichwai*, *Botanical Linen*) onto user wall.
  - Ambient Day/Night lighting slider adjusting canvas composite brightness and warmth (3000K ambient glow).
  - CTA: "Apply This Finish to Quote" $\rightarrow$ sends prefill event to Estimator.
- [ ] **Step 7.2: Decoupled AI Pipeline Contract**
  - Ensure `/api/ai/restyle/route.ts` remains purely asynchronous via external GPU polling, never running local SAM models inside Vercel.
- [ ] **Step 7.3: Verification**
  - Run: `node scripts/test-e2e.mjs` (117/117).
  - Run: `npx tsc --noEmit` (0 errors).

---

### Task 8: Layout Integration, Dedicated Routes & Quality Verification
**Goal:** Wire the new components into the homepage and dedicated deep-link routes while maintaining section alternation and all E2E test assertions.

- [ ] **Step 8.1: Create Dedicated Deep-Link Pages**
  - `src/app/comparator/page.tsx` (Direct route for ad campaigns focusing on zero-civil disruption).
  - `src/app/roi/page.tsx` (Direct route for NRI landlords & high-rise investors).
- [ ] **Step 8.2: Integrate into `src/app/page.tsx`**
  - Carefully mount `RenovationComparator` above the Estimator and ensure alternating light/dark rhythm.
  - Preserve all existing section order rules tested by R12.7.
- [ ] **Step 8.3: Verification of all 4 Acceptance Gates**
  - Gate 1: `node scripts/test-e2e.mjs` (117/117 green).
  - Gate 2: `npx tsc --noEmit` (0 errors).
  - Gate 3: `npm run lint` (0 errors).
  - Gate 4: `npm run build` (Clean production SSR build).

---

### Task 9: Notion Workspace & GitHub Documentation Sync
**Goal:** Package all architecture blueprints, design tokens, mathematical formulas, and operational runbooks for immediate GitHub and Notion export.

- [ ] **Step 9.1: Consolidate GitHub Documentation in `docs/`**
  - `docs/ARCHITECTURE.md` (System overview, pure calculation engines, database schema, and serverless physics).
  - `docs/DESIGN_SYSTEM.md` (Design tokens, palette, typography, radii invariants, and motion rules).
  - `docs/APPLICATIONS_SUITE.md` (Detailed specs for all 6 interactive tools).
- [ ] **Step 9.2: Create Notion-Ready Markdown Package**
  - Export a single, fully structured Notion import document (`docs/NOTION_MASTER_WORKSPACE_IMPORT.md`) with copyable callouts, toggle lists, database schemas, and startup positioning briefs.
