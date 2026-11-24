# Specification: Plum Studio Sleek Layout & UX Redesign

Slug: `spec-plum-styler-sleek-redesign`
Target Route: `/kit/styler/kitchen_5` (and dynamic `/kit/styler/[id]`)
Target Branch: `main`
Status: **APPROVED — POST-STAGE-8 ARCHITECTURAL SIGN-OFF**

---

## 1. Context and Problem Statement

The kitchen styler at `/kit/styler/kitchen_5` accurately composites ray-traced cabinet finishes using binary RGBA alpha masks. However, visual evaluation highlights concrete usability and visual issues:

1. **Obstructive Swatch Bar:** The floating swatch tray (`PlumSwatchBar`) is fixed at `bottom-4` over the canvas, covering lower cabinet drawers and colliding with the bottom camera angle pagination controls.
2. **Cramped Double Header:** A top announcement banner sits stacked directly on top of the sub-navigation header, consuming ~90px of vertical space and squeezing the viewport on standard laptop displays.
3. **Chunky Profile/Finish Selectors:** In the `Fronts` tab, large stacked button blocks and verbose descriptive text push the 28-shade Colorama palette down, requiring unnecessary vertical scrolling to view colors.
4. **Visual Framing Disconnect:** Heavy padding around the canvas container creates a double-boxed effect rather than an integrated studio experience.

---

## 2. High-Level Architecture & UI/UX Redesign

### 2.1 Aspect-Ratio-Safe Studio Stage (Edge-to-Edge Desktop, Split Mobile)
- Remove the outer double padding (`p-2 sm:p-4`), outer border, and shadow from the canvas container.
- **Desktop (≥1024px):** The parent flex row container expands to `w-full h-[calc(100vh-56px)] overflow-hidden`.
  - The stage container occupies `relative flex-1 h-full bg-[#150E07] flex items-center justify-center overflow-hidden`.
  - The configurator sidebar occupies `w-full lg:w-[420px] xl:w-[460px] h-full bg-[#1C130B] border-l border-[#C5A880]/30 flex flex-col`.
- **Canvas Sizing:** The canvas preserves the natural aspect ratio of the 3D render (`drawW`, `drawH` computed via true aspect-ratio `contain` math inside `PlumCanvasCompositor`). When aspect ratios diverge, the margins are letterboxed with the studio matte background color `#150E07`. Remove CSS `object-cover` from canvas elements.
- **Mobile (<1024px):** Maintain the responsive vertical split (`min-h-[50vh]` for the visualizer stage, and the lower viewport for the scrollable configurator panel).

### 2.2 Unified Studio Header (56px)
- Remove the redundant announcement banner on styler routes.
- Use a single 56px sticky header (`h-14`, `bg-[#1C130B]/95`, `backdrop-blur-md`, `border-b border-[#C5A880]/20`):
  - **Left:** Return breadcrumb (`← Kits & Collections / Line Kitchen 3D Styler`).
  - **Right:**
    - **Sample Box Button:** Minimal pill `<button>` (`Sample Box (${swatches.length}/3)`) with a box icon and `aria-haspopup="dialog"`, wired directly to open `PlumSampleBoxDialog`.
    - **Itemized BOM Button:** Retained architectural button triggering the BOM dialog.

### 2.3 Unobstructed Floating Camera Dock
- Remove the colliding swatch bar from the canvas so the existing camera angle dock (`bottom-4 left-1/2 -translate-x-1/2`) sits cleanly and unobstructed above the stage floor.
- Retain existing numeric/dot indicators (`w-6` active vs `w-2.5` inactive) and previous/next chevrons. Retain the separate perspective subtitle at `bottom-3 left-6`.

### 2.4 Streamlined Configurator Sidebar
- **Retain the 4 Radix Tabs:** Preserve `<TabsPrimitive.Root>` with `facades` (Fronts), `handles` (Handles), `worktop` (Worktop), and `extras` (Details) to maintain strict compatibility with automated Playwright test contracts.
- **Compact Sidebar Header:** Tighten title block typography; display collection badge (`Line Collection · 48H Makeover`) and concise heading (`Customizable Kitchen Envelope`).
- **Low-Profile Segment Selectors in `Fronts` Tab:**
  - **Profile Style:** 3-way segmented pill switch (`Lisse`, `Cannelé`, `À Cadre`, `h-9 rounded-xl text-xs`) with `role="radiogroup"`.
  - **Finish Quality:** 3-way segmented pill switch with cost transparency badges (`Matte Lacquer`, `Oak (+₹28k)`, `Duo (+₹19k)`).
- **Prominent Colorama Palette:**
  - Shifted up directly below the finish selector so that color circles are immediately visible without scrolling on 1440×900 screens.
  - 40px circular touch targets (`w-10 h-10` with visual 32px color circle) with active gold ring indicator and native `title` attribute for accessibility.
  - Retain the active color info card below the swatches displaying shade name, description, and finish type for touch/mobile clarity.

### 2.5 Controlled Swatch Box Dialog Architecture
- Remove the permanent floating `<aside aria-label="Plum Floating Swatch Tray">` markup from the visualizer canvas.
- Refactor `PlumSwatchBar.tsx` into a controlled dialog component `PlumSampleBoxDialog` accepting `{ open: boolean; onOpenChange: (open: boolean) => void }`, mounted in `PlumKitchenStyler.tsx`.
- **Swatch Deletion inside Modal:** Ensure each saved swatch in the dialog's grid includes an accessible remove button (`X` icon) calling `removeSwatch(swatch.id)` so users are never trapped at capacity.
- **2-State Sidebar Button Contract:**
  1. Unsaved State (`!isCurrentSwatchSaved`): Button displays `Sample Finish (Free)`. Clicking calls `handleAddActiveSwatch`, adds the finish to `SwatchContext`, and flips the button to `Saved in Swatch Box`.
  2. Saved State (`isCurrentSwatchSaved`): Button displays `Saved in Swatch Box`. Clicking opens the `PlumSampleBoxDialog`.
  3. Header Pill (`Sample Box (n/3)`): Unconditionally opens `PlumSampleBoxDialog`.

### 2.6 Fixed Bottom Pricing & Conversion Bar (Retained)
- Keep the existing fixed footer docked to the bottom of the configurator sidebar:
  - **Total Makeover Estimate:** `₹3,15,650 (incl. 18% GST)` with `View Details` linking to BOM dialog.
  - **Action Buttons:** `Sample Finish (Free)` (swatch action) and `Get Instant Quote →` (strictly triggering the laser measurement modal).

---

## 3. Detailed Implementation Plan

### Step 1: Layout & Header Refactoring in `src/components/styler/PlumKitchenStyler.tsx`
1. Delete the redundant top banner (`<div className="bg-[#1C130B] border-b ... py-2">`).
2. Update the header:
   - Add `<button onClick={() => setIsSampleBoxOpen(true)} aria-haspopup="dialog" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#C5A880]/40 text-xs font-semibold text-[#C5A880] hover:bg-[#C5A880]/10">` displaying `Sample Box (${swatches.length}/3)`.
3. Simplify the stage container and synchronize heights:
   - Make the parent container `h-[calc(100vh-56px)]`.
   - Visualizer stage container: `relative flex-1 h-full bg-[#150E07] flex items-center justify-center overflow-hidden`. Remove outer `p-2 sm:p-4`, `aspect-[4/3]`, `rounded-3xl`, and border.
   - Configurator sidebar: `w-full lg:w-[420px] xl:w-[460px] h-full bg-[#1C130B] border-t lg:border-t-0 lg:border-l border-[#C5A880]/30 flex flex-col`.
4. Remove the floating `<PlumSwatchBar className="..." />` from the stage and replace it with `<PlumSampleBoxDialog open={isSampleBoxOpen} onOpenChange={setIsSampleBoxOpen} />` mounted in the JSX tree.

### Step 2: Configurator Compaction in `src/components/styler/PlumKitchenStyler.tsx`
1. In the `facades` (Fronts) tab:
   - Compress `1. Profile Style` into a 3-button segment grid (`grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#FAF8F5]/5 border border-[#C5A880]/20`).
   - Compress `2. Finish Quality` into a 3-button segment grid with price labels (`Matte Lacquer`, `Oak (+₹28k)`, `Duo (+₹19k)`).
   - Position `3. Color Palette` immediately below so swatches sit above the fold on desktop.
2. Maintain all Radix tab trigger values (`facades`, `handles`, `worktop`, `extras`) and data bindings so `test-styler-playwright.mjs` test locators remain 100% stable.

### Step 3: Aspect-Ratio Containment in `src/components/styler/PlumCanvasCompositor.tsx`
1. In `renderComposite`, add `ctx.fillStyle = '#150E07'; ctx.fillRect(0, 0, w, h);` as the first canvas operation before drawing.
2. Update lines 74–90 to true `contain` math:
   ```ts
   const imgRatio = img.naturalWidth / img.naturalHeight;
   const canvasRatio = w / h;
   let drawW = w;
   let drawH = h;
   let drawX = 0;
   let drawY = 0;

   if (canvasRatio > imgRatio) {
     // Canvas is wider than image: pillarbox left and right
     drawH = h;
     drawW = h * imgRatio;
     drawX = (w - drawW) / 2;
   } else {
     // Canvas is taller than image: letterbox top and bottom
     drawW = w;
     drawH = w / imgRatio;
     drawY = (h - drawH) / 2;
   }
   ```
3. Remove `object-cover` from `<canvas className="...">` and container styles.

### Step 4: Controlled Dialog & Swatch Deletion in `src/components/swatches/PlumSwatchBar.tsx`
1. Refactor component to `PlumSampleBoxDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void })`.
2. Remove the `<aside aria-label="Plum Floating Swatch Tray">` markup.
3. In `<DialogContent>`, add an accessible delete button `<button onClick={() => removeSwatch(swatch.id)} aria-label="Remove swatch">` with an `X` icon on each saved swatch item so users can remove swatches directly inside the modal.

### Step 5: Verification and Quality Gates
1. Run `node scripts/test-e2e.mjs` (must pass 117/117).
2. Run `npx tsc --noEmit` (0 errors).
3. Run `npm run lint` (0 errors).
4. Run `npm run build` (Turbopack static build).
5. Update `scripts/test-styler-playwright.mjs` to include a test step clicking the header `Sample Box (n/3)` pill and asserting dialog visibility.
6. Run `node scripts/test-styler-playwright.mjs` to capture screenshots and verify zero canvas cropping, zero camera dock collisions, and functional sample ordering.
