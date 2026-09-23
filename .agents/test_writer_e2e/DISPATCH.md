## 2026-09-20T20:15:10Z

You are the E2E Test Writer responsible for the Opaque-Box E2E Testing Track for AuroMakeover Phase 1 Redesign.

Your working directory: c:\Users\vigilare\Aura\auro-makeover\.agents\test_writer_e2e
Project directory: c:\Users\vigilare\Aura\auro-makeover
Original Request: c:\Users\vigilare\Aura\auro-makeover\.agents\ORIGINAL_REQUEST.md
Project Scope: c:\Users\vigilare\Aura\auro-makeover\PROJECT.md

MANDATORY FIRST STEP:
Read c:\Users\vigilare\Aura\auro-makeover\.agents\ORIGINAL_REQUEST.md thoroughly before doing anything else.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All tests must genuinely verify requirements. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

EXCLUSIVE FILE OWNERSHIP:
You exclusively own and create:
- `TEST_INFRA.md` (at project root `c:\Users\vigilare\Aura\auro-makeover\TEST_INFRA.md`)
- `TEST_READY.md` (at project root `c:\Users\vigilare\Aura\auro-makeover\TEST_READY.md`)
- Test files and test runners in `tests/` or `scripts/` (e.g. `tests/e2e-requirements.test.ts` or `scripts/test-e2e.mjs`).
Do NOT modify application source code in `src/`.

TESTING PRINCIPLES & METHODOLOGY:
Build a comprehensive opaque-box test suite derived directly from user requirements (R1 through R6) and acceptance criteria:
1. Tier 1: Feature Coverage (>=5 test cases per feature across R1-R6: Hero, Before/After slider, Design Gallery, Society Section, Estimator Wizard & Ticker, Footer & Layout. Minimum 30 tests).
2. Tier 2: Boundary & Corner Cases (>=5 test cases per feature: e.g. min/max wall dimensions 5ft/30ft, 8ft/15ft, extreme inputs, negative values handling, slider edge dragging 0% and 100%, mobile vs desktop event signatures, GST/deposit rounding).
3. Tier 3: Cross-Feature Combinations (pairwise coverage: society card selection triggering estimator pre-population, finish tier changes updating animated counter, WhatsApp URL generation with formatted parameters, lookbook CTA scrolling to gallery).
4. Tier 4: Real-World Application Scenarios (realistic end-to-end user workflows: e.g. Bhooja 3BHK flat owner calculating living room accent wall, Provincia resident choosing smart motorized blinds, etc.).

Total test cases must meet or exceed ~40 test cases across the 4 tiers.

EXECUTION & HARNESS:
- Create a runnable test script/runner (e.g. Node.js runner or test runner using `npm test` or a standalone test script `node scripts/test-e2e.mjs` or `npx tsx ...`) that tests:
  - Component exports, structure, and attributes.
  - Palette compliance: verifying no prohibited colors.
  - Corner compliance: verifying only `rounded-2xl` or `rounded-3xl`.
  - WhatsApp phone number verification (`919700675637`).
  - Metadata verification in `layout.tsx`.
  - Engines verification (`calculateRollNesting` and `calculateDynamicPricing`).
  - Estimator wizard step navigation and calculation verification.
- Document the exact test runner command in `TEST_INFRA.md` and create `TEST_READY.md` summarizing coverage and test results.

OUTPUT:
- Write `TEST_INFRA.md` at project root.
- Implement tests in `tests/` or `scripts/`.
- Run the test suite and verify results.
- Write `TEST_READY.md` at project root.
- Update `progress.md` with timestamps.
- Write handoff report to `c:\Users\vigilare\Aura\auro-makeover\.agents\test_writer_e2e\handoff.md`.
- Send completion message via `send_message` to orchestrator.
