# Design Document: Plum-Style Single-Image Multi-Pass Canvas Compositor & Swatch System

**Status:** Approved by Human Partner  
**Author:** Lead Systems Architect & Senior Frontend Engineer  
**Date:** 2026-11-22  
**Target Branch:** `feat/radix-luxury-ui`  
**Reference Benchmark:** [Plum Living France — Collection Stone](https://plum-living.com/fr/collection/stone) & [Plum 3D Styler](https://plum-living.com/fr/kit/styler/kitchen_5?sp=default_kitchen_5_argile)

---

## 1. Intent & The "Why"

High-end architectural clients want immediate visual feedback when testing colorways and materials in high-rise interior spaces. Loading separate 3D renders or static images for every color permutation causes network latency, mobile browser lag, and visual flashing.

Following the engineering paradigm of **Plum Living (France)**, this system implements a **client-side HTML5 Canvas multi-pass compositing engine** that transforms the color and texture of architectural surfaces on a **single photorealistic base image in real-time (0ms)**. In addition, it ports the exact layout, interactive hotspots, and floating 3-slot swatch bar of Plum Living's flagship **Collection Stone (`/collection/stone`)** and **3D Styler (`/studio`, `/styler`)**.

---

## 2. Key Architecture Decisions (Resolved)

1. **Recoloring Technique (Option 1A — Plum Living Standard):**
   * The HTML5 Canvas compositor clips to a normalized vector polygon isolating the target feature wall / cabinetry.
   * Color tint is applied using `globalCompositeOperation = 'multiply'` combined with `'luminosity'`.
   * The inherent ambient shadow falloff, contact occlusions, and wood/stone grain in the master photograph are 100% preserved on the single image with zero geometric warping artifacts or network latency.
2. **Unified Integration Scope (Option 2A):**
   * The engine powers **both** the new **Collection Stone showcase (`/collection/stone`)** and the **3D Styler (`/studio` / `/styler`)**, creating a cohesive, shared single-image compositing pipeline across the platform.
3. **Floating Swatch Bar Mounting Boundary:**
   * Scoped to `/collection/stone`, `/collections/*`, `/studio`, and `/styler` via a shared `SwatchProvider`.
   * Kept off the homepage root layout to eliminate z-index collisions with `OfferBanner`, `UrgencyBanner48`, and pinned assertions in `scripts/test-e2e.mjs`.
4. **Dual Application Toggle on Collection Stone:**
   * Switches between *Panneaux Cannelés* (fluted joinery view) and *Peinture & Mur* (continuous wallcovering view), each with its own pre-calibrated segmentation mask.
5. **Interactive Hotspot Pins (`●`):**
   * Absolute HTML overlays on the canvas viewport that trigger Radix UI Popovers displaying product name, price, and instant **"+ Ajouter à mon panier d'échantillons"** button.

---

## 3. Goals, Non-Goals, and Anti-Goals

### Goals
- **Instant (0ms) Single-Image Recoloring:** Changing a swatch (*Green 05 - Stone*, *Argile*, *Chêne Fumé*, *Terre Cuite*, *Bleu Paon*, *Ivoire*) updates the canvas surface immediately without downloading new image files.
- **Natural Ambient Occlusion & Shadows:** Ambient shadows and 3000K cove lighting highlights are naturally multiplied over the color tint.
- **Exact Plum Living Collection Stone (`/collection/stone` & `/collections/stone`):**
  - Hero with colorway descriptor, color pill, and dual CTAs (*Commander un échantillon* + *Configurer dans le Styler*).
  - Dual application toggle (*Panneaux Cannelés* vs *Revêtement Mural*).
  - In-situ editorial room lookbook with interactive clickable hotspot pins (`●`).
  - Palette harmonies (*"Avec quoi l'associer ?"*) featuring 1-click addition of companion swatches.
- **Exact Plum Floating 3-Swatch Bar (`PlumSwatchBar.tsx`):**
  - Persistent sticky bottom tray with 3 slots (`[ Slot 1 ] [ Slot 2 ] [ Slot 3 ]`).
  - "3 échantillons offerts dans votre boîte aux lettres" counter.
  - Radix Dialog modal for Swatch Van dispatch to West Hyderabad high-rise gates.
- **Preserve All Quality Gates:** All 117 tests in `scripts/test-e2e.mjs` must remain 100% passing; zero TypeScript errors (`tsc`); zero ESLint errors.

### Non-Goals
- Full 3D WebGL / Three.js geometry rendering (rejected due to mobile battery drain and lack of tactile photographic warmth).
- Overwriting existing pinned homepage tests.

### Anti-Goals
- Flashing white screens or loading spinners when switching colors.
- Artificial flat color overlays that wipe out natural shadows and material textures.

---

## 4. Constraints

- **Brand Tokens:** Dark Espresso (`#1C130B`), Warm Gold (`#C5A880`), Terracotta (`#8A5836`), Linen (`#FAF8F5`), Royal Bronze (`#3E2C1E`), WhatsApp Green (`#15803D`).
- **Corner Radii Invariants:** Strict `rounded-2xl`, `rounded-3xl`, `rounded-full` (zero `rounded-sm`).
- **Git Branching:** All modifications committed exclusively to `feat/radix-luxury-ui`; `main` branch remains untouched.
- **Test Invariants:** Must retain literal strings in JSX/comments: `id="faq"`, `aria-expanded`, `10/60/30`, `2-year`, `48hr Guarantee`, `#how-it-works`, `#reviews`.

---

## 5. Architectural Specification & Component Breakdown

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. SwatchContext (Global State & LocalStorage Persistence)              │
│    Holds: selectedSwatches: Swatch[] (max 3), isTrayOpen, activeColor  │
├────────────────────────────────────────────────────────────────────────┤
│ 2. PlumCanvasCompositor.tsx (Approach A Engine)                        │
│    • Base Scene Image (Neutral Master)                                 │
│    • Vector Segmentation Mask (Normalized 0-100% coordinates)         │
│    • Color Tint Multiply Pass (Hex + Alpha LUT)                        │
│    • Shadow Map / Relief Pass (Preserves Slats & Stone Veins)          │
│    • Specular Lighting Pass (3000K Cove Halo & Natural Daylight)       │
├────────────────────────────────────────────────────────────────────────┤
│ 3. Plum Collection Stone Page (/collection/stone & /collections/stone) │
│    • Editorial Hero: Green 05 - Stone                                  │
│    • Dual Finish Toggle: Panneaux Cannelés vs Revêtement Mural         │
│    • In-Situ Room Viewport with Interactive Hotspots (●)               │
│    • "Avec quoi l'associer ?" Palette Harmonies Grid                   │
├────────────────────────────────────────────────────────────────────────┤
│ 4. Plum Floating Swatch Bar (PlumSwatchBar.tsx)                        │
│    • Persistent viewport bottom bar: [Slot 1] [Slot 2] [Slot 3]        │
│    • Radix Dialog: "Valider ma boîte d'échantillons"                   │
│    • Pre-fills high-rise society for Swatch Van dispatch               │
└────────────────────────────────────────────────────────────────────────┘
```

### 5.1 Colorama Palette Definition
| Code | Name | French Name | Hex | Material Finish |
| :--- | :--- | :--- | :--- | :--- |
| **G05** | Green 05 - Stone | Vert Kaki Sourde | `#7D8471` | Velvet Matte Lacquer & Fluted Oak |
| **A01** | Argile | Argile Naturelle | `#B69E87` | Mineral Earth Textured Slat |
| **T03** | Terre Cuite | Terracotta Toscane | `#8A5836` | Warm Ochre Architectural Slat |
| **I02** | Ivoire | Blanc Ivoire Chaud | `#ECE7DC` | Soft Warm Silk Weave |
| **B04** | Bleu Paon | Bleu Paon Profond | `#2B444B` | Acoustic Studio Matte |
| **O06** | Smoked Oak | Chêne Fumé Véritable | `#3E2C1E` | Natural Hardwood Slat (NRC 0.85) |

---

## 6. What is Left to the Builder
- Pre-calibrating the normalized coordinate polygon array for the target feature wall.
- Wiring `SwatchContext` to sync between `/collection/stone` and `/studio`.
- Running the full verification suite (`node scripts/test-e2e.mjs`, `tsc`, `lint`, `build`).
