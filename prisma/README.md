# Database Schemas & Migrations (`prisma`)

## Overview
PostgreSQL database schema definitions, relational constraints, lifecycle enums, and test seeding data for the AuroMakeover enterprise backend.

## Interface
- `schema.prisma`: Authoritative Prisma schema declaring models: `Customer`, `CustomerScore`, `Order`, `EscrowTransaction`, `Installation`, `DesignItem`, `DyeLot`, `Lead`, `SalesAgent`, `SocietyLayout`, `AuditLog`.
- `seed.ts`: Database seeder provisioning initial sales agents, gated society pre-measured layouts, sample customers, and active dye-lot inventories.

## Invariants
- `Customer.phone`: Unique identifier indexing customer profiles across multi-channel touchpoints.
- `EscrowTransaction.stage`: Must conform to enum values `DEPOSIT_PENDING`, `MATERIAL_RELEASED`, or `POST_QA_UNLOCK_PENDING`.
- Migrations must never be applied blindly in production without verifying existing lead data integrity.

## Side Effects
- Mutates PostgreSQL database structure and tables when running `prisma db push` or `prisma migrate deploy`.

## Verification
- Run: `npx tsc --noEmit`
