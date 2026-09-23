/**
 * Package Recommender — pure core (spec-package-recommender.md)
 *
 * Maps a short questionnaire (room target, style affinity, budget band,
 * project scope) to a concrete AuroMakeover package. Pure and deterministic:
 * no React, no DB, no side effects — unit-testable via node.
 */

export interface PackageDef {
  id: string;
  name: string;
  tagline: string;
  /** Finish tier key understood by EstimatorGateway's tierMap (essential|premium|luxury) */
  tier: 'essential' | 'premium' | 'luxury';
  /** Minimum budget band in ₹ required for this package */
  minBudget: number;
  roomTypes: string[];
  styles: string[];
  /** Full-room packages score higher when scope === 'full-room' */
  fullRoom: boolean;
  includes: string[];
}

export interface RecommendInput {
  roomType?: string | null;
  style?: string | null;
  budget?: number | null;
  scope?: string | null;
}

export interface RecommendResult {
  package: PackageDef;
  matches: string[];
}

export const PACKAGES: PackageDef[] = [
  {
    id: 'accent-wall',
    name: 'Signature Accent Wall',
    tagline: 'One statement wall, transformed in a day.',
    tier: 'essential',
    minBudget: 15000,
    roomTypes: ['living', 'bedroom', 'dining', 'office'],
    styles: ['botanical', 'fluted', 'neoclassical'],
    fullRoom: false,
    includes: ['Single accent wall', 'Premium substrate + install', 'Oversize pattern match'],
  },
  {
    id: 'room-suite',
    name: 'Full Room Suite',
    tagline: 'Every wall, ceiling line and blind coordinated.',
    tier: 'premium',
    minBudget: 40000,
    roomTypes: ['living', 'bedroom', 'dining'],
    styles: ['botanical', 'fluted', 'neoclassical', 'pichwai'],
    fullRoom: true,
    includes: ['All four walls', 'Coordinated blind package', 'Matched door/window trims', '2-year warranty'],
  },
  {
    id: 'smart-home',
    name: 'Smart Motorized Home',
    tagline: 'Motorized blackout + acoustic panels, app-controlled.',
    tier: 'luxury',
    minBudget: 75000,
    roomTypes: ['living', 'bedroom', 'office', 'full-home'],
    styles: ['fluted', 'minimal', 'neoclassical'],
    fullRoom: true,
    includes: ['Motorized smart blinds', 'Acoustic fluted panels', 'Voice + app control', 'Solar heat analysis'],
  },
  {
    id: 'temple-pichwai',
    name: 'Temple Pichwai Ensemble',
    tagline: 'Heritage artwork walls for pooja rooms & corridors.',
    tier: 'luxury',
    minBudget: 55000,
    roomTypes: ['pooja', 'dining'],
    styles: ['pichwai', 'neoclassical'],
    fullRoom: false,
    includes: ['Hand-crafted Pichwai canvas', 'Gold-leaf accents', 'Anti-yellowing finish'],
  },
];

const norm = (s: string | null | undefined) => (s ?? '').trim().toLowerCase();

/**
 * Score-based recommendation:
 * - +2 per matching roomType
 * - +2 per matching style
 * - budget band guard: reject packages above the user's budget (unless unset)
 * - full-room packages get +1 when scope === 'full-room'
 * - ties break deterministically by catalog order (stable sort)
 * Always returns a package: unmatched/no-budget falls back to the first.
 */
export function recommendPackage(input: RecommendInput): RecommendResult {
  const room = norm(input.roomType);
  const style = norm(input.style);
  const scope = norm(input.scope);
  const budget = typeof input.budget === 'number' && input.budget > 0 ? input.budget : null;

  const scored = PACKAGES.map((pkg) => {
    const matches: string[] = [];
    if (room && pkg.roomTypes.includes(room)) matches.push(`Designed for ${room} rooms`);
    if (style && pkg.styles.includes(style)) matches.push(`Matches your ${style} style`);
    if (scope === 'full-room' && pkg.fullRoom) matches.push('Covers the full room scope');
    if (scope && !pkg.fullRoom && scope !== 'full-room') matches.push('Perfect single-wall scope');

    const roomScore = room && pkg.roomTypes.includes(room) ? 2 : 0;
    const styleScore = style && pkg.styles.includes(style) ? 2 : 0;
    const scopeScore = scope === 'full-room' && pkg.fullRoom ? 1 : 0;
    // Budget: prefer packages under budget; never push one far above the band
    const withinBudget = budget === null || budget >= pkg.minBudget;
    const budgetScore = withinBudget ? 1 : -3;

    return { pkg, matches, score: roomScore + styleScore + scopeScore + budgetScore, withinBudget };
  });

  // Any in-budget match beats a forced above-budget one
  const candidates = scored.filter((s) => s.withinBudget);
  const pool = candidates.length > 0 ? candidates : scored;

  pool.sort((a, b) => b.score - a.score || PACKAGES.indexOf(a.pkg) - PACKAGES.indexOf(b.pkg));
  const best = pool[0];
  return { package: best.pkg, matches: best.matches };
}

export interface PrefillData {
  roomType: string;
  finishTier: 'essential' | 'premium' | 'luxury';
  categories: string[];
  features: string[];
}

/** Map a recommended package onto the shared estimator_prefill channel. */
export function recommendToPrefill(pkg: PackageDef): PrefillData {
  return {
    roomType: pkg.roomTypes[0] ?? 'living',
    finishTier: pkg.tier,
    categories: pkg.styles.slice(0, 1),
    features: pkg.includes.slice(0, 2),
  };
}

/** The budget bands shown as selectable chips in the questionnaire. */
export const BUDGET_BANDS: { label: string; value: number }[] = [
  { label: '₹15k–₹40k', value: 30000 },
  { label: '₹40k–₹75k', value: 60000 },
  { label: '₹75k+', value: 100000 },
];