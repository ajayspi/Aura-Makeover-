# AuroMakeover — Enterprise Architecture (CMP & Core Systems)

This document details the Customer Management Platform (CMP) introduced in Phase P0, along with the core orchestrators introduced in Phase P1 and P2.

## 1. Customer Management Platform (CMP) Architecture

The CMP transforms AuroMakeover from a simple lead capture tool into a full-scale CRM and operational backend.

### Key Models
- **Customer**: A 360-degree view encompassing lifetime value, NPS, lead scoring, tags, and all associated addresses and projects.
- **CustomerTimeline**: Immutable event sourcing for tracking interactions (WhatsApp, calls, visits, payments, state changes).
- **CustomerSegment**: Dynamic audiences updated in real-time based on querying rules (e.g., "Kokapet Premium 3BHK").
- **CustomerScore**: Multi-dimensional scoring assessing engagement, intent, and value to assign lead tiers.

## 2. 20-State Lifecycle State Machine

A deterministic state machine (`src/lib/services/LifecycleStateMachine.ts`) defines the lifecycle from lead to warranty expiration.

### Core Stages
1. **Acquisition**: `ANONYMOUS` -> `LEAD_CAPTURED` -> `CONTACTED`
2. **Sales**: `VAN_DISPATCHED` -> `MEASURED` -> `QUOTE_SENT` -> `NEGOTIATING` -> `DEAL_WON` (or `DEAL_LOST`)
3. **Fulfillment**: `MATERIAL_ORDERED` -> `INSTALL_SCHEDULED` -> `INSTALLING` -> `QA_PENDING` -> `COMPLETED`
4. **Post-Sales**: `WARRANTY_ACTIVE` -> `CLAIM_OPEN` -> `CLAIM_RESOLVED` -> `WARRANTY_EXPIRED`
5. **Re-engagement**: `REACTIVATION_TARGET`, `NURTURE_SEQUENCE`

### Guard Conditions
Every transition requires explicit conditions. For example:
- `QUOTE_SENT` -> `DEAL_WON` requires `depositPaid: true` (10% deposit).
- `INSTALLING` -> `QA_PENDING` requires at least one QA photo uploaded.

## 3. Lead Scoring Logic

The `LeadScoringEngine` computes a composite score (0-100) determining the SLA for outreach:

- **Engagement (30%)**: Tracks digital footprint (quiz completion, page visits, estimator usage, WhatsApp replies, van visits).
- **Intent (40%)**: Tracks buying signals (timeline mentioned, budget provided, pricing page visits, callback requested).
- **Value (30%)**: Tracks revenue potential (premium societies, unit type, referrals, repeat business).

### Tiers and SLA
- **Tier S (80-100)**: Immediate assignment to senior agent + instant WhatsApp alert + calendar slot hold.
- **Tier A (60-79)**: Agent assigned within 15 minutes + automated Swatch PDF email/WhatsApp.
- **Tier B (40-59)**: Enrolled in 7-day drip WhatsApp campaign.
- **Tier C (0-39)**: Enrolled in weekly batch email newsletter.

## 4. WhatsApp Integrations & Communication Orchestrator

The `CommunicationOrchestrator` centralizes outbound messaging across multiple channels (WhatsApp, SMS, Email).

- **AiSensyService**: Connects directly to the WhatsApp Business API via AiSensy. Supports templates, rich media, and custom payloads.
- **MessageTemplates**: Stored in Prisma, mapping slugs (e.g., `quote_sent`) to dynamic Handlebars-style strings.
- **Event-Driven**: Fully decoupled via the `EventBus` so lifecycle state transitions emit events that trigger automated messaging flows automatically.

## 5. Live Inventory Tracking & Supply Chain

Inventory tracks the exact state of available materials.

- **Dye-Lot Tracking**: Wallpapers are grouped by `DyeLot` (CMYK Code, substrate batch) to prevent mismatched shades during an installation.
- **Roll Level Serial Tracking**: Each roll is serialized and tracked. When assigned to an `OrderItem`, `stockMeters` is precisely decremented.
- **Safety Buffers**: A mandatory 11% nesting buffer is calculated via `calculateRollNesting()` in the pure calculation engines to prevent running short on-site.
