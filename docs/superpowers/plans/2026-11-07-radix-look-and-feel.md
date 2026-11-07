# Radix UI Look and Feel Luxury Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the AuroMakeover site experience by fully adopting Radix UI primitives (`Accordion`, `Tabs`, `Slider`, `Dialog`) across key customer-facing surfaces with silky smooth animations, segmented controls, and accessible focus states, while keeping all 117 E2E tests green.

**Architecture:** 
1. Inject standard Radix CSS keyframes (`--radix-accordion-content-height`, modal fades) into `src/app/globals.css`.
2. Migrate `FAQSection.tsx` from raw `useState` to the luxury Radix `Accordion` primitive.
3. Migrate `RenovationComparator.tsx` persona controls and `StepRoomSize.tsx` preset switches to Radix `Tabs`.
4. Refine Radix component micro-styling with subtle hairline borders, focus rings, and luxury gold/espresso tokens.
5. Verify all 4 acceptance gates (117 E2E tests -> tsc -> lint -> build) and launch the local dev server.

**Tech Stack:** Next.js 16 (App Router) · React 19 · Radix UI Primitives (`@radix-ui/react-accordion`, `@radix-ui/react-tabs`, `@radix-ui/react-slider`, `@radix-ui/react-dialog`) · Tailwind CSS v4 · TypeScript 5 · Lucide React

---

## Global Constraints

- **Branch Safety:** Must remain on `feat/radix-luxury-ui`; `main` branch remains untouched.
- **Palette Invariants:** Only `#1C130B` (Dark Espresso), `#C5A880` (Warm Gold), `#8A5836` (Terracotta), `#FAF8F5` (Linen), `#15803D` (WhatsApp Green), `#3E2C1E` (Royal Bronze), and `#C9CDD4` (Silver Alloy).
- **Corner Radii Invariant:** Strictly `rounded-2xl`, `rounded-3xl`, or `rounded-full`. Zero `rounded-sm` anywhere in new or refactored UI (enforced by Test R6-B5).
- **Typography Invariant:** Headings use `Syne` (`font-['Syne']`), body text uses `Plus Jakarta Sans` (`font-['Plus_Jakarta_Sans']`).
- **Test Suite Safety:** Never remove or alter assertions in `scripts/test-e2e.mjs`. All 117 tests must pass.
- **R12.4 Contract:** `FAQSection.tsx` must contain `id="faq"`, `aria-expanded`, `10/60/30`, `2-year` or `2-Year`, and `rounded-2xl`.

---

## Review Focus

1. **Accordion Height Animation:** Radix Accordion requires `--radix-accordion-content-height` keyframes so expanding/collapsing doesn't visually jump.
2. **Keyboard Navigation on Tabs:** Radix Tabs must support arrow keys (Left/Right/Home/End) and have visible focus rings.
3. **SSR Hydration Safety:** All Radix UI wrappers and consumers must keep `"use client"` at the top to prevent React 19 ID mismatches.
4. **Touch Conflict on Sliders:** Mobile sliders must retain `touch-action: none` on the thumb and fluid container scrolling.
5. **No Visual Layout Shift:** Radix state switches must maintain fixed container boundaries.

---

### Task 1: Add Radix UI Animation Keyframes in `globals.css`

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add `@keyframes` for Radix Accordion and Dialog animations**
  Add keyframes for `accordion-down` and `accordion-up` utilizing `var(--radix-accordion-content-height)` and smooth ease-out curves.
- [ ] **Step 2: Verify build and test suite**
  Run: `node scripts/test-e2e.mjs` and `npm run build` to confirm no CSS compilation errors.

---

### Task 2: Upgrade `FAQSection.tsx` to Radix Accordion

**Files:**
- Modify: `src/components/FAQSection.tsx`
- Modify: `src/components/ui/accordion.tsx` (if needed for styling)

- [ ] **Step 1: Refactor `FAQSection.tsx` to use Radix Accordion primitives**
  Replace custom `open` state and div toggles with:
  ```tsx
  <Accordion type="single" collapsible className="space-y-3">
    {FAQS.map((f, i) => (
      <AccordionItem key={i} value={`faq-${i}`} className="bg-white rounded-2xl border border-[#C5A880]/30 px-6 py-1 data-[state=open]:border-[#C5A880] transition-all">
        <AccordionTrigger className="...">
          {f.q}
        </AccordionTrigger>
        <AccordionContent className="...">
          <p className="border-l-2 border-[#C5A880] pl-4">{f.a}</p>
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
  ```
- [ ] **Step 2: Ensure compliance with Test R12.4**
  Verify `id="faq"`, `aria-expanded`, `10/60/30`, `2-year` or `2-Year`, and `rounded-2xl` are preserved in `FAQSection.tsx`.
- [ ] **Step 3: Run E2E tests**
  Run: `node scripts/test-e2e.mjs` (must pass 117/117).

---

### Task 3: Upgrade `RenovationComparator.tsx` to Radix Tabs

**Files:**
- Modify: `src/components/RenovationComparator.tsx`

- [ ] **Step 1: Wire Radix `Tabs` for Persona Toggle**
  Replace the custom buttons in the Occupancy Status bar with:
  ```tsx
  <Tabs value={isLivingInFlat ? 'living' : 'investment'} onValueChange={(val) => setIsLivingInFlat(val === 'living')}>
    <TabsList className="bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#C5A880]/30">
      <TabsTrigger value="living" className="...">Living in Flat (Live-in Friendly)</TabsTrigger>
      <TabsTrigger value="investment" className="...">Vacant Unit (Landlord / Investor)</TabsTrigger>
    </TabsList>
  </Tabs>
  ```
- [ ] **Step 2: Polish room selector & comparison cards**
  Ensure sleek Radix look with subtle gold hairline borders and focus rings.
- [ ] **Step 3: Run E2E tests**
  Run: `node scripts/test-e2e.mjs`.

---

### Task 4: Upgrade `StepRoomSize.tsx` Sizing Presets to Radix Tabs

**Files:**
- Modify: `src/components/estimator/StepRoomSize.tsx`

- [ ] **Step 1: Replace preset mode buttons with Radix `Tabs`**
  Use `Tabs`, `TabsList`, `TabsTrigger` for switching between "Standard Rooms" and "Gated Society Floorplans".
- [ ] **Step 2: Polish Radix Slider styling**
  Refine track background, range gradient, and thumb focus states.
- [ ] **Step 3: Run E2E tests and TypeScript check**
  Run: `node scripts/test-e2e.mjs` and `npx tsc --noEmit`.

---

### Task 5: Complete Acceptance Gates & Launch Local Server

**Files:**
- All modified files

- [ ] **Step 1: Run Gate 1 (E2E Suite)**: `node scripts/test-e2e.mjs` (117/117 green).
- [ ] **Step 2: Run Gate 2 (Typecheck)**: `npx tsc --noEmit` (0 errors).
- [ ] **Step 3: Run Gate 3 (Lint)**: `npm run lint` (0 errors).
- [ ] **Step 4: Run Gate 4 (Build)**: `npm run build` (success).
- [ ] **Step 5: Git commit changes on `feat/radix-luxury-ui`**.
- [ ] **Step 6: Launch local server (`npm run dev`)** as background task and provide live URL to user.
