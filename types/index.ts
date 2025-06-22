// Core type definitions for Fit Food Map

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Hours {
  mon?: string;
  tue?: string;
  wed?: string;
  thu?: string;
  fri?: string;
  sat?: string;
  sun?: string;
}

export interface Nutrition {
  calories: number;
  protein: number;  // g
  fat: number;      // g
  carbs: number;    // g
  fiber?: number;   // g
  sodium?: number;  // mg
  sugar?: number;   // g
}

export interface Restaurant {
  id: string;
  name: string;
  location: Location;
  hours?: Hours;
  chainId?: string;
  verified: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  category?: string;
}

export interface Menu {
  id: string;
  restaurantId: string;
  name: string;
  price?: number;
  nutrition: Nutrition;
  dataSource: 'official' | 'ai_estimated' | 'user_input';
  confidence: number; // 0-1
  imageUrl?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  nutritionGoals?: {
    dailyCalories: number;
    dailyProtein: number;
    dailyFat: number;
    dailyCarbs: number;
  };
  favorites: string[]; // restaurant IDs
  createdAt: Date;
}

export interface MealHistory {
  id: string;
  menuId: string;
  restaurantId: string;
  date: string; // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  portion: number; // 1.0 = normal size
  createdAt: Date;
}

export interface SearchFilters {
  distance?: number; // in meters
  minProtein?: number;
  maxCalories?: number;
  tags?: string[];
}

export interface NutritionEstimate {
  nutrition: Nutrition;
  confidence: number;
  method: 'keyword_match' | 'similar_menu' | 'ai_analysis';
}