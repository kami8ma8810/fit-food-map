import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text 
          style={styles.title}
          accessibilityRole="header"
          accessibilityLabel="食事履歴画面のタイトル"
        >
          食事履歴
        </Text>
        <View style={styles.placeholder}>
          <Text 
            style={styles.placeholderText}
            accessibilityLabel="食事履歴機能は今後実装予定です"
          >
            食事履歴機能（実装予定）
          </Text>
          <Text style={styles.descriptionText}>
            今後のアップデートで以下の機能を追加予定：
          </Text>
          <Text style={styles.featureText}>• 日別の食事記録</Text>
          <Text style={styles.featureText}>• 栄養摂取量の可視化</Text>
          <Text style={styles.featureText}>• PFCバランスのグラフ表示</Text>
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
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
    paddingLeft: 8,
  },
});