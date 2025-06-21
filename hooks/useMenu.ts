import { useState, useEffect } from 'react';
import { Menu } from '../types';
import { RestaurantService } from '../services';

export interface UseMenuResult {
  menu: Menu | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMenu(menuId: string): UseMenuResult {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = async () => {
    if (!menuId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const menuData = await RestaurantService.getMenuById(menuId);
      
      if (!menuData) {
        setError('メニューが見つかりませんでした');
        setMenu(null);
        return;
      }

      setMenu(menuData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'メニュー情報の取得に失敗しました');
      setMenu(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [menuId]);

  return {
    menu,
    loading,
    error,
    refetch: fetchMenu,
  };
}