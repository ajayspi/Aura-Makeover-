import { describe, it, expect } from 'vitest';
import { calculateRenovationDisruption, DISRUPTION_CONSTANTS } from './disruption-engine';
import { calculateWestHydRentalROI, WEST_HYDERABAD_SOCIETIES } from './roi-engine';

describe('Expansion Engines', () => {
  describe('calculateRenovationDisruption', () => {
    it('calculates disruption for owner living in flat', () => {
      const result = calculateRenovationDisruption({
        roomCount: 2,
        isLivingInFlat: true,
      });

      expect(result.traditionalDays).toBeGreaterThan(45);
      expect(result.auraDays).toBeLessThan(5);
      expect(result.daysSaved).toBe(result.traditionalDays - Math.ceil(result.auraDays));
      expect(result.relocationCost).toBe(result.traditionalDays * DISRUPTION_CONSTANTS.DAILY_AIRBNB_RATE);
      expect(result.deepCleaningCost).toBe(DISRUPTION_CONSTANTS.DEEP_CLEANING_COST * 2);
      expect(result.netFinancialSavings).toBeGreaterThan(50000);
    });

    it('calculates vacancy loss for landlord with vacant unit', () => {
      const result = calculateRenovationDisruption({
        roomCount: 3,
        isLivingInFlat: false,
        monthlyRentOrMortgage: 90000,
      });

      // Daily rent = 90000 / 30 = 3000
      expect(result.relocationCost).toBe(result.traditionalDays * 3000);
      expect(result.netFinancialSavings).toBeGreaterThan(0);
    });

    it('handles zero or negative room counts safely', () => {
      const result = calculateRenovationDisruption({
        roomCount: 0,
        isLivingInFlat: true,
      });

      expect(result.auraDays).toBeGreaterThanOrEqual(DISRUPTION_CONSTANTS.AURA_MIN_TIMELINE_DAYS);
      expect(result.netFinancialSavings).toBeGreaterThan(0);
    });
  });

  describe('calculateWestHydRentalROI', () => {
    it('calculates ROI for My Home Bhooja 3BHK', () => {
      const result = calculateWestHydRentalROI({
        societyKey: 'my-home-bhooja',
        unitType: '3BHK',
        tier: 'EXECUTIVE_LOUVER',
      });

      expect(result.societyName).toBe('My Home Bhooja');
      expect(result.baseMonthlyRent).toBe(98000);
      expect(result.monthlyRentalLift).toBeGreaterThan(15000);
      expect(result.postMakeoverMonthlyRent).toBe(result.baseMonthlyRent + result.monthlyRentalLift);
      expect(result.annualRentalLift).toBe(result.monthlyRentalLift * 12);
      expect(result.paybackDurationMonths).toBeLessThan(12); // Should payback within 12 months
      expect(result.threeYearNetWealthGain).toBeGreaterThan(300000);
    });

    it('calculates ROI for Rajapushpa Provincia 2BHK with Standard Canvas', () => {
      const result = calculateWestHydRentalROI({
        societyKey: 'rajapushpa-provincia',
        unitType: '2BHK',
        tier: 'STANDARD_CANVAS',
      });

      expect(result.societyName).toBe('Rajapushpa Provincia');
      expect(result.baseMonthlyRent).toBe(48000);
      expect(result.paybackDurationMonths).toBeGreaterThan(0);
      expect(result.paybackDurationMonths).toBeLessThan(10);
    });

    it('falls back gracefully on unknown society key', () => {
      const result = calculateWestHydRentalROI({
        // @ts-expect-error testing fallback
        societyKey: 'unknown-society',
        unitType: '3BHK',
        tier: 'EXECUTIVE_LOUVER',
      });

      expect(result.societyName).toBe(WEST_HYDERABAD_SOCIETIES['my-home-bhooja'].name);
      expect(result.monthlyRentalLift).toBeGreaterThan(0);
    });
  });
});
