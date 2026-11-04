# Admin Portal Components (`src/components/admin`)

## Overview
Administrative operations components providing visual pipeline control for customer management.

## Interface
- `KanbanBoard`: Client-rendered drag-and-drop or column-based board for moving customer leads across lifecycle stages.

## Invariants
- Lead status updates must strictly match `LifecycleStage` schema types.

## Side Effects
- Mutates lead records via API mutation requests.

## Verification
- Run: `node scripts/test-e2e.mjs`
