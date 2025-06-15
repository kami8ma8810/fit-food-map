import { calculatePFCRatio, estimateNutritionFromKeywords } from '../nutritionCalculator';
import type { Nutrition } from '../../types';

describe('nutritionCalculator', () => {
  describe('calculatePFCRatio', () => {
    it('should calculate correct PFC ratio', () => {
      const nutrition: Nutrition = {
        calories: 600,
        protein: 30, // 120 calories (30 * 4)
        fat: 20,     // 180 calories (20 * 9)
        carbs: 75    // 300 calories (75 * 4)
      };

      const ratio = calculatePFCRatio(nutrition);

      expect(ratio.protein).toBeCloseTo(0.2); // 20%
      expect(ratio.fat).toBeCloseTo(0.3);     // 30%
      expect(ratio.carbs).toBeCloseTo(0.5);   // 50%
    });

    it('should handle zero calories', () => {
      const nutrition: Nutrition = {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0
      };

      const ratio = calculatePFCRatio(nutrition);

      expect(ratio.protein).toBe(0);
      expect(ratio.fat).toBe(0);
      expect(ratio.carbs).toBe(0);
    });
  });

  describe('estimateNutritionFromKeywords', () => {
    it('should estimate nutrition for chicken keywords', () => {
      const keywords = ['鶏肉', '唐揚げ'];
      const estimate = estimateNutritionFromKeywords(keywords);

      expect(estimate.nutrition.protein).toBeGreaterThan(20);
      expect(estimate.confidence).toBeGreaterThan(0.5);
      expect(estimate.method).toBe('keyword_match');
    });

    it('should return low confidence for unknown keywords', () => {
      const keywords = ['不明な料理'];
      const estimate = estimateNutritionFromKeywords(keywords);

      expect(estimate.confidence).toBeLessThan(0.3);
    });

    it('should handle empty keywords', () => {
      const keywords: string[] = [];
      const estimate = estimateNutritionFromKeywords(keywords);

      expect(estimate.nutrition.calories).toBe(0);
      expect(estimate.confidence).toBe(0);
    });
  });
});