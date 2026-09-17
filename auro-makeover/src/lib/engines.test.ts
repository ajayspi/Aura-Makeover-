import { describe, it, expect } from 'vitest';
import { calculateRollNesting, analyzeSolarLux, calculateDynamicPricing } from './engines';

describe('engines', () => {
  describe('calculateRollNesting', () => {
    it('calculates properly for a 10x10 wall', () => {
      const result = calculateRollNesting({
        wallWidthFt: 10,
        wallHeightFt: 10,
        rollWidthInches: 42,
        patternRepeatInches: 24,
      });
      expect(result.totalVerticalDrops).toBe(3); // 120 / 42 = 2.85 -> 3
      expect(result.matchingWasteInches).toBe(48); // (3 - 1) * 24 = 48
      expect(result.requiredContinuousMeters).toBeCloseTo(10.668); // ((3 * 124) + 48) * 0.0254 = 420 * 0.0254 = 10.668
      expect(result.totalSqFtRequired).toBe(122.5); // (420 * 42) / 144 = 122.5
      expect(result.totalSqFtWithBuffer).toBe(122.5); // max(122.5, 100 * 1.11 = 111)
    });

    it('calculates properly for a very wide wall', () => {
      const result = calculateRollNesting({
        wallWidthFt: 20,
        wallHeightFt: 8,
        rollWidthInches: 54,
        patternRepeatInches: 12,
      });
      expect(result.totalVerticalDrops).toBe(5); // 240 / 54 = 4.44 -> 5
      expect(result.matchingWasteInches).toBe(48); // (5 - 1) * 12 = 48
      expect(result.requiredContinuousMeters).toBeCloseTo(13.9192); // ((5 * 100) + 48) * 0.0254 = 548 * 0.0254 = 13.9192
      expect(result.totalSqFtRequired).toBe(205.5); // (548 * 54) / 144 = 205.5
      expect(result.totalSqFtWithBuffer).toBe(205.5); // max(205.5, 160 * 1.11 = 177.6)
    });

    it('handles small dimensions (less than roll width)', () => {
      const result = calculateRollNesting({
        wallWidthFt: 2,
        wallHeightFt: 5,
        rollWidthInches: 42,
        patternRepeatInches: 24,
      });
      expect(result.totalVerticalDrops).toBe(1); // 24 / 42 = 0.57 -> 1
      expect(result.matchingWasteInches).toBe(0); // (1 - 1) * 24 = 0
      expect(result.requiredContinuousMeters).toBeCloseTo(1.6256); // (1 * 64) * 0.0254 = 1.6256
      expect(result.totalSqFtRequired).toBeCloseTo(18.666, 2); // (64 * 42) / 144 = 18.666
      expect(result.totalSqFtWithBuffer).toBeCloseTo(18.666, 2); // max(18.666, 10 * 1.11 = 11.1)
    });

    it('handles zero dimensions', () => {
      const result = calculateRollNesting({
        wallWidthFt: 0,
        wallHeightFt: 10,
        rollWidthInches: 42,
        patternRepeatInches: 24,
      });
      expect(result.totalVerticalDrops).toBe(0); // 0 / 42 = 0
      expect(result.matchingWasteInches).toBe(0); // should not be negative
      expect(result.requiredContinuousMeters).toBe(0);
      expect(result.totalSqFtRequired).toBe(0);
      expect(result.totalSqFtWithBuffer).toBe(0);
    });

    it('uses minimum safety buffer when required', () => {
      // Create a scenario where totalSqFtRequired < safetyBufferSqFt
      const result = calculateRollNesting({
        wallWidthFt: 100, // 1200 inches
        wallHeightFt: 100, // 1200 inches
        rollWidthInches: 1200, // exact fit
        patternRepeatInches: 0,
      });
      // drops = 1
      // waste = 0
      // linear inches = 1 * (1200 + 4) = 1204
      // totalSqFtRequired = (1204 * 1200) / 144 = 10033.33
      // exactWallSqFt = 10000
      // safetyBuffer = 11100
      expect(result.totalVerticalDrops).toBe(1);
      expect(result.totalSqFtWithBuffer).toBeCloseTo(11100);
    });
  });

  describe('analyzeSolarLux', () => {
    it('returns Standard for North on low floor', () => {
      expect(analyzeSolarLux({ compassAngleDegrees: 0, floorNumber: 2 })).toEqual({
        highSolarHeatRadiation: false,
        recommendedBlindType: 'Standard Translucent Sheer'
      });
    });

    it('returns Blackout for West on low floor', () => {
      expect(analyzeSolarLux({ compassAngleDegrees: 270, floorNumber: 5 })).toEqual({
        highSolarHeatRadiation: false,
        recommendedBlindType: '100% Blackout Motorized Blinds'
      });
    });

    it('returns Honeycomb for West on high floor', () => {
      expect(analyzeSolarLux({ compassAngleDegrees: 270, floorNumber: 12 })).toEqual({
        highSolarHeatRadiation: true,
        recommendedBlindType: 'Double-cell Honeycomb Blinds'
      });
    });

    it('handles bounds of West/South-West', () => {
      // 180 is South-West starting point
      expect(analyzeSolarLux({ compassAngleDegrees: 180, floorNumber: 10 })).toEqual({
        highSolarHeatRadiation: true,
        recommendedBlindType: 'Double-cell Honeycomb Blinds'
      });
      // 315 is West ending point
      expect(analyzeSolarLux({ compassAngleDegrees: 315, floorNumber: 10 })).toEqual({
        highSolarHeatRadiation: true,
        recommendedBlindType: 'Double-cell Honeycomb Blinds'
      });
      // 316 is just past West
      expect(analyzeSolarLux({ compassAngleDegrees: 316, floorNumber: 10 })).toEqual({
        highSolarHeatRadiation: false,
        recommendedBlindType: 'Standard Translucent Sheer'
      });
    });
  });

  describe('calculateDynamicPricing', () => {
    it('calculates correctly without motor', () => {
      const result = calculateDynamicPricing({
        rawMaterialBasePerSqFt: 100,
        totalSqFtRequired: 100,
        isSmartMotorized: false
      });
      // material = 10000
      // primer = 1500
      // labor = 2500
      // subtotal = 14000
      // gst = 2520
      // total = 16520
      expect(result.subtotal).toBe(14000);
      expect(result.totalRetailPrice).toBe(16520);
      expect(result.escrowTranches.deposit10).toBe(1652);
      expect(result.escrowTranches.materialRelease60).toBe(9912);
      expect(result.escrowTranches.postQAUnlock30).toBe(4956);
    });

    it('calculates correctly with motor', () => {
      const result = calculateDynamicPricing({
        rawMaterialBasePerSqFt: 100,
        totalSqFtRequired: 100,
        isSmartMotorized: true
      });
      // material = 10000
      // primer = 1500
      // labor = 2500
      // motor = 15000
      // subtotal = 29000
      // gst = 5220
      // total = 34220
      expect(result.subtotal).toBe(29000);
      expect(result.totalRetailPrice).toBe(34220);
      expect(result.escrowTranches.deposit10).toBe(3422);
      expect(result.escrowTranches.materialRelease60).toBe(20532);
      expect(result.escrowTranches.postQAUnlock30).toBe(10266);
    });

    it('handles zero sqft', () => {
      const result = calculateDynamicPricing({
        rawMaterialBasePerSqFt: 100,
        totalSqFtRequired: 0,
        isSmartMotorized: false
      });
      expect(result.subtotal).toBe(0);
      expect(result.totalRetailPrice).toBe(0);
    });
  });
});
