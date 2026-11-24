# Naive Reader Paraphrase

## High-Level Purpose & What This Spec Proposes
This document proposes a user interface and layout redesign for an interactive kitchen cabinet visualizer (located at `/kit/styler/kitchen_5` and dynamic `/kit/styler/[id]`). The redesign addresses viewport cramping and visual obstruction on laptop and mobile displays by removing a redundant top announcement banner, replacing a canvas-obstructing bottom swatch bar with on-demand dialog triggers in the header and sidebar, compacting cabinet profile and finish selection controls into low-profile segmented switches, and resizing the visualizer canvas container to edge-to-edge desktop dimensions. The goal is to present an unhindered 3D cabinet visualization studio while retaining existing color selection, camera angle pagination, pricing estimates, and sample-ordering workflows.

## Key Technical Mechanisms & Workflow
The existing system renders 3D cabinet imagery on an HTML5 canvas (`PlumCanvasCompositor`) by compositing ray-traced base finishes with binary RGBA alpha masks, controlled alongside a Radix UI tabbed sidebar (`Fronts`, `Handles`, `Worktop`, `Details`), camera view angle controls, and a floating swatch bar (`PlumSwatchBar`). The proposed design restructures this layout by:
1. Merging navigation and modal triggers into a single 56px glassmorphic header containing a "Sample Box (n/3)" pill button and an itemized Bill of Materials (BOM) trigger.
2. Converting the visualizer canvas scaling logic in `PlumCanvasCompositor` to an aspect-ratio `contain` model within an edge-to-edge container (`h-[calc(100vh-56px)]`), clearing the canvas floor so the camera pagination dock sits unobstructed.
3. Compressing the `Fronts` tab selectors into 3-button segmented grids (`Lisse`, `Cannelé`, `À Cadre` and `Matte Lacquer`, `Natural Oak`, `Duo Tone`), elevating the 34-shade ceramic color swatch grid above the vertical fold on desktop screens.
4. Decoupling the sample ordering Radix `Dialog` from the fixed floating canvas tray so it opens via the header pill or sidebar action button.

---

# Comprehension Findings

### Undefined Terms & Acronyms

1. **Severity: Major**
   - **Affected Scope:** Section 2.2 (Line 35), Section 2.6 (Line 59) — `BOM`
   - **Discrepancy Description & Rationale:** The document refers to an "Itemized BOM Button", a "BOM dialog", and "linking to BOM" without defining the acronym or explaining what data it presents. While standard in manufacturing/engineering as "Bill of Materials", a fresh reader has no definition of what constitutes a BOM in this web application (e.g., cabinet box dimensions, hardware parts, finish square footage) or what component renders it.

2. **Severity: Major**
   - **Affected Scope:** Title (Line 1), Section 1 (Line 11), Section 2.5 (Line 52), Step 1 (Line 72), Step 4 (Line 85) — `Plum`, `Plum Studio`, `Plum Styler`
   - **Discrepancy Description & Rationale:** "Plum" is referenced as a primary naming prefix across components (`PlumKitchenStyler`, `PlumCanvasCompositor`, `PlumSwatchBar`). The document does not define what "Plum" represents (e.g., an external cabinet supplier/system like Plum Living, a brand partnership, or an internal project codename), leaving an unfamiliar developer without context on domain boundaries.

3. **Severity: Nit**
   - **Affected Scope:** Section 1 (Line 15), Section 2.4 (Line 46) — `Colorama Palette`
   - **Discrepancy Description & Rationale:** The document refers to the "34-shade Colorama palette" without explaining if "Colorama" is a proprietary third-party color collection, a design system token group, or internal catalog nomenclature.

4. **Severity: Nit**
   - **Affected Scope:** Step 3.2 (Line 83) — `dpr`
   - **Discrepancy Description & Rationale:** Used in parentheses without being defined inline as Device Pixel Ratio (`window.devicePixelRatio`).

5. **Severity: Nit**
   - **Affected Scope:** Status (Line 5) — `POST-ZOOM-OUT REMEDIATION`
   - **Discrepancy Description & Rationale:** Status metadata mentions a "POST-ZOOM-OUT" milestone or phase without defining what the "Zoom-Out" review or event was.

---

### Ambiguous Directives

1. **Severity: Blocker**
   - **Affected Scope:** Section 2.1 (Line 25) vs. Step 3.2 (Line 83) — Aspect-Ratio Containment vs. "Without Letterboxing"
   - **Discrepancy Description & Rationale:** Section 2.1 dictates that the canvas preserves aspect ratio via "object-fit contain math inside `PlumCanvasCompositor`" against an outer dark background (`bg-[#150E07]`), ensuring no clipping occurs on any display aspect ratio. However, Step 3.2 explicitly instructs: *"Ensure canvas scaling (`dpr`) adapts cleanly to responsive resize events without clipping or letterboxing."* In 2D canvas and viewport math, fitting an arbitrary aspect ratio render into a variable screen size without clipping mathematically requires letterboxing/pillarboxing (the empty space showing `bg-[#150E07]`). Stating "without clipping or letterboxing" is a direct geometric contradiction. The spec must clarify whether letterbox bars matching `bg-[#150E07]` are expected and intentional.

2. **Severity: Major**
   - **Affected Scope:** Section 2.5 (Line 53) vs. Step 1.2 (Line 69) vs. Step 4.1 (Line 87) — Swatch Dialog Controller State Architecture
   - **Discrepancy Description & Rationale:** Step 4.1 directs: *"Export an explicit trigger/controller state (`isOpen`, `setIsOpen`) so both the header pill and sidebar button can trigger the sample ordering modal."* In React, child components cannot export state variables upward to parent or sibling components. Step 1.2 implements the header button as `<button onClick={() => setIsSampleBoxOpen(true)}>`, which implies that state is held in the parent `PlumKitchenStyler`. Step 4.1 fails to clarify whether `PlumSwatchBar` should be refactored into a purely controlled component receiving `isOpen` and `onOpenChange` props, or if state is mediated via a shared React Context.

3. **Severity: Major**
   - **Affected Scope:** Section 2.5 (Line 55) vs. Section 2.6 (Line 60) — Inline "Saved in Swatch Box" Feedback Target
   - **Discrepancy Description & Rationale:** Section 2.5 states: *"Adding a swatch provides instant inline feedback on the button ('Saved in Swatch Box' + checkmark)"*. However, the document does not specify *which* button displays this text. Section 2.6 specifies the fixed bottom buttons as `Sample Finish (Free)` and `Get Instant Quote →`, while Section 2.4 specifies swatches as 32px circular buttons. It is unclear if clicking a color circle changes the text of the sticky footer button, or if there is an "Add to Sample Box" button inside the active color card in the sidebar.

---

### Missing Context

1. **Severity: Major**
   - **Affected Scope:** Section 2.1 (Line 24) & Section 2.4 (Line 40) — Desktop Dual-Pane Layout Structure (Stage vs. Sidebar)
   - **Discrepancy Description & Rationale:** Section 2.1 specifies that on desktop (≥1024px), the stage container expands to `w-full h-[calc(100vh-56px)]`, while Section 2.4 specifies a configurator sidebar of `420px–460px`. The spec never defines how these two containers coexist horizontally on desktop: does the stage use `flex-1` alongside a fixed `w-[440px]` sidebar in a parent flex row, or does the sidebar float on top of a full-screen canvas? An implementer applying `w-full` literally to the stage container in a flex layout will cause horizontal viewport overflow.

2. **Severity: Major**
   - **Affected Scope:** Section 2.2 (Line 33), Step 1.2 (Line 69) — `swatches` State Origin and Capacity Bounds
   - **Discrepancy Description & Rationale:** The header pill button displays `Sample Box (${swatches.length}/3)`. The document never specifies where `swatches` is persisted (local component state, custom hook, localStorage, or server session), how a user removes a swatch, or what business logic applies if a user attempts to select a 4th swatch when the box is full.

3. **Severity: Major**
   - **Affected Scope:** Section 2.6 (Line 60) — Laser Measurement Modal Reference
   - **Discrepancy Description & Rationale:** Section 2.6 references a button `Get Instant Quote →` *"triggering the laser measurement modal"*. No component path, modal name, or interface contract is provided for this modal, leaving the developer to search external codebase files or guess its implementation.

4. **Severity: Nit**
   - **Affected Scope:** Section 2.3 (Lines 36-39) — Mobile Camera Dock Positioning
   - **Discrepancy Description & Rationale:** The camera pagination dock is anchored at `bottom-4 left-1/2 -translate-x-1/2`. The document does not describe how this dock behaves in the mobile split view where the visualizer stage is compressed to `min-h-[45vh]` or `50vh` above a scrolling panel, specifically whether it risks overlapping lower cabinet elements on short mobile screens.

---

### Conceptual Gaps

1. **Severity: Major**
   - **Affected Scope:** Section 1 (Line 11), Section 2.1 (Line 25), Step 3.1 (Line 82) — Coordinate Synchronization of Base Render and Binary Alpha Masks
   - **Discrepancy Description & Rationale:** The document states that the styler composites ray-traced cabinet finishes using binary RGBA alpha masks and requires `renderComposite` in `PlumCanvasCompositor.tsx` to support `contain` fitting. However, it does not explain how the source image dimensions, mask buffer dimensions, and canvas display dimensions interact. A new reader cannot tell whether the base 3D render and alpha masks are pre-rendered at a 1:1 identical resolution, or if the compositor must scale disparate mask layers dynamically to match the base canvas buffer.

2. **Severity: Nit**
   - **Affected Scope:** Section 2.4 (Line 41), Step 5.5 (Line 95) — Test Harness Environment Prerequisites
   - **Discrepancy Description & Rationale:** Step 5.5 references running `node scripts/test-styler-playwright.mjs` against a local build. The document does not specify whether this script spins up its own local web server or assumes a running dev server on `http://localhost:3000`, which could cause fresh developers or CI jobs to fail upon execution.
