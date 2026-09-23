# Deploy Runbook — AuroMakeover

Short ops guide for deploying auro-makeover (Next.js 16, App Router, React 19, Tailwind v4). The app lives at the repo root (flattened 2026-09-23).

## 1. CI / Deploy flow

- **CI (GitHub Actions, `.github/workflows/ci.yml`)** — runs on every push/PR to `main` from the repo root (Node 20, npm). Gates run in order and fail fast:
  1. `node scripts/test-e2e.mjs` — opaque-box E2E suite (exit 0 = pass; NOT an npm script)
  2. `npx tsc --noEmit`
  3. `npm run lint`
  4. `npm run build`
- **Vercel** auto-detects the Next.js framework; `vercel.json` only sets `cleanUrls`.
  - Preview deployments are created for PRs; the production deployment is promoted/created on merge to `main`.
  - A deploy should only go out after the CI gates are green.
- **Local sanity before any deploy:** `node scripts/test-e2e.mjs` && `npx tsc --noEmit` && `npm run lint` && `npm run build` (all from the repo root).

## 2. Prisma migration — PENDING REVIEW ⚠️

`prisma/migrations/pending_lead_routing/migration.sql` (lead auto-routing: `SalesAgent` table + new `Lead` columns/FKs) is **PENDING REVIEW**.

- **NEVER blind-apply it.** It is Postgres-dialect and touches existing tables (`Lead`).
- Before applying, review it against the **live DB**: confirm table/column existence and existing `NULL` constraints, and that the new columns (`sessionId`, `quizAnswers`, `source`, `assignedAgentId`, `routedAt`) don't collide with anything already present.
- Apply only after review, via `prisma migrate deploy` (or an equivalent controlled apply against the production Postgres).
- Until this migration is applied, lead auto-routing / `SalesAgent` features must not be relied on in production.

## 3. Seeding the SalesAgent roster

Sales agents are seeded at deploy time from an environment variable — **real phone numbers are NEVER committed to the repo**.

```bash
SALES_AGENTS_JSON='[{"name":"Agent Name","phone":"91XXXXXXXXXX","cities":["hyderabad"],"societies":[],"weight":1}]' node prisma/seed.js
```

- Supply real numbers via the environment at deploy time (Vercel env vars, `.env` on the host, etc.).
- The script fail-closes: no `SALES_AGENTS_JSON` (and no `--demo`) → seeds nothing, exits non-zero.
- **`--demo` is for local/staging only** — it seeds synthetic agents flagged `isDemo=true`. **Demo rows MUST be purged before production use:**

```sql
delete from "SalesAgent" where "isDemo" = true;
```

## 4. WhatsApp routing fallback

- `919700675637` is the fallback WhatsApp number.
- While the `SalesAgent` roster is empty (or after purging demo agents), lead routing falls back to this number — verify routing expectations against it until real agents are seeded.