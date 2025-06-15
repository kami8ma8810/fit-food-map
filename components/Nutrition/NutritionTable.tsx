import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Nutrition } from '../../types';

interface NutritionTableProps {
  nutrition: Nutrition;
}

export default function NutritionTable({ nutrition }: NutritionTableProps) {
  const nutritionRows = [
    { label: 'カロリー', value: `${nutrition.calories}`, unit: 'kcal', highlight: true },
    { label: 'タンパク質', value: `${nutrition.protein}`, unit: 'g', highlight: false },
    { label: '脂質', value: `${nutrition.fat}`, unit: 'g', highlight: false },
    { label: '炭水化物', value: `${nutrition.carbs}`, unit: 'g', highlight: false },
    { label: '食物繊維', value: `${nutrition.fiber}`, unit: 'g', highlight: false },
    { label: 'ナトリウム', value: `${nutrition.sodium}`, unit: 'mg', highlight: false },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>栄養成分表示</Text>
      
      <View style={styles.table}>
        {nutritionRows.map((row, index) => (
          <View 
            key={row.label} 
            style={[
              styles.row, 
              row.highlight && styles.highlightRow,
              index === nutritionRows.length - 1 && styles.lastRow
            ]}
            accessibilityRole="row"
            accessibilityLabel={`${row.label}: ${row.value}${row.unit}`}
          >
            <Text style={[styles.label, row.highlight && styles.highlightLabel]}>
              {row.label}
            </Text>
            <View style={styles.valueContainer}>
              <Text style={[styles.value, row.highlight && styles.highlightValue]}>
                {row.value}
              </Text>
              <Text style={[styles.unit, row.highlight && styles.highlightUnit]}>
                {row.unit}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.note}>
        <Text style={styles.noteText}>
          ※ 栄養成分値は目安です。実際の値は調理方法や食材により異なる場合があります。
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
  table: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  highlightRow: {
    backgroundColor: '#f8fafc',
    borderBottomColor: '#e5e7eb',
  },
  label: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  highlightLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  highlightValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  unit: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  highlightUnit: {
    fontSize: 16,
    color: '#2563eb',
  },
  note: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  noteText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 16,
  },
});