import { useState, useEffect } from 'react';
import { Restaurant, Menu } from '../types';
import { MockRestaurantService as RestaurantService } from '../services';

export interface UseRestaurantResult {
  restaurant: Restaurant | null;
  menus: Menu[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRestaurant(restaurantId: string): UseRestaurantResult {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurantData = async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [restaurantData, menuData] = await Promise.all([
        RestaurantService.getRestaurantById(restaurantId),
        RestaurantService.getMenusByRestaurantId(restaurantId)
      ]);

      if (!restaurantData) {
        setError('店舗情報が見つかりませんでした');
        return;
      }

      setRestaurant(restaurantData);
      setMenus(menuData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '店舗情報の取得に失敗しました');
      setRestaurant(null);
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantData();
  }, [restaurantId]);

  return {
    restaurant,
    menus,
    loading,
    error,
    refetch: fetchRestaurantData,
  };
}