import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MenuDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text 
          style={styles.title}
          accessibilityRole="header"
          accessibilityLabel={`メニューID ${id} の詳細画面`}
        >
          メニュー詳細（ID: {id}）
        </Text>
        
        <View style={styles.placeholder}>
          <Ionicons 
            name="nutrition-outline" 
            size={64} 
            color="#6b7280"
            accessibilityLabel="栄養情報アイコン"
          />
          <Text 
            style={styles.placeholderText}
            accessibilityLabel="メニュー詳細機能は今後実装予定です"
          >
            メニュー詳細機能（実装予定）
          </Text>
          <Text style={styles.descriptionText}>
            今後のアップデートで以下の情報を表示予定：
          </Text>
          <Text style={styles.featureText}>• メニュー名・価格・画像</Text>
          <Text style={styles.featureText}>• 詳細な栄養情報（PFC・カロリー）</Text>
          <Text style={styles.featureText}>• アレルギー情報</Text>
          <Text style={styles.featureText}>• 栄養価の可視化グラフ</Text>
          <Text style={styles.featureText}>• 類似メニューの提案</Text>
          <Text style={styles.featureText}>• 食事履歴への追加</Text>
        </View>

        <View style={styles.nutritionPreview}>
          <Text style={styles.cardTitle}>栄養価プレビュー</Text>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>カロリー</Text>
            <Text style={styles.nutritionValue}>750 kcal</Text>
          </View>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>タンパク質</Text>
            <Text style={styles.nutritionValue}>35.5 g</Text>
          </View>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>脂質</Text>
            <Text style={styles.nutritionValue}>28.2 g</Text>
          </View>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>炭水化物</Text>
            <Text style={styles.nutritionValue}>82.4 g</Text>
          </View>
          <Text style={styles.noteText}>※ サンプルデータです</Text>
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
  nutritionPreview: {
    backgroundColor: '#ffffff',
    padding: 20,
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  nutritionValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
  },
  noteText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});