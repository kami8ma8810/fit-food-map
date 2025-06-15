import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text 
          style={styles.title}
          accessibilityRole="header"
          accessibilityLabel={`店舗ID ${id} の詳細画面`}
        >
          店舗詳細（ID: {id}）
        </Text>
        
        <View style={styles.placeholder}>
          <Ionicons 
            name="restaurant-outline" 
            size={64} 
            color="#6b7280"
            accessibilityLabel="店舗アイコン"
          />
          <Text 
            style={styles.placeholderText}
            accessibilityLabel="店舗詳細機能は今後実装予定です"
          >
            店舗詳細機能（実装予定）
          </Text>
          <Text style={styles.descriptionText}>
            今後のアップデートで以下の情報を表示予定：
          </Text>
          <Text style={styles.featureText}>• 店舗名・住所・営業時間</Text>
          <Text style={styles.featureText}>• メニュー一覧</Text>
          <Text style={styles.featureText}>• 栄養情報の詳細</Text>
          <Text style={styles.featureText}>• お気に入り登録</Text>
          <Text style={styles.featureText}>• 店舗への経路案内</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1f2937',
  },
  placeholder: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
    paddingLeft: 8,
  },
});