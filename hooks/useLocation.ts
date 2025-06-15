import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

export interface LocationError {
  code: string;
  message: string;
}

export interface UseLocationResult {
  location: LocationData | null;
  error: LocationError | null;
  loading: boolean;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<void>;
}

export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [loading, setLoading] = useState(true);

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (err) {
      setError({
        code: 'PERMISSION_ERROR',
        message: '位置情報の許可取得に失敗しました',
      });
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setError({
          code: 'PERMISSION_DENIED',
          message: '位置情報の使用が許可されていません',
        });
        return;
      }

      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
        accuracy: locationResult.coords.accuracy,
      });
    } catch (err) {
      setError({
        code: 'LOCATION_ERROR',
        message: '現在地の取得に失敗しました',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    location,
    error,
    loading,
    requestPermission,
    getCurrentLocation,
  };
}