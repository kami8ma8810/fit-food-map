import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Nutrition } from '../../types';

interface PFCBarsProps {
  nutrition: Nutrition;
}

export default function PFCBars({ nutrition }: PFCBarsProps) {
  const proteinCalories = nutrition.protein * 4;
  const fatCalories = nutrition.fat * 9;
  const carbsCalories = nutrition.carbs * 4;
  const totalMacroCalories = proteinCalories + fatCalories + carbsCalories;

  const proteinPercentage = (proteinCalories / totalMacroCalories) * 100;
  const fatPercentage = (fatCalories / totalMacroCalories) * 100;
  const carbsPercentage = (carbsCalories / totalMacroCalories) * 100;

  const maxGrams = Math.max(nutrition.protein, nutrition.fat, nutrition.carbs);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PFCバランス</Text>
      
      <View style={styles.barContainer}>
        <View style={styles.barRow}>
          <Text style={styles.barLabel}>P</Text>
          <View style={styles.barTrack}>
            <View 
              style={[
                styles.barFill, 
                { 
                  width: `${(nutrition.protein / maxGrams) * 100}%`,
                  backgroundColor: '#3b82f6'
                }
              ]} 
            />
          </View>
          <View style={styles.barValue}>
            <Text style={styles.barValueText}>{nutrition.protein}g</Text>
            <Text style={styles.barPercentage}>({proteinPercentage.toFixed(1)}%)</Text>
          </View>
        </View>

        <View style={styles.barRow}>
          <Text style={styles.barLabel}>F</Text>
          <View style={styles.barTrack}>
            <View 
              style={[
                styles.barFill, 
                { 
                  width: `${(nutrition.fat / maxGrams) * 100}%`,
                  backgroundColor: '#ef4444'
                }
              ]} 
            />
          </View>
          <View style={styles.barValue}>
            <Text style={styles.barValueText}>{nutrition.fat}g</Text>
            <Text style={styles.barPercentage}>({fatPercentage.toFixed(1)}%)</Text>
          </View>
        </View>

        <View style={styles.barRow}>
          <Text style={styles.barLabel}>C</Text>
          <View style={styles.barTrack}>
            <View 
              style={[
                styles.barFill, 
                { 
                  width: `${(nutrition.carbs / maxGrams) * 100}%`,
                  backgroundColor: '#10b981'
                }
              ]} 
            />
          </View>
          <View style={styles.barValue}>
            <Text style={styles.barValueText}>{nutrition.carbs}g</Text>
            <Text style={styles.barPercentage}>({carbsPercentage.toFixed(1)}%)</Text>
          </View>
        </View>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          総カロリー: {nutrition.calories}kcal
        </Text>
        <Text style={styles.summaryText}>
          うちマクロ栄養素: {Math.round(totalMacroCalories)}kcal
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  barContainer: {
    marginBottom: 16,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  barLabel: {
    width: 20,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  barTrack: {
    flex: 1,
    height: 24,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 12,
    minWidth: 2,
  },
  barValue: {
    width: 80,
    alignItems: 'flex-end',
  },
  barValueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  barPercentage: {
    fontSize: 12,
    color: '#6b7280',
  },
  summary: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
});