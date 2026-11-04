# Automation & Verification Scripts (`scripts`)

## Overview
Self-contained verification runners and image catalog asset generation scripts.

## Interface
- `test-e2e.mjs`: Standalone 117-test opaque-box E2E test suite inspecting source code, math engines, design tokens, and simulated user workflows.
- `generate-before-after.mjs`: Script invoking Pollinations image edit pipelines using secure external keys stored in `.secrets/image-keys.json`.

## Invariants
- `test-e2e.mjs`: Exits with code 0 if all tests pass, code 1 if any failure occurs. Must run with zero external dev server or database dependencies.
- No private API keys may be committed to version control.

## Side Effects
- `generate-before-after.mjs`: Writes generated `.jpg` assets to `public/images/`.

## Verification
- Run: `node scripts/test-e2e.mjs`
