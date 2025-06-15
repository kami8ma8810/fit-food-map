import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface FilterOptions {
  highProtein: boolean;
  maxDistance: number;
  priceRange: {
    min: number;
    max: number;
  };
  categories: string[];
}

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClose: () => void;
  visible: boolean;
}

const DISTANCE_OPTIONS = [
  { label: '500m以内', value: 0.5 },
  { label: '1km以内', value: 1 },
  { label: '2km以内', value: 2 },
  { label: '5km以内', value: 5 },
];

const CATEGORY_OPTIONS = [
  { label: '牛丼', value: '牛丼' },
  { label: '定食', value: '定食' },
  { label: 'チキン', value: 'チキン' },
  { label: '海鮮', value: '海鮮' },
  { label: '揚げ物', value: '揚げ物' },
  { label: 'ヘルシー', value: 'ヘルシー' },
];

const PRICE_RANGES = [
  { label: '～500円', min: 0, max: 500 },
  { label: '500～800円', min: 500, max: 800 },
  { label: '800～1200円', min: 800, max: 1200 },
  { label: '1200円～', min: 1200, max: 9999 },
];

export default function FilterPanel({ filters, onFiltersChange, onClose, visible }: FilterPanelProps) {
  if (!visible) return null;

  const updateFilters = (updates: Partial<FilterOptions>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    updateFilters({ categories: newCategories });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      highProtein: false,
      maxDistance: 2,
      priceRange: { min: 0, max: 9999 },
      categories: [],
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.highProtein) count++;
    if (filters.maxDistance !== 2) count++;
    if (filters.priceRange.min !== 0 || filters.priceRange.max !== 9999) count++;
    if (filters.categories.length > 0) count++;
    return count;
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.panel}>
        <View style={styles.header}>
          <Text style={styles.title}>フィルター</Text>
          <View style={styles.headerActions}>
            {getActiveFiltersCount() > 0 && (
              <TouchableOpacity
                onPress={clearAllFilters}
                style={styles.clearButton}
                accessibilityRole="button"
                accessibilityLabel="すべてのフィルターをクリア"
              >
                <Text style={styles.clearText}>クリア</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="フィルターパネルを閉じる"
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>栄養フィルター</Text>
            <TouchableOpacity
              style={[styles.toggleOption, filters.highProtein && styles.activeToggle]}
              onPress={() => updateFilters({ highProtein: !filters.highProtein })}
              accessibilityRole="switch"
              accessibilityState={{ checked: filters.highProtein }}
              accessibilityLabel="高タンパク質メニューのみ表示"
            >
              <Ionicons 
                name="fitness" 
                size={20} 
                color={filters.highProtein ? '#ffffff' : '#6b7280'} 
              />
              <Text style={[styles.toggleText, filters.highProtein && styles.activeToggleText]}>
                高タンパク質メニュー (25g以上)
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>距離</Text>
            <View style={styles.optionsGrid}>
              {DISTANCE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    filters.maxDistance === option.value && styles.activeOption
                  ]}
                  onPress={() => updateFilters({ maxDistance: option.value })}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: filters.maxDistance === option.value }}
                  accessibilityLabel={`距離フィルター: ${option.label}`}
                >
                  <Text style={[
                    styles.optionText,
                    filters.maxDistance === option.value && styles.activeOptionText
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>価格帯</Text>
            <View style={styles.optionsGrid}>
              {PRICE_RANGES.map((range, index) => {
                const isActive = filters.priceRange.min === range.min && 
                               filters.priceRange.max === range.max;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.optionButton, isActive && styles.activeOption]}
                    onPress={() => updateFilters({ 
                      priceRange: { min: range.min, max: range.max }
                    })}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isActive }}
                    accessibilityLabel={`価格フィルター: ${range.label}`}
                  >
                    <Text style={[
                      styles.optionText,
                      isActive && styles.activeOptionText
                    ]}>
                      {range.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>カテゴリー</Text>
            <View style={styles.categoriesGrid}>
              {CATEGORY_OPTIONS.map((category) => {
                const isActive = filters.categories.includes(category.value);
                return (
                  <TouchableOpacity
                    key={category.value}
                    style={[styles.categoryChip, isActive && styles.activeCategoryChip]}
                    onPress={() => toggleCategory(category.value)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isActive }}
                    accessibilityLabel={`カテゴリーフィルター: ${category.label}`}
                  >
                    <Text style={[
                      styles.categoryText,
                      isActive && styles.activeCategoryText
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  panel: {
    position: 'absolute',
    top: 100,
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    marginRight: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  clearText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  toggleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activeToggle: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  toggleText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeToggleText: {
    color: '#ffffff',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minWidth: '45%',
    alignItems: 'center',
  },
  activeOption: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeOptionText: {
    color: '#ffffff',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activeCategoryChip: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeCategoryText: {
    color: '#ffffff',
  },
});