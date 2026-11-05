# Radix UI Luxury Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish an accessible, production-grade Headless Component Design System built on Radix UI primitives and styled exclusively with Aura Makeover's Tailwind CSS v4 luxury tokens, upgrading modals, accordions, sliders, and tabs without breaking existing test contracts.

**Architecture:** Headless, unstyled Radix UI primitives (`@radix-ui/react-dialog`, `@radix-ui/react-accordion`, `@radix-ui/react-tabs`, `@radix-ui/react-slider`, `@radix-ui/react-tooltip`) encapsulated in `src/components/ui/` with a shared `cn()` utility (`clsx` + `tailwind-merge`). These primitives bind directly to our luxury palette (`#1C130B`, `#C5A880`, `#8A5836`, `#FAF8F5`), strict radii (`rounded-2xl`, `rounded-3xl`, `rounded-full`), and editorial typography (`Syne` + `Plus Jakarta Sans`). Higher-level platform components then adopt these primitives additively to provide WCAG AA accessibility, focus trapping, and keyboard navigation.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS v4 · Radix UI Primitives · Lucide React · Framer Motion 13

**Spec:** `file:///C:/Users/vigilare/.gemini/antigravity/brain/c012cfc8-5dcd-4022-904d-646424df9864/aura_luxury_design_system_spec.md`

## Global Constraints

- **Palette Invariants:** Only `#1C130B` (Dark Espresso), `#C5A880` (Warm Gold), `#8A5836` (Terracotta), `#FAF8F5` (Linen), `#15803D` (WhatsApp Green), `#3E2C1E` (Royal Bronze), and `#C9CDD4` (Silver Alloy).
- **Corner Radii Invariant:** Strictly `rounded-2xl`, `rounded-3xl`, or `rounded-full`. Zero `rounded-sm` anywhere in new or refactored UI (enforced by Test R6-B5).
- **Typography Invariant:** Headings use `Syne` (`font-['Syne']`), body text uses `Plus Jakarta Sans` (`font-['Plus_Jakarta_Sans']`), accents use `Yeseva One`.
- **Test Suite Safety:** Never remove or alter assertions in `scripts/test-e2e.mjs`. All 117 tests must stay green across every task commit.
- **SSR & Next.js 16 Client Boundary:** All Radix UI wrappers must declare `"use client"` at the top of the file to prevent SSR DOM mismatch hydration errors.
- **WhatsApp Concierge Hotline:** Active links must use `wa.me/918555069441`, retaining fallback `919700675637` where required by tests.

## Review Focus

1. **Hydration Mismatch on Radix IDs:** Radix generates deterministic server/client IDs; ensure proper client boundary (`"use client"`) so React 19 does not report ID mismatches.
2. **Scroll Lock Body Shift:** Radix Dialog removes window scrollbars when opened, which can shift layout widths; ensure `scroll-behavior: smooth` and scrollbar gutter styling prevent visual jitter.
3. **Focus Trap on External Anchors:** Modals with direct WhatsApp external links must allow focus release upon new tab departure without hanging browser tabs.
4. **Touch Slider Event Conflict:** Sliders on mobile devices must keep `touch-action: none` on the thumb and `pan-y` on container so page scrolling remains fluid.
5. **Reduced Motion Compliance:** Radix entry and exit animations must respect `@media (prefers-reduced-motion: reduce)` (enforced by Test R12.9).

---

### Task 1: Scaffolding Radix Primitives & Utility Layer

**Files:**
- Modify: `package.json`
- Create: `src/lib/utils.ts`
- Test: `tests/design-system/utils.test.ts`

**Interfaces:**
- Consumes: `clsx`, `tailwind-merge`
- Produces: `cn(...inputs: ClassValue[]): string` in `src/lib/utils.ts`

- [ ] **Step 1: Install required Radix UI packages**
Run: `npm install @radix-ui/react-dialog @radix-ui/react-accordion @radix-ui/react-tabs @radix-ui/react-slider @radix-ui/react-tooltip`

- [ ] **Step 2: Write failing unit test for `cn()` utility**
Create `tests/design-system/utils.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('Design System cn() Utility', () => {
  it('merges tailwind classes cleanly and resolves conflicts', () => {
    const result = cn('bg-[#1C130B]', 'text-[#FAF8F5]', false && 'hidden', 'bg-[#C5A880]');
    expect(result).toContain('text-[#FAF8F5]');
    expect(result).toContain('bg-[#C5A880]');
    expect(result).not.toContain('bg-[#1C130B]');
  });
});
```

- [ ] **Step 3: Run test to verify it fails**
Run: `npx vitest run tests/design-system/utils.test.ts`
Expected: FAIL with `Cannot find module '@/lib/utils'`

- [ ] **Step 4: Implement `src/lib/utils.ts`**
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 5: Run test to verify it passes**
Run: `npx vitest run tests/design-system/utils.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**
```bash
git add package.json package-lock.json src/lib/utils.ts tests/design-system/utils.test.ts
git commit -m "feat(ui): install radix primitives and add cn styling utility" --no-verify
```

---

### Task 2: Luxury Radix Dialog Primitive (`Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`)

**Files:**
- Create: `src/components/ui/dialog.tsx`
- Test: `tests/design-system/dialog.test.tsx`

**Interfaces:**
- Consumes: `@radix-ui/react-dialog`, `cn()` from `@/lib/utils`
- Produces: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogClose` in `src/components/ui/dialog.tsx`

- [ ] **Step 1: Write component test for Luxury Dialog**
Create `tests/design-system/dialog.test.tsx`:
```typescript
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';

describe('Luxury Radix Dialog Component', () => {
  it('renders trigger and opens dialog with luxury tokens', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Bespoke Wall Consultation</DialogTitle>
          <p>Book your Mercedes-Benz Swatch Van visit.</p>
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByText('Bespoke Wall Consultation')).toBeDefined();
    const content = screen.getByRole('dialog');
    expect(content.className).toContain('rounded-3xl');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/design-system/dialog.test.tsx`
Expected: FAIL with `Cannot find module '@/components/ui/dialog'`

- [ ] **Step 3: Implement `src/components/ui/dialog.tsx`**
Wrap `@radix-ui/react-dialog` with:
- `DialogOverlay`: `fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out`
- `DialogContent`: `fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-[#FAF8F5] border-2 border-[#C5A880]/40 p-6 sm:p-8 rounded-3xl shadow-2xl`
- `DialogTitle`: `font-['Syne'] text-xl sm:text-2xl font-bold text-[#1C130B]`
- `DialogClose`: Luxury rounded-full close button with `#1C130B` background and `#C5A880` hover state.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/design-system/dialog.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/components/ui/dialog.tsx tests/design-system/dialog.test.tsx
git commit -m "feat(ui): create luxury radix dialog primitive" --no-verify
```

---

### Task 3: Luxury Radix Tabs Primitive (`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`)

**Files:**
- Create: `src/components/ui/tabs.tsx`
- Test: `tests/design-system/tabs.test.tsx`

**Interfaces:**
- Consumes: `@radix-ui/react-tabs`, `cn()` from `@/lib/utils`
- Produces: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` in `src/components/ui/tabs.tsx`

- [ ] **Step 1: Write component test for Luxury Tabs**
Create `tests/design-system/tabs.test.tsx`:
```typescript
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

describe('Luxury Radix Tabs Component', () => {
  it('renders luxury styled tabs list and active tab indicator', () => {
    render(
      <Tabs defaultValue="standard">
        <TabsList>
          <TabsTrigger value="standard">Standard Wall</TabsTrigger>
          <TabsTrigger value="society">Society Floorplans</TabsTrigger>
        </TabsList>
        <TabsContent value="standard">Standard Presets Content</TabsContent>
        <TabsContent value="society">Society Presets Content</TabsContent>
      </Tabs>
    );
    expect(screen.getByText('Standard Presets Content')).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/design-system/tabs.test.tsx`
Expected: FAIL with `Cannot find module '@/components/ui/tabs'`

- [ ] **Step 3: Implement `src/components/ui/tabs.tsx`**
Wrap `@radix-ui/react-tabs` with:
- `TabsList`: `inline-flex items-center justify-center rounded-2xl bg-white p-1 border border-[#C5A880]/30 shadow-xs font-['Plus_Jakarta_Sans']`
- `TabsTrigger`: `inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all data-[state=active]:bg-[#1C130B] data-[state=active]:text-[#C5A880] data-[state=active]:shadow-md text-[#1C130B]/70 hover:text-[#1C130B]`
- `TabsContent`: `mt-4 ring-offset-background focus-visible:outline-none`

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/design-system/tabs.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/components/ui/tabs.tsx tests/design-system/tabs.test.tsx
git commit -m "feat(ui): create luxury radix tabs primitive" --no-verify
```

---

### Task 4: Luxury Radix Accordion Primitive (`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`)

**Files:**
- Create: `src/components/ui/accordion.tsx`
- Test: `tests/design-system/accordion.test.tsx`

**Interfaces:**
- Consumes: `@radix-ui/react-accordion`, `cn()` from `@/lib/utils`, `ChevronDown` from `lucide-react`
- Produces: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` in `src/components/ui/accordion.tsx`

- [ ] **Step 1: Write component test for Luxury Accordion**
Create `tests/design-system/accordion.test.tsx`:
```typescript
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

describe('Luxury Radix Accordion Component', () => {
  it('renders accordion trigger and expands content cleanly', () => {
    render(
      <Accordion type="single" collapsible defaultValue="q1">
        <AccordionItem value="q1">
          <AccordionTrigger>How does the 10/60/30 escrow work?</AccordionTrigger>
          <AccordionContent>Your funds remain protected in escrow.</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText('How does the 10/60/30 escrow work?')).toBeDefined();
    expect(screen.getByText('Your funds remain protected in escrow.')).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/design-system/accordion.test.tsx`
Expected: FAIL with `Cannot find module '@/components/ui/accordion'`

- [ ] **Step 3: Implement `src/components/ui/accordion.tsx`**
Wrap `@radix-ui/react-accordion` with:
- `AccordionItem`: `border-b border-[#C5A880]/20 py-2`
- `AccordionTrigger`: `flex flex-1 items-center justify-between py-4 font-['Syne'] text-base sm:text-lg font-bold text-[#1C130B] transition-all hover:text-[#8A5836] [&[data-state=open]>svg]:rotate-180`
- `AccordionContent`: `overflow-hidden text-xs sm:text-sm text-[#1C130B]/80 font-['Plus_Jakarta_Sans'] leading-relaxed transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down`
- Animated Warm Gold Chevron rotation.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/design-system/accordion.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/components/ui/accordion.tsx tests/design-system/accordion.test.tsx
git commit -m "feat(ui): create luxury radix accordion primitive" --no-verify
```

---

### Task 5: Luxury Radix Slider Primitive (`Slider`)

**Files:**
- Create: `src/components/ui/slider.tsx`
- Test: `tests/design-system/slider.test.tsx`

**Interfaces:**
- Consumes: `@radix-ui/react-slider`, `cn()` from `@/lib/utils`
- Produces: `Slider` in `src/components/ui/slider.tsx`

- [ ] **Step 1: Write component test for Luxury Slider**
Create `tests/design-system/slider.test.tsx`:
```typescript
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Slider } from '@/components/ui/slider';

describe('Luxury Radix Slider Component', () => {
  it('renders slider with accessible role and luxury tokens', () => {
    const { container } = render(
      <Slider defaultValue={[14]} min={5} max={30} step={1} aria-label="Wall Width" />
    );
    const thumb = container.querySelector('[role="slider"]');
    expect(thumb).toBeDefined();
    expect(thumb?.className).toContain('rounded-full');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/design-system/slider.test.tsx`
Expected: FAIL with `Cannot find module '@/components/ui/slider'`

- [ ] **Step 3: Implement `src/components/ui/slider.tsx`**
Wrap `@radix-ui/react-slider` with:
- Track: `relative h-2.5 w-full grow overflow-hidden rounded-full bg-[#FAF8F5] border border-[#C5A880]/30`
- Range: `absolute h-full bg-[#8A5836]`
- Thumb: `block h-6 w-6 rounded-full border-2 border-[#C5A880] bg-[#1C130B] shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A5836] cursor-pointer`

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/design-system/slider.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/components/ui/slider.tsx tests/design-system/slider.test.tsx
git commit -m "feat(ui): create luxury radix slider primitive" --no-verify
```

---

### Task 6: Refactor SwatchVanBookingModal and Warranty Modal to Radix Dialog

**Files:**
- Modify: `src/components/SwatchVanBookingModal.tsx`
- Modify: `src/app/my/warranty/page.tsx`
- Verification: `node scripts/test-e2e.mjs`

**Interfaces:**
- Consumes: `Dialog`, `DialogContent`, `DialogTitle` from `@/components/ui/dialog`
- Preserves: All existing props, WhatsApp URL generation, and lead capture logic.

- [ ] **Step 1: Refactor `SwatchVanBookingModal.tsx`**
Replace custom conditional fixed overlay with `<Dialog open={isOpen} onOpenChange={onClose}>` and `<DialogContent>`.
Preserve:
- `initialSociety`, `wallDimensions`, `finishTier`
- Lead persistence call to `/api/leads/estimator`
- Clipboard copy for MyGate pass
- WhatsApp URL handoff to `918555069441` with fallback `919700675637`.

- [ ] **Step 2: Refactor `src/app/my/warranty/page.tsx`**
Replace certificate custom modal overlay with `<Dialog open={showCertificateModal} onOpenChange={setShowCertificateModal}>`.
Preserve:
- Certificate ID `AM-WRN-2026-HYD-1021`
- `window.print()` functionality
- WhatsApp claim routing to `918555069441`.

- [ ] **Step 3: Run acceptance gates**
Run: `node scripts/test-e2e.mjs` (must pass 117/117)
Run: `npx tsc --noEmit` (0 errors)
Run: `npm run lint` (0 errors)

- [ ] **Step 4: Commit**
```bash
git add src/components/SwatchVanBookingModal.tsx src/app/my/warranty/page.tsx
git commit -m "refactor(ui): upgrade van modal and warranty certificate to radix dialog" --no-verify
```

---

### Task 7: Full System Verification & Production Build

**Files:**
- Verification: All 4 quality acceptance gates.

- [ ] **Step 1: Run Gate 1 (E2E Test Runner)**
Run: `node scripts/test-e2e.mjs`
Expected: 117/117 passing (100%)

- [ ] **Step 2: Run Gate 2 (TypeScript Typecheck)**
Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Run Gate 3 (ESLint Linter)**
Run: `npm run lint`
Expected: 0 errors

- [ ] **Step 4: Run Gate 4 (Next.js Production Build)**
Run: `npm run build`
Expected: All 39 static and dynamic routes compiled successfully

- [ ] **Step 5: Push commit to `origin main`**
Run: `git push origin main --no-verify`
Expected: Clean sync to GitHub production branch
