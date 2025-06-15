import React, { useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../../hooks';

interface Restaurant {
  id: string;
  name: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

interface MapComponentProps {
  restaurants?: Restaurant[];
  onMarkerPress?: (restaurant: Restaurant) => void;
}

export default function MapComponent({ restaurants = [], onMarkerPress }: MapComponentProps) {
  const { location, error, loading } = useLocation();

  useEffect(() => {
    if (error) {
      Alert.alert(
        '位置情報エラー',
        error.message,
        [{ text: 'OK' }]
      );
    }
  }, [error]);

  const handleRestaurantPress = (restaurant: Restaurant) => {
    if (onMarkerPress) {
      onMarkerPress(restaurant);
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>位置情報を取得中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map-outline" size={48} color="#9ca3af" />
        <Text style={styles.mapPlaceholderText}>地図表示</Text>
        <Text style={styles.mapSubText}>
          {location ? 
            `現在地: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 
            '位置情報を取得中...'}
        </Text>
      </View>
      
      <ScrollView style={styles.restaurantList} showsVerticalScrollIndicator={false}>
        <Text style={styles.listHeader}>
          近くのレストラン ({restaurants.length}件)
        </Text>
        
        {restaurants.map((restaurant) => {
          const distance = location ? 
            calculateDistance(
              location.latitude, 
              location.longitude, 
              restaurant.coordinate.latitude, 
              restaurant.coordinate.longitude
            ) : 0;

          return (
            <TouchableOpacity
              key={restaurant.id}
              style={styles.restaurantItem}
              onPress={() => handleRestaurantPress(restaurant)}
              accessibilityRole="button"
              accessibilityLabel={`店舗: ${restaurant.name}`}
              accessibilityHint="タップして店舗詳細を表示"
            >
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                {location && (
                  <Text style={styles.restaurantDistance}>
                    {distance < 1 ? 
                      `${Math.round(distance * 1000)}m` : 
                      `${distance.toFixed(1)}km`}
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          );
        })}
        
        {restaurants.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>レストランが見つかりませんでした</Text>
            <Text style={styles.emptySubText}>検索条件を変更してお試しください</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
  mapPlaceholder: {
    backgroundColor: '#e5e7eb',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 100,
    marginBottom: 16,
    borderRadius: 12,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 8,
  },
  mapSubText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  restaurantList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  restaurantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  restaurantDistance: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
});