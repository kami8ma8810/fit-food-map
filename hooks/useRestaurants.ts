import { useState, useEffect } from 'react';
import { Restaurant } from '../types';
import { MockRestaurantService as RestaurantService } from '../services';
import { useLocation } from './useLocation';

export interface UseRestaurantsResult {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  searchRestaurants: (searchTerm: string, filters?: {
    highProtein?: boolean;
    maxDistance?: number;
  }) => Promise<void>;
}

export function useRestaurants(radiusKm: number = 2): UseRestaurantsResult {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { location } = useLocation();

  const fetchRestaurants = async () => {
    if (!location) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const fetchedRestaurants = await RestaurantService.getNearbyRestaurants(
        location.latitude,
        location.longitude,
        radiusKm
      );
      
      setRestaurants(fetchedRestaurants);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知のエラーが発生しました');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const searchRestaurants = async (
    searchTerm: string,
    filters?: {
      highProtein?: boolean;
      maxDistance?: number;
    }
  ) => {
    if (!location) {
      setError('位置情報が取得できていません');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const searchResults = await RestaurantService.searchRestaurants(
        searchTerm,
        location.latitude,
        location.longitude,
        filters
      );
      
      setRestaurants(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : '検索中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      fetchRestaurants();
    }
  }, [location, radiusKm]);

  return {
    restaurants,
    loading,
    error,
    refetch: fetchRestaurants,
    searchRestaurants,
  };
}