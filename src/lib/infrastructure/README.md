# Domain Infrastructure (`src/lib/infrastructure`)

## Overview
Asynchronous messaging infrastructure and pub/sub event bus decoupling domain mutations (lead creation, escrow release, stock depletion) from communication and audit listeners.

## Interface
- `EventBus`: Domain event bus singleton instance exposing `emitEvent(name, payload)` and `onEvent(name, listener)`.
- `registerEventSubscribers()`: Automatic listener wiring linking domain events to `LeadScoringEngine`, `AiSensyService`, and audit logging.

## Invariants
- Event payloads are strictly type-checked against `EventMap` definitions (`lead.created`, `lead.status_updated`, `order.escrow_released`, `inventory.low_stock`).

## Side Effects
- Emits console telemetry and delegates side effects asynchronously to downstream communication channels.

## Verification
- Run: `node scripts/test-e2e.mjs`
