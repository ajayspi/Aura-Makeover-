# Ambient Type Declarations (`src/types`)

## Overview
Ambient TypeScript type declarations and mock interfaces providing type safety during local compilation when generated vendor SDKs (e.g., Prisma 8 client) are not built locally.

## Interface
- `declare module '@prisma/client'`: Ambient definitions for `PrismaClient`, `LeadDelegate`, and `SaleAgentDelegate` ensuring `npx tsc --noEmit` succeeds locally.

## Invariants
- Ambient declarations must never shadow or conflict with production `@prisma/client` types on deployment platforms.

## Side Effects
- None (compile-time type augmentation only).

## Verification
- Run: `npx tsc --noEmit`
