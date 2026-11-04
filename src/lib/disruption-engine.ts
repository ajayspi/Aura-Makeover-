/**
 * Zero-Civil vs Traditional Renovation Disruption & Cost Computation Engine
 * Pure deterministic mathematical calculations for financial and lifestyle deltas.
 */

export interface DisruptionInput {
  roomCount: number; // 1 to 5 rooms
  isLivingInFlat: boolean; // true = owner living in flat; false = vacant investment property
  monthlyRentOrMortgage?: number; // Estimated local high-rise rent (default: ₹65,000)
  dailyAirbnbRate?: number; // Temporary accommodation cost (default: ₹2,500/day)
  civilTimelineDays?: number; // Traditional civil renovation duration (default: 45 days)
}

export interface DisruptionOutput {
  traditionalDays: number;
  auraDays: number;
  daysSaved: number;
  relocationCost: number;
  deepCleaningCost: number;
  contractorDelayRiskCost: number;
  debrisDisposalNocCost: number;
  totalIndirectCivilCost: number;
  estimatedTraditionalInvoice: number;
  totalCivilProjectOutlay: number;
  auraMakeoverTotalEstimate: number;
  netFinancialSavings: number;
}

export const DISRUPTION_CONSTANTS = {
  CIVIL_DAYS_PER_ROOM: 18, // 1 room = ~20-25 days, scaling with diminishing returns
  CIVIL_BASE_TIMELINE_DAYS: 45,
  AURA_DAYS_PER_ROOM: 0.8, // Rapid mechanical dry-mount
  AURA_MIN_TIMELINE_DAYS: 2,
  DAILY_AIRBNB_RATE: 2500, // INR per day in Kokapet / Financial District
  DEFAULT_MONTHLY_RENT: 65000, // INR
  DEEP_CLEANING_COST: 8000, // INR post-civil dust extraction
  DEBRIS_DISPOSAL_NOC_COST: 10000, // Society debris disposal & NOC deposit risk
  CIVIL_BASE_INVOICE_PER_ROOM: 95000, // INR traditional contractor charge per room
  AURA_BASE_PRICE_PER_ROOM: 42000, // INR average zero-civil transformation price per room
};

export function calculateRenovationDisruption(input: DisruptionInput): DisruptionOutput {
  const rooms = Math.max(1, input.roomCount || 1);
  const monthlyRent = input.monthlyRentOrMortgage || DISRUPTION_CONSTANTS.DEFAULT_MONTHLY_RENT;
  const dailyAirbnb = input.dailyAirbnbRate || DISRUPTION_CONSTANTS.DAILY_AIRBNB_RATE;
  
  // 1. Duration calculation
  const traditionalDays = input.civilTimelineDays || (DISRUPTION_CONSTANTS.CIVIL_BASE_TIMELINE_DAYS + ((rooms - 1) * 12));
  const auraDays = Number(Math.max(DISRUPTION_CONSTANTS.AURA_MIN_TIMELINE_DAYS, rooms * DISRUPTION_CONSTANTS.AURA_DAYS_PER_ROOM).toFixed(1));
  const daysSaved = Math.max(0, traditionalDays - Math.ceil(auraDays));

  // 2. Relocation / Vacancy Loss
  let relocationCost = 0;
  if (input.isLivingInFlat) {
    // Owner moves to temporary service apartment / Airbnb to avoid dust and noise
    relocationCost = Math.round(dailyAirbnb * traditionalDays);
  } else {
    // Landlord / Investor loses monthly rent during vacant renovation months
    const dailyRentalLoss = monthlyRent / 30;
    relocationCost = Math.round(dailyRentalLoss * traditionalDays);
  }

  // 3. Indirect civil costs
  const deepCleaningCost = DISRUPTION_CONSTANTS.DEEP_CLEANING_COST * Math.min(3, rooms);
  const debrisDisposalNocCost = DISRUPTION_CONSTANTS.DEBRIS_DISPOSAL_NOC_COST;
  const estimatedTraditionalInvoice = DISRUPTION_CONSTANTS.CIVIL_BASE_INVOICE_PER_ROOM * rooms;
  
  // 15% contingency for civil contractor delays and material overruns
  const contractorDelayRiskCost = Math.round(estimatedTraditionalInvoice * 0.15);

  const totalIndirectCivilCost = relocationCost + deepCleaningCost + debrisDisposalNocCost + contractorDelayRiskCost;
  const totalCivilProjectOutlay = estimatedTraditionalInvoice + totalIndirectCivilCost;

  // 4. Aura Zero-Civil Pricing
  const auraMakeoverTotalEstimate = DISRUPTION_CONSTANTS.AURA_BASE_PRICE_PER_ROOM * rooms;
  const netFinancialSavings = Math.max(0, totalCivilProjectOutlay - auraMakeoverTotalEstimate);

  return {
    traditionalDays,
    auraDays,
    daysSaved,
    relocationCost,
    deepCleaningCost,
    contractorDelayRiskCost,
    debrisDisposalNocCost,
    totalIndirectCivilCost,
    estimatedTraditionalInvoice,
    totalCivilProjectOutlay,
    auraMakeoverTotalEstimate,
    netFinancialSavings,
  };
}
