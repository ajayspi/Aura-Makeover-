# Domain Services (`src/lib/services`)

## Overview
Core business logic and integration services orchestrating the customer lifecycle state machine, AiSensy WhatsApp Business messaging, multi-channel communication routing, RFM lead scoring, and external webhook dispatching.

## Interface
- `AiSensyService`: Static class for WhatsApp template and campaign dispatch (`AiSensyService.sendTemplateMessage`, `sendSessionMessage`)
- `CommunicationOrchestrator`: Multi-channel message routing and template rendering (`routeMessage`, `renderTemplate`, `bulkRoute`)
- `LifecycleStateMachine`: Deterministic customer lifecycle transitions (`canTransition`, `transition`, `getAvailableTransitions`)
- `LeadScoringEngine`: RFM-based composite customer scoring (`scoreCustomer`, `recalculateAllScores`)
- `WebhookDispatcher`: Outbound webhook fanout with HMAC signatures (`WebhookDispatcher.dispatch`)

## Invariants
- `LifecycleStateMachine`: Every customer status mutation must satisfy transition guards defined in `TRANSITIONS` table; illegal transitions are strictly rejected.
- `AiSensyService`: Destination phone numbers must be stripped of `+` prefixes prior to API dispatch.
- `LeadScoringEngine`: Composite scores are clamped to [0, 100] and deterministically categorized into tiers S (>=80), A (65-79), B (45-64), and C (<45).

## Side Effects
- `AiSensyService.sendTemplateMessage`: Outbound HTTPS POST to `https://backend.aisensy.com/campaign/t1/api/v2`.
- `WebhookDispatcher.dispatch`: Outbound HTTPS POST requests with `x-signature-sha256` HMAC headers.

## Verification
- Run: `node scripts/test-e2e.mjs`
