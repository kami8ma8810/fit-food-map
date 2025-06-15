import { Nutrition, NutritionEstimate } from '../types';

// PFC calories per gram
const PROTEIN_CALORIES_PER_GRAM = 4;
const FAT_CALORIES_PER_GRAM = 9;
const CARB_CALORIES_PER_GRAM = 4;

export interface PFCRatio {
  protein: number; // 0-1
  fat: number;     // 0-1
  carbs: number;   // 0-1
}

/**
 * Calculate PFC ratio from nutrition data
 */
export function calculatePFCRatio(nutrition: Nutrition): PFCRatio {
  const proteinCalories = nutrition.protein * PROTEIN_CALORIES_PER_GRAM;
  const fatCalories = nutrition.fat * FAT_CALORIES_PER_GRAM;
  const carbCalories = nutrition.carbs * CARB_CALORIES_PER_GRAM;
  
  const totalCalories = proteinCalories + fatCalories + carbCalories;
  
  if (totalCalories === 0) {
    return { protein: 0, fat: 0, carbs: 0 };
  }
  
  return {
    protein: proteinCalories / totalCalories,
    fat: fatCalories / totalCalories,
    carbs: carbCalories / totalCalories
  };
}

// Base nutrition data for common ingredients
const INGREDIENT_NUTRITION_DATA: Record<string, Nutrition> = {
  '鶏肉': { calories: 200, protein: 25, fat: 10, carbs: 0 },
  '豚肉': { calories: 250, protein: 20, fat: 18, carbs: 0 },
  '牛肉': { calories: 280, protein: 22, fat: 20, carbs: 0 },
  '魚': { calories: 150, protein: 25, fat: 5, carbs: 0 },
  '卵': { calories: 150, protein: 12, fat: 10, carbs: 1 },
  '米': { calories: 350, protein: 6, fat: 1, carbs: 77 },
  '麺': { calories: 300, protein: 10, fat: 2, carbs: 60 },
  'パン': { calories: 250, protein: 8, fat: 4, carbs: 50 },
};

// Cooking method modifiers
const COOKING_MODIFIERS: Record<string, { calories: number; fat: number }> = {
  '揚げ物': { calories: 1.5, fat: 2.0 },
  '唐揚げ': { calories: 1.5, fat: 2.0 },
  'フライ': { calories: 1.4, fat: 1.8 },
  '炒め': { calories: 1.2, fat: 1.3 },
  '焼き': { calories: 1.1, fat: 1.1 },
  '茹で': { calories: 1.0, fat: 1.0 },
  '蒸し': { calories: 1.0, fat: 1.0 },
};

/**
 * Extract keywords from menu name
 */
export function extractKeywords(menuName: string): string[] {
  // Simple keyword extraction - could be enhanced with NLP
  const keywords: string[] = [];
  
  Object.keys(INGREDIENT_NUTRITION_DATA).forEach(ingredient => {
    if (menuName.includes(ingredient)) {
      keywords.push(ingredient);
    }
  });
  
  Object.keys(COOKING_MODIFIERS).forEach(method => {
    if (menuName.includes(method)) {
      keywords.push(method);
    }
  });
  
  return keywords;
}

/**
 * Estimate nutrition from keywords
 */
export function estimateNutritionFromKeywords(keywords: string[]): NutritionEstimate {
  if (keywords.length === 0) {
    return {
      nutrition: { calories: 0, protein: 0, fat: 0, carbs: 0 },
      confidence: 0,
      method: 'keyword_match'
    };
  }
  
  // Find base ingredient
  const ingredientKeywords = keywords.filter(k => k in INGREDIENT_NUTRITION_DATA);
  const cookingKeywords = keywords.filter(k => k in COOKING_MODIFIERS);
  
  if (ingredientKeywords.length === 0) {
    return {
      nutrition: { calories: 0, protein: 0, fat: 0, carbs: 0 },
      confidence: 0.1,
      method: 'keyword_match'
    };
  }
  
  // Use first ingredient as base
  const baseNutrition = { ...INGREDIENT_NUTRITION_DATA[ingredientKeywords[0]] };
  
  // Apply cooking modifiers
  cookingKeywords.forEach(cooking => {
    const modifier = COOKING_MODIFIERS[cooking];
    baseNutrition.calories *= modifier.calories;
    baseNutrition.fat *= modifier.fat;
  });
  
  // Calculate confidence based on keyword matches
  const confidence = Math.min(0.9, (ingredientKeywords.length * 0.4) + (cookingKeywords.length * 0.2) + 0.3);
  
  return {
    nutrition: baseNutrition,
    confidence,
    method: 'keyword_match'
  };
}