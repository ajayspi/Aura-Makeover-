# App Router Subsystem (`src/app`)

## Overview
Next.js 16 App Router application root organizing client-facing marketing surfaces, localized city routes, customer portals, administrative command centers, and backend API routes.

## Local Interface & Invariants
- `layout.tsx`: Root application layout loading `Syne`, `Plus_Jakarta_Sans`, and `Yeseva_One` from `next/font/google`. Mounts the sticky `OfferBanner`, responsive `NavBar`, and Vercel `SpeedInsights`.
- `page.tsx`: Production homepage assembling the complete narrative flow: Hero, Before/After Slider, 16-Cell Grid, Society Band, Method, Reviews, Estimator Wizard, and Footer.
- `globals.css`: Tailwind CSS v4 design token declarations and custom utility classes (`.text-foil`, `.bg-foil-card`, `.shimmer-bar`).
- `[city]/page.tsx`: Localized SSG/ISR landing pages (`/hyderabad`, `/bangalore`, `/chennai`) generating static paths and routing local leads.
- `quiz/page.tsx`: 4-step style questionnaire collecting room type, aesthetic preference, budget, and customer contact details.

## Subdirectories & System Boundaries
- [API Route Handlers](./api/README.md): Serverless endpoints for lead ingestion, AI restyling, and webhooks.
- [Customer Portal](./my/README.md): Customer dashboard, escrow payment tracking, and digital warranty portal.
- [Operations Command Center](./ops/README.md): Internal business OS, Kanban CRM, Customer 360, and inventory management.

## Global Invariants
- Root HTML and BODY tags must strictly exist only in `src/app/layout.tsx`. Sub-pages must never define nested `<html>` or `<body>` elements.
- Dynamic route parameters must be awaited as Promises in page components.

## Verification
- Run: `node scripts/test-e2e.mjs` && `npm run build`
