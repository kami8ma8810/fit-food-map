import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { MapView } from '../../components/Map';
import { useRestaurants } from '../../hooks';

export default function MapScreen() {
  const { restaurants, loading, error } = useRestaurants(5);

  const handleMarkerPress = (restaurant: { id: string; name: string; coordinate: { latitude: number; longitude: number } }) => {
    router.push(`/restaurant/${restaurant.id}`);
  };

  const mapRestaurants = restaurants.map(restaurant => ({
    id: restaurant.id,
    name: restaurant.name,
    coordinate: {
      latitude: restaurant.location.lat,
      longitude: restaurant.location.lng,
    },
  }));

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>レストランを検索中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>エラー: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView 
        restaurants={mapRestaurants}
        onMarkerPress={handleMarkerPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    margin: 16,
  },
});