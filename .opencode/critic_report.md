# Stage 7 Antagonistic Critic Review Report

**Target Document:** [spec-plum-styler-sleek-redesign.md](file:///c:/Users/vigilare/Aura/.opencode/spec-plum-styler-sleek-redesign.md) (Lines 1–99)

## Reviewer Status

| Reviewer | Lens Description | Status |
| :--- | :--- | :--- |
| `egm-design` | Hostile Design Critic (architecture, edge cases, layout failure modes, scaling risks) | **completed** |
| `egm-structural` | Structural Layout Validator (heading hierarchy, symmetry, specification completeness) | **completed** |
| `egm-style` | Technical Copy Editor (clarity, precision, brevity, objective framing, buzzword stripping) | **completed** |

---

## Executive Severity Breakdown

- 🔴 **Blockers:** 5 (Implementation will fail, crash, or permanently break user state)
- 🟡 **Majors:** 5 (Architectural, usability, accessibility, or test contract flaws requiring remediation)
- 🟢 **Nits:** 6 (Cosmetic formatting, buzzwords, ambiguous syntax, and minor styling gaps)

---

## Prioritized Findings (Blockers → Majors → Nits)

### 1. Swatch Deletion & Removal Capability Permanently Lost - Severity: Blocker
* **Reviewer Lens:** `egm-design`
* **Affected Scope:** Section 2.5 (Lines 51–56) & Step 4 (Lines 85–89)
* **Discrepancy Description:** In `PlumSwatchBar.tsx` (lines 63–75), the swatch deletion control (`removeSwatch` via hover/tap `X` icon) exists strictly inside `<aside aria-label="Plum Floating Swatch Tray">`. The `<DialogContent>` only contains an immutable static swatch badge list with no removal actions. Step 4 removes `<aside>` completely without relocating `removeSwatch` into the dialog. Because `SwatchContext.addSwatch` enforces a hard ceiling of 3 items (`prev.length >= 3 ? prev : ...`), any user who saves 3 swatches is permanently trapped and cannot remove a swatch or sample a 4th finish without manually clearing browser localStorage.
* **Rationale & Recommendation:** Swatch deletion controls (`removeSwatch` button with `X` icon) MUST be migrated directly into the `<DialogContent>` swatch grid. In addition, the modal must display empty slot placeholders (`Slot 1/3: Empty`) so users clearly see remaining capacity and can manage their swatch selections directly from the dialog.

---

### 2. Contradictory User Action & Broken State Machine on "Sample Finish" - Severity: Blocker
* **Reviewer Lens:** `egm-design`
* **Affected Scope:** Section 2.5 (Lines 53–55) & Section 2.6 (Line 60)
* **Discrepancy Description:** Line 54 states: *"Clicking the header pill (`Sample Box (n/3)`) or the sidebar button ('Sample Finish') opens the sample ordering dialog."* However, line 55 immediately asserts: *"Adding a swatch provides instant inline feedback on the button ('Saved in Swatch Box' + checkmark)."* These two requirements describe mutually exclusive behaviors for a single button click. If clicking "Sample Finish" opens the ordering modal, the swatch is never added. If clicking it adds the swatch, it cannot open the modal. Furthermore, line 60 erroneously conflates modal triggers: *"`Sample Finish (Free)` and `Get Instant Quote →` triggering the laser measurement modal."*
* **Rationale & Recommendation:** Define a formal 2-state interaction contract for the sidebar button:
  1. **Unsaved State (`!isCurrentSwatchSaved`):** Button displays `Sample Finish (Free)`. Clicking it calls `handleAddActiveSwatch`, adds the current finish to `SwatchContext`, increments the header counter, and flips the button to `Saved in Swatch Box`.
  2. **Saved State (`isCurrentSwatchSaved`):** Button displays `Saved in Swatch Box (View Box)`. Clicking it opens the Swatch Ordering Dialog.
  3. **Header Pill (`Sample Box (n/3)`):** Unconditionally opens the Swatch Ordering Dialog.
  4. The laser measurement modal trigger is strictly isolated to `Get Instant Quote →`.

---

### 3. Missing Dialog Mounting and Invalid React Architecture for Modal State - Severity: Blocker
* **Reviewer Lens:** `egm-design` / `egm-structural`
* **Affected Scope:** Step 1.4 (Line 72) & Step 4.1 (Lines 86–89)
* **Discrepancy Description:** Step 1.4 commands removing `<PlumSwatchBar className="..." />` from `PlumKitchenStyler.tsx`, while Step 1.2 adds `onClick={() => setIsSampleBoxOpen(true)}` to the header. Step 4 then states: *"Export an explicit trigger/controller state (`isOpen`, `setIsOpen`) so both the header pill and sidebar button can trigger the sample ordering modal."* In React, a component cannot "export state" to its parent. Furthermore, if `<PlumSwatchBar />` is removed from the JSX tree in Step 1.4 and not remounted elsewhere, the dialog does not exist in the DOM, rendering `setIsSampleBoxOpen(true)` an inert no-op.
* **Rationale & Recommendation:**
  1. Refactor `PlumSwatchBar.tsx` into a controlled modal dialog (e.g. `PlumSampleBoxDialog.tsx`) that accepts standard props:
     ```tsx
     interface PlumSampleBoxDialogProps {
       open: boolean;
       onOpenChange: (open: boolean) => void;
     }
     ```
  2. Explicitly specify in Step 1 that `<PlumSampleBoxDialog open={isSampleBoxOpen} onOpenChange={setIsSampleBoxOpen} />` MUST remain mounted in `PlumKitchenStyler.tsx` alongside `Itemized BOM` and `Quote` dialogs.

---

### 4. Desktop Layout Height Desynchronization (Stage vs Sidebar) - Severity: Blocker
* **Reviewer Lens:** `egm-design`
* **Affected Scope:** Section 2.1 (Line 24) & `src/components/styler/PlumKitchenStyler.tsx` (Lines 460, 534)
* **Discrepancy Description:** The spec dictates: *"Desktop (≥1024px): The stage container expands to `w-full h-[calc(100vh-56px)]`."* However, in `PlumKitchenStyler.tsx`, the configurator `aside` container is hardcoded to `lg:h-[calc(100vh-120px)]` (leftover from the deleted 120px double header + banner). If only the visualizer stage container is changed to `calc(100vh-56px)` while the sidebar remains `calc(100vh-120px)`, the sidebar will be 64px shorter than the viewport, creating an uneven bottom gap, broken border alignment, and vertical layout shifting.
* **Rationale & Recommendation:** Both the visualizer stage AND the configurator sidebar container must be synchronized to `h-[calc(100vh-56px)]`, or the parent container `div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden"` must govern full height (`h-[calc(100vh-56px)]`) with both children inheriting `h-full`.

---

### 5. Geometrical Impossibility: Containment Math Claiming "Without Letterboxing" - Severity: Blocker
* **Reviewer Lens:** `egm-design`
* **Affected Scope:** Section 2.1 (Line 25) & Step 3 (Lines 81–84)
* **Discrepancy Description:** Step 3 requires `contain` aspect-fit math, but Step 3.2 claims: *"Ensure canvas scaling (`dpr`) adapts cleanly to responsive resize events without clipping or letterboxing."* It is geometrically impossible to fit a source image with a fixed aspect ratio (e.g. 16:10 / 1.6) into arbitrary viewport aspect ratios (e.g. 1.2 on desktop, 0.75 on mobile) using `contain` without letterboxing/pillarboxing. Furthermore, `PlumCanvasCompositor.tsx` uses `getContext('2d', { alpha: false })` without filling the background with the stage color (`#150E07`) prior to drawing. If `contain` shifts the draw coordinates `(drawX, drawY)`, the unpainted borders will display black or uninitialized pixel buffer artifacts.
* **Rationale & Recommendation:**
  1. Correct the specification wording: `contain` fitting eliminates image clipping by scaling the render within stage boundaries; when aspect ratios diverge, the letterbox/pillarbox margins are explicitly filled with the stage matte color `#150E07`.
  2. Mandate `ctx.fillStyle = '#150E07'; ctx.fillRect(0, 0, w, h);` as the first operation in `renderComposite` before `drawImage`.
  3. Specify removal of `object-cover` from `<canvas className="w-full h-full block object-cover">` and `<PlumCanvasCompositor className="w-full h-full object-cover">` to prevent CSS scaling conflicts with JavaScript 2D canvas drawing.

---

### 6. Phantom Camera Dock Pagination Specification - Severity: Major
* **Reviewer Lens:** `egm-structural` / `egm-design`
* **Affected Scope:** Section 2.3 (Lines 38–39)
* **Discrepancy Description:** The spec commands: *"Retain previous/next chevrons and view angle pagination pills (`Frontal`, `Perspective`, `Detail`)."* The codebase does NOT have text pills labeled `Frontal`, `Perspective`, `Detail`. It has dot indicators (`w-6` vs `w-2.5`). The view angle name is rendered in a separate absolute container at `bottom-3 left-6`. Stating "Retain" for non-existent markup creates ambiguity: is the developer expected to create new text buttons, or keep the existing dots? If text pills are added, on mobile viewports (<640px) three text pills plus two chevrons will exceed stage width or overlap with the camera subtitle.
* **Rationale & Recommendation:** Rewrite Section 2.3 to reflect codebase ground truth: retain existing numeric/dot pagination indicators and chevrons, or explicitly specify the markup, styling, and responsive breakpoint hiding if replacing dots with text labels.

---

### 7. Loss of Pricing Transparency in Compressed Fronts Selectors - Severity: Major
* **Reviewer Lens:** `egm-design`
* **Affected Scope:** Section 2.4 (Lines 43–45) & Step 2 (Lines 75–78)
* **Discrepancy Description:** The existing implementation displays informative subtitles inside the option cards: `Quarter-Cut Oak (+₹28k)` and `Two-Tone Split (+₹19k)`. Compressing these into `h-9` single-line segmented pills strips out the cost multiplier cues (`+₹28k`, `+₹19k`). Users will have no visibility that selecting "Natural Oak" adds ₹28,000 until they look at the BOM or the bottom pricing footer.
* **Rationale & Recommendation:** Include concise badge indicators within the segment pills (e.g. `Oak (+28k)`), or retain a dynamic tier description note directly below the segmented control displaying the price add-on before selection.

---

### 8. Touch Target Size Violations on 32px Swatches - Severity: Major
* **Reviewer Lens:** `egm-design`
* **Affected Scope:** Section 2.4 (Line 48)
* **Discrepancy Description:** Reducing swatch button size from 40px to 32px (`w-8 h-8`) violates WCAG 2.1 AA/AAA touch target guidelines (minimum 44×44px or 48×48px). On mobile screens with 34 color options organized in grid clusters, 32px swatches will cause accidental adjacent color selection and touch frustration.
* **Rationale & Recommendation:** Preserve the 40px hit area (`w-10 h-10` or `min-w-[44px] min-h-[44px]` with a visual inner circle `w-8 h-8` via border/padding) or ensure `p-1.5` hit target expansion.

---

### 9. Playwright Test Contract Incompleteness and False Verification Claims - Severity: Major
* **Reviewer Lens:** `egm-structural`
* **Affected Scope:** Step 5 (Lines 95–99)
* **Discrepancy Description:** Step 5.5 asserts that running `node scripts/test-styler-playwright.mjs` verifies "Zero canvas cropping across wide/laptop resolutions", "Zero camera dock collisions", and "Clean, functional sample box dialog opened via header pill." However, inspecting `test-styler-playwright.mjs` reveals it only runs on a single viewport (`1440x900`), does NOT query or click the header pill (`Sample Box (n/3)`), and contains zero collision detection logic between the camera dock and canvas elements. The verification claim is completely unfounded unless the test script is updated.
* **Rationale & Recommendation:** Add a required sub-step to update `scripts/test-styler-playwright.mjs` with:
  1. Locator test for header pill `Sample Box (n/3)` triggering the dialog.
  2. Multi-viewport audit (e.g. 1920x1080, 1440x900, 390x844).
  3. Assertion verifying the dialog opens and closes cleanly.

---

### 10. Mobile Sticky Footer Absence and Scrolled Conversion Bar - Severity: Major
* **Reviewer Lens:** `egm-design`
* **Affected Scope:** Section 2.6 (Lines 57–61)
* **Discrepancy Description:** On mobile (<1024px), the configurator sidebar is stacked vertically beneath the visualizer stage with `h-auto`. As a result, the "fixed bottom pricing & conversion bar" sits at the bottom of the entire DOM, buried beneath all 4 tabs and 34 color swatches. Users evaluating finishes on mobile cannot see the total estimate or conversion CTA without scrolling to the bottom of the document.
* **Rationale & Recommendation:** Specify mobile bottom bar behavior: on mobile viewports (<1024px), the pricing and conversion bar should be sticky at the bottom of the viewport (`fixed bottom-0 left-0 right-0 z-30 lg:relative`), with appropriate padding (`pb-24 lg:pb-0`) on the scroll container to prevent content occlusion.

---

### 11. Fluff, Buzzwords, and Subjective Marketing Glaze - Severity: Nit
* **Reviewer Lens:** `egm-style`
* **Affected Scope:** Lines 16, 30, 34, 48, 55, 71
* **Discrepancy Description:** The document is littered with non-technical buzzwords and marketing rhetoric: *"expansive architectural studio experience"* (Line 16), *"minimalist glassmorphic header"* (Line 30), *"retained architectural button"* (Line 34), *"circular ceramic swatches"* (Line 48), *"without cluttering the screen with unnecessary custom sheet/toast abstractions"* (Line 55), *"clean relative w-full h-full"* (Line 71).
* **Rationale & Recommendation:** Strip all subjective filler and emotional adjectives. Replace with strict CSS, architectural, and component terminology (e.g. replace "minimalist glassmorphic header" with "56px fixed header with semi-transparent background `bg-[#1C130B]/95`, backdrop blur, and bottom border").

---

### 12. Unnumbered and Asymmetric Section Headings - Severity: Nit
* **Reviewer Lens:** `egm-structural`
* **Affected Scope:** Line 64
* **Discrepancy Description:** Section 1 is `## 1. Context and Problem Statement` and Section 2 is `## 2. High-Level Architecture & UI/UX Redesign`. But Section 3 is unnumbered: `## Detailed Implementation Plan`.
* **Rationale & Recommendation:** Renumber to `## 3. Detailed Implementation Plan` to maintain structural numbering symmetry.

---

### 13. Grammatical Conflation of Modal Triggers - Severity: Nit
* **Reviewer Lens:** `egm-style`
* **Affected Scope:** Line 60
* **Discrepancy Description:** Line 60 reads: *"`Sample Finish (Free)` and `Get Instant Quote →` triggering the laser measurement modal."* This grammatically implies that `Sample Finish (Free)` triggers the laser measurement modal, which is false.
* **Rationale & Recommendation:** Rephrase: *"`Sample Finish (Free)` triggers the swatch box action; `Get Instant Quote →` triggers the laser measurement modal."*

---

### 14. Missing Specification Metadata and Target Branch - Severity: Nit
* **Reviewer Lens:** `egm-structural`
* **Affected Scope:** Lines 1–5
* **Discrepancy Description:** The header contains slug, route, and status, but lacks standard engineering metadata: Author, Target Branch (`main`), Created/Updated Date, and Acceptance Gate criteria.
* **Rationale & Recommendation:** Add standard metadata block to frontmatter.

---

### 15. Indecisive Sizing Specifications - Severity: Nit
* **Reviewer Lens:** `egm-style`
* **Affected Scope:** Line 26 (*"min-h-[45vh] or 50vh"*) & Line 40 (*"420px–460px"*)
* **Discrepancy Description:** Specifications must be deterministic, not ranges or options.
* **Rationale & Recommendation:** Lock values to concrete Tailwind classes: `min-h-[50vh]` for mobile stage, and `w-full lg:w-[420px] xl:w-[460px]` for configurator sidebar.

---

### 16. Missing a11y ARIA Contract for Segment Selectors & Dialog Triggers - Severity: Nit
* **Reviewer Lens:** `egm-design` / `egm-structural`
* **Affected Scope:** Section 2.4 (Lines 43–45) & Step 1.2 (Line 69)
* **Discrepancy Description:** The specification does not define ARIA roles for the new 3-way segmented selectors (`role="radiogroup"` / `role="radio"` with `aria-checked`, or `aria-pressed`) or `aria-haspopup="dialog"` for the header button.
* **Rationale & Recommendation:** Document the explicit ARIA attributes required for accessibility compliance.

---

## Verdict & Next Steps

The specification has **5 Blockers** and **5 Majors** that must be remediated in `spec-plum-styler-sleek-redesign.md` before implementation begins:
1. Move `removeSwatch` into `<DialogContent>` to prevent permanently trapping user swatch selections.
2. Clarify the 2-state interaction model on the sidebar `Sample Finish` button vs the header pill.
3. Define the controlled React props interface for `PlumSampleBoxDialog` and keep it mounted in `PlumKitchenStyler`.
4. Synchronize desktop container heights (`h-[calc(100vh-56px)]`) across both stage and sidebar.
5. Fix `contain` rendering in `PlumCanvasCompositor` to clear the matte background with `#150E07` and remove CSS `object-cover`.
6. Align `scripts/test-styler-playwright.mjs` test assertions with the redesigned UI controls.
