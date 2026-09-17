export interface RollNestingInput {
  wallWidthFt: number;
  wallHeightFt: number;
  rollWidthInches: number; // typically 42" or 54"
  patternRepeatInches: number;
}

export interface RollNestingOutput {
  totalVerticalDrops: number;
  matchingWasteInches: number;
  requiredContinuousMeters: number;
  totalSqFtRequired: number;
  totalSqFtWithBuffer: number; // Min 11% safety buffer
}

export function calculateRollNesting(input: RollNestingInput): RollNestingOutput {
  const wallWidthInches = input.wallWidthFt * 12;
  const wallHeightInches = input.wallHeightFt * 12;

  // 1. Calculate number of vertical drops required
  const totalVerticalDrops = Math.ceil(wallWidthInches / input.rollWidthInches);

  if (totalVerticalDrops === 0) {
    return {
      totalVerticalDrops: 0,
      matchingWasteInches: 0,
      requiredContinuousMeters: 0,
      totalSqFtRequired: 0,
      totalSqFtWithBuffer: 0
    };
  }

  // 2. Pattern Matching Waste:
  // Each drop (except the first) might need to be shifted down up to the repeat height to match the pattern.
  // We estimate average waste as half the repeat per drop, or max repeat for safety.
  // Standard practice: assume 1 full pattern repeat of waste per drop after the first.
  const matchingWasteInches = Math.max(0, (totalVerticalDrops - 1)) * input.patternRepeatInches;

  // 3. Required Continuous Linear Inches
  // Each drop requires wallHeightInches + 4 inches bleed (2 top, 2 bottom)
  const dropHeightInches = wallHeightInches + 4;
  const totalLinearInches = (totalVerticalDrops * dropHeightInches) + matchingWasteInches;
  const requiredContinuousMeters = totalLinearInches * 0.0254;

  // 4. Square Footage Calculations
  const exactWallSqFt = input.wallWidthFt * input.wallHeightFt;

  // Total SqFt based on actual roll consumption
  const totalSqFtRequired = (totalLinearInches * input.rollWidthInches) / 144;

  // Ensure minimum 11% safety buffer over exact wall size
  const safetyBufferSqFt = exactWallSqFt * 1.11;
  const totalSqFtWithBuffer = Math.max(totalSqFtRequired, safetyBufferSqFt);

  return {
    totalVerticalDrops,
    matchingWasteInches,
    requiredContinuousMeters,
    totalSqFtRequired,
    totalSqFtWithBuffer
  };
}

export interface SolarLuxInput {
  compassAngleDegrees: number; // 0 = North, 90 = East, 180 = South, 270 = West
  floorNumber: number;
}

export interface SolarLuxOutput {
  highSolarHeatRadiation: boolean;
  recommendedBlindType: 'Standard Translucent Sheer' | '100% Blackout Motorized Blinds' | 'Double-cell Honeycomb Blinds';
}

export function analyzeSolarLux(input: SolarLuxInput): SolarLuxOutput {
  // Flag high solar heat radiation for West (225-315) and South-West (180-270)
  // Especially on higher floors where shading from trees/other buildings is minimal.
  const isWestOrSouthWest = (input.compassAngleDegrees >= 180 && input.compassAngleDegrees <= 315);
  const isHighFloor = input.floorNumber >= 10;

  const highSolarHeatRadiation = isWestOrSouthWest && isHighFloor;

  let recommendedBlindType: SolarLuxOutput['recommendedBlindType'] = 'Standard Translucent Sheer';

  if (highSolarHeatRadiation) {
     // For severe heat, recommend honeycomb for insulation or blackout
     recommendedBlindType = 'Double-cell Honeycomb Blinds';
  } else if (isWestOrSouthWest) {
     recommendedBlindType = '100% Blackout Motorized Blinds';
  }

  return {
    highSolarHeatRadiation,
    recommendedBlindType
  };
}

export interface PricingInput {
  rawMaterialBasePerSqFt: number;
  totalSqFtRequired: number;
  isSmartMotorized: boolean; // Flat add-on fee if true
}

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

export function calculateDynamicPricing(input: PricingInput): PricingOutput {
  const PRIMER_COST_PER_SQFT = 15; // INR
  const INSTALL_LABOR_PER_SQFT = 25; // INR
  const MOTOR_ADDON_FLAT = 15000; // INR

  if (input.totalSqFtRequired === 0) {
    return {
      materialCost: 0,
      primerCost: 0,
      installationLaborCost: 0,
      subtotal: 0,
      gstAmount: 0,
      totalRetailPrice: 0,
      escrowTranches: { deposit10: 0, materialRelease60: 0, postQAUnlock30: 0 }
    };
  }

  const materialCost = input.rawMaterialBasePerSqFt * input.totalSqFtRequired;
  const primerCost = PRIMER_COST_PER_SQFT * input.totalSqFtRequired;
  const installationLaborCost = INSTALL_LABOR_PER_SQFT * input.totalSqFtRequired;

  let subtotal = materialCost + primerCost + installationLaborCost;
  if (input.isSmartMotorized) {
    subtotal += MOTOR_ADDON_FLAT;
  }

  const gstAmount = subtotal * 0.18; // 18% GST
  const totalRetailPrice = subtotal + gstAmount;

  // Escrow Tranches (10/60/30)
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
      postQAUnlock30
    }
  };
}
