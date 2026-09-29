# AuroMakeover — Platform Documentation (Notion Master Export)

> **Instructions for Import:** This document is formatted to cleanly import into Notion. Download this `.md` file, drag it into your Notion workspace, and it will automatically generate the nested headings, tables, code blocks, and toggle lists.

---

# 1. Executive Summary

AuroMakeover is transitioning from a localized interior design service into a **Vertical SaaS Platform** for the 48-hour home makeover industry.

**Core Offerings:**
- Luxury Wallpapers, Fluted Acoustic Louvers, Smart Motorized Blinds
- Zero Civil Work. Zero Dust.
- 48-Hour Installation Guarantee
- 10/60/30 Escrow Payment Protection
- 2-Year Comprehensive Warranty

---

# 2. Phase 1-7 Expansion Roadmap

<details>
<summary>Phase 1: Customer-Facing Website</summary>

- `/about` — Company Story & Team
- `/services` — Full Service Catalog
- `/projects` — Portfolio / Case Studies
- `/pricing` — Transparent Pricing Page
- `/warranty` — 2-Year Warranty Hub
- `/blog` — Content Marketing & SEO Engine
</details>

<details>
<summary>Phase 2: Customer Portal (`/my`)</summary>

- `/my/dashboard` — Project tracking (Deposit → Material → Install → QA → Done)
- `/my/payments` — Escrow invoice management
- `/my/support` — Warranty claims and support tickets
</details>

<details>
<summary>Phase 3: Operations Dashboard (`/ops`)</summary>

- `/ops/leads` — Lead CRM with Kanban view
- `/ops/inventory` — Warehouse & Inventory Management (Dye-lot tracking)
- `/ops/fleet` — Swatch Van dispatching
- `/ops/finance` — Revenue and Escrow pipelines
</details>

<details>
<summary>Phase 4: Technician Mobile App (`/tech`)</summary>

- `/tech/today` — Installation schedule
- `/tech/job/[id]` — Moisture checks, QA photos, Escrow unlock triggers
</details>

<details>
<summary>Phase 5-7: Enterprise SaaS Architecture</summary>

- Vendor Portal (`/vendor`) for print orders
- Multi-tenancy for franchising/licensing
- API infrastructure
</details>

---

# 3. Animation & UI Design System

The platform will utilize an Apple-grade cinematic animation layer.

## Typography & Color
- **Headings:** Syne (Black/Bold)
- **Body:** Plus Jakarta Sans
- **Colors:** Dark Espresso (`#1C130B`), Warm Gold (`#C5A880`), Terracotta (`#8A5836`)

## Core Animations (GSAP)
1. **Hyperframe Sequences:** Scroll-bound `<canvas>` animations for high-performance 3D/video scrubbing (e.g., watching a room transform dynamically as you scroll down the homepage).
2. **Animated SVG Icons:** Lucide icons replaced with custom GSAP `drawSVG` stroke animations triggered on scroll and hover.
3. **Escrow Visualizers:** Interactive progress bars that fill sequentially to demonstrate the 10/60/30 payment protection.

---

# 4. System UML & Architecture

## ERD (Database Model)

```mermaid
erDiagram
    USER ||--o{ LEAD : "manages"
    USER ||--o{ ORDER : "places"
    ORDER ||--|{ ORDER_ITEM : "contains"
    ORDER ||--o{ ESCROW_TRANSACTION : "tracks payment"
    ORDER ||--o| INSTALLATION : "requires"
    DESIGN_ITEM ||--o{ DYE_LOT : "manufactured in"
    DYE_LOT ||--o{ ORDER_ITEM : "allocated to"
    USER ||--o{ INSTALLATION : "performs"
    INSTALLATION ||--o| QA_REPORT : "generates"
```

## Actor Use Cases

### Customer
- **Public:** Take AI Quiz, Get Estimate, Browse Portfolio
- **Portal:** Track Order, Pay 10/60/30 Escrow, Claim 2-Year Warranty

### Operations Admin
- **Sales:** Manage Leads, Generate Quotes, Assign Agents
- **Fulfillment:** Dispatch Vans, Manage Dye-Lot Inventory, Generate Vendor POs

### Technician
- **On-site:** View Schedule, Scan Dye-Lot QR, Record Wall Moisture, Upload QA Photos, Trigger 30% Escrow Unlock

---

# 5. Technology Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Animations:** GSAP 3 (ScrollTrigger) + Framer Motion
- **Database:** Prisma ORM (PostgreSQL)
- **Payments (Proposed):** Razorpay Escrow API
- **Auth (Proposed):** NextAuth.js / Clerk
