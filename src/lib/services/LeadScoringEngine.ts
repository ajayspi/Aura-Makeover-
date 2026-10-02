/**
 * Lead Scoring Engine
 * 
 * Three-dimensional scoring model:
 *   - Engagement (30% weight): How actively is the lead interacting?
 *   - Intent (40% weight): How close are they to buying?
 *   - Value (30% weight): How much revenue potential?
 * 
 * Pure function — no side effects, no DB calls.
 */

export interface ScoreInput {
  // Engagement signals
  quizCompleted: boolean;
  estimatorUsed: boolean;
  pageVisits: number;
  whatsappResponded: boolean;
  vanVisitDone: boolean;

  // Intent signals
  societyMentioned: boolean;
  budgetProvided: boolean;
  timelineMentioned: boolean;
  callbackRequested: boolean;
  pricingPageVisits: number;

  // Value signals
  estimatedValue: number;
  unitType: string; // 2BHK, 3BHK, 4BHK, 5BHK
  isPremiumSociety: boolean;
  isRepeatCustomer: boolean;
  isReferred: boolean;
}

export type ScoreTier = 'S' | 'A' | 'B' | 'C';

export interface ScoreOutput {
  engagementScore: number;  // 0-100
  intentScore: number;      // 0-100
  valueScore: number;       // 0-100
  compositeScore: number;   // 0-100 (weighted)
  tier: ScoreTier;
}

// Premium societies in Hyderabad (extensible per city)
const PREMIUM_SOCIETIES = [
  'My Home Bhooja',
  'Aparna Sarovar Zenith',
  'Rajapushpa Provincia',
  'Prestige High Fields',
  'Phoenix Towers',
  'Lodha Bellezza',
  'My Home Abhra',
];

/**
 * Calculate lead score across all three dimensions.
 * Returns a composite score and tier classification.
 */
export function calculateLeadScore(input: ScoreInput): ScoreOutput {
  // ─── Engagement Dimension (0-100, weighted 30%) ───
  let engagement = 0;
  if (input.quizCompleted) engagement += 20;
  if (input.estimatorUsed) engagement += 15;
  if (input.pageVisits >= 5) engagement += 15;
  else if (input.pageVisits >= 3) engagement += 10;
  else if (input.pageVisits >= 1) engagement += 5;
  if (input.whatsappResponded) engagement += 25;
  if (input.vanVisitDone) engagement += 30;
  engagement = Math.min(engagement, 100);

  // ─── Intent Dimension (0-100, weighted 40%) ───
  let intent = 0;
  if (input.societyMentioned) intent += 15;
  if (input.budgetProvided) intent += 10;
  if (input.timelineMentioned) intent += 20;
  if (input.callbackRequested) intent += 25;
  if (input.pricingPageVisits >= 3) intent += 15;
  else if (input.pricingPageVisits >= 1) intent += 8;
  intent = Math.min(intent, 100);

  // ─── Value Dimension (0-100, weighted 30%) ───
  let value = 0;
  if (input.estimatedValue > 100000) value += 30;
  else if (input.estimatedValue > 50000) value += 20;
  else if (input.estimatedValue > 25000) value += 10;

  const largeUnits = ['3BHK', '4BHK', '5BHK', 'VILLA', 'PENTHOUSE'];
  if (largeUnits.includes(input.unitType.toUpperCase())) value += 15;

  if (input.isPremiumSociety) value += 25;
  if (input.isRepeatCustomer) value += 30;
  if (input.isReferred) value += 20;
  value = Math.min(value, 100);

  // ─── Composite Score ───
  const compositeScore = Math.round(
    engagement * 0.30 +
    intent * 0.40 +
    value * 0.30
  );

  // ─── Tier Classification ───
  const tier: ScoreTier =
    compositeScore >= 80 ? 'S' :
    compositeScore >= 60 ? 'A' :
    compositeScore >= 40 ? 'B' : 'C';

  return {
    engagementScore: engagement,
    intentScore: intent,
    valueScore: value,
    compositeScore,
    tier,
  };
}

/**
 * Get the automation action for a given score tier.
 */
export function getAutomationAction(tier: ScoreTier): {
  action: string;
  urgency: 'IMMEDIATE' | 'WITHIN_15_MIN' | 'DAILY_BATCH' | 'WEEKLY';
  channels: string[];
} {
  switch (tier) {
    case 'S':
      return {
        action: 'Instant WhatsApp alert to senior agent + auto-assign + calendar slot hold',
        urgency: 'IMMEDIATE',
        channels: ['WHATSAPP', 'PUSH', 'SMS'],
      };
    case 'A':
      return {
        action: 'Assign to available agent within 15 min + send swatch catalog PDF',
        urgency: 'WITHIN_15_MIN',
        channels: ['WHATSAPP', 'EMAIL'],
      };
    case 'B':
      return {
        action: 'Enroll in 7-day drip WhatsApp campaign',
        urgency: 'DAILY_BATCH',
        channels: ['WHATSAPP'],
      };
    case 'C':
      return {
        action: 'Weekly batch email newsletter only',
        urgency: 'WEEKLY',
        channels: ['EMAIL'],
      };
  }
}
