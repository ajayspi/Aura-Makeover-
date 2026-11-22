# Plum Single-Image Canvas Compositor & Collection Stone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Plum Living's client-side single-image multi-pass canvas recoloring engine and port the exact Collection Stone (`/collection/stone`) and 3-slot floating swatch bar across the platform.

**Architecture:** An HTML5 Canvas compositor clips to a vector polygon on a single high-resolution room image and applies dynamic colorama tints via `multiply` and `luminosity` blend passes in 0ms without re-downloading images. A reactive `SwatchContext` synchronizes up to 3 physical swatches across `/collection/stone` and `/studio`, rendered in a persistent floating bottom tray with mobile Swatch Van dispatch.

**Tech Stack:** Next.js 16 (Turbopack), React 19, TypeScript, HTML5 Canvas 2D API, Radix UI (Dialog, Popover, Tabs, Slider), Tailwind CSS v4, Lucide React.

**Spec:** `docs/superpowers/specs/2026-11-22-plum-single-image-canvas-compositor-design.md`

## Global Constraints

- Brand Tokens: Dark Espresso (`#1C130B`), Warm Gold (`#C5A880`), Terracotta (`#8A5836`), Linen (`#FAF8F5`), Royal Bronze (`#3E2C1E`), WhatsApp Green (`#15803D`).
- Corner Radii: Strict `rounded-2xl`, `rounded-3xl`, `rounded-full` (zero `rounded-sm`).
- Git Branch: Work committed exclusively to `feat/radix-luxury-ui`; `main` branch remains untouched.
- Test Invariants: All 117 tests in `scripts/test-e2e.mjs` must remain passing at all times (`10/60/30`, `2-year`, `48hr Guarantee`, `id="faq"`).

## Review Focus

1. Canvas image cross-origin taint: base images loaded from local `/images/` must not throw security errors when calling canvas pixel methods.
2. Mobile viewport layout: floating swatch bar must not overlap canvas controls or produce horizontal overflow on screens < 640px.
3. Swatch tray capacity overflow: attempting to add a 4th swatch must gracefully cycle (FIFO) or notify the user without crashing.
4. Hotspot Popover placement: interactive pins on the edge of the viewport must align without overflowing the canvas container.
5. Preserving E2E test assertions: `OfferBanner` and `UrgencyBanner48` on the homepage must remain completely unobstructed.

---

### Task 1: SwatchContext & Floating Swatch Bar (`PlumSwatchBar.tsx`)

**Files:**
- Create: `src/context/SwatchContext.tsx`
- Create: `src/components/swatches/PlumSwatchBar.tsx`

**Steps:**
- [x] Create `src/context/SwatchContext.tsx` providing `swatches` (max 3), `addSwatch`, `removeSwatch`, `clearSwatches`, and `activeColor` with `localStorage` persistence.
- [x] Create `src/components/swatches/PlumSwatchBar.tsx` rendering the persistent 3-slot floating bottom tray (`[ Slot 1 ] [ Slot 2 ] [ Slot 3 ]`), "3 Échantillons Offerts" counter, and Radix `Dialog` for Swatch Van dispatch.
- [x] Verify TypeScript types compile cleanly with `npx tsc --noEmit`.
- [x] Commit: `git commit -m "feat(swatches): create SwatchContext and floating 3-slot PlumSwatchBar"`

---

### Task 2: HTML5 Canvas Multi-Pass Compositor (`PlumCanvasCompositor.tsx`)

**Files:**
- Create: `src/components/styler/PlumCanvasCompositor.tsx`

**Steps:**
- [x] Implement `PlumCanvasCompositor.tsx` using `useRef<HTMLCanvasElement>`:
  - Load the master base image once.
  - Apply clipping to the normalized polygon mask (`ctx.beginPath()`, `ctx.moveTo()`, `ctx.lineTo()`, `ctx.clip()`).
  - Apply dynamic color tint with `ctx.globalCompositeOperation = 'multiply'` and `'luminosity'` (0ms recolor).
  - Apply 3000K cove lighting ambient radial gradient in Night Mode.
  - Support high-DPI (`window.devicePixelRatio`) rendering for crispness on Retina screens.
- [x] Verify canvas renders without throwing errors on client mount.
- [x] Commit: `git commit -m "feat(canvas): implement multi-pass client-side canvas recoloring engine"`

---

### Task 3: Exact Plum Living Collection Stone Page (`/collection/stone` & `/collections/stone`)

**Files:**
- Modify: `src/app/collections/stone/page.tsx`
- Create: `src/app/collection/stone/page.tsx` (URL alias matching Plum Living)

**Steps:**
- [x] Build the editorial layout matching `https://plum-living.com/fr/collection/stone`:
  - **Editorial Hero:** High-fashion title `Green 05 - Stone`, descriptor *"Un gris relevé d'une touche de vert, sourd et intemporel"*, color pill `#7D8471`, dual CTAs (*Commander l'échantillon* + *Configurer dans le Styler*).
  - **Dual Application Switcher:** Toggle between *Panneaux Cannelés* (fluted joinery view) and *Peinture & Mur* (continuous wallcovering view).
  - **Single-Image Canvas Viewport:** Mount `PlumCanvasCompositor` with real-time color shifting across the Colorama palette (Stone, Argile, Terre Cuite, Ivoire, Bleu Paon, Chêne Fumé).
  - **Interactive Hotspot Pins (`●`):** Positioned over feature wall and credenza, opening Radix Popovers with "+ Ajouter l'échantillon".
  - **"Avec quoi l'associer ?" (Palette Harmonies):** 3 companion swatches (Chêne Fumé, Laiton Brossé, Travertin) with 1-click addition to `SwatchContext`.
  - **Mounted `PlumSwatchBar`:** Pinned to bottom, reflecting active slots.
- [x] Ensure `/collection/stone` re-exports or mirrors `/collections/stone`.
- [x] Commit: `git commit -m "feat(collection): build exact Plum Living Collection Stone showcase page"`

---

### Task 4: Integrate Canvas Compositor into 3D Styler (`/studio` and `/styler`)

**Files:**
- Modify: `src/components/styler/PlumRoomStyler.tsx`

**Steps:**
- [x] Replace static image overlays with `PlumCanvasCompositor` in `PlumRoomStyler.tsx`:
  - Connect the Colorama palette directly to the canvas tint state for instant 0ms recoloring.
  - Connect the 3000K Cove Lighting toggle to the canvas specular lighting pass.
  - Connect swatch clicks to `SwatchContext` so the floating tray stays in sync.
- [x] Test scene switching across all 4 high-rise presets (Kokapet, Provincia, High Fields, Mandir).
- [x] Commit: `git commit -m "feat(styler): integrate single-image canvas compositor into 3d room styler"`

---

### Task 5: End-to-End Verification & Quality Gates

**Steps:**
- [x] Run `node scripts/test-e2e.mjs` and verify **117/117 tests pass (100%)**.
- [x] Run `npx tsc --noEmit` and confirm **0 errors**.
- [x] Run `npm run lint` and confirm **0 errors**.
- [x] Run `npm run build` and confirm **all routes compile cleanly**.
- [x] Verify local dev server at `http://localhost:3000/collection/stone` and `http://localhost:3000/studio`.
- [x] Commit any final polishes to `feat/radix-luxury-ui`.
