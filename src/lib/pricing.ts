// India-specific pricing and GST compliance engines

export interface PricingInput {
  baseAmount: number;
  materialType: 'premium' | 'standard';
  regionTier: 'tier1' | 'tier2' | 'tier3';
}

export interface GSTBreakdown {
  serviceGstAmount: number; // 18%
  materialGstAmount: number; // 18% for premium, 5% for standard
  totalGst: number;
}

export interface EscrowTranche {
  deposit: number; // 10%
  materialRelease: number; // 60%
  postQaUnlock: number; // 30%
}

export interface PricingOutput {
  baseAmount: number;
  regionalMultiplier: number;
  adjustedAmount: number;
  gst: GSTBreakdown;
  totalAmount: number;
  escrow: EscrowTranche;
  emiOptions: {
    months12: number;
    months18: number;
    months24: number;
  };
}

export function calculateIndiaPricing(input: PricingInput): PricingOutput {
  // Regional Adjustments
  const multipliers = {
    tier1: 1.0,  // Metros: Delhi, Mumbai, HYD (Full price)
    tier2: 0.85, // Pune, Ahmedabad (15% cheaper)
    tier3: 0.70  // Indore, Nagpur (30% cheaper)
  };

  const regionalMultiplier = multipliers[input.regionTier];
  const adjustedAmount = input.baseAmount * regionalMultiplier;

  // Split into 40% Service (Install) and 60% Material for GST
  const serviceAmount = adjustedAmount * 0.40;
  const materialAmount = adjustedAmount * 0.60;

  // GST Calculations
  const serviceGstAmount = serviceAmount * 0.18; // Always 18% for services
  const materialGstRate = input.materialType === 'premium' ? 0.18 : 0.05;
  const materialGstAmount = materialAmount * materialGstRate;

  const totalGst = serviceGstAmount + materialGstAmount;
  const totalAmount = adjustedAmount + totalGst;

  // Escrow Tranches (10/60/30)
  const deposit = totalAmount * 0.10;
  const materialRelease = totalAmount * 0.60;
  const postQaUnlock = totalAmount * 0.30;

  // EMI Options (Rough estimate at 0% or low interest subsidized)
  return {
    baseAmount: input.baseAmount,
    regionalMultiplier,
    adjustedAmount,
    gst: {
      serviceGstAmount,
      materialGstAmount,
      totalGst
    },
    totalAmount,
    escrow: {
      deposit,
      materialRelease,
      postQaUnlock
    },
    emiOptions: {
      months12: totalAmount / 12,
      months18: totalAmount / 18,
      months24: totalAmount / 24
    }
  };
}
