# Spec: In-App Lead Auto-Routing to Sales/Design Agents

**Status:** IMPLEMENTED 2026-09-23 — all gates green (tests 81/81, tsc 0, lint 0 errors, build exit 0; router 9/9 unit cases via node). Open: migration apply pending DBA review; demo seed purge + real roster at deploy.
**Date:** 2026-09-23
**Type:** New feature (user-confirmed meaning of "auto routing through agents").

## Goal
When a lead is captured (quiz completion, estimator WhatsApp-booking intent), automatically assign it to the right sales/design agent and persist the assignment — instead of every lead landing on one hardcoded WhatsApp number with no record.

## Non-goals
- No real WhatsApp Business API integration (deep links only, as today).
- No auth, no admin UI for roster management (roster is config-file driven).
- No changes to pricing engines or quiz/visualize UX.
- No migration of historical leads (none exist — route has never written successfully; see blockers).

## Research — blockers found (already done, do not redo)
1. **Quiz route writes fields that don't exist.** `src/app/api/leads/quiz/route.ts` upserts `sessionId`, `styleQuizAnswers`, `quizCompletedAt`, `QUIZ_COMPLETED` — none exist on the Prisma `Lead` model (schema has no `sessionId`, no quiz JSON columns, and `LeadStatus` has no `QUIZ_COMPLETED`). Against a real DB this upsert fails.
2. **Required fields missing.** `Lead.customerName` + `Lead.phone` are required; quiz flow collects neither (anonymous session). Any DB write needs a strategy for anonymous leads.
3. **No agent roster exists.** No sales-agent model; closest is `User.role = OPS_DISPATCHER`. All 3 cities in `src/lib/cities.ts` share one `whatsappNumber` (`919700675637`).
4. **Existing channel to preserve.** Quiz → sessionStorage `estimator_prefill` + `/#estimator?prefill=` + WhatsApp deep link; estimator → `wa.me/<city number>` deep link. Prisma 8 dynamic-import pattern + `src/types/prisma.d.ts` stubs must be preserved.
5. **Current suite impact:** opaque-box tests assert the literal `919700675637` default — routing must keep that number as the fallback default or tests go red (legitimately).

## Proposed design (confirm at sign-off)
- **Roster source:** new `SalesAgent` Prisma model (`id, name, phone, cities String[], societies String[], isActive, weight`) — seeded via `prisma/seed.ts`, editable without code deploys later. *Alternative rejected for now: hardcoding agents in `cities.ts` (bakes PII into the repo).*
- **Routing key:** deterministic by city slug → agent list for that city → highest-weight active agent; tie-break round-robin via `Lead` count per agent in last 24h. *Alternative: pure round-robin (rejected — ignores city expertise).*
- **Pure core:** new `src/lib/lead-router.ts` — `routeLead({ citySlug, society }, agents) → agent|null`, fully unit-testable, zero I/O.
- **Persistence:** extend `Lead` with `sessionId String? @unique`, `quizAnswers Json?`, `assignedAgentId String?` (+ relation), `routedAt DateTime?`, `source String` (`quiz|estimator|visualize|shop-look`); add `QUIZ_COMPLETED`?? — no: reuse `NEW` + `source='quiz'` to avoid enum migration. Anonymous leads: `customerName='Walk-in (quiz)'`, phone from later capture or `UNKNOWN` placeholder — **needs sign-off** (privacy/UX call).
- **Write path:** quiz route upserts with assignment in the same call; estimator booking intent POSTs to new `/api/leads/estimator` (same upsert shape) before opening WhatsApp; WhatsApp deep link retargets to the **assigned agent's number**, falling back to city default `919700675637` when no agent matches.

## Affected files
| Action | Path |
|---|---|
| Edit + migrate | `prisma/schema.prisma` (+ migration SQL; verify against live DB before applying) |
| Create | `src/lib/lead-router.ts` (pure routing function) |
| Create | `prisma/seed.ts` (initial agent roster; phone numbers supplied at sign-off, never committed blind) |
| Edit | `src/app/api/leads/quiz/route.ts` (assign + persist with real fields) |
| Create | `src/app/api/leads/estimator/route.ts` (booking-intent capture + assignment) |
| Edit | `src/components/EstimatorGateway.tsx` (POST intent before WhatsApp open; retarget number on assignment) |
| Edit | `src/types/prisma.d.ts` (stub new fields if client regen unavailable) |
| Edit | `scripts/test-e2e.mjs` — Tier 3: routing pure-function cases via lib import? (opaque-box reads source; assert router + assignment wiring strings), Tier 4: full quiz→assigned-agent journey |
| Update | Notion Roadmap (new item) + Architecture (lead-write path) |

## Expected behavior
1. Quiz completion persists a `Lead` (source=`quiz`) with an assigned active agent for the visitor's city, or unassigned + city default when no agent matches.
2. Estimator booking sends intent first; WhatsApp opens against the assigned agent's number, else `919700675637`.
3. Routing is deterministic per (city, 24h window counts) — same input state → same agent (testable).
4. No PII in repo: agent phones live in DB seed data provided at deploy, never in `cities.ts`.

## Acceptance criteria
- [ ] `routeLead` unit cases green (city match, weight priority, inactive skipped, empty-roster fallback) — run via node, results pasted in build log
- [ ] E2E suite green incl. new Tier 3/4 routing tests; existing `919700675637` assertions still pass (fallback preserved)
- [ ] `npx tsc --noEmit` 0 · `npm run lint` 0 errors · `npm run build` exit 0
- [ ] Migration SQL reviewed against live DB before apply (no blind `migrate deploy`)
- [ ] Notion Roadmap + Architecture updated

## Risks
| Risk | Mitigation |
|---|---|
| Prisma 8 dynamic-import + stub types drift from real client | Keep `src/types/prisma.d.ts` in sync; tsc gate catches drift |
| Anonymous-lead PII placeholders pollute DB | Sign-off on placeholder strategy; `source` column keeps them queryable/purgeable |
| Agent phone numbers in seed committed to git | Phones supplied at deploy time via env/secret, seed script reads env; never hardcode |
| WhatsApp number change breaks R5.5-family assertions | Fallback default `919700675637` preserved in code; tests assert fallback, not per-agent numbers |

## Decisions (architect sign-off, 2026-09-23 — user delegated)
1. **Roster source: new `SalesAgent` model.** Overloading `User`+`OPS_DISPATCHER` couples HR identity to routing config; a dedicated model keeps assignment queryable and lets roster churn without touching users.
2. **Routing key: city → weight → 24h round-robin** as proposed. Deterministic, testable, respects city expertise.
3. **Anonymous leads allowed** with `customerName='Walk-in (quiz)'`, `phone='UNKNOWN'`, `source` set. Blocking quiz submit on phone capture would kill the low-friction funnel (Havenly/Decorilla pattern); concierge captures the real phone on WhatsApp handoff. Placeholders are queryable/purgeable by `source`.
4. **Roster seeding is fail-closed.** No phone numbers are invented: seed script requires env vars and refuses without them; a `--demo` flag seeds synthetic agents explicitly marked `isDemo` for end-to-end testing. Real numbers are supplied at deploy, never committed.
