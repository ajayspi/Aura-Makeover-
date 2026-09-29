# AuroMakeover — Premium Home Makeovers

![AuroMakeover](public/images/hero.jpg)

**AuroMakeover** is a Vertical SaaS platform and premium home interior service operating in Hyderabad, Bangalore, and Chennai. We deliver luxury wallpapers, fluted louvers, and smart motorized blinds in exactly 48 hours—with zero civil work, zero dust, and a 10/60/30 escrow payment protection model.

## 📚 Platform Documentation

We are actively expanding from a localized Next.js landing page into a full SaaS Operating System capable of running the entire interior business end-to-end.

Detailed architectural documentation can be found in the `docs/` directory:

- [UML Use Case Diagrams](docs/UML_USE_CASES.md) — Visual mapping of Customer, Admin, Technician, and Vendor workflows.
- [Database Architecture (ERD)](docs/DATABASE_ARCHITECTURE.md) — Prisma schema ERD showing Escrow, Inventory, and Order flows.
- [Notion Master Document](docs/NOTION_MASTER_DOC.md) — Comprehensive business, design, and animation spec designed for Notion import.

## 🚀 Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS v4
- **Animations:** GSAP 3 (ScrollTrigger, Canvas Hyperframes), Framer Motion 13
- **Database:** PostgreSQL via Prisma ORM
- **Infrastructure:** Vercel (Edge Functions, Blob Storage)

## 💻 Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   *(Note: Ensure you have a PostgreSQL instance running and provide the connection string in `.env`)*
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Server will run on [http://localhost:3000](http://localhost:3000).

## 🧪 Testing

AuroMakeover uses a strict custom E2E suite to guarantee production stability and aesthetic regressions:

```bash
# Run the E2E verification suite (117 tests)
node scripts/test-e2e.mjs

# Typechecking
npx tsc --noEmit

# Linting
npm run lint
```

## 📐 Key Interfaces

The core business logic lives in `src/lib/engines.ts`. These are pure functions and modifying them requires updating all callers:
- `calculateRollNesting(input)`: Calculates required wallpaper rolls with a strict 11% safety buffer.
- `analyzeSolarLux(input)`: Recommends smart blind types based on window direction.
- `calculateDynamicPricing(input)`: Generates the 10/60/30 escrow breakdown and 18% GST calculation.

---
*AuroMakeover — We don't renovate. We transform.*
