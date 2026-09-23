-- Migration: lead auto-routing (spec-lead-auto-routing)
-- STATUS: PENDING REVIEW — do NOT apply blindly. Review against the live DB
-- (table/column existence, existing NULL constraints) before `migrate deploy`.
-- PostgreSQL dialect, matches prisma/schema.prisma models Lead/SalesAgent.

CREATE TABLE IF NOT EXISTS "SalesAgent" (
  "id"        TEXT NOT NULL,
  "name"      TEXT NOT NULL,
  "phone"     TEXT NOT NULL,
  "cities"    TEXT[] NOT NULL,
  "societies" TEXT[] NOT NULL,
  "isActive"  BOOLEAN NOT NULL DEFAULT true,
  "weight"    INTEGER NOT NULL DEFAULT 1,
  "isDemo"    BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SalesAgent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "SalesAgent_name_key" ON "SalesAgent"("name");

ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "sessionId" TEXT;
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "quizAnswers" JSONB;
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "source" TEXT;
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "assignedAgentId" TEXT;
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "routedAt" TIMESTAMP(3);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'Lead' AND constraint_name = 'Lead_sessionId_key'
  ) THEN
    ALTER TABLE "Lead" ADD CONSTRAINT "Lead_sessionId_key" UNIQUE ("sessionId");
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'Lead' AND constraint_name = 'Lead_assignedAgentId_fkey'
  ) THEN
    ALTER TABLE "Lead" ADD CONSTRAINT "Lead_assignedAgentId_fkey"
      FOREIGN KEY ("assignedAgentId") REFERENCES "SalesAgent"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
