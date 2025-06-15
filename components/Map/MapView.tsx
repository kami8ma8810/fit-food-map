import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Dimensions } from 'react-native';
import { Map, Marker } from 'expo-maps';
import { useLocation } from '../../hooks';

const { width, height } = Dimensions.get('window');

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

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const DEFAULT_REGION: Region = {
  latitude: 35.6762,
  longitude: 139.6503,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function MapComponent({ restaurants = [], onMarkerPress }: MapComponentProps) {
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const { location, error, loading } = useLocation();

  useEffect(() => {
    if (location) {
      const userRegion: Region = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(userRegion);
    }
  }, [location]);

  useEffect(() => {
    if (error) {
      Alert.alert(
        '位置情報エラー',
        error.message,
        [{ text: 'OK' }]
      );
    }
  }, [error]);

  const handleMarkerPress = (restaurant: Restaurant) => {
    if (onMarkerPress) {
      onMarkerPress(restaurant);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        {/* Loading state */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Map
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        accessibilityLabel="地図表示"
        accessibilityHint="現在地周辺の飲食店を表示しています"
      >
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={{
              latitude: restaurant.coordinate.latitude,
              longitude: restaurant.coordinate.longitude,
            }}
            title={restaurant.name}
            onPress={() => handleMarkerPress(restaurant)}
            accessibilityLabel={`店舗: ${restaurant.name}`}
            accessibilityHint="タップして店舗詳細を表示"
          />
        ))}
      </Map>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  map: {
    width,
    height: '100%',
  },
});