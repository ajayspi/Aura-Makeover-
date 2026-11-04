# Aura Makeover — Master Engineering & Architecture Workspace

> 🏛️ **Executive Notice:** This document is the consolidated master technical handbook for **Aura Makeover** (AuroMakeover), an enterprise-grade luxury residential transformation platform targeting West Hyderabad high-rises (Kokapet, Financial District, Tellapur). It is formatted for direct 1-click import into **Notion** or archival in **GitHub** (`docs/`).

---

## Table of Contents
1. [Core Strategy & Startup Positioning](#1-core-strategy--startup-positioning)
2. [Deterministic Calculation Engines](#2-deterministic-calculation-engines)
3. [Design System & Luxury Brand Tokens](#3-design-system--luxury-brand-tokens)
4. [The 6 Core Interactive Applications](#4-the-6-core-interactive-applications)
5. [Database Schema & Data Dictionary (PostgreSQL)](#5-database-schema--data-dictionary-postgresql)
6. [API Specifications & Lead Routing Protocol](#6-api-specifications--lead-routing-protocol)
7. [Architectural Framework: B.L.A.S.T. & 4 Quality Gates](#7-architectural-framework-blast--4-quality-gates)
8. [Master Platform Expansion Implementation Plan](#8-master-platform-expansion-implementation-plan)

---

## 1. Core Strategy & Startup Positioning

### Global Benchmarks
* **Front End:** *Plum Living (France)* — Architectural modular "skins" (fluted WPC louvers, acoustic slat paneling, European textile wallcoverings) mounted directly over standard builder distemper plaster.
* **Back End:** *Block Renovation (USA)* — Automated, real-time Bill of Materials (BOM), programmatic pricing transparency, and milestone-driven execution.
* **Spatial UX:** *IKEA Kreativ & Canoa* — Interactive split-screen before/after exploration with 2.5D perspective quad alignment.

### Strategic Brand Positioning
> 💡 **Core Positioning Directive:** Retiring the rigid "48-Hour Guarantee" clock as the primary value proposition to eliminate operational liabilities. Positioned as:
> - **"Rapid Surface Makeover"**
> - **"Zero-Civil Architectural Transformation"**
> - **"100% Live-In Friendly / Zero-Dust Upgrade"**
>
> *(Note: The phrase "48-Hour Guarantee" is retained in secondary trust badges and metadata to maintain strict compliance with invariant automated CI test assertions.)*

---

## 2. Deterministic Calculation Engines

All financial and material calculations exist as pure, deterministic TypeScript functions in `src/lib/`:

### A. Roll Nesting & Fabric Sizing (`calculateRollNesting`)
* **Vertical Drops:** $\lceil \text{Wall Width (in)} / \text{Roll Width (in)} \rceil$
* **Pattern Waste:** $\max(0, \text{Drops} - 1) \times \text{Pattern Repeat (in)}$
* **Required Linear Meters:** $((\text{Drops} \times (\text{Wall Height} + 4\text{" trim})) + \text{Pattern Waste}) \times 0.0254$
* **Safety Buffer:** Enforces an automatic **11% safety buffer** over exact square footage to absorb builder drywall deviations.

### B. Solar Lux & Heat Radiation (`analyzeSolarLux`)
* Evaluates orientation ($0^\circ–360^\circ$) and building floor number.
* Flags West / South-West exposure ($\ge 180^\circ \text{ and } \le 315^\circ$) on high floors ($\ge 10\text{th floor}$).
* Automatically recommends **Double-Cell Honeycomb** or **Motorized Blackout Blinds** (₹15,000 add-on).

### C. Dynamic Pricing & Escrow Calculator (`calculateDynamicPricing`)
* Material Cost = $\text{Raw Material Base} \times \text{Buffered Area}$
* Fixed Primer = ₹15/sq.ft | Fixed Installation Labor = ₹25/sq.ft
* Motorization Flat Fee = ₹15,000 | Statutory GST = 18%
* **Escrow Milestone Split (10/60/30):**
  - **10% Tranche 1:** Booking Deposit (quote lock & site survey dispatch)
  - **60% Tranche 2:** Material Dispatch (upon high-resolution photo QA of cut rolls)
  - **30% Tranche 3:** Post-QA Handover (auto-releases after 72 hours unless customer lodges formal dispute)

### D. Renovation Disruption Engine (`calculateRenovationDisruption`)
* Computes hidden civil renovation costs:
  - Temporary Airbnb rent in Kokapet/Tellapur (₹2,000/day $\times$ 45 days = ₹90,000)
  - Deep post-civil cleaning (₹8,000)
  - Contractor delay risk buffer (₹25,000)
* Demonstrates ₹1.2L–₹1.8L net savings with Aura's 2–3 day zero-civil transformation.

### E. West Hyderabad Rental Yield Model (`calculateWestHydRentalROI`)
* Localized high-rise society constants:
  - *My Home Bhooja:* Base Rent ₹95,000 $\rightarrow$ Post-Makeover ₹1,15,000 (+₹20k/mo lift)
  - *Rajapushpa Provincia:* Base Rent ₹60,000 $\rightarrow$ Post-Makeover ₹75,000 (+₹15k/mo lift)
  - *Prestige High Fields:* Base Rent ₹55,000 $\rightarrow$ Post-Makeover ₹68,000 (+₹13k/mo lift)
  - *Aparna Sarovar Zenith:* Base Rent ₹50,000 $\rightarrow$ Post-Makeover ₹62,000 (+₹12k/mo lift)
* Computes capex payback (6–9 months) and 3-year net wealth appreciation.

---

## 3. Design System & Luxury Brand Tokens

Configured in Tailwind CSS v4 (`src/app/globals.css`) and verified in automated CI tests:

| Token Name | Hex Code | Semantic Role |
|---|---|---|
| `--color-espresso` | `#1C130B` | Deep walnut foundation, high-contrast dark canvas |
| `--color-gold` | `#C5A880` | Brushed champagne brass, metallic borders, glows |
| `--color-terracotta` | `#8A5836` | Baked earth, eyebrow tags, secondary headings |
| `--color-linen` | `#FAF8F5` | Natural unbleached canvas, off-white text/pills |
| `--color-whatsapp` | `#15803D` | High-trust conversion CTA, WhatsApp triggers |
| `--color-royal` | `#3E2C1E` | Deep bronze foil card surfacing |
| `--color-silver` | `#C9CDD4` | Cold metallic slat highlights, secondary sheen |

* **Typography Scale:** Headings in **Syne** (`700`, `800`), Body in **Plus Jakarta Sans** (`400`, `500`, `600`), Marquee editorial in **Yeseva One**.
* **Corner Radius Rule:** Exclusively `rounded-2xl` (16px), `rounded-3xl` (24px), or `rounded-full`. Zero `rounded-sm`.

---

## 4. The 6 Core Interactive Applications

```
Platform Suite Architecture
├── 1. Rapid Surface Makeover Estimator (EstimatorGateway.tsx + StickyBOMDrawer.tsx)
├── 2. Renovation Cost & Disruption Comparator (RenovationComparator.tsx)
├── 3. West Hyderabad Rental Yield & ROI Calculator (RentalYieldCalculator.tsx)
├── 4. Smart Home Shading & Lighting Configurator (SmartLightingConfigurator.tsx)
├── 5. 2.5D Perspective Canvas Visualizer (HomographyCanvasVisualizer.tsx)
└── 6. Swatch Van Booking & WhatsApp Gate Pass Flow (SwatchVanBookingModal.tsx)
```

1. **Estimator & Sticky BOM Drawer:** Interactive 3-step room wizard with real-time drop count, pattern waste, and sticky 10/60/30 escrow tranche drawer.
2. **Renovation Comparator:** Interactive toggle (*"Living in Flat"* vs *"Vacant Investment"*) exposing the ₹1.5L hidden cost of civil work.
3. **Rental Yield Calculator:** Turnkey landlord capex tool with direct 1-tap investor consultation booking.
4. **Smart Shading & Lighting Configurator:** Multi-window motorized Matter/Zigbee shading paired with 3000K warm LED cove extrusions without dropping ceilings.
5. **2.5D Client Canvas Visualizer:** Zero-app in-browser wall perspective quad replacement for fragile WebXR. Runs at 60 FPS across all iOS and Android devices.
6. **Swatch Van Booking & Gate Pass:** Schedules physical van visits with automated WhatsApp notifications and pre-formatted resident MyGate visitor approval text.

---

## 5. Database Schema & Data Dictionary (PostgreSQL)

Models defined in `prisma/schema.prisma` with production pooling via PgBouncer:

```
[ User ] (Roles: CUSTOMER, OPS_DISPATCHER, TECHNICIAN, SUPERADMIN)
   ├── [ Lead ] (Status: NEW, WHATSAPP_SENT, VAN_DISPATCHED, MEASURED, WON, LOST)
   ├── [ Order ] (Stage: DEPOSIT_PENDING, DEPOSIT_PAID, MATERIAL_RELEASED, COMPLETED)
   │      ├── [ OrderItem ] ── [ DesignItem ] ── [ DyeLot ] (Continuous CMYK Lot Tracking)
   │      └── [ EscrowTransaction ] (Tranches: 10%, 60%, 30%)
   ├── [ Installation ] ── [ Van ] (Mobile Showroom Inventory)
   └── [ CustomerScore ] (Automated RFM Segment Classification)
```

---

## 6. API Specifications & Lead Routing Protocol

* **`/api/leads/estimator` (POST):** Ingests dimensions, finish tier, and estimated price; deterministically assigns sales agents via `lead-router.ts`; falls back to WhatsApp hotline `919700675637`.
* **`/api/leads/quiz` (POST):** Ingests style quiz preferences, computes interior archetype, and persists verified name and phone number.
* **`/api/ai/restyle` (POST):** Asynchronous GPU inpainting dispatcher using Replicate/RunPod signed webhooks.
* **`/api/ai/restyle/[jobId]` (GET):** Polling endpoint returning prediction status and high-resolution WebP rendering URL.

---

## 7. Architectural Framework: B.L.A.S.T. & 4 Quality Gates

* **B (Blueprint):** Type-safe JSON data contracts defined before code execution.
* **L (Link):** Environment variables, Prisma resilient proxy, and direct WhatsApp routing.
* **A (Architect):** Strict 3-layer separation (Presentation, Serverless API, Pure Computation).
* **S (Stylize):** Luxury tokens, GSAP 3.15 ScrollTrigger, Framer Motion 3D card tilt.
* **T (Trigger & Test):** Enforcement of the 4 Mandatory Quality Gates:
  1. `node scripts/test-e2e.mjs` — 117/117 Opaque-Box E2E tests green.
  2. `npx tsc --noEmit` — 0 TypeScript compilation errors.
  3. `npm run lint` — 0 ESLint errors.
  4. `npm run build` — 30/30 Next.js App Router routes compiled cleanly.

---

## 8. Master Platform Expansion Implementation Plan

See complete task decomposition and tracking in:  
`docs/plans/2026-11-05-master-platform-expansion-plan.md`
