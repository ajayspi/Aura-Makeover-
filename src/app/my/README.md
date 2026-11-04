# Customer Self-Service Portal (`src/app/my`)

## Overview
Secure customer portal providing real-time renovation stage progress, escrow tranche visibility, and digital warranty management for apartment owners and tenants.

## Interface
- `/my/dashboard`: Primary timeline tracking the 5 renovation phases (Booking Confirmed $\rightarrow$ Material Ordered $\rightarrow$ Installation Day $\rightarrow$ QA Inspection $\rightarrow$ Warranty Activated), assigned van details, and technician contact.
- `/my/payments`: Detailed escrow tranche ledger displaying 10% Deposit, 60% Material Release, and 30% Post-QA Unlock statuses.
- `/my/warranty`: Digital 2-Year Full Warranty card displaying covered room components and direct claims hotline.

## Invariants
- Dynamic stages match order `escrowStage` attributes.
- Escrow calculations reflect statutory 18% GST and mathematical tranche invariants.

## Side Effects
- Reads customer order and transaction history from Prisma.

## Verification
- Run: `node scripts/test-e2e.mjs`
