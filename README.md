# AuroMakeover Spacemake OS

AuroMakeover is a hyper-growth, venture-grade home micro-makeover and soft-furnishings platform designed for modern urban high-rises. We bring premium designs directly to customers via our "Design-on-Wheels" swatch vans and guarantee a 48-hour dust-free installation process.

## 🚀 Completed Features (Vercel Ready)

### 1. Landing Page (Customer Facing)
- **Hero Section:** Highlights the 48-Hour Guarantee and Zero-Civil Work process.
- **Design Gallery:** Curated design catalog using `next/image` for performance.
- **AI Estimator Gateway:** Interactive tool for instant pricing quotes based on wall dimensions and material quality.
- **WhatsApp Integration:** Direct links for customers to book swatch vans seamlessly.

### 2. E-Commerce & Pricing Engine (India Strategy)
- **Regional Pricing:** Multipliers for Metros (Tier 1), Emerging (Tier 2), and Towns (Tier 3).
- **GST Compliance:** Automated tax splits for Service (18%) and Materials (5-18%).
- **Payment Hierarchy UI:** Mockups for UPI Autopay, EMI options, and BNPL.
- **Escrow Logic:** Tranche split calculators (10% Deposit, 60% Material Prep, 30% Post-QA).

### 3. TechOps & Admin Portals
- **Technician Intake Form:** Mobile-first PWA interface for field techs to perform barcode scanning, moisture limit checks (<12%), and multi-photo QA sign-offs to unlock warranty and escrow.
- **Admin CRM Kanban:** Dispatcher UI for tracking live leads and van locations across the Hyderabad West Corridor.

### 4. Database Schema
- **Prisma ORM Setup:** Comprehensive schema modeling Users, Society Layouts (for viral loop tracking), Dye-Lots (supply chain tracking), Orders, and Warranty Vaults.

---

## 🛠️ Tech Stack
- **Framework:** Next.js 15 (App Router, React 19)
- **Styling:** Tailwind CSS 4, Lucide Icons, Framer Motion
- **Database:** Prisma ORM, PostgreSQL (Schema defined)
- **State Management:** Zustand (Installed)
- **Forms & Validation:** React Hook Form + Zod (Installed)

## 📦 Deployment (Vercel)

This project is configured and ready to be deployed on Vercel out-of-the-box.

1. Push this repository to GitHub/GitLab.
2. Connect the repository in your Vercel Dashboard.
3. Ensure you set the `DATABASE_URL` environment variable in Vercel for Prisma to connect to your PostgreSQL database (e.g., Neon).
4. Deploy!

### Local Development

1. Install dependencies: `npm install`
2. Setup Prisma (with .env): `npx prisma generate`
3. Start server: `npm run dev &`
