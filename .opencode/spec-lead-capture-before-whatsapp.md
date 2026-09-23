# R11 — Lead Capture Before WhatsApp Handoff

**Status:** IMPLEMENTED (2026-09-23) · **TESTS:** 99/99 E2E (R11.1–R11.6), tsc 0, lint 0 errors, build exit 0

## Why

Both funnels fire the WhatsApp handoff with zero personal data:

- **Style Quiz** (`/quiz`): 5 option steps → `onComplete` → POST `/api/leads/quiz` → `wa.me` open.
- **Estimator** (`/#estimator`, Step 3 "Review & Book"): society select + WhatsApp CTA → POST `/api/leads/estimator` → `wa.me` open.

Both API routes stored `customerName: 'Walk-in (quiz|estimator)'` and `phone: 'UNKNOWN'`, so the assigned sales agent had no way to reach the prospect. R11 adds a **name + phone capture step before every WhatsApp open** and persists real values on the lead.

## Interpretation (scope decision)

- "Phone no" = 10-digit Indian mobile (optional `+91`/`0` prefix, must start 6–9).
- "Personal details" = **name + phone**. Society is already captured by the estimator and city comes from the URL; anything else adds friction before a channel (WhatsApp) that handles the rest. Choosing minimal friction is deliberate.

## Design

1. **`src/lib/lead-details.ts` (new, shared)**: `normalizeLeadPhone` (→ 10-digit or null), `isValidLeadPhone` (10-digit starting 6–9), `isValidLeadName` (trim ≥ 2 chars).
2. **Quiz — 6th step "Your Details"** in `StyleQuiz.tsx` (after Budget): name + phone inputs with live validation; `QuizAnswers` extended with `customerName`/`phone`; last-step button stays `Get My Estimate` and only enables when both fields are valid. `onComplete(answers)` carries them.
3. **`quiz/page.tsx`**: destructures `customerName`/`phone` out of answers, sends them in the `/api/leads/quiz` body, and personalizes the WhatsApp message (`tagsToWhatsAppMessage(tags, society?, customerName?)` gained an optional `Name:` line).
4. **`api/leads/quiz/route.ts`**: accepts `customerName`/`phone` in the body; upsert writes them (falls back to `'Walk-in (quiz)'`/`'UNKNOWN'` when absent — old clients still work).
5. **Estimator — "Your Contact Details" card in Step 3**: name + phone inputs with inline validation; the WhatsApp CTA is `disabled` until `isValidLeadName && isValidLeadPhone`; `handleWhatsAppBooking` re-checks, sends `customerName`/`phone` in the POST, and `buildWhatsAppUrl` adds `• Customer Name` + `• Contact Number` lines.
6. **`api/leads/estimator/route.ts`**: accepts + persists both fields (same fallback).

## Test additions (scripts/test-e2e.mjs, 93 → 99)

- R11.1 Quiz ends with a validated "Your Details" step (StyleQuiz).
- R11.2 Quiz page + route carry/persist name+phone.
- R11.3 Estimator Step 3 collects name+phone and gates the CTA (`disabled`).
- R11.4 Estimator POST + route persist name+phone.
- R11.5 WhatsApp messages include the customer name (estimator + quiz lib).
- R11.6 Shared lead-details lib exists with normalize/validators + `+91` handling.

## Contracts preserved

R5.5 (`wa.me/`, `919700675637`, animated price) · R-C6 (wizard nav/disabled) · R-C8 (prefill channel) · R-C12 (quiz route fields, no fake enums) · R-C13 (estimator POST + agent retarget) · R-W4 (Step 1/2/3 + hotline) · R-W5 (quiz → routeLead → prefill). No test pins the quiz step count.