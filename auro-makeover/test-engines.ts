import { calculateRollNesting, analyzeSolarLux, calculateDynamicPricing } from './src/lib/engines';

console.log("Testing calculateRollNesting...");
console.log(calculateRollNesting({
  wallWidthFt: 10,
  wallHeightFt: 10,
  rollWidthInches: 42,
  patternRepeatInches: 24
}));

console.log("\nTesting analyzeSolarLux...");
console.log(analyzeSolarLux({
  compassAngleDegrees: 200,
  floorNumber: 15
}));

console.log("\nTesting calculateDynamicPricing...");
console.log(calculateDynamicPricing({
  rawMaterialBasePerSqFt: 120,
  totalSqFtRequired: 150,
  isSmartMotorized: true
}));
