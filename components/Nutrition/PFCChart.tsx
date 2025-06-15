import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Nutrition } from '../../types';

interface PFCChartProps {
  nutrition: Nutrition;
  size?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export default function PFCChart({ nutrition, size = Math.min(screenWidth * 0.6, 200) }: PFCChartProps) {
  const proteinCalories = nutrition.protein * 4;
  const fatCalories = nutrition.fat * 9;
  const carbsCalories = nutrition.carbs * 4;
  const totalMacroCalories = proteinCalories + fatCalories + carbsCalories;

  const proteinPercentage = (proteinCalories / totalMacroCalories) * 100;
  const fatPercentage = (fatCalories / totalMacroCalories) * 100;
  const carbsPercentage = (carbsCalories / totalMacroCalories) * 100;

  const proteinAngle = (proteinPercentage / 100) * 360;
  const fatAngle = (fatPercentage / 100) * 360;
  const carbsAngle = (carbsPercentage / 100) * 360;

  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const proteinStrokeDasharray = `${(proteinPercentage / 100) * circumference} ${circumference}`;
  const fatStrokeDasharray = `${(fatPercentage / 100) * circumference} ${circumference}`;
  const carbsStrokeDasharray = `${(carbsPercentage / 100) * circumference} ${circumference}`;

  const proteinOffset = 0;
  const fatOffset = -(proteinPercentage / 100) * circumference;
  const carbsOffset = -((proteinPercentage + fatPercentage) / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.chartContainer}>
        <View style={[styles.chart, { width: size, height: size }]}>
          <View style={styles.backgroundCircle} />
          
          <View style={styles.proteinSegment}>
            <View 
              style={[
                styles.segment,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  borderWidth: strokeWidth,
                  borderColor: '#3b82f6',
                }
              ]}
            />
          </View>
          
          <View style={styles.fatSegment}>
            <View 
              style={[
                styles.segment,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  borderWidth: strokeWidth,
                  borderColor: '#ef4444',
                }
              ]}
            />
          </View>
          
          <View style={styles.carbsSegment}>
            <View 
              style={[
                styles.segment,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  borderWidth: strokeWidth,
                  borderColor: '#10b981',
                }
              ]}
            />
          </View>
        </View>
        
        <View style={[styles.centerInfo, { width: size - strokeWidth * 2, height: size - strokeWidth * 2 }]}>
          <Text style={styles.caloriesText}>{nutrition.calories}</Text>
          <Text style={styles.caloriesLabel}>kcal</Text>
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#3b82f6' }]} />
          <Text style={styles.legendText}>
            タンパク質 {nutrition.protein}g ({proteinPercentage.toFixed(1)}%)
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#ef4444' }]} />
          <Text style={styles.legendText}>
            脂質 {nutrition.fat}g ({fatPercentage.toFixed(1)}%)
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#10b981' }]} />
          <Text style={styles.legendText}>
            炭水化物 {nutrition.carbs}g ({carbsPercentage.toFixed(1)}%)
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chartContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chart: {
    position: 'relative',
  },
  backgroundCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 100,
    backgroundColor: '#f3f4f6',
  },
  segment: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent',
  },
  proteinSegment: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fatSegment: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  carbsSegment: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  centerInfo: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 100,
  },
  caloriesText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  caloriesLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  legend: {
    marginTop: 20,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#374151',
  },
});