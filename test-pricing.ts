import { calculateRollNesting, calculateDynamicPricing } from './src/lib/engines';

const nesting = calculateRollNesting({
  wallWidthFt: 10,
  wallHeightFt: 10,
  rollWidthInches: 42,
  patternRepeatInches: 24
});

console.log("Nesting for 10x10:", nesting);

const pricing = calculateDynamicPricing({
  rawMaterialBasePerSqFt: 120, // Standard Canvas
  totalSqFtRequired: nesting.totalSqFtWithBuffer,
  isSmartMotorized: false
});

console.log("Pricing for 10x10 (Standard Canvas):", pricing);
