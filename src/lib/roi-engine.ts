/**
 * West Hyderabad High-Rise Rental Yield & ROI Computation Engine
 * Tailored for landlord investors in Kokapet, Financial District, and Tellapur.
 */

export type SocietyKey = 
  | 'my-home-bhooja'
  | 'rajapushpa-provincia'
  | 'prestige-high-fields'
  | 'aparna-sarovar-zenith'
  | 'jayabheri-silicon-county'
  | 'sas-crown';

export type UnitType = '2BHK' | '3BHK' | '4BHK';

export type MakeoverTier = 'STANDARD_CANVAS' | 'EXECUTIVE_LOUVER' | 'PRESIDENTIAL_ACOUSTIC';

export interface SocietyBenchmark {
  name: string;
  locality: string;
  baselineRentByUnit: Record<UnitType, number>; // Baseline untextured builder-distemper rent
  projectedLiftPercent: number; // Percentage rental premium after luxury surface makeover
  avgPropertyValuationByUnit: Record<UnitType, number>; // INR
}

export const WEST_HYDERABAD_SOCIETIES: Record<SocietyKey, SocietyBenchmark> = {
  'my-home-bhooja': {
    name: 'My Home Bhooja',
    locality: 'Financial District / Silpa Gram Craft',
    baselineRentByUnit: { '2BHK': 75000, '3BHK': 98000, '4BHK': 135000 },
    projectedLiftPercent: 0.22, // +22% rent premium for premium wall skins
    avgPropertyValuationByUnit: { '2BHK': 28000000, '3BHK': 38000000, '4BHK': 55000000 },
  },
  'rajapushpa-provincia': {
    name: 'Rajapushpa Provincia',
    locality: 'Narsingi / Financial District Outer',
    baselineRentByUnit: { '2BHK': 48000, '3BHK': 65000, '4BHK': 88000 },
    projectedLiftPercent: 0.24,
    avgPropertyValuationByUnit: { '2BHK': 18000000, '3BHK': 24000000, '4BHK': 34000000 },
  },
  'prestige-high-fields': {
    name: 'Prestige High Fields',
    locality: 'Financial District / ISB Road',
    baselineRentByUnit: { '2BHK': 45000, '3BHK': 62000, '4BHK': 82000 },
    projectedLiftPercent: 0.20,
    avgPropertyValuationByUnit: { '2BHK': 16000000, '3BHK': 22000000, '4BHK': 31000000 },
  },
  'aparna-sarovar-zenith': {
    name: 'Aparna Sarovar Zenith',
    locality: 'Nallagandla / Tellapur Corridor',
    baselineRentByUnit: { '2BHK': 40000, '3BHK': 54000, '4BHK': 72000 },
    projectedLiftPercent: 0.21,
    avgPropertyValuationByUnit: { '2BHK': 14000000, '3BHK': 19000000, '4BHK': 26000000 },
  },
  'jayabheri-silicon-county': {
    name: 'Jayabheri Silicon County',
    locality: 'Hitec City / Kondapur',
    baselineRentByUnit: { '2BHK': 52000, '3BHK': 72000, '4BHK': 95000 },
    projectedLiftPercent: 0.23,
    avgPropertyValuationByUnit: { '2BHK': 20000000, '3BHK': 28000000, '4BHK': 39000000 },
  },
  'sas-crown': {
    name: 'SAS Crown',
    locality: 'Kokapet Golden Mile',
    baselineRentByUnit: { '2BHK': 90000, '3BHK': 125000, '4BHK': 180000 },
    projectedLiftPercent: 0.25,
    avgPropertyValuationByUnit: { '2BHK': 35000000, '3BHK': 50000000, '4BHK': 75000000 },
  },
};

export const TIER_CAPEX: Record<MakeoverTier, { name: string; baseCost: number }> = {
  STANDARD_CANVAS: { name: 'Standard Textured Canvas', baseCost: 65000 },
  EXECUTIVE_LOUVER: { name: 'Executive WPC Fluted Louver + Fabric', baseCost: 115000 },
  PRESIDENTIAL_ACOUSTIC: { name: 'Presidential Acoustic Slats + Smart Blinds', baseCost: 165000 },
};

export interface RentalROIInput {
  societyKey: SocietyKey;
  unitType: UnitType;
  tier: MakeoverTier;
  customBaseRent?: number;
}

export interface RentalROIOutput {
  societyName: string;
  unitType: UnitType;
  tierName: string;
  baseMonthlyRent: number;
  postMakeoverMonthlyRent: number;
  monthlyRentalLift: number;
  annualRentalLift: number;
  makeoverCapexOutlay: number;
  paybackDurationMonths: number;
  threeYearNetWealthGain: number;
  annualGrossYieldLift: number;
  estimatedVacancyDaysSaved: number;
}

export function calculateWestHydRentalROI(input: RentalROIInput): RentalROIOutput {
  const society = WEST_HYDERABAD_SOCIETIES[input.societyKey] || WEST_HYDERABAD_SOCIETIES['my-home-bhooja'];
  const unit = input.unitType || '3BHK';
  const tierConfig = TIER_CAPEX[input.tier] || TIER_CAPEX.EXECUTIVE_LOUVER;

  const baseMonthlyRent = input.customBaseRent || society.baselineRentByUnit[unit] || 65000;
  
  // Calculate rental lift: derived from society premium rating + tier multiplier
  let tierMultiplier = 1.0;
  if (input.tier === 'STANDARD_CANVAS') tierMultiplier = 0.85;
  if (input.tier === 'PRESIDENTIAL_ACOUSTIC') tierMultiplier = 1.25;

  const rawLift = baseMonthlyRent * society.projectedLiftPercent * tierMultiplier;
  // Round to nearest ₹500 for clean market quotes
  const monthlyRentalLift = Math.round(rawLift / 500) * 500;
  const postMakeoverMonthlyRent = baseMonthlyRent + monthlyRentalLift;
  const annualRentalLift = monthlyRentalLift * 12;

  // Capex Outlay (scales with unit size)
  let unitScale = 1.0;
  if (unit === '2BHK') unitScale = 0.85;
  if (unit === '4BHK') unitScale = 1.35;

  const makeoverCapexOutlay = Math.round(tierConfig.baseCost * unitScale);

  // Payback duration in months
  const paybackDurationMonths = monthlyRentalLift > 0 
    ? Number((makeoverCapexOutlay / monthlyRentalLift).toFixed(1))
    : 0;

  // 3-Year Net Wealth Generation = (3 Years of Additional Rent) - Initial Capex
  const threeYearNetWealthGain = Math.max(0, (annualRentalLift * 3) - makeoverCapexOutlay);

  // Valuation-based yield lift
  const propertyValue = society.avgPropertyValuationByUnit[unit] || 25000000;
  const annualGrossYieldLift = Number(((annualRentalLift / propertyValue) * 100).toFixed(2));

  // High-rise apartments with luxury aesthetics rent 45–60 days faster on platforms like NoBroker / 99acres
  const estimatedVacancyDaysSaved = 45;

  return {
    societyName: society.name,
    unitType: unit,
    tierName: tierConfig.name,
    baseMonthlyRent,
    postMakeoverMonthlyRent,
    monthlyRentalLift,
    annualRentalLift,
    makeoverCapexOutlay,
    paybackDurationMonths,
    threeYearNetWealthGain,
    annualGrossYieldLift,
    estimatedVacancyDaysSaved,
  };
}
