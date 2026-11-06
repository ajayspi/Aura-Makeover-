# AuroMakeover Blueprint

## System Overview
**AuroMakeover** is a Vertical SaaS platform and premium home interior transformation service operating in Hyderabad, Bangalore, and Chennai. We deliver luxury architectural surface skins (wallcoverings, acoustic fluted louvers, smart motorized blinds) with zero civil work, zero dust, and a 10/60/30 escrow payment protection model.

The platform combines high-touch physical service (Design-on-Wheels Swatch Van) with automated programmatic pricing, AI spatial visualizers, and a Customer Management Platform (CMP).

## Subdirectories & System Boundaries
- `src`: [Application Source Tree](./src/README.md) — Presentation components, app router pages, calculation libraries, static data catalogs, and ambient types.
- `prisma`: [Database Schemas & Migrations](./prisma/README.md) — PostgreSQL database schema definitions, relational constraints, lifecycle enums, and test seeding data.
- `scripts`: [Automation & Verification Scripts](./scripts/README.md) — Standalone 117-test opaque-box E2E test suite and keyed image generation runners.
- `docs`: Technical documentation covering enterprise architecture, UML use cases, database ERD, and Notion specs.

## Global Invariants
- **Palette compliance:** All components strictly adhere to designated design tokens (`#1C130B` Dark Espresso, `#C5A880` Warm Gold, `#8A5836` Terracotta, `#FAF8F5` Linen, `#15803D` WhatsApp Green, `#3E2C1E` Royal Bronze, `#C9CDD4` Silver Alloy).
- **Corner geometry:** Exclusively `rounded-2xl`, `rounded-3xl`, and `rounded-full`. Zero occurrences of sharp `rounded-sm`.
- **Mathematical determinism:** Pure functions in `src/lib/engines.ts` calculate all roll nesting, solar radiation, and dynamic pricing with zero side effects.
- **Escrow Financial Invariant:** Tranche 1 (10% Deposit) + Tranche 2 (60% Material Release) + Tranche 3 (30% Post-QA Handover) strictly equals `totalRetailPrice`.
- **Buffer Invariant:** `calculateRollNesting` always enforces a minimum 11% safety buffer over exact wall dimensions.

## Global Side Effects
- **Database:** Prisma client connects to PostgreSQL database with dynamic safe fallback proxy during local builds.
- **Messaging:** AiSensy WhatsApp Business API dispatches customer notifications and swatch van booking confirmations.

## System Verification
Run the 4 acceptance gates:
```bash
# Gate 1: E2E Verification Suite (117 tests)
node scripts/test-e2e.mjs

# Gate 2: Strict Typechecking
npx tsc --noEmit

# Gate 3: ESLint 9 Flat Config
npm run lint

# Gate 4: Next.js Production Build
npm run build
```

---
*AuroMakeover — We don't renovate. We transform.*

<!-- about-me -->
## About me

<p>
  <img alt="HFI Certified User Experience Analyst (CXA)" src="https://img.shields.io/badge/HFI-Certified%20UX%20Analyst%20(CXA)-1a3a52?style=flat-square">
  <a href="https://www.linkedin.com/in/aigrowthandautomationleader/"><img alt="LinkedIn" src="https://img.shields.io/badge/LinkedIn-aigrowthandautomationleader-0A66C2?style=flat-square&logo=linkedin&logoColor=white"></a>
  <a href="https://designjoom.com"><img alt="designjoom.com" src="https://img.shields.io/badge/designjoom.com-Portfolio-0b1220?style=flat-square&logo=astro&logoColor=white"></a>
</p>

**A V Ajay Kiran** — AI Growth & Digital Transformation Leader with 14+ years across AI
product development, SEO and performance marketing, UX strategy and workflow automation,
working with teams across India, Germany, the US and Australia.

**Certified:** HFI Certified User Experience Analyst (CXA) — Human Factors International.

**Capabilities**

- **AI & Growth** — Generative AI · LLM workflows · Prompt engineering · AI product development · AI content & video · Workflow automation · Growth strategy · SEO/SEM · Performance marketing · CRO · Go-to-market · Content strategy · Marketing automation
- **UX & Product** — UX strategy · User research · Information architecture · Wireframing & prototyping · Design systems · Usability testing · Product strategy
- **Engineering** — TypeScript · Python · React 19 · Next.js · Astro · FastAPI · Three.js · Tailwind CSS · PostgreSQL · Docker · Vite · Zustand
- **Analytics** — GA4 · Search Console · Looker Studio · Hotjar · Mixpanel · Microsoft Clarity · Google Ads · Semrush · Ahrefs

**Find me** — [LinkedIn](https://www.linkedin.com/in/aigrowthandautomationleader/) ·
[designjoom.com](https://designjoom.com) · [ajayspi@gmail.com](mailto:ajayspi@gmail.com)
