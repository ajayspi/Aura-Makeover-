/**
 * Before/After Grid — Paired-Image Catalog (R13)
 * 15 true same-space before→after pairs across 7 categories (2–3 variants each).
 * Cell 16 is the estimator CTA (handled by the grid component).
 *
 * Keys for the keyed Pollinations /v1/images/edits generation route live in the
 * gitignored .secrets/image-keys.json and are NEVER inlined in source.
 * The generation script (scripts/generate-before-after-pairs.mjs) reads from there.
 */

export interface BeforeAfterPair {
  id: string;
  category: string;
  variant: number;
  label: string;
  before: string; // public/images path
  after: string;  // public/images path
}

export const GRID_CATEGORIES = [
  'living',
  'bedroom',
  'dining',
  'office',
  'pooja',
  'kids',
  'balcony',
] as const;

export const BEFORE_AFTER_PAIRS: BeforeAfterPair[] = [
  // Living Room (3 variants)
  {
    id: 'living-1',
    category: 'living',
    variant: 1,
    label: 'Living Room — Fluted Walnut Louvers',
    before: '/images/before-living-2.jpg',
    after: '/images/after-living-fluted.jpg',
  },
  {
    id: 'living-2',
    category: 'living',
    variant: 2,
    label: 'Living Room — Botanical Wallpaper Accent',
    before: '/images/before-living-1.jpg',
    after: '/images/after-living-botanical.jpg',
  },
  {
    id: 'living-3',
    category: 'living',
    variant: 3,
    label: 'Living Room — Concealed Cove Lighting',
    before: '/images/before-living-3.jpg',
    after: '/images/after-living-arch.jpg',
  },

  // Bedroom (3 variants)
  {
    id: 'bedroom-1',
    category: 'bedroom',
    variant: 1,
    label: 'Bedroom — Warm Gold Textile Layer',
    before: '/images/before-master.jpg',
    after: '/images/after-master-pichwai.jpg',
  },
  {
    id: 'bedroom-2',
    category: 'bedroom',
    variant: 2,
    label: 'Bedroom — Smart Blackout Minimal',
    before: '/images/before-master.jpg',
    after: '/images/after-master-smart.jpg',
  },
  {
    id: 'bedroom-3',
    category: 'bedroom',
    variant: 3,
    label: 'Bedroom — Organic Linen Tones',
    before: '/images/before-master.jpg',
    after: '/images/after-master-linen.jpg',
  },

  // Dining (1 variant)
  {
    id: 'dining-1',
    category: 'dining',
    variant: 1,
    label: 'Dining Room — Tinted Bronze Mirror Paneling',
    before: '/images/before-dining.jpg',
    after: '/images/after-dining-mirror.jpg',
  },

  // Office (2 variants)
  {
    id: 'office-1',
    category: 'office',
    variant: 1,
    label: 'Guest Office — Executive Walnut Bookshelves',
    before: '/images/before-office.jpg',
    after: '/images/after-office-wood.jpg',
  },
  {
    id: 'office-2',
    category: 'office',
    variant: 2,
    label: 'Guest Office — Bright Fluted Minimalism',
    before: '/images/before-office.jpg',
    after: '/images/after-office-bright.jpg',
  },

  // Pooja Room (2 variants)
  {
    id: 'pooja-1',
    category: 'pooja',
    variant: 1,
    label: 'Pooja Room — Traditional Carved Wood',
    before: '/images/before-pooja.jpg',
    after: '/images/after-pooja-traditional.jpg',
  },
  {
    id: 'pooja-2',
    category: 'pooja',
    variant: 2,
    label: 'Pooja Room — Modern Statuario Marble',
    before: '/images/before-pooja.jpg',
    after: '/images/after-pooja-marble.jpg',
  },

  // Kids Room (2 variants)
  {
    id: 'kids-1',
    category: 'kids',
    variant: 1,
    label: 'Kids Room — Luxury Jungle Safari',
    before: '/images/before-kids.jpg',
    after: '/images/after-kids-jungle.jpg',
  },
  {
    id: 'kids-2',
    category: 'kids',
    variant: 2,
    label: 'Kids Room — Galaxy Space Theme',
    before: '/images/before-kids.jpg',
    after: '/images/after-kids-space.jpg',
  },

  // Balcony (2 variants)
  {
    id: 'balcony-1',
    category: 'balcony',
    variant: 1,
    label: 'Balcony — Teak Wood Decking',
    before: '/images/balcony 1 -garden BEFORE.jpg',
    after: '/images/after-balcony-decking.jpg',
  },
  {
    id: 'balcony-2',
    category: 'balcony',
    variant: 2,
    label: 'Balcony — Vertical Green Garden',
    before: '/images/balcony 1 -garden BEFORE.jpg',
    after: '/images/after-balcony-garden.jpg',
  },
];

// Total paired cells = 15 (16th cell is the CTA, handled by the grid component)
export const PAIR_COUNT = BEFORE_AFTER_PAIRS.length;
export const CELL_COUNT = PAIR_COUNT + 1; // +1 for the estimator CTA card
