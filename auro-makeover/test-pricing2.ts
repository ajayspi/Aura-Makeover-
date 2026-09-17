import { calculateRollNesting, calculateDynamicPricing } from './src/lib/engines';

const nesting = calculateRollNesting({
  wallWidthFt: 20,
  wallHeightFt: 10,
  rollWidthInches: 42,
  patternRepeatInches: 24
});
console.log("Nesting for 20x10:", nesting);

const pricing = calculateDynamicPricing({
  rawMaterialBasePerSqFt: 120, // Standard Canvas
  totalSqFtRequired: nesting.totalSqFtWithBuffer,
  isSmartMotorized: false
});
console.log("Pricing for 20x10 (Standard Canvas):", pricing);

const pricingBelgian = calculateDynamicPricing({
  rawMaterialBasePerSqFt: 250, // Belgian Luxury
  totalSqFtRequired: 122.5, // 10x10
  isSmartMotorized: false
});
console.log("Pricing for 10x10 (Belgian Luxury):", pricingBelgian);
