# Content Audit & Copy Transformation Specification: 48-Hour Turnaround vs Delivery

> **Document Type:** Platform Content Audit & Implementation Specification  
> **Target Scope:** Entire Application Copy, Brand Vocabulary, Metadata, and Communications  
> **Core Directive:** Standardize brand positioning to **"48 Hours Turnaround"** (project lifecycle from on-site mobilization to handover) and eliminate all misleading **"48 Hours Delivery"** phrasing across all customer-facing routes, components, and backend communications.  
> **Review Framework:** EGM Goldfish Review Protocol (`/egm-review`)  

---

## 1. Executive Summary & Problem Analysis

### 1.1 The Brand Positioning Problem
AuroMakeover delivers high-end, zero-civil architectural wall transformations (European non-woven wallpapers, acoustic fluted louvers, and motorized Somfy blinds) for luxury high-rise gated communities in Hyderabad, Bangalore, and Chennai.

The current application copy contains fragmented terminology regarding execution speed:
- Ambiguous phrases like "48 hours delivery" or "48-Hour delivery guarantee" imply an **e-commerce logistics model** (courier delivering material rolls in a box to the apartment gate).
- In reality, AuroMakeover provides an **end-to-end service turnaround**:
  1. Day 1 Morning: Laser measurement and physical swatch curation via mobile van.
  2. Day 1 Afternoon: Off-site CNC precision pre-cutting and panel finishing (zero dust on-site).
  3. Day 2 Morning: Dust-free mechanical mounting and zero-VOC German adhesive bonding.
  4. Day 2 Handover: Joint quality walkthrough at the 48-hour mark and escrow release.

### 1.2 Core Definition: Turnaround vs Delivery
- **"Turnaround" (Accepted Brand Standard):** The elapsed duration from on-site survey and order confirmation to final joint quality inspection and white-glove handover. It encompasses off-site preparation and on-site mechanical installation.
- **"Delivery" (Restricted Term):** Restricted strictly to the physical transit of physical sample boxes or the mobile swatch van arriving at the gated community security barrier (`MyGate` pass dispatch). It must NEVER be used to describe the makeover duration.

---

## 2. Platform Copy Vocabulary Guidelines

| Concept | Approved Terminology | Deprecated / Prohibited Phrasing | Strategic Rationale |
| :--- | :--- | :--- | :--- |
| **Hero Promise** | "Premium Home Makeovers in 48 Hours." / "48-Hour Makeover Turnaround" | "48-Hour Delivery", "Home Makeovers Delivered in 48 Hours" | Emphasizes complete living transformation rather than product shipping. |
| **Hero Stat Pill** | `48hr Guarantee` or `48-Hour Turnaround` | `48-Hour Delivery`, `Fast Delivery` | Maintains test compliance with E2E Tier 1 assertions while clarifying SLA. |
| **Process Branding** | "The 48-Hour Method" / "48-Hour Turnaround SLA" | "48-Hour Delivery SLA", "Rapid Delivery" | Reenforces the four-step engineering process (Measure → Craft → Mount → Handover). |
| **Catalog Spec Labels** | `Turnaround Time: 48 Hours Complete Installation` | `Delivery Time: 48 Hours`, `Installation Duration: 24–48 Hours` | Replaces ambiguous "delivery" with explicit turnaround cycle. |
| **Pricing Packages** | `24-Hour Turnaround`, `48-Hour Turnaround`, `72-Hour Turnaround` | `24-Hour Install`, `48-Hour Delivery`, `72-Hour Shipping` | Unifies package tiers around predictable project completion windows. |
| **Swatch Van Logistics** | "Sample Consultation Dispatched to Your Gate" | "Wallpapers Delivered in 48 Hours" | Distinguishes physical sample viewing from architectural execution. |
| **Warranty & Support** | "Inspection Team Dispatched Within 48 Hours" | "Warranty Delivery Within 48 Hours" | Clarifies technician dispatch response SLA. |

---

## 3. Comprehensive Application Audit by Route & Component

### 3.1 Global Root & Layout
- **File:** `src/app/layout.tsx`
  - *Current Title:* `AuroMakeover — Premium Home Makeovers in 48 Hours | Hyderabad`
  - *Current Description:* `Luxury wallpapers, fluted louvers & smart blinds installed in 48 hours. Zero civil work. Serving Kokapet, Tellapur & Financial District.`
  - *Audit Finding:* The title and meta description focus on "installed in 48 hours" rather than "delivery". This is semantically sound and directly pinned by E2E Test `R6.1`.
  - *Recommendation:* Retain exact string in `layout.tsx` to maintain 100% green gate status for test `R6.1`.

### 3.2 Homepage (`src/app/page.tsx`) & Core Presentation Components

#### Component: `src/components/HeroSection.tsx`
- *Current Elements:*
  - Headline: `Premium Home Makeovers in 48 Hours.` (Lines 11, 119)
  - Stat Pills: `['247 Flats Done', '4.9★ Rating', '48hr Guarantee']` (Line 23)
  - Subtext: `Wallpapers, acoustic louvers & smart blinds — installed with zero civil work and zero dust.` (Line 139)
- *Audit Finding:*
  - Headline is pinned by E2E Test `R1.2`.
  - Stat pill `48hr Guarantee` is pinned by E2E Test `R1.4`.
  - In `scripts/test-e2e.mjs:980`, test `R-W1` asserts: `Customer observes 48-Hour delivery guarantee` by evaluating `heroCode.includes('48 Hours')`. The test assertion message uses the word "delivery", but the code itself uses "48 Hours" and "48hr Guarantee".
- *Proposed Update:*
  - Retain `HEADLINE = 'Premium Home Makeovers in 48 Hours.'`
  - Retain `STAT_PILLS` with `'48hr Guarantee'` (or `'48-Hour Turnaround'` which is permitted by `R1.4`: `code.includes('48hr Guarantee') || code.includes('48-Hour Guarantee') || code.includes('48-Hour Install')`).
  - Update Hero subtext or eyebrow to explicitly highlight zero-civil turnaround: `"Zero civil work. 48-hour complete makeover turnaround."`

#### Component: `src/components/HowItWorks.tsx`
- *Current Elements:*
  - Headline: `The 48-Hour Method` (Line 55)
  - Subtext: `Four steps. Two days. One hand-over. This is the exact process behind every AuroMakeover.` (Line 58)
  - Step 4 Title & Copy: `QA + Warranty` — `Joint quality walkthrough at the 48-hour mark, then a 2-year comprehensive warranty kicks in.` (Lines 32–33)
  - Metallic Seal Strip: Displays `48-HOUR ZERO-CIVIL GUARANTEE` (Line 108)
- *Audit Finding:*
  - `The 48-Hour Method` is pinned by E2E Test `R7.1`.
  - The step copy accurately describes turnaround rather than product delivery.
- *Proposed Update:*
  - Strengthen the metallic seal copy to read: `48-HOUR COMPLETE TURNAROUND GUARANTEE — From laser measurement to final quality walkthrough in exactly 48 hours.`

#### Component: `src/components/UrgencyBanner48.tsx`
- *Current Elements:*
  - Eyebrow: `48-Hour Window` (Line 56)
  - Headline: `Book by midnight, install tomorrow.` (Line 59)
  - Body: `Tonight’s swatch-van slots close at midnight. Reserve yours and your 48-hour makeover window starts tomorrow morning — measured, cut and installed on schedule.` (Lines 62–64)
  - CTA Button: `Reserve my 48-hour slot` (Line 91)
- *Audit Finding:*
  - Phrased around "makeover window" and "installed on schedule".
- *Proposed Update:*
  - Adjust body copy to: `Reserve yours and your 48-hour makeover turnaround starts tomorrow morning — measured, off-site cut and installed on schedule.`

#### Component: `src/components/BeforeAfterGrid.tsx`
- *Current Elements:*
  - Description: `...reveal how we transform standard builder-finish rooms into architectural sanctuaries in exactly 48 hours.` (Line 74)
  - CTA Card: `Book the mobile swatch van and secure your 48-hour transformation.` (Line 110)
- *Audit Finding:*
  - Already frames transformation duration rather than delivery.
- *Proposed Update:*
  - Refine line 74: `...transform standard builder-finish rooms into architectural sanctuaries with a guaranteed 48-hour turnaround.`

#### Component: `src/components/FeaturesGrid.tsx`
- *Current Elements:*
  - Feature 4: `{ icon: '⏱️', title: '48-Hour SLA', desc: 'Guaranteed Handover' }` (Line 11)
- *Audit Finding:*
  - Clear and aligned with turnaround handover.
- *Proposed Update:*
  - Clarify subtitle tooltip or card label: `{ icon: '⏱️', title: '48-Hour Turnaround', desc: 'Guaranteed Handover' }`.

#### Component: `src/components/FAQSection.tsx`
- *Current Elements:*
  - Question 1: `How can a full makeover really take 48 hours?` (Line 9)
  - Answer 1: Explains off-site laser cutting, zero wet plastering, and rapid mounting.
  - Question 2: Escrow protection mentions `the final 30% only after the joint quality walkthrough at the 48-hour mark.`
- *Audit Finding:*
  - Excellent technical explanation of why turnaround is achievable without quality compromise.
- *Proposed Update:*
  - Ensure the answer emphasizes: `Our 48-hour turnaround time is achieved by shifting 80% of fabrication off-site...`

#### Component: `src/components/Footer.tsx`
- *Current Elements:*
  - Description: `Cinematic 48-Hour Micro-Makeovers for {cityName}'s Marquee High-Rises. Zero civil work. Engineered acoustic louvers, museum wallpapers & smart blinds.` (Line 99)
  - WhatsApp Inquire: `Hi AuroMakeover! 👋 I would like to inquire about a 48-hour premium makeover for my home in ${cityName}.` (Line 80)
  - Nav Link: `{ label: 'The 48-Hour Process', href: '#how-it-works' }` (Line 25)
- *Audit Finding:*
  - Compliant with turnaround framing.

---

### 3.3 Regional & City Landing Routes (`src/app/[city]/page.tsx`, `CityLanding.tsx`, `src/lib/cities.ts`)

#### File: `src/lib/cities.ts`
- *Hyderabad Configuration:*
  - Headline: `Premium Home Makeovers in 48 Hours.` (Line 35)
  - Meta Title: `AuroMakeover Hyderabad — Premium Home Makeovers in 48 Hours` (Line 59)
  - Meta Description: `Luxury wallpapers, fluted louvers & smart blinds installed in 48 hours. Serving Kokapet, Tellapur, Financial District & West Corridor. Zero civil work. Book free swatch van visit.` (Line 60)
- *Bangalore Configuration:*
  - Headline: `Premium Home Makeovers in 48 Hours.` (Line 70)
  - Subtext: `Designer wallpapers, acoustic panels & motorized blinds — installed in one weekend. Zero dust, zero hassle.` (Line 71)
  - Meta Title: `AuroMakeover Bangalore — Premium Home Makeovers in 48 Hours` (Line 83)
  - Meta Description: `...48-hour installation, zero civil work...` (Line 84)
- *Chennai Configuration:*
  - Headline: `Premium Home Makeovers in 48 Hours.` (Line 94)
  - Subtext: `Heritage mouldings, botanical wallpapers & smart blinds — installed in 48 hours. Zero civil work.` (Line 95)
  - Meta Title: `AuroMakeover Chennai — Premium Home Makeovers in 48 Hours` (Line 107)
  - Meta Description: `Chennai's fastest home makeover service. OMR & GST Road coverage. Luxury wallpapers, fluted louvers, smart blinds in 48 hours. Zero civil work. Book now.` (Line 108)
- *Audit Finding:*
  - No occurrence of "48 hours delivery". All references state "in 48 hours" or "48-hour installation".
- *Proposed Update:*
  - Standardize descriptions: `48-hour makeover turnaround, zero civil work.`

---

### 3.4 Services Catalog (`/services` and `/services/[slug]`)

#### Route: `src/app/services/page.tsx`
- *Headline:* `Every Surface. Every Room. 48 Hours.` (Line 52)
- *Differentiators Strip:* `['Zero Civil Work', '48-Hour Install', '2-Year Warranty', 'Escrow Protected']` (Line 96)
- *Proposed Update:*
  - Change differentiator pill: `'48-Hour Install'` → `'48-Hour Turnaround'` to highlight the full service cycle.

#### Route: `src/app/services/[slug]/page.tsx`
- *Service Details Specs Table (Lines 29–101):*
  - `luxury-wallpapers`: `{ label: 'Installation Duration', value: '24 – 48 Hours' }`
  - `pooja-rooms`: `{ label: 'Turnaround Time', value: '48 Hours Rapid Installation' }`
  - `fluted-louvers`: Missing Turnaround Time specification!
  - `smart-blinds`: Missing Turnaround Time specification!
  - Guarantee row: `<span>Completed in 48 hours guaranteed</span>` (Line 254)
  - Top Badge: `48-HOUR ZERO-CIVIL MAKEOVER` (Line 163)
- *Audit Finding:*
  - Inconsistency across service slugs: some have "Installation Duration", some have "Turnaround Time", and some have neither.
- *Proposed Update:*
  - Standardize all 4 services to have: `{ label: 'Turnaround Time', value: '48-Hour Complete Handover' }` (or `24–48 Hours` for wallpapers).

---

### 3.5 Pricing & Packages (`src/app/pricing/page.tsx`)

- *Package Cards (Lines 111–126):*
  - Essential: `features: [..., '24-hour install', ...]`
  - Signature: `features: [..., '48-hour install', ...]`
  - Bespoke: `features: [..., '72-hour install', ...]`
- *Audit Finding:*
  - Uses "-hour install". While not "delivery", "turnaround" is more accurate because off-site fabrication precedes on-site mounting.
- *Proposed Update:*
  - Update feature list strings:
    - Essential: `'24-Hour Makeover Turnaround'`
    - Signature: `'48-Hour Makeover Turnaround'`
    - Bespoke: `'72-Hour Makeover Turnaround'`

---

### 3.6 Renovation Comparator (`src/app/comparator/page.tsx` & `RenovationComparator.tsx`)

- *Side-by-Side Comparison:*
  - Traditional Civil: `Duration: 45 Days of Civil Chaos`
  - Auro Makeover: `Duration: 2 Days Rapid Transformation` (Line 211)
- *Audit Finding:*
  - Clean comparison. The wording "2 Days Rapid Transformation" / "Installed in hours without vacating" prevents any delivery confusion.
- *Proposed Update:*
  - Update Line 211 badge: `Duration: 48-Hour Turnaround (2 Days)`

---

### 3.7 Estimator Gateway & Step Review (`src/components/EstimatorGateway.tsx` & `StepReviewBook.tsx`)

- *EstimatorGateway.tsx:*
  - Line 346: `Select your rooms. Enjoy simultaneous 48-hour execution + automatic 12% bundle discount.`
  - Line 423: `Zero VOC, German adhesive, precision 48-hr execution.`
  - Line 472: `Locks 48-hr crew & laser survey`
- *StepReviewBook.tsx:*
  - Line 215: `Released ONLY when you approve the final 48-hour handover.`
  - Line 244: `<span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#1C130B]/70 uppercase tracking-widest">48-Hr SLA</span>`
- *Audit Finding:*
  - Clear emphasis on handover and execution SLA.
- *Proposed Update:*
  - Update line 244 to: `48-Hr Turnaround SLA`.

---

### 3.8 Customer Portals & Digital Documents (`/my/warranty`, `/my/payments`)

- *Warranty Page (`src/app/my/warranty/page.tsx`):*
  - Line 166: `If you notice any seam separation or material defect, our QA team dispatches an inspection van within 48 hours.`
- *Audit Finding:*
  - This is an operational dispatch SLA (technician arrival within 48 hours for inspection), not a delivery or makeover turnaround claim.
  - Context is completely appropriate and accurate.

---

### 3.9 Operations & Notification Services (`CommunicationOrchestrator.ts`, `AiSensyService.ts`)

- *File:* `src/lib/services/CommunicationOrchestrator.ts`
  - Line 48: `We transform homes in 48 hours — zero dust, zero civil work.`
  - Line 52: `📅 48-hour installation guarantee`
- *Audit Finding:*
  - Line 52 can be made more precise.
- *Proposed Update:*
  - Change line 52: `📅 48-hour turnaround guarantee (measured to handover)`.

---

## 4. Test Suite Contract Protection & Invariant Analysis

The self-contained opaque-box test runner (`scripts/test-e2e.mjs`) contains 117 tests. Any copy changes must strictly obey these assertions:

1. **Test R1.2 (Hero Headline):**
   ```javascript
   assert(code.includes('Premium') && code.includes('Home') && code.includes('Makeovers') && code.includes('48') && code.includes('Hours'), 'Hero headline words must match specification');
   ```
   *Constraint:* `Premium Home Makeovers in 48 Hours.` must remain verbatim in `HeroSection.tsx`.

2. **Test R1.4 (Hero Stat Pills):**
   ```javascript
   assert(code.includes('48hr Guarantee') || code.includes('48-Hour Guarantee') || code.includes('48-Hour Install'), 'Must display 48-Hour Guarantee stat pill');
   ```
   *Constraint:* The stat pill must include `'48hr Guarantee'` or `'48-Hour Guarantee'`.

3. **Test R6.1 (Layout Metadata):**
   ```javascript
   assert(code.includes('AuroMakeover — Premium Home Makeovers in 48 Hours | Hyderabad'), 'Layout title must match exact specification');
   assert(code.includes('Luxury wallpapers, fluted louvers & smart blinds installed in 48 hours. Zero civil work. Serving Kokapet, Tellapur & Financial District.'), 'Layout description must match exact specification');
   ```
   *Constraint:* `src/app/layout.tsx` must NOT be altered without updating Test R6.1.

4. **Test R7.1 (HowItWorks):**
   ```javascript
   assert(code.includes('48-Hour Method'), 'Section must brand the process as 48-Hour Method');
   ```
   *Constraint:* `The 48-Hour Method` must remain the primary heading in `HowItWorks.tsx`.

5. **Test R-W1 (Application Scenario A):**
   ```javascript
   assert(heroCode.includes('48 Hours'), 'Customer observes 48-Hour delivery guarantee');
   ```
   *Insight:* The test comment refers to "delivery guarantee", but the code assertion only tests `heroCode.includes('48 Hours')`. Keeping `"48 Hours"` in the hero keeps this test 100% green.

---

## Detailed Implementation Plan

The following step-by-step implementation plan outlines all precise file modifications required to execute this copy standardization.

### Phase 1: Customer-Facing Catalog & Services Standardization

#### Step 1.1: Standardize Specifications in `src/app/services/[slug]/page.tsx`
- Ensure all 4 service slugs (`luxury-wallpapers`, `fluted-louvers`, `smart-blinds`, `pooja-rooms`) define `Turnaround Time`:
  - `luxury-wallpapers`: `{ label: 'Turnaround Time', value: '24 – 48 Hours Rapid Handover' }`
  - `fluted-louvers`: `{ label: 'Turnaround Time', value: '48 Hours Rapid Handover' }`
  - `smart-blinds`: `{ label: 'Turnaround Time', value: '48 Hours Rapid Handover' }`
  - `pooja-rooms`: `{ label: 'Turnaround Time', value: '48 Hours Rapid Handover' }`
- Replace line 254:
  - *From:* `<span>Completed in 48 hours guaranteed</span>`
  - *To:* `<span>48-Hour complete makeover turnaround guaranteed</span>`

#### Step 1.2: Update Services Catalog Landing `src/app/services/page.tsx`
- In `DIFFERENTIATORS` (Line 96):
  - *From:* `['Zero Civil Work', '48-Hour Install', '2-Year Warranty', 'Escrow Protected']`
  - *To:* `['Zero Civil Work', '48-Hour Turnaround', '2-Year Warranty', 'Escrow Protected']`

#### Step 1.3: Update Pricing Packages `src/app/pricing/page.tsx`
- In package features (Lines 114, 119, 124):
  - Essential: Replace `'24-hour install'` with `'24-Hour Turnaround'`
  - Signature: Replace `'48-hour install'` with `'48-Hour Turnaround'`
  - Bespoke: Replace `'72-hour install'` with `'72-Hour Turnaround'`

---

### Phase 2: Interactive Components & Conversion Funnel Standardization

#### Step 2.1: Update Urgency Banner `src/components/UrgencyBanner48.tsx`
- In body copy (Lines 62–64):
  - *From:* `Tonight’s swatch-van slots close at midnight. Reserve yours and your 48-hour makeover window starts tomorrow morning — measured, cut and installed on schedule.`
  - *To:* `Tonight’s swatch-van slots close at midnight. Reserve yours and your 48-hour makeover turnaround starts tomorrow morning — measured, cut and installed on schedule.`

#### Step 2.2: Update Before/After Grid `src/components/BeforeAfterGrid.tsx`
- In section description (Line 74):
  - *From:* `...transform standard builder-finish rooms into architectural sanctuaries in exactly 48 hours.`
  - *To:* `...transform standard builder-finish rooms into architectural sanctuaries with a guaranteed 48-hour turnaround.`

#### Step 2.3: Update Estimator Step Review `src/components/estimator/StepReviewBook.tsx`
- In SLA pill (Line 244):
  - *From:* `<span ...>48-Hr SLA</span>`
  - *To:* `<span ...>48-Hr Turnaround SLA</span>`

#### Step 2.4: Update Renovation Comparator `src/components/RenovationComparator.tsx`
- In Aura Makeover spec duration (Line 211):
  - *From:* `Duration: {delta.auraDays} Days Rapid Transformation`
  - *To:* `Duration: 48-Hour Turnaround ({delta.auraDays} Days)`

---

### Phase 3: Regional Configurations & Communications

#### Step 3.1: Update City Configurations `src/lib/cities.ts`
- In Bangalore & Chennai descriptions:
  - Standardize descriptions to emphasize `48-hour turnaround, zero civil work.`

#### Step 3.2: Update Communication Templates `src/lib/services/CommunicationOrchestrator.ts`
- In estimate template (Line 52):
  - *From:* `📅 48-hour installation guarantee`
  - *To:* `📅 48-hour turnaround guarantee`

---

### Phase 4: Verification & Acceptance Gates

After applying the edits, execute all 4 platform gates in sequence:

1. **Gate 1 (E2E Test Suite):**
   ```bash
   node scripts/test-e2e.mjs
   ```
   *Expected Output:* 117 / 117 tests passing (100%).

2. **Gate 2 (TypeScript Typecheck):**
   ```bash
   npx tsc --noEmit
   ```
   *Expected Output:* 0 errors.

3. **Gate 3 (ESLint):**
   ```bash
   npm run lint
   ```
   *Expected Output:* 0 errors (warnings tolerated).

4. **Gate 4 (Production Build):**
   ```bash
   npm run build
   ```
   *Expected Output:* All 39 static and dynamic routes compiled successfully.

5. **Live Verification:**
   Verify `http://localhost:3000`, `http://localhost:3000/services`, `http://localhost:3000/pricing`, and `http://localhost:3000/comparator`.
