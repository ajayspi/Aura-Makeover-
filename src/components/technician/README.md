# Technician Portal Components (`src/components/technician`)

## Overview
Field operations components enabling swatch van technicians and installers to log on-site laser measurements, photo evidence, and QA check-offs.

## Interface
- `IntakeForm`: Field form capturing customer room dimensions, wall substrate conditions, and society gate pass references.

## Invariants
- Measurements must validate positive decimal numbers before persisting.

## Side Effects
- Emits form submission payloads to `/api/leads` and logs on-site audit actions.

## Verification
- Run: `node scripts/test-e2e.mjs`
