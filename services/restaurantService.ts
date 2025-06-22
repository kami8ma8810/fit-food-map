import { Restaurant, Menu } from '../types';

// モックデータ
const mockRestaurants: Restaurant[] = [
  {
    id: 'mock-1',
    name: 'ヘルシーキッチン渋谷',
    location: {
      lat: 35.6581,
      lng: 139.7414,
      address: '東京都渋谷区渋谷1-1-1'
    },
    hours: {
      mon: '11:00-22:00',
      sat: '11:00-22:00',
      sun: '11:00-21:00'
    },
    verified: true,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&auto=format&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['ヘルシー', '高タンパク'],
    category: 'healthy'
  },
  {
    id: 'mock-2',
    name: 'プロテインダイニング新宿',
    location: {
      lat: 35.6896,
      lng: 139.6917,
      address: '東京都新宿区新宿3-1-1'
    },
    hours: {
      mon: '10:00-23:00',
      sat: '10:00-23:00',
      sun: '10:00-22:00'
    },
    verified: true,
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['プロテイン', 'フィットネス'],
    category: 'fitness'
  },
  {
    id: 'mock-3',
    name: 'フィットカフェ原宿',
    location: {
      lat: 35.6702,
      lng: 139.7026,
      address: '東京都渋谷区神宮前1-1-1'
    },
    hours: {
      mon: '9:00-21:00',
      sat: '9:00-21:00',
      sun: '9:00-20:00'
    },
    verified: true,
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop&auto=format&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['カフェ', 'オーガニック'],
    category: 'cafe'
  }
];

const mockMenus: Menu[] = [
  {
    id: 'menu-1',
    restaurantId: 'mock-1',
    name: 'グリルチキンサラダ',
    price: 1200,
    nutrition: {
      calories: 320,
      protein: 35,
      carbs: 15,
      fat: 12,
      fiber: 8,
      sodium: 850,
      sugar: 6
    },
    tags: ['高タンパク', 'グルテンフリー'],
    dataSource: 'official',
    confidence: 0.95
  },
  {
    id: 'menu-2',
    restaurantId: 'mock-1',
    name: 'サーモンアボカド丼',
    price: 1400,
    nutrition: {
      calories: 420,
      protein: 28,
      carbs: 35,
      fat: 18,
      fiber: 6,
      sodium: 920,
      sugar: 4
    },
    tags: ['オメガ3', '良質な脂質'],
    dataSource: 'official',
    confidence: 0.92
  },
  {
    id: 'menu-3',
    restaurantId: 'mock-2',
    name: 'プロテインボウル',
    price: 1100,
    nutrition: {
      calories: 380,
      protein: 40,
      carbs: 25,
      fat: 14,
      fiber: 10,
      sodium: 750,
      sugar: 8
    },
    tags: ['超高タンパク', 'ローカーボ'],
    dataSource: 'official',
    confidence: 0.98
  }
];

export class RestaurantService {
  static async getMenuById(id: string): Promise<Menu | null> {
    // モックデータから検索
    const menu = mockMenus.find(m => m.id === id);
    return menu || null;
  }

  static async getNearbyRestaurants(
    lat: number, 
    lng: number, 
    radiusKm: number = 2
  ): Promise<Restaurant[]> {
    // モックデータをフィルタリング（距離計算）
    return mockRestaurants.filter(restaurant => {
      const distance = this.calculateDistance(
        lat, lng,
        restaurant.location.lat,
        restaurant.location.lng
      );
      return distance <= radiusKm;
    });
  }

  static async getRestaurantById(id: string): Promise<Restaurant | null> {
    // モックデータから検索
    const restaurant = mockRestaurants.find(r => r.id === id);
    return restaurant || null;
  }

  static async getMenusByRestaurantId(restaurantId: string): Promise<Menu[]> {
    // モックデータから該当レストランのメニューを返す
    return mockMenus.filter(menu => menu.restaurantId === restaurantId);
  }

  static async searchRestaurants(
    searchTerm: string,
    lat?: number,
    lng?: number,
    filters?: {
      highProtein?: boolean;
      maxDistance?: number;
    }
  ): Promise<Restaurant[]> {
    let results = mockRestaurants.filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (restaurant.tags && restaurant.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    if (lat && lng && filters?.maxDistance) {
      results = results.filter(restaurant => {
        const distance = this.calculateDistance(
          lat, lng,
          restaurant.location.lat,
          restaurant.location.lng
        );
        return distance <= filters.maxDistance!;
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
    const R = 6371; // 地球の半径（km）
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