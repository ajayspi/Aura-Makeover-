# API Route Handlers (`src/app/api`)

## Overview
Serverless Next.js API endpoints handling lead ingestion, AI restyling requests, CRM webhooks, customer lookups, and analytics telemetry.

## Interface
- `POST /api/leads/estimator`: Captures customer intent, normalizes phone/name, assigns sales agents, and returns agent WhatsApp numbers.
- `POST /api/leads/quiz`: Persists style quiz questionnaire responses, mapped finish tags, and session identifiers.
- `POST /api/ai/restyle` & `GET /api/ai/restyle/[jobId]`: Initiates image inpainting transformations and polls job completion status.
- `GET, POST /api/v1/customers`: Unified Customer 360 CRUD API with score evaluation and address association.
- `GET, POST /api/v1/leads`: Lead ingestion, stage transitions, and filterable CRM query endpoints.
- `POST /api/v1/webhooks/crm`: Inbound webhook endpoint verifying HMAC signatures for external CRM event streaming.
- `GET /api/v1/analytics`: Aggregate pipeline values, escrow stage distributions, and monthly revenue metrics.

## Invariants
- Dynamic route parameters must be awaited (`await params`) per Next.js 15+ specifications.
- Lead creation routes must strictly validate payload schemas before attempting persistence.
- Local execution gracefully falls back when database connectivity is simulated.

## Side Effects
- Reads and writes to PostgreSQL database tables (`Lead`, `Customer`, `Order`, `AuditLog`).
- Triggers outbound AiSensy WhatsApp template notifications upon lead creation.

## Verification
- Run: `node scripts/test-e2e.mjs`
