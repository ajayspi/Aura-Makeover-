# Static Catalogs & Seed Data (`src/data`)

## Overview
Static datasets and showcase catalog definitions providing curated finish pairs and verified transformation mappings for client display.

## Interface
- `BEFORE_AFTER_PAIRS`: 15 verified same-space transformation pairs across 7 categories (`living`, `bedroom`, `dining`, `office`, `pooja`, `kids`, `balcony`).
- `GRID_CATEGORIES`: Readonly tuple of active showcase categories.
- `PAIR_COUNT`: Number of active image pairs (15).
- `CELL_COUNT`: Total cells rendered by BeforeAfterGrid including the CTA card (16).

## Invariants
- `BEFORE_AFTER_PAIRS`: Every pair must declare both a verified `before` image path and a matching `after` image path located in `public/images/`.
- No image generation API keys or secret tokens may be stored or inlined in this directory (strictly stored in gitignored `.secrets/`).

## Side Effects
- None (pure static constants).

## Verification
- Run: `node scripts/test-e2e.mjs`
