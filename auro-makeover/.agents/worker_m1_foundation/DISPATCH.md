## 2026-09-20T20:15:10Z

You are Worker M1 responsible for Foundation, Layout, Typography, and Global Polish.

Your working directory: c:\Users\vigilare\Aura\auro-makeover\.agents\worker_m1_foundation
Project directory: c:\Users\vigilare\Aura\auro-makeover
Original Request: c:\Users\vigilare\Aura\auro-makeover\.agents\ORIGINAL_REQUEST.md
Project Scope: c:\Users\vigilare\Aura\auro-makeover\PROJECT.md
Survey Handoff to read: c:\Users\vigilare\Aura\auro-makeover\.agents\explorer_survey_1\handoff.md

MANDATORY FIRST STEP:
Read c:\Users\vigilare\Aura\auro-makeover\.agents\ORIGINAL_REQUEST.md thoroughly before doing anything else.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

EXCLUSIVE FILE OWNERSHIP:
You exclusively own and modify:
- `src/app/layout.tsx`
- `src/app/globals.css`
Do NOT modify any other files.

TASKS:
1. `src/app/layout.tsx`:
   - Replace the invalid `LayoutProps<"/">` with `Readonly<{ children: React.ReactNode }>`.
   - Import `Syne` and `Plus_Jakarta_Sans` from `next/font/google`:
     - `Syne`: subsets `["latin"]`, variable `"--font-syne"`, weight `["700", "800"]`, display `"swap"`.
     - `Plus_Jakarta_Sans`: subsets `["latin"]`, variable `"--font-plus-jakarta-sans"`, weight `["400", "500", "600", "700", "800"]`, display `"swap"`.
     - Apply `${syne.variable} ${plusJakartaSans.variable} h-full antialiased scroll-smooth` to `<html>`.
   - Update metadata:
     - `title`: `"AuroMakeover — Premium Home Makeovers in 48 Hours | Hyderabad"`
     - `description`: `"Luxury wallpapers, fluted louvers & smart blinds installed in 48 hours. Zero civil work. Serving Kokapet, Tellapur & Financial District."`
2. `src/app/globals.css`:
   - Add `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');` directly below `@import "tailwindcss";`.
   - Register strict design system theme tokens in `@theme`:
     - `--font-syne: 'Syne', var(--font-syne), sans-serif;`
     - `--font-sans: 'Plus Jakarta Sans', var(--font-plus-jakarta-sans), sans-serif;`
     - `--font-jakarta: 'Plus Jakarta Sans', var(--font-plus-jakarta-sans), sans-serif;`
     - `--color-espresso: #1C130B;`
     - `--color-gold: #C5A880;`
     - `--color-terracotta: #8A5836;`
     - `--color-linen: #FAF8F5;`
     - `--color-whatsapp: #15803D;`
   - Remove the `@media (prefers-color-scheme: dark)` override that changes background to black.
   - Set `:root` and `body` defaults: background `#FAF8F5`, color `#1C130B`, font `'Plus Jakarta Sans', var(--font-plus-jakarta-sans), sans-serif`.
   - Set `h1, h2, h3, h4, h5, h6` font to `'Syne', var(--font-syne), sans-serif`.

VERIFICATION:
- Run `npx tsc --noEmit` to verify zero TypeScript errors in `layout.tsx`.
- Update `progress.md` with timestamps.
- Write handoff report to `c:\Users\vigilare\Aura\auro-makeover\.agents\worker_m1_foundation\handoff.md` with commands run, output, and verified changes.
- Send completion message via `send_message` to orchestrator.
