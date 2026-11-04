# EGM Drift Detection Report (2026-11-05)

## README.md
No drift detected.

## src/README.md
No drift detected.

## src/app/README.md
No drift detected.

## src/app/api/README.md
No drift detected.

## src/app/my/README.md
No drift detected.

## src/app/ops/README.md
No drift detected.

## src/components/README.md
No drift detected.

## src/components/estimator/README.md
No drift detected.

## src/components/animations/README.md
No drift detected.

## src/components/admin/README.md
No drift detected.

## src/components/technician/README.md
No drift detected.

## src/lib/README.md
No drift detected.

## src/lib/services/README.md
No drift detected.

## src/lib/infrastructure/README.md
No drift detected.

## src/data/README.md
No drift detected.

## src/types/README.md
No drift detected.

## prisma/README.md
No drift detected.

## scripts/README.md
No drift detected.

## docs/ARCHITECTURE.md
* **Strategic Copy Transition:** Document cites the legacy "48-Hour Guarantee" in value propositions and customer journey headings; pending alignment with the new "Rapid Surface Makeover / Zero-Civil Transformation" positioning established in `PROJECT_MASTER_PROMPT.md` and `concepts_brief.md`.
* **Lead Router Agent Fallback:** Document specifies sales agent round-robin with multi-city weighted allocation; currently operating with single-agent mock fallback locally when PostgreSQL is disconnected.

## docs/DATABASE_ARCHITECTURE.md
* **Prisma Client Generation:** Document specifies direct Prisma ORM database models (`Customer`, `Order`, `EscrowTransaction`); in the current local environment, access is handled via the dynamic proxy in `src/lib/prisma.ts` until production deployment migrations are executed per `DEPLOY.md`.
