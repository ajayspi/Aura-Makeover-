# Handoff Report: Business Logic Engines, Estimator Wizard, and State Flow

**Target Milestone**: AuroMakeover Phase 1 Homepage Redesign  
**Surveyed Areas**: `src/lib/engines.ts`, `src/components/EstimatorGateway.tsx`, Requirement R5 (Wizard & Animated Counter & WhatsApp CTA), Requirement R4 & Hero CTA integration.

---

## 1. Observation

### 1.1 `src/lib/engines.ts` Codebase Inventory
`src/lib/engines.ts` is 143 lines long and contains 3 exported pure functions, 6 exported TypeScript interfaces, and dynamic pricing escrow logic. No external libraries are imported.

#### 1. `calculateRollNesting` (lines 1-52)
- **Input Interface (`RollNestingInput`)**:
  ```ts
  export interface RollNestingInput {
    wallWidthFt: number;
    wallHeightFt: number;
    rollWidthInches: number; // typically 42" or 54"
    patternRepeatInches: number;
  }
  ```
- **Output Interface (`RollNestingOutput`)**:
  ```ts
  export interface RollNestingOutput {
    totalVerticalDrops: number;
    matchingWasteInches: number;
    requiredContinuousMeters: number;
    totalSqFtRequired: number;
    totalSqFtWithBuffer: number; // Min 11% safety buffer
  }
  ```
- **Mathematical Formulas**:
  1. Width in inches: `wallWidthInches = input.wallWidthFt * 12`
  2. Height in inches: `wallHeightInches = input.wallHeightFt * 12`
  3. Vertical drops: `totalVerticalDrops = Math.ceil(wallWidthInches / input.rollWidthInches)`
  4. Pattern match waste: `matchingWasteInches = (totalVerticalDrops - 1) * input.patternRepeatInches`
  5. Drop cut length: `dropHeightInches = wallHeightInches + 4` (2" top bleed, 2" bottom bleed)
  6. Total continuous linear inches: `totalLinearInches = (totalVerticalDrops * dropHeightInches) + matchingWasteInches`
  7. Metric conversion: `requiredContinuousMeters = totalLinearInches * 0.0254`
  8. Exact wall area: `exactWallSqFt = input.wallWidthFt * input.wallHeightFt`
  9. Roll consumption area: `totalSqFtRequired = (totalLinearInches * input.rollWidthInches) / 144`
  10. Safety buffer: `safetyBufferSqFt = exactWallSqFt * 1.11` (11% safety buffer)
  11. Final billed sqft: `totalSqFtWithBuffer = Math.max(totalSqFtRequired, safetyBufferSqFt)`

#### 2. `analyzeSolarLux` (lines 54-85)
- **Input Interface (`SolarLuxInput`)**:
  ```ts
  export interface SolarLuxInput {
    compassAngleDegrees: number; // 0 = North, 90 = East, 180 = South, 270 = West
    floorNumber: number;
  }
  ```
- **Output Interface (`SolarLuxOutput`)**:
  ```ts
  export interface SolarLuxOutput {
    highSolarHeatRadiation: boolean;
    recommendedBlindType: 'Standard Translucent Sheer' | '100% Blackout Motorized Blinds' | 'Double-cell Honeycomb Blinds';
  }
  ```
- **Logic**:
  - `isWestOrSouthWest = input.compassAngleDegrees >= 180 && input.compassAngleDegrees <= 315`
  - `isHighFloor = input.floorNumber >= 10`
  - `highSolarHeatRadiation = isWestOrSouthWest && isHighFloor`
  - If `highSolarHeatRadiation` is true -> `'Double-cell Honeycomb Blinds'`
  - Else if `isWestOrSouthWest` is true -> `'100% Blackout Motorized Blinds'`
  - Else -> `'Standard Translucent Sheer'`

#### 3. `calculateDynamicPricing` (lines 87-142)
- **Input Interface (`PricingInput`)**:
  ```ts
  export interface PricingInput {
    rawMaterialBasePerSqFt: number;
    totalSqFtRequired: number;
    isSmartMotorized: boolean; // Flat add-on fee if true
  }
  ```
- **Output Interface (`PricingOutput`)**:
  ```ts
  export interface PricingOutput {
    materialCost: number;
    primerCost: number;
    installationLaborCost: number;
    subtotal: number;
    gstAmount: number;
    totalRetailPrice: number;
    escrowTranches: {
      deposit10: number;
      materialRelease60: number;
      postQAUnlock30: number;
    };
  }
  ```
- **Constants & Pricing Formulas**:
  - `PRIMER_COST_PER_SQFT = 15` (INR/sqft)
  - `INSTALL_LABOR_PER_SQFT = 25` (INR/sqft)
  - `MOTOR_ADDON_FLAT = 15000` (INR)
  - `materialCost = input.rawMaterialBasePerSqFt * input.totalSqFtRequired`
  - `primerCost = 15 * input.totalSqFtRequired`
  - `installationLaborCost = 25 * input.totalSqFtRequired`
  - `subtotal = materialCost + primerCost + installationLaborCost + (input.isSmartMotorized ? 15000 : 0)`
  - `gstAmount = subtotal * 0.18` (18% GST)
  - `totalRetailPrice = subtotal + gstAmount`
  - **Escrow Tranches**:
    - `deposit10 = totalRetailPrice * 0.10` (10% upfront deposit)
    - `materialRelease60 = totalRetailPrice * 0.60` (60% when material is released from inventory/printer)
    - `postQAUnlock30 = totalRetailPrice * 0.30` (30% after technician QA and customer sign-off)

---

### 1.2 Current `EstimatorGateway.tsx` Observations
- **Location**: `src/components/EstimatorGateway.tsx` (212 lines)
- **State variables**:
  - `widthFt`: number (default: `10`, range: 5 to 30)
  - `heightFt`: number (default: `10`, range: 8 to 15)
  - `quality`: object `{ id: string, name: string, rate: number, smart: boolean }` (default: `QUALITIES[0]`)
  - `society`: string (default: `"My Home Bhooja"`)
  - `pricing`: `PricingState | null` (`PricingOutput & { sqft: number }`)
  - `isCalculating`: boolean (controls spinner)
- **Presets Defined**:
  - `QUALITIES`:
    - `Standard Canvas`: rate `120`, `smart: false`
    - `Belgian Luxury`: rate `250`, `smart: false`
    - `Smart Motorized`: rate `300`, `smart: true`
  - `SOCIETIES`:
    - `"My Home Bhooja"`
    - `"Aparna Sarovar Zenith"`
    - `"Rajapushpa Provincia"`
    - `"Prestige High Fields"`
    - `"Other (West Corridor)"`
- **Calculation invocation in `useEffect` (lines 33-66)**:
  - Invokes `calculateRollNesting` with `rollWidthInches: 42` and `patternRepeatInches: 24`.
  - Passes resulting `nesting.totalSqFtWithBuffer` into `calculateDynamicPricing`.
  - Uses `setTimeout(..., 300)` as a debounce.
- **WhatsApp Booking Handler (lines 68-72)**:
  - Currently opens placeholder phone number: `https://wa.me/919999999999?text=...`.
  - Pre-fills rough text including `society`, `widthFt`, `heightFt`, `quality.name`, and `pricing.totalRetailPrice`.
- **Existing UX Architecture**:
  - Monolithic single card view (all sliders, tier selection, output card, and society dropdown visible simultaneously).
  - Price is rendered statically with no number count-up animation (`₹{Math.round(pricing?.totalRetailPrice || 0).toLocaleString()}`).
  - Uses Tailwind generic styling (`gray-200`, `gray-600`) rather than the strict palette defined in `ORIGINAL_REQUEST.md`.

---

### 1.3 Page Structure & Navigation Anchors
- In `src/app/page.tsx`:
  - Line 14: `<div id="estimator" className="py-20 bg-white">` defines the anchor ID `#estimator`.
- In `src/components/HeroSection.tsx`:
  - Lines 7-9:
    ```tsx
    const scrollToEstimator = () => {
      document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
    };
    ```
  - Line 33: "Get Instant Quote" button triggers `onClick={scrollToEstimator}`.

---

## 2. Logic Chain

### 2.1 Preserving 100% of Business Logic in the 3-Step Wizard Redesign
1. **Engine Invariance**: The mathematical models in `src/lib/engines.ts` (`calculateRollNesting` and `calculateDynamicPricing`) are pure functions with zero side effects. They can be invoked synchronously or debounced.
2. **State Decoupling**: In a multi-step wizard, the input states (`widthFt`, `heightFt`, `quality`, `society`) should persist across step transitions so the user can move forward and backward freely without resetting inputs.
3. **Step Structure Mapping**:
   - **Step 1: Room Size**:
     - User inputs: `widthFt` (5-30 ft) and `heightFt` (8-15 ft).
     - Optional helper: Quick room preset buttons (e.g., Accent Wall 10×10, Master Bed 14×10, Living Room 18×10) that update width/height directly.
     - Live calculations displayed: Exact wall area (`widthFt * heightFt` sqft) and vertical drops (`Math.ceil((widthFt * 12) / 42)`).
     - Action: "Next: Choose Finish →".
   - **Step 2: Finish Tier**:
     - User inputs: Select finish tier from `QUALITIES` (Standard Canvas ₹120, Belgian Luxury ₹250, Smart Motorized ₹300).
     - Real-time calculations: Shows full pricing breakdown:
       - Material cost (`pricing.materialCost`)
       - Primer prep (`pricing.primerCost` @ ₹15/sqft)
       - Installation labor (`pricing.installationLaborCost` @ ₹25/sqft)
       - Motorized add-on (`₹15,000` flat if motorized)
       - 18% GST (`pricing.gstAmount`)
       - Total retail price (`pricing.totalRetailPrice`) with **Animated Price Counter**
       - 10% Escrow tranche (`pricing.escrowTranches.deposit10`)
     - Actions: "← Back" and "Next: Finalize & Book →".
   - **Step 3: Reserve & Book**:
     - User inputs: Select society from `SOCIETIES` (My Home Bhooja, Aparna Sarovar Zenith, Rajapushpa Provincia, Prestige High Fields, Other).
     - Final summary review card: Selected dimensions, finish name, total estimated amount, 10% deposit, 48hr guarantee tag.
     - WhatsApp CTA: Green button opening `https://wa.me/919700675637` with pre-filled encoded text.
     - Action: "← Back to Finishes".

### 2.2 Animated Price Counter Implementation
1. **Requirement**: R5 and Acceptance Criteria state: *"Estimator price number visibly animates/counts when sliders change (use Framer Motion animate or a counter animation)"*.
2. **Framer Motion Architecture**:
   - Framer Motion 13 (`framer-motion: ^13.3.0`) provides `animate` from `'framer-motion'`.
   - A dedicated `AnimatedCounter` component creates a smooth count-up from the previous price to the new price whenever `value` updates.
   - **Implementation Pattern**:
     ```tsx
     import React, { useEffect, useState, useRef } from 'react';
     import { animate } from 'framer-motion';

     interface AnimatedPriceProps {
       value: number;
       className?: string;
     }

     export function AnimatedPrice({ value, className }: AnimatedPriceProps) {
       const [displayValue, setDisplayValue] = useState(value);
       const prevValueRef = useRef(value);

       useEffect(() => {
         const from = prevValueRef.current;
         const to = value;

         const controls = animate(from, to, {
           duration: 0.6,
           ease: [0.16, 1, 0.3, 1], // easeOutExpo
           onUpdate: (latest) => {
             setDisplayValue(Math.round(latest));
           },
           onComplete: () => {
             prevValueRef.current = value;
           }
         });

         return () => controls.stop();
       }, [value]);

       return (
         <span className={className}>
           ₹{displayValue.toLocaleString('en-IN')}
         </span>
       );
     }
     ```
   - This prevents hydration mismatch during SSR, cancels in-flight animations when sliders move rapidly, and formats numbers using Indian numbering notation (`toLocaleString('en-IN')`).

### 2.3 WhatsApp CTA Button Specification
1. **Target Phone Number**: `919700675637` (fixes previous placeholder `919999999999`).
2. **Payload Structure**:
   ```ts
   const generateWhatsAppUrl = (
     society: string,
     widthFt: number,
     heightFt: number,
     qualityName: string,
     qualityRate: number,
     pricing: PricingState | null
   ) => {
     const priceFormatted = Math.round(pricing?.totalRetailPrice || 0).toLocaleString('en-IN');
     const depositFormatted = Math.round(pricing?.escrowTranches.deposit10 || 0).toLocaleString('en-IN');
     const totalSqFt = Math.round(pricing?.sqft || 0);

     const text = [
       "Hi AuroMakeover! 👋",
       "",
       `I'd like to book a Free Swatch Van Visit to *${society}*.`,
       "",
       "*Rough Estimate Details:*",
       `• Wall Size: ${widthFt}ft × ${heightFt}ft (${widthFt * heightFt} sqft wall area)`,
       `• Material Required (incl. nesting buffer): ${totalSqFt} sqft`,
       `• Finish Tier: ${qualityName} (@ ₹${qualityRate}/sqft)`,
       `• Estimated Total: ₹${priceFormatted} (incl. 18% GST)`,
       `• 10% Escrow Deposit: ₹${depositFormatted}`,
       "",
       "Please confirm the earliest slot for the mobile swatch van!"
     ].join("\n");

     return `https://wa.me/919700675637?text=${encodeURIComponent(text)}`;
   };
   ```

### 2.4 Society Card (R4) & Hero CTA Smooth Scroll Interaction
1. **Target Anchor**: Both the Hero CTA and the 4 Society Cards in R4 must scroll to `#estimator`.
2. **DOM Navigation**:
   ```ts
   const scrollToEstimator = () => {
     const el = document.getElementById('estimator');
     if (el) {
       el.scrollIntoView({ behavior: 'smooth', block: 'start' });
     }
   };
   ```
3. **Pre-selecting Society from Society Cards**:
   - When a user clicks "Check My Flat →" on "Aparna Sarovar Zenith" in the R4 section, the estimator should ideally pre-populate that society.
   - Because `src/app/page.tsx` is a Server Component, a decoupled **Custom Event** or URL hash listener allows cross-component communication without converting `page.tsx` into a heavy client component:
     ```ts
     // In SocietyCard:
     const handleCheckFlat = (societyName: string) => {
       window.dispatchEvent(new CustomEvent('auro:select-society', { detail: { society: societyName } }));
       document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
     };

     // In EstimatorGateway.tsx:
     useEffect(() => {
       const handler = (e: Event) => {
         const customEvent = e as CustomEvent<{ society: string }>;
         if (customEvent.detail?.society) {
           setSociety(customEvent.detail.society);
         }
       };
       window.addEventListener('auro:select-society', handler);
       return () => window.removeEventListener('auro:select-society', handler);
     }, []);
     ```

### 2.5 Animated Ticker (Above Estimator)
1. Requirement R5 specifies an auto-scrolling ticker placed directly above the estimator.
2. Structure:
   - Infinite marquee displaying rotating micro-testimonials and statistics:
     - `"Priya K., My Home Bhooja — '5 stars, done in 1 day!'"`
     - `"Rajesh M., Aparna Sarovar Zenith — 'Zero dust, flawless alignment'"`
     - `"48-Hour Installation Guarantee"`
     - `"100% Rental-Safe Substrates"`
     - `"Vikram S., Rajapushpa Provincia — 'Van arrived in 2 hours with 200+ physical swatches'"`
     - `"2-Year Warranty Vault Included"`
     - `"Prestige High Fields — 38 flats transformed"`

---

## 3. Caveats

1. **`analyzeSolarLux` Function**: Currently, `analyzeSolarLux` is exported in `src/lib/engines.ts` but is not invoked in the existing `EstimatorGateway.tsx`. In Step 2 or Step 3 of the new wizard, we can optionally display a subtle recommendation pill (e.g. "Smart Motorized recommended for West-facing flats above 10th floor") or preserve it as a utility for technician/admin flows.
2. **Terminal Script Execution**: PowerShell on this Windows environment restricts `.ps1` execution scripts by default (`UnauthorizedAccess`). Build commands during implementation should use `cmd.exe /c` or ensure appropriate node command invocation.
3. **Strict Color Palette Enforcement**: All styling in the redesigned `EstimatorGateway.tsx` must strictly use the design system palette (`#1C130B`, `#C5A880`, `#8A5836`, `#FAF8F5`, `#15803D`) and avoid default Tailwind grays (`gray-100`, `gray-200`, `gray-500`). All rounded corners must be `rounded-2xl` or `rounded-3xl` (`rounded` or `rounded-sm` violate acceptance criteria).

---

## 4. Conclusion

1. **Engine Integrity**: The existing calculation engines in `src/lib/engines.ts` are robust, mathematically sound, and should be kept 100% intact. The wizard can consume them directly via `calculateRollNesting` and `calculateDynamicPricing`.
2. **Wizard Redesign Plan**:
   - Redesign `EstimatorGateway.tsx` into a 3-step stateful wizard:
     - `step = 1`: Room Dimensions (Width 5-30ft, Height 8-15ft, visual sqft feedback).
     - `step = 2`: Finish Tier (Standard Canvas ₹120, Belgian Luxury ₹250, Smart Motorized ₹300, full price breakdown, animated price counter).
     - `step = 3`: Society & Booking (Society select, estimate review card, WhatsApp CTA).
   - Add step indicator header with active/completed step styling using `#C5A880` and `#1C130B`.
3. **Animated Counter**: Implement using Framer Motion's `animate` with `easeOutExpo` easing and Indian currency formatting (`₹xx,xxx`).
4. **WhatsApp Integration**: Point directly to `https://wa.me/919700675637` with structured multiline estimate details.
5. **Smooth Scroll**: Anchor `#estimator` is confirmed in `src/app/page.tsx`. Society cards and Hero CTA will trigger smooth scroll to `#estimator` and synchronize the selected society via custom event dispatch.

---

## 5. Verification Method

To independently verify these findings:

1. **Inspect Engine Signatures and Logic**:
   - Run `view_file` on `src/lib/engines.ts` to inspect lines 16-52 (`calculateRollNesting`), 64-85 (`analyzeSolarLux`), and 107-142 (`calculateDynamicPricing`).
   - Check that `calculateDynamicPricing` incorporates `materialCost`, `primerCost` (15/sqft), `installationLaborCost` (25/sqft), motorized flat fee (15000), 18% GST, and 10/60/30 escrow tranches.
2. **Inspect Existing Estimator Gateway**:
   - Run `view_file` on `src/components/EstimatorGateway.tsx`.
   - Verify lines 7-19 for `QUALITIES` and `SOCIETIES` arrays.
   - Verify line 71 for current placeholder WhatsApp phone number `919999999999`.
3. **Inspect Page Anchor and Hero CTA**:
   - Run `view_file` on `src/app/page.tsx` line 14 for `id="estimator"`.
   - Run `view_file` on `src/components/HeroSection.tsx` line 8 for `scrollToEstimator`.
4. **TypeScript & Build Validation Conditions**:
   - Ensure `npm run build` or `npx tsc --noEmit` verifies with zero errors once the implementer replaces `LayoutProps<"/">` with `{ children: React.ReactNode }` in `src/app/layout.tsx`.
