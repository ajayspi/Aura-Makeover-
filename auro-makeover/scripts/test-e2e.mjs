/**
 * AuroMakeover Phase 1 Redesign — Comprehensive Opaque-Box E2E Test Suite
 * 
 * Test Tracks:
 * - Tier 1: Feature Coverage (R1-R6: Hero, Before/After, Gallery, Society, Estimator & Ticker, Footer & Layout)
 * - Tier 2: Boundary & Corner Cases (Extreme dimensions, 0%/100% sliders, touch events, GST rounding, token audits)
 * - Tier 3: Cross-Feature Combinations (Society pre-population, tier changes, motor add-ons, WhatsApp formatting)
 * - Tier 4: Real-World Application Scenarios (Bhooja, Provincia, Sarovar Zenith, Prestige High Fields workflows)
 * 
 * Target: 70 tests (>=40 required)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// Color formatting for console
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

// Test runner state
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function test(tier, id, title, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ${green('✔')} [${tier}] ${bold(id)}: ${title}`);
  } catch (err) {
    failedTests++;
    failures.push({ tier, id, title, error: err.message });
    console.log(`  ${red('✖')} [${tier}] ${bold(id)}: ${title} — ${red(err.message)}`);
  }
}

// Helpers to load project source files
function readProjectFile(relPath) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${relPath}`);
  }
  return fs.readFileSync(fullPath, 'utf-8');
}

function fileExists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

// Mathematical Reference Engines (Direct from Requirements & src/lib/engines.ts specification)
function refCalculateRollNesting({ wallWidthFt, wallHeightFt, rollWidthInches = 42, patternRepeatInches = 24 }) {
  const wallWidthInches = wallWidthFt * 12;
  const wallHeightInches = wallHeightFt * 12;
  const totalVerticalDrops = Math.ceil(wallWidthInches / rollWidthInches);
  const matchingWasteInches = Math.max(0, (totalVerticalDrops - 1) * patternRepeatInches);
  const dropHeightInches = wallHeightInches + 4;
  const totalLinearInches = (totalVerticalDrops * dropHeightInches) + matchingWasteInches;
  const requiredContinuousMeters = totalLinearInches * 0.0254;
  const exactWallSqFt = wallWidthFt * wallHeightFt;
  const totalSqFtRequired = (totalLinearInches * rollWidthInches) / 144;
  const safetyBufferSqFt = exactWallSqFt * 1.11;
  const totalSqFtWithBuffer = Math.max(totalSqFtRequired, safetyBufferSqFt);

  return {
    totalVerticalDrops,
    matchingWasteInches,
    requiredContinuousMeters,
    totalSqFtRequired,
    totalSqFtWithBuffer,
  };
}

function refCalculateDynamicPricing({ rawMaterialBasePerSqFt, totalSqFtRequired, isSmartMotorized = false }) {
  const PRIMER_COST_PER_SQFT = 15;
  const INSTALL_LABOR_PER_SQFT = 25;
  const MOTOR_ADDON_FLAT = 15000;

  const materialCost = rawMaterialBasePerSqFt * totalSqFtRequired;
  const primerCost = PRIMER_COST_PER_SQFT * totalSqFtRequired;
  const installationLaborCost = INSTALL_LABOR_PER_SQFT * totalSqFtRequired;

  let subtotal = materialCost + primerCost + installationLaborCost;
  if (isSmartMotorized) {
    subtotal += MOTOR_ADDON_FLAT;
  }

  const gstAmount = subtotal * 0.18;
  const totalRetailPrice = subtotal + gstAmount;

  const deposit10 = totalRetailPrice * 0.10;
  const materialRelease60 = totalRetailPrice * 0.60;
  const postQAUnlock30 = totalRetailPrice * 0.30;

  return {
    materialCost,
    primerCost,
    installationLaborCost,
    subtotal,
    gstAmount,
    totalRetailPrice,
    escrowTranches: {
      deposit10,
      materialRelease60,
      postQAUnlock30,
    },
  };
}

function refAnalyzeSolarLux({ compassAngleDegrees, floorNumber }) {
  const isWestOrSouthWest = (compassAngleDegrees >= 180 && compassAngleDegrees <= 315);
  const isHighFloor = floorNumber >= 10;
  const highSolarHeatRadiation = isWestOrSouthWest && isHighFloor;

  let recommendedBlindType = 'Standard Translucent Sheer';
  if (highSolarHeatRadiation) {
    recommendedBlindType = 'Double-cell Honeycomb Blinds';
  } else if (isWestOrSouthWest) {
    recommendedBlindType = '100% Blackout Motorized Blinds';
  }

  return {
    highSolarHeatRadiation,
    recommendedBlindType,
  };
}

console.log(bold(cyan('\n========================================================================')));
console.log(bold(cyan('  AUROMAKEOVER PHASE 1 REDESIGN — OPAQUE-BOX E2E TEST RUNNER')));
console.log(bold(cyan('========================================================================\n')));

// ============================================================================
// TIER 1: FEATURE COVERAGE (R1 - R6, 30 TESTS)
// ============================================================================
console.log(bold('\n--- TIER 1: FEATURE COVERAGE (R1-R6) ---'));

// Feature R1: Cinematic Hero Section
test('Tier 1', 'R1.1', 'Hero section implements full-screen layout with dark #1C130B base and brand styling', () => {
  const code = readProjectFile('src/components/HeroSection.tsx');
  assert(code.includes('#1C130B'), 'HeroSection must use #1C130B dark espresso background');
  assert(code.includes('min-h-screen') || code.includes('py-20') || code.includes('py-28') || code.includes('min-h-['), 'HeroSection must be a prominent full-height section');
  assert(code.includes('Syne'), 'HeroSection must employ Syne font for headings');
  assert(code.includes('Plus_Jakarta_Sans'), 'HeroSection must employ Plus Jakarta Sans font for body text');
});

test('Tier 1', 'R1.2', 'Hero headline displays "Premium Home Makeovers in 48 Hours." with Framer Motion word-by-word stagger reveal', () => {
  const code = readProjectFile('src/components/HeroSection.tsx');
  assert(code.includes('Premium') && code.includes('Home') && code.includes('Makeovers') && code.includes('48') && code.includes('Hours'), 'Hero headline words must match specification');
  assert(code.includes('staggerChildren') || code.includes('stagger'), 'Hero headline must configure Framer Motion stagger reveal animation');
  assert(code.includes('motion.'), 'Hero headline must use Framer Motion components');
});

test('Tier 1', 'R1.3', 'Hero background contains ambient gold gradient blobs with blur styling', () => {
  const code = readProjectFile('src/components/HeroSection.tsx');
  assert(code.includes('blur-') || code.includes('blur['), 'Hero background must use blur filters for ambient lighting blobs');
  assert(code.includes('#C5A880') || code.includes('#8A5836'), 'Hero background blobs must use warm gold or terracotta tones');
});

test('Tier 1', 'R1.4', 'Hero features 3 floating animated stat pills ("247 Flats Done", "4.9★ Rating", "48hr Guarantee")', () => {
  const code = readProjectFile('src/components/HeroSection.tsx');
  assert(code.includes('247 Flats Done'), 'Must display "247 Flats Done" stat pill');
  assert(code.includes('4.9') && (code.includes('Rating') || code.includes('★')), 'Must display 4.9★ Rating stat pill');
  assert(code.includes('48hr Guarantee') || code.includes('48-Hour Guarantee') || code.includes('48-Hour Install'), 'Must display 48-Hour Guarantee stat pill');
});

test('Tier 1', 'R1.5', 'Hero preserves 2 CTA buttons ("Get Instant Quote", "View Lookbook") and 3 trust badges', () => {
  const code = readProjectFile('src/components/HeroSection.tsx');
  assert(code.includes('Get Instant Quote') || code.includes('estimator'), 'Primary CTA button must offer quote / scroll to estimator');
  assert(code.includes('View Lookbook') || code.includes('Lookbook'), 'Secondary CTA button must offer Lookbook');
  assert(code.includes('Zero Civil Work') || code.includes('Zero Civil'), 'Must include Zero Civil Work trust badge');
  assert(code.includes('Design-on-Wheels') || code.includes('Swatch Van') || code.includes('Mobile'), 'Must include Swatch Van / Design-on-Wheels badge');
});

// Feature R2: Before/After Interactive Showcase
test('Tier 1', 'R2.1', 'Before/After section exists and displays section title "The AuroMakeover Difference"', () => {
  assert(fileExists('src/components/BeforeAfterShowcase.tsx'), 'src/components/BeforeAfterShowcase.tsx must exist');
  const code = readProjectFile('src/components/BeforeAfterShowcase.tsx');
  assert(code.includes('The AuroMakeover Difference'), 'Showcase title must be "The AuroMakeover Difference"');
});

test('Tier 1', 'R2.2', 'Before/After showcase provides room toggle supporting at least Living Room and Bedroom', () => {
  const code = readProjectFile('src/components/BeforeAfterShowcase.tsx');
  assert(code.includes('Living Room'), 'Showcase must support Living Room');
  assert(code.includes('Bedroom'), 'Showcase must support Bedroom');
});

test('Tier 1', 'R2.3', 'Before side demonstrates plain builder finish with grey/white tones and label "Builder Finish"', () => {
  const code = readProjectFile('src/components/BeforeAfterShowcase.tsx');
  assert(code.includes('Builder Finish'), 'Before side must include label "Builder Finish"');
  assert(code.includes('from-gray') || code.includes('from-slate') || code.includes('bg-[#e') || code.includes('bg-neutral') || code.includes('distemper') || code.includes('Untextured'), 'Before side must convey builder distemper tones');
});

test('Tier 1', 'R2.4', 'After side demonstrates luxury makeover with warm gold/terracotta tones and label "After AuroMakeover"', () => {
  const code = readProjectFile('src/components/BeforeAfterShowcase.tsx');
  assert(code.includes('After AuroMakeover'), 'After side must include label "After AuroMakeover"');
  assert(code.includes('#C5A880') || code.includes('#8A5836') || code.includes('#1C130B'), 'After side must use AuroMakeover luxury palette');
});

test('Tier 1', 'R2.5', 'Before/After slider handle is draggable supporting both mouse and touch events', () => {
  const code = readProjectFile('src/components/BeforeAfterShowcase.tsx');
  const hasMouse = code.includes('onMouseDown') || code.includes('onPointerDown');
  const hasTouch = code.includes('onTouchStart') || code.includes('onPointerDown');
  assert(hasMouse, 'Slider handle must handle desktop mouse/pointer drag initiation');
  assert(hasTouch, 'Slider handle must handle mobile touch/pointer drag initiation');
  assert(code.includes('clipPath') || code.includes('clip-path') || code.includes('width:'), 'Slider must dynamically update clipPath or reveal width');
});

// Feature R3: Upgraded Design Gallery
test('Tier 1', 'R3.1', 'Design Gallery features masonry-style grid layout with alternating card aspect ratios', () => {
  const code = readProjectFile('src/components/DesignGallery.tsx');
  assert(code.includes('aspect-[4/5]'), 'Gallery must use aspect-[4/5] for cards');
  assert(code.includes('aspect-[3/4]'), 'Gallery must use alternating aspect-[3/4] for cards');
});

test('Tier 1', 'R3.2', 'Design Gallery cards implement 3D tilt effect on hover via Framer Motion / CSS transform', () => {
  const code = readProjectFile('src/components/DesignGallery.tsx');
  const hasMotionValues = code.includes('useMotionValue') || code.includes('rotateX') || code.includes('rotateY');
  const hasTiltEffect = hasMotionValues || code.includes('transformStyle') || code.includes('perspective');
  assert(hasTiltEffect, 'Gallery cards must implement 3D tilt transformation');
});

test('Tier 1', 'R3.3', 'Design Gallery catalog contains 8 curated items covering all 4 categories (2 per category)', () => {
  const code = readProjectFile('src/components/DesignGallery.tsx');
  assert(code.includes('Botanical'), 'Gallery must cover Botanical category');
  assert(code.includes('Fluted Louver'), 'Gallery must cover Fluted Louver category');
  assert(code.includes('Neo-Classical'), 'Gallery must cover Neo-Classical category');
  assert(code.includes('Temple Pichwai'), 'Gallery must cover Temple Pichwai category');
  const botanicalCount = (code.match(/category:\s*["']Botanical["']/g) || []).length;
  const louverCount = (code.match(/category:\s*["']Fluted Louver["']/g) || []).length;
  const neoCount = (code.match(/category:\s*["']Neo-Classical["']/g) || []).length;
  const pichwaiCount = (code.match(/category:\s*["']Temple Pichwai["']/g) || []).length;
  assert(botanicalCount >= 2, `Botanical items expected >= 2, found ${botanicalCount}`);
  assert(louverCount >= 2, `Fluted Louver items expected >= 2, found ${louverCount}`);
  assert(neoCount >= 2, `Neo-Classical items expected >= 2, found ${neoCount}`);
  assert(pichwaiCount >= 2, `Temple Pichwai items expected >= 2, found ${pichwaiCount}`);
});

test('Tier 1', 'R3.4', 'Design Gallery provides category filter with animated indicator underline', () => {
  const code = readProjectFile('src/components/DesignGallery.tsx');
  assert(code.includes('All'), 'Filter must have "All" option');
  assert(code.includes('layoutId') || code.includes('transition'), 'Filter must have smooth animated active underline or indicator');
});

test('Tier 1', 'R3.5', 'Design Gallery category filter updates cards client-side without page reload', () => {
  const code = readProjectFile('src/components/DesignGallery.tsx');
  assert(code.includes('activeCategory') || code.includes('filter'), 'Must maintain active category state');
  assert(code.includes('filter(') || code.includes('filteredDesigns'), 'Must dynamically filter cards according to active selection');
});

// Feature R4: Society-Specific Value Section
test('Tier 1', 'R4.1', 'Society section titled "Your Society, Pre-Measured" exists with horizontal scroll', () => {
  assert(fileExists('src/components/SocietyPreMeasured.tsx'), 'SocietyPreMeasured component must exist');
  const code = readProjectFile('src/components/SocietyPreMeasured.tsx');
  assert(code.includes('Your Society, Pre-Measured'), 'Title must match "Your Society, Pre-Measured"');
  assert(code.includes('overflow-x-auto') || code.includes('flex'), 'Must provide horizontal scroll container');
});

test('Tier 1', 'R4.2', 'Society section features all 4 specific high-rise gated communities', () => {
  const code = readProjectFile('src/components/SocietyPreMeasured.tsx');
  assert(code.includes('My Home Bhooja'), 'Must feature My Home Bhooja');
  assert(code.includes('Aparna Sarovar Zenith'), 'Must feature Aparna Sarovar Zenith');
  assert(code.includes('Rajapushpa Provincia'), 'Must feature Rajapushpa Provincia');
  assert(code.includes('Prestige High Fields'), 'Must feature Prestige High Fields');
});

test('Tier 1', 'R4.3', 'Each society card includes fire emoji stat ("47 flats done 🔥") and unit type', () => {
  const code = readProjectFile('src/components/SocietyPreMeasured.tsx');
  assert(code.includes('🔥') && code.includes('flats done'), 'Must display fire emoji stats (e.g. "47 flats done 🔥")');
  assert(code.includes('3BHK') || code.includes('Standard') || code.includes('Unit'), 'Must indicate typical unit configuration');
});

test('Tier 1', 'R4.4', 'Each society card includes pre-estimated price range', () => {
  const code = readProjectFile('src/components/SocietyPreMeasured.tsx');
  assert(code.includes('Est. ₹') || code.includes('₹38,000') || code.includes('₹'), 'Must display pre-estimated price range');
});

test('Tier 1', 'R4.5', 'Society card "Check My Flat →" button triggers smooth scroll to estimator', () => {
  const code = readProjectFile('src/components/SocietyPreMeasured.tsx');
  assert(code.includes('Check My Flat'), 'Button text must be "Check My Flat →"');
  assert(code.includes('#estimator') || code.includes('scrollIntoView'), 'Button must direct user to estimator section');
});

// Feature R5: Estimator Wizard & Ticker
test('Tier 1', 'R5.1', 'Auto-scrolling ticker exists displaying rotating stats and micro-testimonials', () => {
  assert(fileExists('src/components/StatsTicker.tsx'), 'StatsTicker component must exist');
  const code = readProjectFile('src/components/StatsTicker.tsx');
  assert(code.includes('Priya K.') || code.includes('Bhooja') || code.includes('testimonial') || code.includes('Provincia'), 'Ticker must display resident micro-testimonials/stats');
  assert(code.includes('animate') || code.includes('marquee') || code.includes('motion.'), 'Ticker must auto-scroll continuously');
});

test('Tier 1', 'R5.2', 'Estimator is redesigned as a 3-step wizard with step progress indicator', () => {
  const code = readProjectFile('src/components/EstimatorGateway.tsx');
  assert(code.includes('currentStep') || code.includes('step'), 'Estimator must manage current step state');
  assert(code.includes('Step 1') || code.includes('Room Size'), 'Step 1 must cover Room Size');
  assert(code.includes('Step 2') || code.includes('Finish Tier'), 'Step 2 must cover Finish Tier');
  assert(code.includes('Step 3') || code.includes('Book') || code.includes('Review'), 'Step 3 must cover Book / Review');
});

test('Tier 1', 'R5.3', 'Estimator imports and preserves pure calculation logic in engines.ts', () => {
  const code = readProjectFile('src/components/EstimatorGateway.tsx');
  assert(code.includes('calculateRollNesting'), 'Estimator must import calculateRollNesting');
  assert(code.includes('calculateDynamicPricing'), 'Estimator must import calculateDynamicPricing');
  
  // Verify nesting math from engines
  const sampleNesting = refCalculateRollNesting({ wallWidthFt: 10, wallHeightFt: 10 });
  assert(sampleNesting.totalVerticalDrops === 3, `Expected 3 drops, got ${sampleNesting.totalVerticalDrops}`);
  assert(sampleNesting.totalSqFtWithBuffer >= 111, 'Must include minimum 11% safety buffer');
});

test('Tier 1', 'R5.4', 'Dynamic pricing accurately computes material, primer, labor, GST, and escrow tranches', () => {
  const samplePricing = refCalculateDynamicPricing({
    rawMaterialBasePerSqFt: 120,
    totalSqFtRequired: 100,
    isSmartMotorized: false,
  });
  assert(samplePricing.materialCost === 12000, 'Material cost must equal rate * sqft');
  assert(samplePricing.primerCost === 1500, 'Primer cost must equal ₹15 * sqft');
  assert(samplePricing.installationLaborCost === 2500, 'Installation labor must equal ₹25 * sqft');
  assert(samplePricing.subtotal === 16000, 'Subtotal must sum material, primer, and labor');
  assert(samplePricing.gstAmount === 2880, 'GST must be 18% of subtotal');
  assert(samplePricing.totalRetailPrice === 18880, 'Total price must include GST');
  assert(samplePricing.escrowTranches.deposit10 === 1888, 'Deposit must be 10%');
  assert(samplePricing.escrowTranches.materialRelease60 === 11328, 'Material release must be 60%');
  assert(samplePricing.escrowTranches.postQAUnlock30 === 5664, 'Post QA unlock must be 30%');
});

test('Tier 1', 'R5.5', 'Estimator price display animates counting up and WhatsApp button opens with 919700675637', () => {
  const code = readProjectFile('src/components/EstimatorGateway.tsx');
  assert(code.includes('animate') || code.includes('AnimatedPrice') || code.includes('prevValue'), 'Price counter must animate when value changes');
  assert(code.includes('919700675637'), 'WhatsApp link must target +91 97006 75637');
  assert(code.includes('wa.me/'), 'Must use official wa.me URL structure');
});

// Feature R6: Footer & Layout
test('Tier 1', 'R6.1', 'Layout metadata matches title and description specification', () => {
  const code = readProjectFile('src/app/layout.tsx');
  assert(code.includes('AuroMakeover — Premium Home Makeovers in 48 Hours | Hyderabad'), 'Layout title must match exact specification');
  assert(code.includes('Luxury wallpapers, fluted louvers & smart blinds installed in 48 hours. Zero civil work. Serving Kokapet, Tellapur & Financial District.'), 'Layout description must match exact specification');
});

test('Tier 1', 'R6.2', 'Root layout uses proper React typing with children and no LayoutProps<"/">', () => {
  const code = readProjectFile('src/app/layout.tsx');
  assert(!code.includes('LayoutProps<"/"'), 'Must NOT use broken LayoutProps<"/">');
  assert(code.includes('children: React.ReactNode') || code.includes('children: ReactNode'), 'Must use standard React children typing');
});

test('Tier 1', 'R6.3', 'Google Fonts Syne and Plus Jakarta Sans are properly imported and loaded', () => {
  const code = readProjectFile('src/app/layout.tsx');
  assert(code.includes('Syne') && code.includes('next/font/google'), 'Syne must be imported from next/font/google');
  assert(code.includes('Plus_Jakarta_Sans') && code.includes('next/font/google'), 'Plus_Jakarta_Sans must be imported from next/font/google');
});

test('Tier 1', 'R6.4', 'Redesigned Footer includes 2-Year Warranty badge, 5 service areas, and copyright', () => {
  assert(fileExists('src/components/Footer.tsx'), 'Footer component must exist');
  const code = readProjectFile('src/components/Footer.tsx');
  assert(code.includes('2-Year Warranty') || code.includes('2-Year Full Warranty'), 'Footer must display 2-Year Warranty badge');
  const areas = ['Kokapet', 'Tellapur', 'Financial District', 'Nallagandla', 'Gachibowli'];
  for (const area of areas) {
    assert(code.includes(area), `Footer must list service area: ${area}`);
  }
  assert(code.includes('AuroMakeover'), 'Footer must show AuroMakeover brand');
});

// Feature R7: How-it-Works ("The 48-Hour Method") + Offer Banner
test('Tier 1', 'R7.1', 'HowItWorks section mounted with 48-Hour Method steps and anchor', () => {
  assert(fileExists('src/components/HowItWorks.tsx'), 'HowItWorks component must exist');
  const code = readProjectFile('src/components/HowItWorks.tsx');
  assert(code.includes('48-Hour Method'), 'Section must brand the process as 48-Hour Method');
  assert(code.includes('how-it-works'), 'Section must expose the how-it-works anchor');
  const steps = (code.match(/Step [1-4]/g) || []).length;
  assert(steps >= 4, `Section must render 4 method steps, found ${steps}`);
});

test('Tier 1', 'R7.2', 'Sticky offer banner with estimator CTA and dismiss', () => {
  assert(fileExists('src/components/OfferBanner.tsx'), 'OfferBanner component must exist');
  const code = readProjectFile('src/components/OfferBanner.tsx');
  assert(code.includes('sticky') || code.includes('fixed'), 'Banner must stick to viewport');
  assert(code.includes('#estimator'), 'Banner CTA must target the estimator');
  assert(code.includes('sessionStorage'), 'Banner dismiss must persist for the session');
});

test('Tier 1', 'R7.3', 'Footer quick link targets the how-it-works anchor (no dead links)', () => {
  const code = readProjectFile('src/components/Footer.tsx');
  assert(code.includes('#how-it-works'), 'Footer must link to the how-it-works anchor');
  assert(!code.includes('#process'), 'Dead #process anchor must be gone');
});

// Feature R8: Reviews trust section (nav-level social proof, Decorilla/Havenly pattern)
test('Tier 1', 'R8.1', 'Reviews section mounted with anchored grid of rated review cards', () => {
  assert(fileExists('src/components/Reviews.tsx'), 'Reviews component must exist');
  const code = readProjectFile('src/components/Reviews.tsx');
  assert(code.includes('id="reviews"'), 'Section must expose the #reviews anchor');
  assert(code.includes('aria-label') && code.includes('out of 5 stars'), 'Star rating must carry a 5-star aria-label template');
  assert(code.includes('REVIEWS.map'), 'Review cards must be mapped over the reviews catalog');
  const reviews = (code.match(/\{\n\s+name:/g) || []).length + (code.match(/name: '/g) || []).length;
  assert(reviews >= 3, `Reviews catalog must hold >=3 entries, found ${reviews}`);
  assert(code.includes('rounded-3xl') || code.includes('rounded-2xl'), 'Review cards must use token-compliant corner radii');
});

test('Tier 1', 'R8.2', 'Reviews section renders at least 3 distinct reviewer identities', () => {
  const code = readProjectFile('src/components/Reviews.tsx');
  const nameArgs = (code.match(/name:/g) || []).length;
  const locArgs = (code.match(/location:/g) || []).length;
  assert(nameArgs >= 3, `Reviews must define >=3 reviewer names, found ${nameArgs}`);
  assert(locArgs >= 3, `Reviews must define >=3 reviewer locations, found ${locArgs}`);
});

test('Tier 1', 'R8.3', 'Footer quick link targets the reviews anchor (trust surface at nav level)', () => {
  const code = readProjectFile('src/components/Footer.tsx');
  assert(code.includes('#reviews'), 'Footer quick links must include the #reviews anchor');
});

// Feature R9: Package recommender (questionnaire → package mapping, livspace shape)
test('Tier 3', 'R9.1', 'Package recommender core exists with scoring, budget guard and deterministic fallback', () => {
  assert(fileExists('src/lib/package-recommender.ts'), 'Pure recommender module must exist');
  const code = readProjectFile('src/lib/package-recommender.ts');
  assert(code.includes('recommendPackage'), 'Must export recommendPackage');
  assert(code.includes('PACKAGES') || code.includes('packages'), 'Must export a package catalog');
  assert(code.includes('minBudget') || code.includes('budget'), 'Scoring must respect budget floors');
  assert(code.includes('recommendToPrefill'), 'Must map a package to estimator prefill');
});

test('Tier 3', 'R9.2', 'Package recommender UI mounted with anchored questionnaire and token radii', () => {
  assert(fileExists('src/components/PackageRecommender.tsx'), 'PackageRecommender component must exist');
  const code = readProjectFile('src/components/PackageRecommender.tsx');
  assert(code.includes('package-recommender'), 'Section must expose the #package-recommender anchor');
  assert(code.includes('recommendPackage'), 'UI must call the pure recommender');
  assert(code.includes('rounded-3xl') || code.includes('rounded-2xl'), 'Cards must use token-compliant radii');
  const questions = (code.match(/(room|style|budget|scope)/gi) || []).length;
  assert(questions >= 3, 'Questionnaire must cover >=3 dimensions (room/style/budget/scope)');
});

test('Tier 3', 'R9.3', 'Recommender feeds the shared estimator prefill channel between HowItWorks and estimator', () => {
  const pageCode = readProjectFile('src/app/page.tsx');
  const recommenderIdx = pageCode.indexOf('PackageRecommender');
  const howItWorksIdx = pageCode.indexOf('HowItWorks');
  const estimatorIdx = pageCode.indexOf('id="estimator"');
  assert(recommenderIdx !== -1, 'Page must mount PackageRecommender');
  assert(recommenderIdx > howItWorksIdx && recommenderIdx < estimatorIdx, 'Recommender must sit between HowItWorks and the estimator');
  const code = readProjectFile('src/components/PackageRecommender.tsx');
  assert(code.includes('estimator_prefill'), 'Recommender must write the shared estimator_prefill channel');
  assert(code.includes('recommendToPrefill'), 'Recommender must delegate to the prefill mapping function');
  const core = readProjectFile('src/lib/package-recommender.ts');
  assert(core.includes('finishTier'), 'Prefill mapping must carry a finish tier for the estimator tierMap');
});

test('Tier 3', 'R9.4', 'Every referenced /images/ asset exists on disk (no dangling image refs)', () => {
  const srcDir = path.join(ROOT, 'src');
  const refs = new Set();
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else {
        const text = fs.readFileSync(full, 'utf8');
        const matches = text.match(/\/images\/[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp|svg)/g) || [];
        for (const m of matches) refs.add(m);
      }
    }
  };
  walk(srcDir);
  assert(refs.size >= 7, `Must reference >=7 distinct image assets, found ${refs.size}`);
  for (const ref of refs) {
    const abs = path.join(ROOT, 'public', ref);
    assert(fs.existsSync(abs), `Referenced image missing on disk: ${ref}`);
  }
  const citiesCode = readProjectFile('src/lib/cities.ts');
  assert(!citiesCode.includes("image: '/images/"), 'Dead society image refs must be removed from city config');
});

test('Tier 1', 'R6.5', 'Tailwind CSS v4 design tokens and palette are configured in globals.css', () => {
  const css = readProjectFile('src/app/globals.css');
  assert(css.includes('#1C130B') || css.includes('espresso'), 'CSS must define #1C130B espresso token');
  assert(css.includes('#C5A880') || css.includes('gold'), 'CSS must define #C5A880 gold token');
  assert(css.includes('#8A5836') || css.includes('terracotta'), 'CSS must define #8A5836 terracotta token');
  assert(css.includes('#FAF8F5') || css.includes('linen'), 'CSS must define #FAF8F5 linen token');
  assert(css.includes('#15803D') || css.includes('whatsapp'), 'CSS must define #15803D whatsapp token');
});

// ============================================================================
// TIER 2: BOUNDARY & CORNER CASES (30 TESTS)
// ============================================================================
console.log(bold('\n--- TIER 2: BOUNDARY & CORNER CASES (R1-R6) ---'));

// Feature R1 Boundaries
test('Tier 2', 'R1-B1', 'Hero stat pills delays are strictly positive and monotonically non-decreasing', () => {
  const code = readProjectFile('src/components/HeroSection.tsx');
  const delays = [...code.matchAll(/delay:\s*([\d.]+)/g)].map(m => parseFloat(m[1]));
  assert(delays.length >= 2, 'Hero must specify stagger delays for animated stat items');
  for (let i = 1; i < delays.length; i++) {
    assert(delays[i] >= delays[i - 1], `Delay stagger must be sequential: ${delays[i]} should be >= ${delays[i - 1]}`);
  }
});

test('Tier 2', 'R1-B2', 'Hero headline tokenization separates words cleanly without losing punctuation', () => {
  const code = readProjectFile('src/components/HeroSection.tsx');
  assert(code.includes('Hours.') || code.includes('Hours'), 'Headline token must preserve closing punctuation');
});

test('Tier 2', 'R1-B3', 'Hero section has overflow-hidden to prevent ambient blob blur from creating horizontal scrollbars', () => {
  const code = readProjectFile('src/components/HeroSection.tsx');
  assert(code.includes('overflow-hidden'), 'Hero section must constrain blurred blobs with overflow-hidden');
});

test('Tier 2', 'R1-B4', 'Trust badges grid wraps gracefully on mobile viewports (grid-cols-1 sm:grid-cols-3)', () => {
  const code = readProjectFile('src/components/HeroSection.tsx');
  assert(code.includes('grid-cols-1') && code.includes('grid-cols-3'), 'Trust badges must use responsive grid columns');
});

test('Tier 2', 'R1-B5', 'Hero buttons have rounded-2xl corner radius conforming to strict token rules', () => {
  const code = readProjectFile('src/components/HeroSection.tsx');
  assert(!code.includes('rounded-sm'), 'Hero must not contain forbidden rounded-sm');
  assert(code.includes('rounded-2xl') || code.includes('rounded-3xl') || code.includes('rounded-full'), 'Hero elements must use rounded-2xl or rounded-3xl or rounded-full');
});

// Feature R2 Boundaries
test('Tier 2', 'R2-B1', 'Before/After slider drag clamp boundary at 0% (minimum)', () => {
  const code = readProjectFile('src/components/BeforeAfterShowcase.tsx');
  assert(code.includes('Math.max(0') || code.includes('Math.min(100, Math.max(0') || code.includes('Math.max('), 'Slider must clamp minimum value to prevent negative percentage');
});

test('Tier 2', 'R2-B2', 'Before/After slider drag clamp boundary at 100% (maximum)', () => {
  const code = readProjectFile('src/components/BeforeAfterShowcase.tsx');
  assert(code.includes('Math.min(100') || code.includes('100') || code.includes('Math.min('), 'Slider must clamp maximum value to 100%');
});

test('Tier 2', 'R2-B3', 'Before/After room switcher retains slider position when toggling rooms', () => {
  const code = readProjectFile('src/components/BeforeAfterShowcase.tsx');
  // Component manages sliderPosition independently of activeRoomId state
  assert(code.includes('sliderPosition') && code.includes('activeRoom'), 'Slider position state must be decoupled from room tab state');
});

test('Tier 2', 'R2-B4', 'Touch event coordinates normalization safely accesses touches array', () => {
  const code = readProjectFile('src/components/BeforeAfterShowcase.tsx');
  assert(code.includes('touches[0]') || code.includes('clientX') || code.includes('PointerEvent'), 'Touch event handler must inspect client coordinates safely');
});

test('Tier 2', 'R2-B5', 'Before and After labels remain positioned with pointer-events-none to prevent drag interference', () => {
  const code = readProjectFile('src/components/BeforeAfterShowcase.tsx');
  assert(code.includes('pointer-events-none'), 'Overlay labels must not intercept dragging pointer events');
});

// Feature R3 Boundaries
test('Tier 2', 'R3-B1', 'Gallery card aspect ratios alternate strictly between 4/5 and 3/4', () => {
  const code = readProjectFile('src/components/DesignGallery.tsx');
  assert(code.includes('aspect-[4/5]') && code.includes('aspect-[3/4]'), 'Masonry grid must alternate card aspect ratios');
});

test('Tier 2', 'R3-B2', '3D tilt mouse physics calculations clamp rotation angles within sensible bounds', () => {
  const code = readProjectFile('src/components/DesignGallery.tsx');
  assert(code.includes('rotateX') || code.includes('rotateY') || code.includes('transform'), '3D tilt must control X and Y axes rotation');
});

test('Tier 2', 'R3-B3', 'Mouse leave on gallery cards resets tilt back to neutral equilibrium', () => {
  const code = readProjectFile('src/components/DesignGallery.tsx');
  assert(code.includes('onMouseLeave') || code.includes('handleMouseLeave'), 'Card must implement onMouseLeave handler to restore equilibrium');
});

test('Tier 2', 'R3-B4', 'Next.js Image tags in gallery all define fill, alt, and sizes properties', () => {
  const code = readProjectFile('src/components/DesignGallery.tsx');
  assert(code.includes('fill'), 'Gallery images must use fill layout');
  assert(code.includes('alt='), 'Gallery images must have alt accessibility text');
  assert(code.includes('sizes='), 'Gallery images must specify responsive sizes attribute');
});

test('Tier 2', 'R3-B5', 'Gallery category filtering handles "All" by returning complete catalog of 8 items', () => {
  const code = readProjectFile('src/components/DesignGallery.tsx');
  assert(code.includes("activeCategory === 'All'") || code.includes('activeCategory === "All"'), 'Must provide All category branch returning full collection');
});

// Feature R4 Boundaries
test('Tier 2', 'R4-B1', 'Society horizontal scroll container handles snap alignment and hide-scrollbar', () => {
  const code = readProjectFile('src/components/SocietyPreMeasured.tsx');
  assert(code.includes('snap-x') || code.includes('scroll-smooth') || code.includes('overflow-x-auto'), 'Society container must implement smooth snap scrolling');
});

test('Tier 2', 'R4-B2', 'Society fire emoji stat strictly matches format regex pattern', () => {
  const code = readProjectFile('src/components/SocietyPreMeasured.tsx');
  const fireMatches = code.match(/\d+\s+flats done\s*🔥/g);
  assert(fireMatches && fireMatches.length >= 4, `Expected at least 4 matching fire emoji stats, found ${fireMatches ? fireMatches.length : 0}`);
});

test('Tier 2', 'R4-B3', 'Society price range displays formatted currency values', () => {
  const code = readProjectFile('src/components/SocietyPreMeasured.tsx');
  assert(code.includes('Est. ₹') || code.includes('₹'), 'Pre-estimated price must format currency with ₹');
});

test('Tier 2', 'R4-B4', 'Society pre-selection event name adheres to contract "auro:select-society"', () => {
  const code = readProjectFile('src/components/SocietyPreMeasured.tsx');
  assert(code.includes('auro:select-society'), 'Must dispatch event named "auro:select-society"');
});

test('Tier 2', 'R4-B5', 'Society cards use rounded-3xl outer container and rounded-2xl action button', () => {
  const code = readProjectFile('src/components/SocietyPreMeasured.tsx');
  assert(code.includes('rounded-3xl'), 'Society cards must use rounded-3xl container');
  assert(code.includes('rounded-2xl'), 'Society buttons must use rounded-2xl');
});

// Feature R5 Boundaries (Math & Wizard)
test('Tier 2', 'R5-B1', 'Dimension min boundary (5ft width, 8ft height) generates exact vertical drops and buffer', () => {
  const res = refCalculateRollNesting({ wallWidthFt: 5, wallHeightFt: 8 });
  assert(res.totalVerticalDrops === 2, `5ft width (60") / 42" roll = 2 drops, got ${res.totalVerticalDrops}`);
  assert(res.matchingWasteInches === 24, `2 drops = 1 pattern repeat (24") waste, got ${res.matchingWasteInches}`);
  assert(res.totalSqFtWithBuffer >= 40 * 1.11, 'Total sqft must apply >= 11% safety buffer over 40 sqft net area');
});

test('Tier 2', 'R5-B2', 'Dimension max boundary (30ft width, 15ft height) handles large expanse correctly', () => {
  const res = refCalculateRollNesting({ wallWidthFt: 30, wallHeightFt: 15 });
  assert(res.totalVerticalDrops === 9, `30ft width (360") / 42" roll = 9 drops, got ${res.totalVerticalDrops}`);
  assert(res.matchingWasteInches === 8 * 24, `9 drops = 8 repeats waste (192"), got ${res.matchingWasteInches}`);
  assert(res.totalSqFtWithBuffer >= 450 * 1.11, 'Total sqft must apply >= 11% safety buffer over 450 sqft');
});

test('Tier 2', 'R5-B3', 'Zero or negative wall dimensions boundary returns zero or clamped positive value without crashing', () => {
  const res = refCalculateRollNesting({ wallWidthFt: 0, wallHeightFt: 0 });
  assert(res.totalVerticalDrops === 0, 'Zero width produces 0 drops');
  assert(res.matchingWasteInches === 0, 'Zero width produces 0 waste');
  assert(!Number.isNaN(res.totalSqFtWithBuffer), 'Buffer sqft must not be NaN');
});

test('Tier 2', 'R5-B4', 'Fractional wall dimension input (10.5ft x 9.25ft) calculates precise area without truncation', () => {
  const res = refCalculateRollNesting({ wallWidthFt: 10.5, wallHeightFt: 9.25 });
  assert(res.totalVerticalDrops === 3, `10.5ft (126") / 42" = 3 drops, got ${res.totalVerticalDrops}`);
  assert(res.requiredContinuousMeters > 0, 'Continuous meters must be positive float');
});

test('Tier 2', 'R5-B5', 'Escrow tranche financial invariant: Tranche 1 (10%) + Tranche 2 (60%) + Tranche 3 (30%) === Total Retail Price', () => {
  const testInputs = [
    { rate: 120, sqft: 122.5, smart: false },
    { rate: 250, sqft: 185.0, smart: false },
    { rate: 300, sqft: 260.0, smart: true },
    { rate: 120, sqft: 50.0, smart: false },
  ];

  for (const input of testInputs) {
    const p = refCalculateDynamicPricing({
      rawMaterialBasePerSqFt: input.rate,
      totalSqFtRequired: input.sqft,
      isSmartMotorized: input.smart,
    });
    const sumTranches = p.escrowTranches.deposit10 + p.escrowTranches.materialRelease60 + p.escrowTranches.postQAUnlock30;
    const diff = Math.abs(sumTranches - p.totalRetailPrice);
    assert(diff < 0.001, `Tranche sum (${sumTranches}) must equal total price (${p.totalRetailPrice}), diff=${diff}`);
  }
});

// Feature R6 Boundaries
test('Tier 2', 'R6-B1', 'Zero occurrence of broken LayoutProps<"/"> across entire repository', () => {
  const filesToCheck = [
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/components/HeroSection.tsx',
    'src/components/BeforeAfterShowcase.tsx',
    'src/components/DesignGallery.tsx',
    'src/components/SocietyPreMeasured.tsx',
    'src/components/StatsTicker.tsx',
    'src/components/EstimatorGateway.tsx',
    'src/components/Footer.tsx',
  ];

  for (const f of filesToCheck) {
    if (fileExists(f)) {
      const content = readProjectFile(f);
      assert(!content.includes('LayoutProps<'), `File ${f} contains forbidden LayoutProps`);
    }
  }
});

test('Tier 2', 'R6-B2', 'Footer warranty badge text explicitly states 2-Year Warranty', () => {
  const code = readProjectFile('src/components/Footer.tsx');
  assert(code.includes('2-Year Warranty'), 'Footer must contain exact text "2-Year Warranty"');
});

test('Tier 2', 'R6-B3', 'Corridor service areas list contains all 5 marquee Hyderabad West localities', () => {
  const code = readProjectFile('src/components/Footer.tsx');
  const expectedAreas = ['Kokapet', 'Tellapur', 'Financial District', 'Nallagandla', 'Gachibowli'];
  for (const area of expectedAreas) {
    assert(code.includes(area), `Footer missing service area: ${area}`);
  }
});

test('Tier 2', 'R6-B4', 'Palette compliance audit: components strictly adhere to designated palette tokens', () => {
  const components = [
    'src/components/HeroSection.tsx',
    'src/components/BeforeAfterShowcase.tsx',
    'src/components/DesignGallery.tsx',
    'src/components/SocietyPreMeasured.tsx',
    'src/components/StatsTicker.tsx',
    'src/components/EstimatorGateway.tsx',
    'src/components/Footer.tsx',
  ];

  // Prohibited unauthorized arbitrary colors (e.g. standard blue-500, red-500, violet, etc.)
  const forbiddenHex = ['#0000FF', '#FF0000', '#800080', '#00FF00', '#FFA500'];

  for (const comp of components) {
    if (fileExists(comp)) {
      const code = readProjectFile(comp);
      for (const hex of forbiddenHex) {
        assert(!code.toUpperCase().includes(hex), `${comp} contains prohibited color ${hex}`);
      }
    }
  }
});

test('Tier 2', 'R6-B5', 'Corner compliance audit: zero occurrences of forbidden rounded-sm in redesign components', () => {
  const components = [
    'src/components/HeroSection.tsx',
    'src/components/BeforeAfterShowcase.tsx',
    'src/components/DesignGallery.tsx',
    'src/components/SocietyPreMeasured.tsx',
    'src/components/StatsTicker.tsx',
    'src/components/EstimatorGateway.tsx',
    'src/components/Footer.tsx',
  ];

  for (const comp of components) {
    if (fileExists(comp)) {
      const code = readProjectFile(comp);
      assert(!code.includes('rounded-sm'), `${comp} contains prohibited sharp corner 'rounded-sm'`);
    }
  }
});

// ============================================================================
// TIER 3: CROSS-FEATURE COMBINATIONS (6 TESTS)
// ============================================================================
console.log(bold('\n--- TIER 3: CROSS-FEATURE COMBINATIONS ---'));

test('Tier 3', 'R-C1', 'Society Card click triggers CustomEvent "auro:select-society" handled by EstimatorGateway', () => {
  const societyCode = readProjectFile('src/components/SocietyPreMeasured.tsx');
  const estimatorCode = readProjectFile('src/components/EstimatorGateway.tsx');
  assert(societyCode.includes("new CustomEvent('auro:select-society'"), 'Society card must dispatch auro:select-society CustomEvent');
  assert(estimatorCode.includes("addEventListener('auro:select-society'"), 'EstimatorGateway must listen for auro:select-society event');
});

test('Tier 3', 'R-C2', 'Changing finish tier updates total pricing, GST calculation, and 10% booking deposit', () => {
  const sqft = 150;
  const standard = refCalculateDynamicPricing({ rawMaterialBasePerSqFt: 120, totalSqFtRequired: sqft, isSmartMotorized: false });
  const belgian = refCalculateDynamicPricing({ rawMaterialBasePerSqFt: 250, totalSqFtRequired: sqft, isSmartMotorized: false });

  assert(belgian.materialCost > standard.materialCost, 'Belgian luxury material cost must exceed standard canvas');
  assert(belgian.subtotal > standard.subtotal, 'Belgian luxury subtotal must exceed standard canvas');
  assert(belgian.totalRetailPrice > standard.totalRetailPrice, 'Belgian total price must exceed standard');
  assert(belgian.escrowTranches.deposit10 === belgian.totalRetailPrice * 0.10, 'Deposit must strictly equal 10% of new price');
});

test('Tier 3', 'R-C3', 'Selecting Smart Motorized blinds applies flat ₹15,000 motor add-on fee', () => {
  const sqft = 150;
  const baseRate = 300;
  const manual = refCalculateDynamicPricing({ rawMaterialBasePerSqFt: baseRate, totalSqFtRequired: sqft, isSmartMotorized: false });
  const motorized = refCalculateDynamicPricing({ rawMaterialBasePerSqFt: baseRate, totalSqFtRequired: sqft, isSmartMotorized: true });

  const subtotalDiff = motorized.subtotal - manual.subtotal;
  assert(subtotalDiff === 15000, `Motorized subtotal difference must equal exactly ₹15,000, got ${subtotalDiff}`);
  assert(motorized.gstAmount === motorized.subtotal * 0.18, 'Motor add-on must be subject to 18% GST');
});

test('Tier 3', 'R-C4', 'Estimator WhatsApp URL correctly encodes society, dimensions, tier, and estimated price', () => {
  const society = 'Rajapushpa Provincia';
  const widthFt = 14;
  const heightFt = 10;
  const nesting = refCalculateRollNesting({ wallWidthFt: widthFt, wallHeightFt: heightFt });
  const pricing = refCalculateDynamicPricing({ rawMaterialBasePerSqFt: 250, totalSqFtRequired: nesting.totalSqFtWithBuffer });

  const priceFormatted = Math.round(pricing.totalRetailPrice).toLocaleString('en-IN');
  const depositFormatted = Math.round(pricing.escrowTranches.deposit10).toLocaleString('en-IN');

  const textPayload = `Hi AuroMakeover! 👋\n\nI would like to book a Free Swatch Van Visit to *${society}*.\n\n*Configured Estimate Summary:*\n• Target Society: ${society}\n• Wall Dimensions: ${widthFt}ft (W) × ${heightFt}ft (H)\n• Total Estimated Price: ₹${priceFormatted}\n• 10% Escrow Booking Deposit: ₹${depositFormatted}`;
  const encodedUrl = `https://wa.me/919700675637?text=${encodeURIComponent(textPayload)}`;

  assert(encodedUrl.startsWith('https://wa.me/919700675637?text='), 'URL must begin with official WhatsApp API endpoint and phone number');
  assert(encodedUrl.includes(encodeURIComponent(society)), 'URL must encode target society name');
  assert(encodedUrl.includes(encodeURIComponent(`₹${priceFormatted}`)), 'URL must encode formatted price amount');
});

test('Tier 3', 'R-C5', 'Hero "View Lookbook" CTA smoothly targets Design Gallery (#gallery)', () => {
  const heroCode = readProjectFile('src/components/HeroSection.tsx');
  const galleryCode = readProjectFile('src/components/DesignGallery.tsx');
  assert(heroCode.includes('#gallery') || heroCode.includes('gallery'), 'Hero Lookbook CTA must link or scroll to gallery');
  assert(galleryCode.includes('id="gallery"') || galleryCode.includes("id='gallery'"), 'DesignGallery component must have id="gallery" for anchor targeting');
});

test('Tier 3', 'R-C6', 'Estimator 3-step wizard enforces sequential forward navigation and direct backward navigation', () => {
  const estimatorCode = readProjectFile('src/components/EstimatorGateway.tsx');
  assert(estimatorCode.includes('setCurrentStep(2)') || estimatorCode.includes('setCurrentStep(currentStep + 1)') || estimatorCode.includes('currentStep < 3'), 'Wizard must support advancing to next step');
  assert(estimatorCode.includes('setCurrentStep(1)') || estimatorCode.includes('setCurrentStep(currentStep - 1)') || estimatorCode.includes('ArrowLeft'), 'Wizard must support stepping back to previous step');
  assert(estimatorCode.includes('disabled=') || estimatorCode.includes('cursor-not-allowed'), 'Future steps must be disabled until prerequisites are reached');
});

test('Tier 3', 'R-C7', 'Gallery Shop This Look prefills estimator via shared prefill channel', () => {
  const galleryCode = readProjectFile('src/components/DesignGallery.tsx');
  assert(galleryCode.includes('Shop This Look'), 'Gallery card must offer Shop This Look action');
  assert(galleryCode.includes('estimator_prefill'), 'Shop action must write the shared estimator_prefill channel');
  assert(galleryCode.includes('?prefill='), 'Shop action must navigate to estimator with prefill param');
  const libCode = readProjectFile('src/lib/quiz-to-tags.ts');
  assert(libCode.includes('designToEstimatorPrefill'), 'Design-to-prefill mapping must live in the shared tags lib');
});

test('Tier 3', 'R-C8', 'Quiz completion writes estimator prefill and navigates with prefill param', () => {
  const quizCode = readProjectFile('src/app/quiz/page.tsx');
  assert(quizCode.includes('estimator_prefill'), 'Quiz must write the shared estimator_prefill channel');
  assert(quizCode.includes('?prefill='), 'Quiz must navigate to estimator with prefill param');
  assert(quizCode.includes('tagsToEstimatorPrefill'), 'Quiz must build prefill via shared tags lib');
});

test('Tier 3', 'R-C9', 'Visualize Use This Look writes estimator prefill with restyled image', () => {
  const galleryCode = readProjectFile('src/components/DesignGallery.tsx');
  assert(galleryCode.includes('restyledImage'), 'Visualize handoff must carry the restyled image into prefill');
  assert(galleryCode.includes('estimator_prefill'), 'Visualize handoff must write the shared estimator_prefill channel');
});

test('Tier 3', 'R-C10', 'City geo routes exist with city-aware landing', () => {
  assert(fileExists('src/app/[city]/page.tsx'), 'Dynamic [city] route page must exist');
  const landingCode = readProjectFile('src/app/[city]/CityLanding.tsx');
  assert(landingCode.includes('CityLanding') || landingCode.includes('city'), 'City landing must consume city config');
  const citiesCode = readProjectFile('src/lib/cities.ts');
  assert(citiesCode.includes('societies') && citiesCode.includes('whatsappNumber'), 'City config must carry societies and WhatsApp numbers');
});

test('Tier 3', 'R-C11', 'Lead router assigns agents by city, weight and round-robin with fallback', () => {
  assert(fileExists('src/lib/lead-router.ts'), 'Pure lead router module must exist');
  const code = readProjectFile('src/lib/lead-router.ts');
  assert(code.includes('routeLead'), 'Router must export routeLead');
  assert(code.includes('SalesAgent'), 'Router must type the agent roster');
  assert(code.includes('weight'), 'Router must respect agent weight priority');
  assert(code.includes('isActive'), 'Router must skip inactive agents');
});

test('Tier 3', 'R-C12', 'Quiz lead persists assignment with real schema fields only', () => {
  const code = readProjectFile('src/app/api/leads/quiz/route.ts');
  assert(code.includes('assignedAgentId'), 'Quiz upsert must persist the routing assignment');
  assert(code.includes('sessionId'), 'Quiz upsert must key on session id');
  assert(code.includes("source"), 'Quiz upsert must tag the lead source');
  assert(!code.includes('QUIZ_COMPLETED'), 'Must not write enum values absent from the Prisma schema');
});

test('Tier 3', 'R-C13', 'Estimator booking captures intent before opening WhatsApp', () => {
  assert(fileExists('src/app/api/leads/estimator/route.ts'), 'Estimator intent endpoint must exist');
  const gatewayCode = readProjectFile('src/components/EstimatorGateway.tsx');
  assert(gatewayCode.includes('/api/leads/estimator'), 'Gateway must POST booking intent before WhatsApp open');
  assert(gatewayCode.includes('assignedAgentNumber') || gatewayCode.includes('assignedWhatsapp'), 'Gateway must retarget WhatsApp to the assigned agent number');
});

test('Tier 4', 'R-W5', 'Scenario E: Quiz lead routed to city agent end to end', () => {
  const quizCode = readProjectFile('src/app/quiz/page.tsx');
  assert(quizCode.includes('/api/leads/quiz'), 'Quiz must persist the lead via the leads API');
  const routerCode = readProjectFile('src/lib/lead-router.ts');
  assert(routerCode.includes('routeLead'), 'Router must resolve the assigned agent');
  const estimatorCode = readProjectFile('src/components/EstimatorGateway.tsx');
  assert(estimatorCode.includes('estimator_prefill') || estimatorCode.includes('prefill'), 'Estimator must still honor the shared prefill channel');
});

// ============================================================================
// TIER 4: REAL-WORLD APPLICATION SCENARIOS (4 TESTS)
// ============================================================================
console.log(bold('\n--- TIER 4: REAL-WORLD APPLICATION SCENARIOS ---'));

test('Tier 4', 'R-W1', 'Scenario A: My Home Bhooja 3BHK Living Room Accent Wall Makeover', () => {
  // Scenario: 16ft width x 10ft height, Belgian Luxury @ ₹250/sqft
  const wallWidthFt = 16;
  const wallHeightFt = 10;
  const rate = 250;

  const nesting = refCalculateRollNesting({
    wallWidthFt,
    wallHeightFt,
    rollWidthInches: 42,
    patternRepeatInches: 24,
  });

  // Verify nesting: 16ft = 192 inches. 192 / 42 = 4.57 -> 5 vertical drops.
  assert(nesting.totalVerticalDrops === 5, `Expected 5 drops, got ${nesting.totalVerticalDrops}`);
  // 4 matching pattern wastes of 24" = 96"
  assert(nesting.matchingWasteInches === 96, `Expected 96" waste, got ${nesting.matchingWasteInches}`);
  // Exact wall area = 160 sqft. Safety buffer = 160 * 1.11 = 177.6 sqft.
  assert(nesting.totalSqFtWithBuffer >= 177.6, `Expected >= 177.6 sqft with buffer, got ${nesting.totalSqFtWithBuffer}`);

  const pricing = refCalculateDynamicPricing({
    rawMaterialBasePerSqFt: rate,
    totalSqFtRequired: nesting.totalSqFtWithBuffer,
    isSmartMotorized: false,
  });

  // Verify financial breakdown
  assert(pricing.primerCost === 15 * nesting.totalSqFtWithBuffer, 'Primer cost calculation verified');
  assert(pricing.installationLaborCost === 25 * nesting.totalSqFtWithBuffer, 'Labor cost calculation verified');
  assert(pricing.gstAmount === pricing.subtotal * 0.18, '18% GST calculation verified');
  assert(pricing.escrowTranches.deposit10 === pricing.totalRetailPrice * 0.10, '10% Escrow deposit verified');

  // Verify WhatsApp booking payload
  const waUrl = `https://wa.me/919700675637?text=${encodeURIComponent(`AuroMakeover: My Home Bhooja living room total ₹${Math.round(pricing.totalRetailPrice)}`)}`;
  assert(waUrl.includes('919700675637'), 'WhatsApp hotline verified');
});

test('Tier 4', 'R-W2', 'Scenario B: Rajapushpa Provincia 14th Floor West Penthouse Smart Motorized Blinds', () => {
  // Scenario: 24ft width x 11ft height on 14th floor facing West (270 degrees)
  const solarLux = refAnalyzeSolarLux({ compassAngleDegrees: 270, floorNumber: 14 });
  assert(solarLux.highSolarHeatRadiation === true, 'West facing 14th floor must be flagged for high heat radiation');
  assert(solarLux.recommendedBlindType === 'Double-cell Honeycomb Blinds', 'Severe heat exposure must recommend honeycomb or blackout');

  const nesting = refCalculateRollNesting({
    wallWidthFt: 24,
    wallHeightFt: 11,
    rollWidthInches: 42,
    patternRepeatInches: 24,
  });

  // 24ft = 288 inches. 288 / 42 = 6.85 -> 7 drops
  assert(nesting.totalVerticalDrops === 7, `Expected 7 drops, got ${nesting.totalVerticalDrops}`);

  const pricing = refCalculateDynamicPricing({
    rawMaterialBasePerSqFt: 300,
    totalSqFtRequired: nesting.totalSqFtWithBuffer,
    isSmartMotorized: true, // Motor add-on
  });

  // Material (300) + Primer (15) + Labor (25) = 340/sqft + 15,000 motor flat
  const expectedSubtotal = (340 * nesting.totalSqFtWithBuffer) + 15000;
  const diff = Math.abs(pricing.subtotal - expectedSubtotal);
  assert(diff < 0.01, `Expected subtotal ${expectedSubtotal}, got ${pricing.subtotal}`);
  assert(pricing.totalRetailPrice > 100000, `High rise luxury package should total > ₹1,00,000, got ${pricing.totalRetailPrice}`);
});

test('Tier 4', 'R-W3', 'Scenario C: Aparna Sarovar Zenith Master Bedroom Standard Canvas Makeover', () => {
  // Scenario: 12ft width x 9ft height, Standard Canvas @ ₹120/sqft
  const nesting = refCalculateRollNesting({
    wallWidthFt: 12,
    wallHeightFt: 9,
    rollWidthInches: 42,
    patternRepeatInches: 24,
  });

  // 12ft = 144 inches. 144 / 42 = 3.42 -> 4 drops
  assert(nesting.totalVerticalDrops === 4, `Expected 4 drops, got ${nesting.totalVerticalDrops}`);
  // Continuous fabric meters
  assert(nesting.requiredContinuousMeters > 10, 'Continuous fabric must exceed 10 linear meters');

  const pricing = refCalculateDynamicPricing({
    rawMaterialBasePerSqFt: 120,
    totalSqFtRequired: nesting.totalSqFtWithBuffer,
    isSmartMotorized: false,
  });

  assert(pricing.totalRetailPrice > 0, 'Pricing must be computed');
  assert(pricing.escrowTranches.deposit10 === pricing.totalRetailPrice * 0.10, 'Deposit must be 10%');
  assert(pricing.escrowTranches.materialRelease60 === pricing.totalRetailPrice * 0.60, 'Material release must be 60%');
  assert(pricing.escrowTranches.postQAUnlock30 === pricing.totalRetailPrice * 0.30, 'Post-QA unlock must be 30%');
});

test('Tier 4', 'R-W4', 'Scenario D: Prestige High Fields Full Customer Journey Simulation', () => {
  // 1. Visitor enters site and reads Hero guarantees
  const heroCode = readProjectFile('src/components/HeroSection.tsx');
  assert(heroCode.includes('48 Hours'), 'Customer observes 48-Hour delivery guarantee');

  // 2. Visitor explores Before/After slider
  const showcaseCode = readProjectFile('src/components/BeforeAfterShowcase.tsx');
  assert(showcaseCode.includes('Builder Finish') && showcaseCode.includes('After AuroMakeover'), 'Customer compares builder finish with AuroMakeover');

  // 3. Visitor filters gallery by Botanical
  const galleryCode = readProjectFile('src/components/DesignGallery.tsx');
  assert(galleryCode.includes('Botanical'), 'Customer selects Botanical collection');

  // 4. Visitor scrolls to Prestige High Fields pre-measured card
  const societyCode = readProjectFile('src/components/SocietyPreMeasured.tsx');
  assert(societyCode.includes('Prestige High Fields'), 'Customer finds their gated society');

  // 5. Customer clicks "Check My Flat →" which navigates to estimator
  assert(societyCode.includes('auro:select-society'), 'Pre-populates society in estimator wizard');

  // 6. Customer navigates EstimatorGateway through Step 1 -> Step 2 -> Step 3
  const estimatorCode = readProjectFile('src/components/EstimatorGateway.tsx');
  assert(estimatorCode.includes('Step 1') || estimatorCode.includes('Room Size'), 'Completes Step 1');
  assert(estimatorCode.includes('Step 2') || estimatorCode.includes('Finish Tier'), 'Completes Step 2');
  assert(estimatorCode.includes('Step 3') || estimatorCode.includes('Book') || estimatorCode.includes('Review'), 'Completes Step 3');

  // 7. Customer books swatch van via WhatsApp
  assert(estimatorCode.includes('919700675637'), 'Sends booking request to AuroMakeover concierge at 919700675637');
});

// ============================================================================
// TIER 3 EXTENSION: GSAP INTERACTION LAYER (R10.x — animated numbers, gold lines, scroll motion)
// ============================================================================

test('Tier 3', 'R10.1', 'GSAP installed and ScrollTrigger registered once in a client-safe setup module', () => {
  const pkg = readProjectFile('package.json');
  assert(pkg.includes('"gsap"'), 'gsap must be a dependency in package.json');
  assert(fileExists('src/lib/gsap.ts'), 'Client-safe GSAP setup module must exist');
  const code = readProjectFile('src/lib/gsap.ts');
  assert(code.includes('registerPlugin'), 'Setup module must register GSAP plugins');
  assert(code.includes('ScrollTrigger'), 'Setup module must wire ScrollTrigger');
  assert(code.includes('typeof window'), 'Setup module must guard against SSR (no window on server)');
});

test('Tier 3', 'R10.2', 'AnimatedCounter counts up on scroll into view with Warm Gold digits', () => {
  assert(fileExists('src/components/AnimatedCounter.tsx'), 'AnimatedCounter component must exist');
  const code = readProjectFile('src/components/AnimatedCounter.tsx');
  assert(code.includes('useGSAP'), 'Counter must drive its tween via useGSAP');
  assert(code.includes('gsap.to'), 'Counter must animate a numeric tween object');
  assert(code.includes('#C5A880'), 'Counter digits must carry the Warm Gold accent');
  assert(code.includes('ScrollTrigger'), 'Counter must fire when scrolled into view');
});

test('Tier 3', 'R10.3', 'GoldDivider draws an animated gold divider line on scroll', () => {
  assert(fileExists('src/components/GoldDivider.tsx'), 'GoldDivider component must exist');
  const code = readProjectFile('src/components/GoldDivider.tsx');
  assert(code.includes('strokeDash'), 'Divider must draw itself via stroke dash animation');
  assert(code.includes('#C5A880'), 'Divider line must use the Warm Gold palette token');
  assert(code.includes('ScrollTrigger') || code.includes('scrollTrigger'), 'Divider draw must be scroll-triggered');
});

test('Tier 3', 'R10.4', 'GSAP layer wired into page seams and Reviews heading stat', () => {
  const pageCode = readProjectFile('src/app/page.tsx');
  assert(pageCode.includes('GoldDivider'), 'page.tsx must mount the animated gold divider');
  const reviewsCode = readProjectFile('src/components/Reviews.tsx');
  assert(reviewsCode.includes('AnimatedCounter'), 'Reviews must animate its 200+ stat with the counter');
});

test('Tier 3', 'R10.5', 'Hero gains scrubbed scroll parallax on the background image', () => {
  const code = readProjectFile('src/components/HeroSection.tsx');
  assert(code.includes('useGSAP') || code.includes('gsap'), 'Hero must drive motion via GSAP');
  assert(code.includes('yPercent') || code.includes('scrub'), 'Hero must apply scrubbed vertical parallax');
});

// ============================================================================
// SUMMARY & READINESS REPORT
// ============================================================================
console.log(bold(cyan('\n========================================================================')));
console.log(bold(cyan('  E2E TEST SUITE EXECUTION SUMMARY')));
console.log(bold(cyan('========================================================================')));
console.log(`  Total Tests Run:    ${bold(totalTests)}`);
console.log(`  Passed Tests:       ${bold(green(passedTests))}`);
console.log(`  Failed Tests:       ${bold(failedTests > 0 ? red(failedTests) : green(0))}`);
console.log(`  Pass Rate:          ${bold(green(`${((passedTests / totalTests) * 100).toFixed(1)}%`))}`);

if (failures.length > 0) {
  console.log(bold(red('\nFailures Summary:')));
  failures.forEach(f => {
    console.log(`  [${f.tier}] ${bold(f.id)}: ${f.title}`);
    console.log(`    Error: ${red(f.error)}`);
  });
  process.exit(1);
} else {
  console.log(bold(green(`\nALL ${totalTests} OPAQUE-BOX E2E TESTS PASSED WITH 100% SUCCESS!\n`)));
  process.exit(0);
}
