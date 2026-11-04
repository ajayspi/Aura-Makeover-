# Application Source Tree (`src`)

## Overview
Primary source tree for the AuroMakeover application, organized into presentation components, app router pages and endpoints, calculation libraries, static data catalogs, and ambient types.

## Subdirectories & Boundaries
- [App Router Subsystem](./app/README.md): Next.js App Router root organizing pages, dynamic city routes, portals, and serverless API endpoints.
- [Component Package](./components/README.md): Reusable UI primitives, showcase grids, 3D galleries, and estimator wizard steps.
- [Core Library & Calculation Engines](./lib/README.md): Mathematical roll nesting, solar lux exposure analysis, dynamic escrow pricing, and domain services.
- [Static Catalogs & Seed Data](./data/README.md): Curated before/after pairs and category definitions.
- [Ambient Type Declarations](./types/README.md): TypeScript ambient interfaces and SDK typings.

## Verification
- Run: `node scripts/test-e2e.mjs` && `npx tsc --noEmit`
