import { Restaurant, Menu } from '../types';
import { sampleRestaurants, sampleMenus } from '../data';

export class MockRestaurantService {
  static async getNearbyRestaurants(
    lat: number, 
    lng: number, 
    radiusKm: number = 2
  ): Promise<Restaurant[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const restaurants = sampleRestaurants.filter(restaurant => {
      const distance = this.calculateDistance(
        lat, lng,
        restaurant.location.lat,
        restaurant.location.lng
      );
      return distance <= radiusKm;
    });
    
    return restaurants.sort((a, b) => {
      const distanceA = this.calculateDistance(lat, lng, a.location.lat, a.location.lng);
      const distanceB = this.calculateDistance(lat, lng, b.location.lat, b.location.lng);
      return distanceA - distanceB;
    });
  }

  static async getRestaurantById(id: string): Promise<Restaurant | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return sampleRestaurants.find(restaurant => restaurant.id === id) || null;
  }

  static async getMenusByRestaurantId(restaurantId: string): Promise<Menu[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return sampleMenus.filter(menu => menu.restaurantId === restaurantId);
  }

  static async searchRestaurants(
    searchTerm: string,
    lat?: number,
    lng?: number,
    filters?: {
      highProtein?: boolean;
      maxDistance?: number;
      priceRange?: {
        min: number;
        max: number;
      };
      categories?: string[];
    }
  ): Promise<Restaurant[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    let restaurants = sampleRestaurants;
    
    if (searchTerm.trim()) {
      restaurants = restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (lat && lng && filters?.maxDistance) {
      restaurants = restaurants.filter(restaurant => {
        const distance = this.calculateDistance(
          lat, lng,
          restaurant.location.lat,
          restaurant.location.lng
        );
        return distance <= filters.maxDistance!;
      });
    }
    
    const restaurantIds = restaurants.map(r => r.id);
    let validMenus = sampleMenus.filter(menu => restaurantIds.includes(menu.restaurantId));
    
    if (filters?.highProtein) {
      validMenus = validMenus.filter(menu => menu.nutrition.protein >= 25);
    }
    
    if (filters?.priceRange) {
      const { min, max } = filters.priceRange;
      validMenus = validMenus.filter(menu => 
        menu.price >= min && menu.price <= max
      );
    }
    
    if (filters?.categories && filters.categories.length > 0) {
      validMenus = validMenus.filter(menu =>
        menu.tags.some(tag => 
          filters.categories!.some(category => 
            tag.toLowerCase().includes(category.toLowerCase()) ||
            category.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }
    
    if (searchTerm.trim()) {
      const menuMatchRestaurants = validMenus.filter(menu =>
        menu.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).map(menu => menu.restaurantId);
      
      const allMatchingRestaurantIds = new Set([
        ...restaurants.map(r => r.id),
        ...menuMatchRestaurants
      ]);
      
      restaurants = sampleRestaurants.filter(r => allMatchingRestaurantIds.has(r.id));
    }
    
    const validRestaurantIds = [...new Set(validMenus.map(m => m.restaurantId))];
    restaurants = restaurants.filter(r => validRestaurantIds.includes(r.id));
    
    if (lat && lng) {
      restaurants.sort((a, b) => {
        const distanceA = this.calculateDistance(lat, lng, a.location.lat, a.location.lng);
        const distanceB = this.calculateDistance(lat, lng, b.location.lat, b.location.lng);
        return distanceA - distanceB;
      });
    }
    
    return restaurants;
  }

  static async getHighProteinMenus(
    lat?: number,
    lng?: number,
    minProtein: number = 25
  ): Promise<Array<{ menu: Menu; restaurant: Restaurant }>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const highProteinMenus = sampleMenus.filter(menu => menu.nutrition.protein >= minProtein);
    
    const results = highProteinMenus.map(menu => {
      const restaurant = sampleRestaurants.find(r => r.id === menu.restaurantId);
      return { menu, restaurant: restaurant! };
    }).filter(result => result.restaurant);
    
    if (lat && lng) {
      results.sort((a, b) => {
        const distanceA = this.calculateDistance(lat, lng, a.restaurant.location.lat, a.restaurant.location.lng);
        const distanceB = this.calculateDistance(lat, lng, b.restaurant.location.lat, b.restaurant.location.lng);
        return distanceA - distanceB;
      });
    }
    
    return results;
  }

  private static calculateDistance(
    lat1: number, 
    lng1: number, 
    lat2: number, 
    lng2: number
  ): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}