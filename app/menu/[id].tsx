import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMenu } from '../../hooks';
import { PFCBars, NutritionTable } from '../../components/Nutrition';

export default function MenuDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { menu, loading, error } = useMenu(id);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>メニュー情報を読み込み中...</Text>
      </View>
    );
  }

  if (error || !menu) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error || 'メニューが見つかりませんでした'}</Text>
      </View>
    );
  }

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.9) return '信頼度: 高';
    if (confidence >= 0.7) return '信頼度: 中';
    return '信頼度: 低';
  };

  const getDataSourceText = (dataSource: string) => {
    switch (dataSource) {
      case 'official': return '公式データ';
      case 'ai_estimated': return 'AI推定';
      case 'user_input': return 'ユーザー入力';
      default: return 'データソース不明';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.menuHeader}>
          <Text 
            style={styles.menuName}
            accessibilityRole="header"
            accessibilityLabel={`メニュー名: ${menu.name}`}
          >
            {menu.name}
          </Text>
          <Text style={styles.menuPrice}>¥{menu.price}</Text>
          
          <View style={styles.metaInfo}>
            <Text style={styles.dataSource}>
              {getDataSourceText(menu.dataSource)}
            </Text>
            <Text style={styles.confidence}>
              {getConfidenceText(menu.confidence)}
            </Text>
          </View>

          {menu.tags && menu.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {menu.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <PFCBars nutrition={menu.nutrition} />
        
        <NutritionTable nutrition={menu.nutrition} />

        <View style={styles.healthInsights}>
          <Text style={styles.insightsTitle}>健康指標</Text>
          
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>タンパク質含有率</Text>
            <Text style={styles.insightValue}>
              {((menu.nutrition.protein * 4 / menu.nutrition.calories) * 100).toFixed(1)}%
            </Text>
          </View>
          
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>100gあたりタンパク質</Text>
            <Text style={styles.insightValue}>
              推定 {Math.round(menu.nutrition.protein * 100 / (menu.nutrition.calories / 2.5))}g
            </Text>
          </View>
          
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>ナトリウム評価</Text>
            <Text style={[
              styles.insightValue,
              menu.nutrition.sodium > 2000 ? styles.highSodium :
              menu.nutrition.sodium > 1000 ? styles.mediumSodium : styles.lowSodium
            ]}>
              {menu.nutrition.sodium > 2000 ? '高' :
               menu.nutrition.sodium > 1000 ? '中' : '低'}
            </Text>
          </View>
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
    padding: 16,
  },
  menuHeader: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  menuPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#059669',
    textAlign: 'center',
    marginBottom: 16,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  dataSource: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  confidence: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  healthInsights: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  insightLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  insightValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
  },
  lowSodium: {
    color: '#10b981',
  },
  mediumSodium: {
    color: '#f59e0b',
  },
  highSodium: {
    color: '#ef4444',
  },
});