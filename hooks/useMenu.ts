import { useState, useEffect } from 'react';
import { Menu } from '../types';
import { sampleMenus } from '../data';

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

      await new Promise(resolve => setTimeout(resolve, 300));
      
      const foundMenu = sampleMenus.find(m => m.id === menuId);
      
      if (!foundMenu) {
        setError('メニューが見つかりませんでした');
        setMenu(null);
        return;
      }

      setMenu(foundMenu);
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