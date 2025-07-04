import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRestaurant } from '../../hooks';

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { restaurant, menus, loading, error } = useRestaurant(id);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleMenuPress = (menuId: string) => {
    router.push(`/menu/${menuId}`);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>店舗情報を読み込み中...</Text>
      </View>
    );
  }

  if (error || !restaurant) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error || '店舗が見つかりませんでした'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* 店舗画像 */}
        {restaurant.imageUrl && (
          <View style={styles.imageContainer}>
            {imageLoading && (
              <View style={styles.imageLoading}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={styles.imageLoadingText}>画像を読み込み中...</Text>
              </View>
            )}
            {!imageError && (
              <Image
                source={{ uri: restaurant.imageUrl }}
                style={styles.restaurantImage}
                onLoad={handleImageLoad}
                onError={handleImageError}
                accessibilityLabel={`${restaurant.name}の外観写真`}
              />
            )}
            {imageError && (
              <View style={styles.imageError}>
                <Ionicons name="image-outline" size={48} color="#9ca3af" />
                <Text style={styles.imageErrorText}>画像を読み込めませんでした</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.restaurantInfo}>
          <Text 
            style={styles.restaurantName}
            accessibilityRole="header"
            accessibilityLabel={`店舗名: ${restaurant.name}`}
          >
            {restaurant.name}
          </Text>
          <Text style={styles.address}>{restaurant.location.address}</Text>
          
          <View style={styles.hoursContainer}>
            <Text style={styles.sectionTitle}>営業時間</Text>
            <Text style={styles.hoursText}>月-金: {restaurant.hours.mon}</Text>
            <Text style={styles.hoursText}>土: {restaurant.hours.sat}</Text>
            <Text style={styles.hoursText}>日: {restaurant.hours.sun}</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>メニュー一覧</Text>
          {menus.length === 0 ? (
            <Text style={styles.noMenuText}>メニュー情報がありません</Text>
          ) : (
            menus.map(menu => (
              <TouchableOpacity
                key={menu.id}
                style={styles.menuItem}
                onPress={() => handleMenuPress(menu.id)}
                accessibilityRole="button"
                accessibilityLabel={`メニュー: ${menu.name}, 価格: ${menu.price}円, タンパク質: ${menu.nutrition.protein}g`}
              >
                <View style={styles.menuInfo}>
                  <Text style={styles.menuName}>{menu.name}</Text>
                  <Text style={styles.menuPrice}>¥{menu.price}</Text>
                </View>
                <View style={styles.nutritionSummary}>
                  <Text style={styles.nutritionText}>
                    {menu.nutrition.calories}kcal | P:{menu.nutrition.protein}g
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  imageContainer: {
    height: 200,
    backgroundColor: '#f3f4f6',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    zIndex: 1,
  },
  imageLoadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  imageError: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    zIndex: 1,
  },
  imageErrorText: {
    marginTop: 8,
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  restaurantInfo: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  hoursContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  hoursText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  menuSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noMenuText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuInfo: {
    flex: 1,
  },
  menuName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  menuPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  nutritionSummary: {
    marginRight: 8,
  },
  nutritionText: {
    fontSize: 12,
    color: '#6b7280',
  },
});