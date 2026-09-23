## 2026-09-20T20:43:00Z

<USER_REQUEST>
You are Worker M5 responsible for resolving the two upstream TypeScript compilation issues and verifying the entire project build and E2E test suite.

Your working directory: c:\Users\vigilare\Aura\auro-makeover\.agents\worker_m5_fix
Project directory: c:\Users\vigilare\Aura\auro-makeover
Original Request: c:\Users\vigilare\Aura\auro-makeover\.agents\ORIGINAL_REQUEST.md
Project Scope: c:\Users\vigilare\Aura\auro-makeover\PROJECT.md
Page Assembly Handoff to read: c:\Users\vigilare\Aura\auro-makeover\.agents\worker_page_assembly\handoff.md

MANDATORY FIRST STEP:
Read c:\Users\vigilare\Aura\auro-makeover\.agents\ORIGINAL_REQUEST.md thoroughly before doing anything else.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

EXCLUSIVE FILE OWNERSHIP:
You exclusively own and modify:
- `src/components/Footer.tsx`
- `src/components/HeroSection.tsx`

TASKS:
1. `src/components/Footer.tsx`:
   - `lucide-react` does not export `Instagram` or `Linkedin`.
   - Remove `Instagram, Linkedin` from the `lucide-react` import.
   - Implement clean, elegant inline SVG icons for Instagram and LinkedIn matching the social link buttons (in `#C5A880`, with hover effects).
   - Ensure all social links maintain `rounded-2xl` targets and strict brand palette (`#1C130B`, `#C5A880`, `#8A5836`, `#FAF8F5`, `#15803D`).
2. `src/components/HeroSection.tsx`:
   - Fix the TypeScript variant typing at line 39 by adding `as const`:
     change `ease: [0.16, 1, 0.3, 1]` to `ease: [0.16, 1, 0.3, 1] as const`.
3. VERIFICATION (CRUCIAL):
   - Run `npx tsc --noEmit` and confirm ZERO TypeScript errors across the entire codebase!
   - Run `npm run build` and confirm production build completes with ZERO errors!
   - Run `node scripts/test-e2e.mjs` and confirm all 70 test cases pass!
4. Write handoff report to `c:\Users\vigilare\Aura\auro-makeover\.agents\worker_m5_fix\handoff.md` with the terminal commands, full outputs, and verification results.
5. Send completion message via `send_message` to orchestrator.

</USER_REQUEST>
