export type QuizAnswers = {
  roomType?: string;
  styleVibe?: string;
  colorPreference?: string;
  mustHaves?: string[];
  budgetTier?: string;
};

export type QuizTags = {
  categories: string[];
  budgetTier: 'essential' | 'premium' | 'luxury';
  roomType: string;
  priorityFeatures: string[];
};

const STYLE_TO_CATEGORY: Record<string, string[]> = {
  'modern-minimal': ['Fluted Louver'],
  'warm-traditional': ['Neo-Classical', 'Temple Pichwai'],
  'luxury-glam': ['Botanical', 'Neo-Classical'],
  'eclectic-boho': ['Botanical', 'Temple Pichwai'],
  'zen-nature': ['Botanical', 'Fluted Louver'],
};

const COLOR_TO_ACCENT: Record<string, string[]> = {
  'neutrals': ['Fluted Louver'],
  'earth-tones': ['Botanical', 'Temple Pichwai'],
  'jewel-tones': ['Neo-Classical', 'Botanical'],
  'pastels': ['Botanical', 'Fluted Louver'],
  'dark-moody': ['Neo-Classical', 'Temple Pichwai'],
};

const MUST_HAVE_TO_TAG: Record<string, string> = {
  'smart-blinds': 'Smart Blinds',
  'acoustic-panels': 'Fluted Louver',
  'feature-wallpaper': 'Botanical',
  'concealed-lighting': 'Neo-Classical',
  'heritage-mouldings': 'Temple Pichwai',
};

const BUDGET_MAP: Record<string, 'essential' | 'premium' | 'luxury'> = {
  'essential': 'essential',
  'premium': 'premium',
  'luxury': 'luxury',
};

export function answersToTags(answers: QuizAnswers): QuizTags {
  const categorySet = new Set<string>();

  // Style vibe → categories
  const styleCats = STYLE_TO_CATEGORY[answers.styleVibe ?? ''];
  if (styleCats) styleCats.forEach((c) => categorySet.add(c));

  // Color preference → accent categories
  const colorCats = COLOR_TO_ACCENT[answers.colorPreference ?? ''];
  if (colorCats) colorCats.forEach((c) => categorySet.add(c));

  // Must-haves → direct tag mapping
  answers.mustHaves?.forEach((m) => {
    const tag = MUST_HAVE_TO_TAG[m];
    if (tag) categorySet.add(tag);
  });

  return {
    categories: Array.from(categorySet),
    budgetTier: BUDGET_MAP[answers.budgetTier ?? ''] || 'premium',
    roomType: answers.roomType ?? '',
    priorityFeatures: answers.mustHaves ?? [],
  };
}

export function tagsToWhatsAppMessage(tags: QuizTags, society?: string, customerName?: string): string {
  const lines = [
    'Hi AuroMakeover, I\'d like a quote based on my style quiz.',
    customerName ? `Name: ${customerName}` : '',
    '',
    `Room: ${tags.roomType.replace('-', ' ')}`,
    `Style categories: ${tags.categories.join(', ')}`,
    `Budget tier: ${tags.budgetTier}`,
    tags.priorityFeatures.length ? `Must-haves: ${tags.priorityFeatures.join(', ')}` : '',
    society ? `Society: ${society}` : '',
    '',
    'Please share estimate & next steps. Thanks!',
  ].filter(Boolean);

  return encodeURIComponent(lines.join('\n'));
}

export function tagsToEstimatorPrefill(tags: QuizTags) {
  return {
    roomType: tags.roomType,
    finishTier: tags.budgetTier,
    categories: tags.categories,
    features: tags.priorityFeatures,
  };
}

export type GalleryDesign = {
  id: number;
  title: string;
  category: string;
  room: string;
};

const CATEGORY_TO_TIER: Record<string, 'essential' | 'premium' | 'luxury'> = {
  'Botanical': 'premium',
  'Fluted Louver': 'premium',
  'Neo-Classical': 'luxury',
  'Temple Pichwai': 'luxury',
};

const ROOM_TO_TYPE: Record<string, string> = {
  'Living Room': 'living',
  'TV Media Wall': 'living',
  'Master Bedroom': 'bedroom',
  'Guest Bedroom': 'bedroom',
  'Dining Nook': 'dining',
  'Pooja Room': 'pooja',
  'Pooja Corridor': 'pooja',
};

export function designToEstimatorPrefill(item: GalleryDesign) {
  return {
    roomType: ROOM_TO_TYPE[item.room] ?? '',
    finishTier: CATEGORY_TO_TIER[item.category] ?? 'premium',
    categories: [item.category],
    features: [] as string[],
    designId: item.id,
    designTitle: item.title,
  };
}