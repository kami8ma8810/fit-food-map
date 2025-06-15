import { 
  collection, 
  query, 
  getDocs, 
  doc, 
  getDoc,
  where,
  orderBy,
  limit,
  GeoPoint 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Restaurant, Menu } from '../types';

export class RestaurantService {
  static async getNearbyRestaurants(
    lat: number, 
    lng: number, 
    radiusKm: number = 2
  ): Promise<Restaurant[]> {
    try {
      const restaurantsRef = collection(db, 'restaurants');
      const q = query(
        restaurantsRef,
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      const restaurants: Restaurant[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        if (data.location && data.location instanceof GeoPoint) {
          const distance = this.calculateDistance(
            lat, lng,
            data.location.latitude,
            data.location.longitude
          );
          
          if (distance <= radiusKm) {
            restaurants.push({
              id: doc.id,
              ...data,
              location: {
                lat: data.location.latitude,
                lng: data.location.longitude,
                address: data.location.address || '',
              }
            } as Restaurant);
          }
        }
      });
      
      return restaurants.sort((a, b) => {
        const distanceA = this.calculateDistance(lat, lng, a.location.lat, a.location.lng);
        const distanceB = this.calculateDistance(lat, lng, b.location.lat, b.location.lng);
        return distanceA - distanceB;
      });
    } catch (error) {
      console.error('Error fetching nearby restaurants:', error);
      throw new Error('レストラン情報の取得に失敗しました');
    }
  }

  static async getRestaurantById(id: string): Promise<Restaurant | null> {
    try {
      const docRef = doc(db, 'restaurants', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          location: {
            lat: data.location.latitude,
            lng: data.location.longitude,
            address: data.location.address || '',
          }
        } as Restaurant;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      throw new Error('レストラン詳細の取得に失敗しました');
    }
  }

  static async getMenusByRestaurantId(restaurantId: string): Promise<Menu[]> {
    try {
      const menusRef = collection(db, 'menus');
      const q = query(
        menusRef,
        where('restaurantId', '==', restaurantId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const menus: Menu[] = [];
      
      querySnapshot.forEach((doc) => {
        menus.push({
          id: doc.id,
          ...doc.data()
        } as Menu);
      });
      
      return menus;
    } catch (error) {
      console.error('Error fetching menus:', error);
      throw new Error('メニュー情報の取得に失敗しました');
    }
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
    try {
      const restaurantsRef = collection(db, 'restaurants');
      let q = query(restaurantsRef, limit(50));
      
      const querySnapshot = await getDocs(q);
      let restaurants: Restaurant[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        if (data.location && data.location instanceof GeoPoint) {
          restaurants.push({
            id: doc.id,
            ...data,
            location: {
              lat: data.location.latitude,
              lng: data.location.longitude,
              address: data.location.address || '',
            }
          } as Restaurant);
        }
      });
      
      restaurants = restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
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
      
      return restaurants;
    } catch (error) {
      console.error('Error searching restaurants:', error);
      throw new Error('レストラン検索に失敗しました');
    }
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