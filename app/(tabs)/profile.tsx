import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text 
          style={styles.title}
          accessibilityRole="header"
          accessibilityLabel="プロフィール画面のタイトル"
        >
          プロフィール
        </Text>
        <View style={styles.placeholder}>
          <Text 
            style={styles.placeholderText}
            accessibilityLabel="ユーザープロフィール機能は今後実装予定です"
          >
            ユーザープロフィール機能（実装予定）
          </Text>
          <Text style={styles.descriptionText}>
            今後のアップデートで以下の機能を追加予定：
          </Text>
          <Text style={styles.featureText}>• ユーザー認証（メール/Google）</Text>
          <Text style={styles.featureText}>• お気に入り店舗の管理</Text>
          <Text style={styles.featureText}>• 栄養目標の設定</Text>
          <Text style={styles.featureText}>• アクセシビリティ設定</Text>
          <Text style={styles.featureText}>• 高コントラストモード</Text>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>アプリ情報</Text>
          <Text style={styles.infoText}>バージョン: 1.0.0</Text>
          <Text style={styles.infoText}>WCAG 2.1 AA準拠を目指して開発中</Text>
          <Text style={styles.infoText}>健康的な食事選択をサポートします</Text>
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
  infoCard: {
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
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
});