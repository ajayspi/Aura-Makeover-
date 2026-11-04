# Operations Command Center (`src/app/ops`)

## Overview
Internal operating system providing executive telemetry, sales pipeline Kanban management, Customer 360 profiles, warehouse dye-lot tracking, and automated communication workflow building.

## Interface
- `/ops`: Command Center executive dashboard aggregating monthly revenue trajectories, live active pipeline amounts, critical dye-lot alerts, and real-time audit event feeds.
- `/ops/leads`: 7-stage Kanban CRM tracking lead velocity (`NEW`, `WHATSAPP_SENT`, `VAN_DISPATCHED`, `MEASURED`, `QUOTE_LOCKED`, `WON`, `LOST`).
- `/ops/customers` & `/ops/customers/[id]`: Customer 360 database with RFM composite lead scoring (S, A, B, C tiers), address associations, and LTV metrics.
- `/ops/inventory`: Dye-lot inventory management tracking active master roll serials and flagging rolls below 30m as critical.
- `/ops/workflows`: Interactive node-based visual workflow editor for orchestrating AiSensy automated message drips.
- `/ops/calendar`: Swatch van dispatch and on-site measurement schedule.

## Invariants
- Queries execute safely with empty-state fallbacks if the database has not yet been seeded.
- Impure functions (e.g. `Date.now()`) are never executed synchronously during React component rendering.

## Side Effects
- Mutates lead stages, assigns technicians, locks quotes, and triggers domain audit events.

## Verification
- Run: `node scripts/test-e2e.mjs`
