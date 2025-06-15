# Fit Food Map - 飲食店栄養情報マップアプリ

健康志向のユーザーが適切な食事選択をできるよう、飲食店のメニューに含まれる栄養情報（特にタンパク質量・PFCバランス）を地図上で可視化するアプリケーションです。

## 🎯 プロジェクト概要

### 目的
飲食店のメニューに含まれる栄養情報を地図上で可視化し、健康志向のユーザーが適切な食事選択をサポート

### 対象プラットフォーム
- iOS（iOS 13.0以上）
- Android（Android 6.0以上）

### アクセシビリティ要件
- **WCAG 2.1 AA準拠** を目標とした設計・実装
- スクリーンリーダー（VoiceOver/TalkBack）完全対応
- キーボードナビゲーション対応
- 色覚多様性に配慮したカラーパレット
- 最小タッチターゲットサイズ（44px以上）遵守

## 🛠 技術スタック

- **フロントエンド**: React Native + Expo
- **バックエンド**: Firebase (Firestore, Functions, Auth)
- **地図**: OpenStreetMap + react-native-maps
- **状態管理**: Redux Toolkit
- **スタイリング**: NativeWind (Tailwind CSS for React Native)
- **アクセシビリティ**: React Native Accessibility API + react-native-accessibility-engine

## 📱 主な機能

### Phase 1 (MVP) - 1-2ヶ月
- 🗺️ **地図表示機能**
  - 現在地を中心とした地図表示
  - 登録済み飲食店のピン表示
  - ピンタップで店舗基本情報のポップアップ表示

- 🏪 **店舗情報表示**
  - 店舗名、住所、営業時間
  - 代表的なメニューのPFC情報
  - 情報の信頼度表示（公式/推測）

- 🔍 **検索・フィルター機能**
  - 高タンパク質メニューのある店舗フィルター
  - 距離によるフィルター（500m, 1km, 2km）
  - メニュー名での検索

### Phase 2 - 3-4ヶ月
- 🤖 **栄養価推測機能**
  - メニュー名からのAI推測
  - 推測精度の表示
  - 類似メニューの提案

- 👤 **ユーザー機能**
  - アカウント登録（メール/Google）
  - お気に入り店舗の保存
  - 食事履歴の記録
  - 日別の栄養摂取量グラフ

### Phase 3 - 6ヶ月以降
- 📷 **画像認識機能**
- 👥 **コミュニティ機能**

## 📊 データ構造

### Firestore Collections

#### restaurants
```typescript
{
  id: "restaurant_001",
  name: "店舗名",
  location: {
    lat: 35.6812,
    lng: 139.7671,
    address: "東京都新宿区..."
  },
  hours: {
    mon: "11:00-23:00",
    tue: "11:00-23:00"
  },
  chainId: "chain_001",
  verified: true,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### menus
```typescript
{
  id: "menu_001",
  restaurantId: "restaurant_001",
  name: "鶏の唐揚げ定食",
  price: 850,
  nutrition: {
    calories: 750,
    protein: 35.5,    // g
    fat: 28.2,        // g
    carbs: 82.4,      // g
    fiber: 3.2,       // g
    sodium: 1200      // mg
  },
  dataSource: "official", // "official", "ai_estimated", "user_input"
  confidence: 1.0,        // 0-1の信頼度スコア
  imageUrl: "https://...",
  tags: ["定食", "鶏肉", "揚げ物"],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🏗 ディレクトリ構造

```
fit-food-map/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx        # 地図画面
│   │   ├── history.tsx      # 履歴画面
│   │   └── profile.tsx      # プロフィール画面
│   ├── restaurant/
│   │   └── [id].tsx         # 店舗詳細
│   ├── menu/
│   │   └── [id].tsx         # メニュー詳細
│   └── _layout.tsx
├── components/
│   ├── Map/
│   ├── Restaurant/
│   └── Common/
├── hooks/
├── services/
├── store/
├── utils/
└── types/
```

## 🚀 開発環境セットアップ

```bash
# プロジェクト作成
npx create-expo-app fit-food-map --template
cd fit-food-map

# 必要なパッケージのインストール
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install @reduxjs/toolkit react-redux
npm install firebase
npm install react-native-maps-osm
npm install nativewind
npm install expo-location

# 開発用パッケージ
npm install -D @types/react @types/react-native typescript
```

## 📋 実装計画

### Phase 1 実装手順（Week 1-8）

**Week 1-2: 基礎設定**
- Firebaseプロジェクトの作成と設定
- 基本的なナビゲーション構造の実装
- 地図コンポーネントの実装
- 位置情報取得の実装

**Week 3-4: データ準備**
- Firestoreのデータ構造作成
- 大手チェーン店の栄養情報収集スクリプト作成
- 初期データの投入
- データ取得用のカスタムフックの実装

**Week 5-6: 店舗表示機能**
- 地図上への店舗ピン表示
- 店舗詳細画面の実装
- メニュー一覧・詳細画面の実装
- PFC情報の視覚的表示（グラフ等）

**Week 7-8: 検索・フィルター**
- 検索UIの実装
- フィルター機能の実装
- 検索結果の地図反映
- パフォーマンス最適化

## 🧪 テスト計画

### 単体テスト
- 栄養価計算ロジック
- データ変換処理
- フィルター機能

### 統合テスト
- Firebase連携
- 地図表示と店舗データの連携
- ユーザー認証フロー

### E2Eテスト
- 主要なユーザーフロー
- パフォーマンステスト

### アクセシビリティテスト
- 自動化テスト（axe-core for React Native）
- スクリーンリーダーテスト（VoiceOver/TalkBack）
- 色覚多様性テスト（Colour Contrast Analyser）
- キーボードナビゲーションテスト
- WCAG 2.1 AA準拠チェック

## 🔮 今後の拡張案

- 多言語対応（英語、中国語）
- アレルギー情報の追加
- カロリー計算機能
- SNS連携
- 店舗向け管理画面

## 📝 実装状況

### ✅ Phase 0: プロジェクト初期化（完了）
- [x] README.md作成
- [x] プロジェクト仕様策定
- [x] アプリ名決定（Fit Food Map）

### ✅ Phase 1: 基盤構築（完了）
- [x] React Native + Expo セットアップ
- [x] TypeScript設定
- [x] 依存関係インストール
- [x] テスト環境セットアップ（Jest + Testing Library）
- [x] 基本型定義作成
- [x] 栄養価計算ユーティリティ実装（TDD）
- [ ] Firebase プロジェクト作成
- [ ] 基本的なナビゲーション構造
- [ ] 地図コンポーネント実装
- [ ] 位置情報取得機能
- [ ] アクセシビリティ基盤設計・実装

### ⏳ Phase 2: データ基盤（予定）
- [ ] Firestore データ構造作成
- [ ] 大手チェーン店データ収集
- [ ] 初期データ投入
- [ ] データ取得カスタムフック

### ⏳ Phase 3: 店舗表示機能（予定）
- [ ] 地図上店舗ピン表示
- [ ] 店舗詳細画面
- [ ] メニュー一覧・詳細画面
- [ ] PFC情報視覚化
- [ ] アクセシビリティラベル・ヒント追加

### ⏳ Phase 4: 検索・フィルター（予定）
- [ ] 検索UI実装
- [ ] フィルター機能
- [ ] 検索結果地図反映
- [ ] パフォーマンス最適化
- [ ] 音声検索対応（アクセシビリティ）

### ⏳ Phase 5: ユーザー機能（予定）
- [ ] ユーザー認証
- [ ] お気に入り機能
- [ ] 食事履歴記録
- [ ] 栄養摂取量グラフ
- [ ] 高コントラストモード実装

### ⏳ Phase 6: AI機能（予定）
- [ ] メニュー名から栄養価推測
- [ ] 推測精度表示
- [ ] 類似メニュー提案

### ⏳ Phase 7: アクセシビリティ最適化（予定）
- [ ] WCAG 2.1 AA準拠監査・修正
- [ ] スクリーンリーダーテスト
- [ ] 色覚多様性テスト
- [ ] キーボードナビゲーションテスト
- [ ] 自動アクセシビリティテスト導入

## 📝 ライセンス

MIT License

## 👥 コントリビューション

プルリクエストやイシューの投稿を歓迎します。

---

**注**: このプロジェクトは健康志向のユーザーをサポートすることを目的としており、医学的なアドバイスを提供するものではありません。