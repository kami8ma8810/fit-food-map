import React, { useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MapView } from '../../components/Map';
import { SearchBar, FilterPanel, FilterOptions } from '../../components/Search';
import { useRestaurants } from '../../hooks';

export default function MapScreen() {
  const { restaurants, loading, error, searchRestaurants, refetch } = useRestaurants(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    highProtein: false,
    maxDistance: 2,
    priceRange: { min: 0, max: 9999 },
    categories: [],
  });
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleMarkerPress = (restaurant: { id: string; name: string; coordinate: { latitude: number; longitude: number } }) => {
    router.push(`/restaurant/${restaurant.id}`);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearchActive(query.trim().length > 0 || isFiltersActive());
    
    if (query.trim() || isFiltersActive()) {
      await searchRestaurants(query, {
        highProtein: filters.highProtein,
        maxDistance: filters.maxDistance,
        priceRange: filters.priceRange.min === 0 && filters.priceRange.max === 9999 
          ? undefined 
          : filters.priceRange,
        categories: filters.categories.length > 0 ? filters.categories : undefined,
      });
    } else {
      await refetch();
    }
  };

  const handleFiltersChange = async (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setIsSearchActive(searchQuery.trim().length > 0 || isFiltersActive(newFilters));
    
    await searchRestaurants(searchQuery, {
      highProtein: newFilters.highProtein,
      maxDistance: newFilters.maxDistance,
      priceRange: newFilters.priceRange.min === 0 && newFilters.priceRange.max === 9999 
        ? undefined 
        : newFilters.priceRange,
      categories: newFilters.categories.length > 0 ? newFilters.categories : undefined,
    });
  };

  const isFiltersActive = (checkFilters = filters) => {
    return checkFilters.highProtein || 
           checkFilters.maxDistance !== 2 ||
           (checkFilters.priceRange.min !== 0 || checkFilters.priceRange.max !== 9999) ||
           checkFilters.categories.length > 0;
  };

  const handleClearSearch = async () => {
    setSearchQuery('');
    setIsSearchActive(false);
    setFilters({
      highProtein: false,
      maxDistance: 2,
      priceRange: { min: 0, max: 9999 },
      categories: [],
    });
    await refetch();
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
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={styles.searchBarContainer}>
            <SearchBar
              value={searchQuery}
              onSearch={handleSearch}
              onClear={handleClearSearch}
              placeholder="店舗名やメニューを検索"
            />
          </View>
          <TouchableOpacity
            style={[
              styles.filterButton,
              (isFiltersActive() || showFilters) && styles.activeFilterButton
            ]}
            onPress={() => setShowFilters(!showFilters)}
            accessibilityRole="button"
            accessibilityLabel="フィルター設定"
            accessibilityHint="検索条件を詳細に設定できます"
          >
            <Ionicons 
              name="options" 
              size={20} 
              color={isFiltersActive() || showFilters ? '#ffffff' : '#6b7280'} 
            />
            {isFiltersActive() && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>
                  {[
                    filters.highProtein && 'P',
                    filters.maxDistance !== 2 && 'D',
                    (filters.priceRange.min !== 0 || filters.priceRange.max !== 9999) && '$',
                    filters.categories.length > 0 && 'C'
                  ].filter(Boolean).join('')}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {isSearchActive && (
          <View style={styles.resultsInfo}>
            <Text style={styles.resultsText}>
              {restaurants.length}件の店舗が見つかりました
            </Text>
            <TouchableOpacity onPress={handleClearSearch}>
              <Text style={styles.clearSearchText}>クリア</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <MapView 
        restaurants={mapRestaurants}
        onMarkerPress={handleMarkerPress}
      />

      <FilterPanel
        visible={showFilters}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClose={() => setShowFilters(false)}
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
  searchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchBarContainer: {
    flex: 1,
    marginRight: 12,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    position: 'relative',
  },
  activeFilterButton: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  resultsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  resultsText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  clearSearchText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
});