import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MapView } from '../../components/Map';

const sampleRestaurants = [
  {
    id: '1',
    name: 'サンプル定食屋',
    coordinate: {
      latitude: 35.6762,
      longitude: 139.6503,
    },
  },
  {
    id: '2', 
    name: 'ヘルシーカフェ',
    coordinate: {
      latitude: 35.6782,
      longitude: 139.6523,
    },
  },
];

export default function MapScreen() {
  const handleMarkerPress = (restaurant: typeof sampleRestaurants[0]) => {
    router.push(`/restaurant/${restaurant.id}`);
  };

  return (
    <View style={styles.container}>
      <MapView 
        restaurants={sampleRestaurants}
        onMarkerPress={handleMarkerPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});