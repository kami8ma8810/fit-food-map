# Fit Food Map - 飲食店栄養情報マップアプリ

健康志向のユーザーが適切な食事選択をできるよう、飲食店のメニューに含まれる栄養情報（特にタンパク質量・PFCバランス）を地図上で可視化するアプリケーションです。

## 🚀 現在の実装状況

**✅ アプリは完全に動作します！**
- Expo Goで起動・動作確認済み
- 全主要機能が実装され、モックデータで完全動作
- ネイティブモジュール依存なし
- アクセシビリティ対応済み

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
- **ナビゲーション**: Expo Router
- **状態管理**: カスタムフック（useRestaurants, useLocation, useMenu）
- **データ**: MockRestaurantService（Firebase準備済み）
- **スタイリング**: React Native StyleSheet
- **テスト**: Jest + TypeScript
- **アクセシビリティ**: React Native Accessibility API完全対応

## 📱 実装済み機能

### ✅ コア機能（完全実装済み）
- 🗺️ **レストラン一覧表示**
  - 現在地ベースの距離計算・表示
  - レストラン一覧のスクロール表示
  - タップでレストラン詳細画面に遷移

- 🏪 **店舗詳細情報**
  - 店舗名、住所、営業時間、電話番号
  - メニュー一覧表示
  - 各メニュータップで詳細画面に遷移

- 🍽️ **メニュー詳細・栄養情報**
  - 詳細な栄養成分表示（カロリー、タンパク質、脂質、炭水化物等）
  - PFCバランスの視覚的表示（プログレスバー）
  - ヘルスインサイト（高タンパク質、低ナトリウム等の判定）
  - データソースと信頼度の表示

- 🔍 **高度な検索・フィルター機能**
  - リアルタイム検索（レストラン名・メニュー名）
  - 高タンパク質メニューフィルター（25g以上）
  - 距離フィルター（500m〜5km）
  - 価格帯フィルター（〜500円、500-1000円等）
  - カテゴリフィルター（定食、丼物、パスタ等）
  - 複合フィルター対応
  - アクティブフィルター表示・クリア機能

### 🎯 今後の実装予定

#### Phase 2: Firebase統合・ユーザー機能
- 🔐 **Firebase統合**
  - Firestore データベース接続
  - ユーザー認証（Google/Apple/メール）
  - リアルタイムデータ同期

- 👤 **ユーザー機能**
  - お気に入り店舗・メニュー保存
  - 食事履歴の記録・管理
  - 日別・週別栄養摂取量グラフ
  - 個人の栄養目標設定

#### Phase 3: AI・画像認識
- 🤖 **栄養価推測機能**
  - メニュー名からのAI推測
  - 推測精度の表示・向上
  - 類似メニューの提案

- 📷 **画像認識機能**
  - メニュー写真からの栄養価推測
  - OCRによるメニュー文字認識

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

## 🏗 プロジェクト構成

### ディレクトリ構造
```
fit-food-map/
├── app/                     # Expo Router ページ
│   ├── (tabs)/             # タブナビゲーション
│   │   ├── index.tsx       # メイン画面（レストラン一覧）
│   │   ├── history.tsx     # 履歴画面（未実装）
│   │   └── profile.tsx     # プロフィール画面（未実装）
│   ├── restaurant/
│   │   └── [id].tsx        # レストラン詳細画面
│   ├── menu/
│   │   └── [id].tsx        # メニュー詳細画面
│   └── _layout.tsx         # レイアウト設定
├── components/
│   ├── Map/                # マップ関連コンポーネント
│   │   └── MapView.tsx     # レストラン一覧表示
│   ├── Restaurant/         # レストラン関連コンポーネント
│   │   ├── RestaurantCard.tsx
│   │   └── RestaurantInfo.tsx
│   ├── Nutrition/          # 栄養情報コンポーネント
│   │   ├── PFCBars.tsx     # PFCバランス表示
│   │   └── NutritionTable.tsx
│   ├── Search/             # 検索・フィルター
│   │   ├── SearchBar.tsx
│   │   └── FilterPanel.tsx
│   └── Common/             # 共通コンポーネント
├── hooks/                  # カスタムフック
│   ├── useRestaurants.ts   # レストランデータ管理
│   ├── useRestaurant.ts    # 単一レストラン管理
│   ├── useMenu.ts          # メニューデータ管理
│   └── useLocation.ts      # 位置情報管理
├── services/               # データサービス
│   ├── mockRestaurantService.ts  # モックデータサービス
│   ├── restaurantService.ts      # Firebase サービス（準備済み）
│   └── index.ts
├── utils/                  # ユーティリティ
│   ├── nutritionCalculator.ts    # 栄養計算
│   └── accessibility.ts          # アクセシビリティ
├── types/                  # TypeScript型定義
│   └── index.ts
├── data/                   # サンプルデータ
│   └── sampleRestaurants.ts
├── config/                 # 設定ファイル
│   └── firebase.ts         # Firebase設定
└── mocks/                  # テスト用モック
```

### アプリケーションアーキテクチャ

```mermaid
graph TB
    subgraph "📱 Presentation Layer"
        A["app/(tabs)/index.tsx<br/>メイン画面"] --> B["app/restaurant/[id].tsx<br/>レストラン詳細"]
        B --> C["app/menu/[id].tsx<br/>メニュー詳細"]
        A --> D["components/Search/<br/>検索・フィルター"]
        B --> E["components/Restaurant/<br/>レストラン情報"]
        C --> F["components/Nutrition/<br/>栄養情報・PFC"]
    end
    
    subgraph "🔧 Business Logic Layer"
        G["hooks/useRestaurants.ts<br/>レストランデータ管理"]
        H["hooks/useLocation.ts<br/>位置情報管理"]
        I["hooks/useMenu.ts<br/>メニューデータ管理"]
        J["utils/nutritionCalculator.ts<br/>栄養計算ロジック"]
    end
    
    subgraph "📊 Data Layer"
        K["services/mockRestaurantService.ts<br/>モックデータサービス"]
        L["services/restaurantService.ts<br/>Firebase サービス(準備済み)"]
        M["data/sampleRestaurants.ts<br/>サンプルデータ"]
    end
    
    subgraph "🎯 Cross-cutting Concerns"
        N["utils/accessibility.ts<br/>アクセシビリティ"]
        O["types/index.ts<br/>型定義"]
    end
    
    A --> G
    B --> G
    B --> I
    C --> I
    A --> H
    G --> K
    I --> K
    G --> L
    I --> L
    K --> M
    F --> J
    A --> N
    B --> N
    C --> N
    
    style A fill:#e1f5fe
    style B fill:#e1f5fe
    style C fill:#e1f5fe
    style K fill:#f3e5f5
    style L fill:#f3e5f5
    style J fill:#fff3e0
```

### データフロー図

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant UI as 🖥️ UI Component
    participant H as 🔧 Custom Hook
    participant S as 📊 Service Layer
    participant D as 💾 Data Store
    
    Note over U,D: アプリ起動・レストラン一覧表示
    U->>UI: アプリ起動
    UI->>H: useRestaurants()
    H->>S: MockRestaurantService.getNearbyRestaurants()
    S->>D: サンプルレストランデータ取得
    D-->>S: レストランリスト
    S-->>H: フィルタ・距離計算適用
    H-->>UI: restaurants, loading, error
    UI-->>U: レストラン一覧表示
    
    Note over U,D: 検索・フィルター操作
    U->>UI: 検索キーワード入力
    UI->>H: searchRestaurants(searchTerm, filters)
    H->>S: MockRestaurantService.searchRestaurants()
    S->>D: フィルタ条件でデータ検索
    D-->>S: 検索結果
    S-->>H: 結果データ
    H-->>UI: フィルタされたレストラン
    UI-->>U: 検索結果表示
    
    Note over U,D: レストラン詳細表示
    U->>UI: レストランタップ
    UI->>H: useRestaurant(id)
    H->>S: MockRestaurantService.getRestaurantById()
    S->>D: 特定レストランデータ取得
    D-->>S: レストラン詳細
    S-->>H: レストランデータ
    H-->>UI: restaurant, menus
    UI-->>U: レストラン詳細画面表示
    
    Note over U,D: メニュー詳細・栄養情報
    U->>UI: メニューアイテムタップ
    UI->>H: useMenu(id)
    H->>S: MockRestaurantService.getMenuById()
    S->>D: メニューデータ取得
    D-->>S: メニュー詳細
    S->>S: nutritionCalculator でPFC計算
    S-->>H: 栄養情報付きメニュー
    H-->>UI: menu, nutrition, insights
    UI-->>U: メニュー詳細・栄養情報表示
```

### 状態管理パターン

```mermaid
graph LR
    subgraph "🔄 State Management"
        A[Local Component State<br/>useState] --> B[Custom Hooks<br/>共有ロジック]
        B --> C[Service Layer<br/>データ取得・変換]
        C --> D[Mock Data Store<br/>サンプルデータ]
    end
    
    subgraph "🔮 Future: Global State"
        E[Redux Toolkit<br/>準備済み] -.-> F[User Preferences<br/>お気に入り・履歴]
        E -.-> G[Authentication State<br/>ログイン状態]
    end
    
    style D fill:#c8e6c9
    style E fill:#ffecb3
    style F fill:#ffecb3
    style G fill:#ffecb3
```

### コンポーネント間の相互作用

```mermaid
graph TD
    subgraph "🗺️ メイン画面 (index.tsx)"
        A[SearchBar<br/>検索入力] --> B[FilterPanel<br/>フィルター設定]
        B --> C[MapView<br/>レストラン一覧表示]
        C --> D[Restaurant Card<br/>個別レストラン]
    end
    
    subgraph "🏪 レストラン詳細 (restaurant/[id].tsx)"
        E[RestaurantInfo<br/>店舗基本情報] --> F[Menu List<br/>メニュー一覧]
        F --> G[Menu Item<br/>個別メニュー]
    end
    
    subgraph "🍽️ メニュー詳細 (menu/[id].tsx)"
        H[Menu Header<br/>メニュー名・価格] --> I[NutritionTable<br/>栄養成分表]
        I --> J[PFCBars<br/>PFCバランス表示]
        J --> K[Health Insights<br/>健康アドバイス]
    end
    
    D -->|navigation.push| E
    G -->|navigation.push| H
    
    style A fill:#e3f2fd
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style H fill:#fce4ec
    style I fill:#f3e5f5
    style J fill:#e0f2f1
```

### 技術的な実装詳細

```mermaid
graph TB
    subgraph "🔍 Search & Filter System"
        A[SearchBar.tsx<br/>リアルタイム検索] --> B[useRestaurants Hook<br/>検索ロジック]
        B --> C[MockRestaurantService<br/>データフィルタリング]
        C --> D[Advanced Search Logic<br/>• 高タンパク質フィルター<br/>• 距離計算<br/>• 価格帯フィルター<br/>• カテゴリマッチング]
    end
    
    subgraph "📍 Location Services"
        E[useLocation Hook] --> F[expo-location<br/>位置情報取得]
        F --> G[Haversine Formula<br/>距離計算]
        G --> H[Distance Display<br/>m/km表示]
    end
    
    subgraph "🧮 Nutrition Calculation"
        I[nutritionCalculator.ts<br/>TDD実装] --> J[PFC Ratio Calculation<br/>プロテイン・脂質・炭水化物]
        J --> K[Health Insights<br/>• 高タンパク質判定<br/>• 低ナトリウム判定<br/>• カロリー評価]
    end
    
    subgraph "♿ Accessibility Features"
        L[accessibility.ts<br/>WCAG 2.1 AA準拠] --> M[Screen Reader Support<br/>VoiceOver/TalkBack]
        M --> N[Touch Targets<br/>44px以上保証]
        N --> O[Color Contrast<br/>4.5:1以上コントラスト]
    end
    
    B --> E
    C --> I
    A --> L
    
    style D fill:#e8f5e8
    style I fill:#fff3e0
    style L fill:#fce4ec
```

## 🚀 開発環境セットアップ

```bash
# リポジトリをクローン
git clone <repository-url>
cd fit-food-map

# 依存関係をインストール
npm install

# アプリを起動
npm start

# Expo Goアプリでテスト、またはWebブラウザで起動
```

### 必要な環境
- Node.js 18以上
- Expo CLI
- Expo Goアプリ（iOS/Android端末）またはWebブラウザ

### インストール済みパッケージ
- **expo**: ~53.0.11
- **expo-router**: ^5.1.0 (ナビゲーション)
- **expo-location**: ^18.1.5 (位置情報)
- **firebase**: ^11.9.1 (バックエンド準備)
- **react-redux**: ^9.2.0 (状態管理準備)
- **@reduxjs/toolkit**: ^2.8.2
- **jest**: テスト環境

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

### ✅ Phase 1: 基盤構築・コア機能（完了）
- [x] **プロジェクト初期化**
  - [x] React Native + Expo セットアップ
  - [x] TypeScript設定・型定義作成
  - [x] 依存関係インストール・設定
  - [x] テスト環境セットアップ（Jest）
  - [x] アクセシビリティユーティリティ実装

- [x] **ナビゲーション・画面構成**
  - [x] Expo Router による画面遷移
  - [x] タブナビゲーション構造
  - [x] レストラン詳細画面
  - [x] メニュー詳細画面

- [x] **データ管理・サービス層**
  - [x] 栄養価計算ユーティリティ（TDD）
  - [x] MockRestaurantService 実装
  - [x] サンプルレストラン・メニューデータ作成
  - [x] カスタムフック（useRestaurants, useLocation, useMenu）
  - [x] Firebase設定ファイル準備

- [x] **UI・UXコンポーネント**
  - [x] レストラン一覧表示（地図代替）
  - [x] レストラン詳細情報表示
  - [x] メニュー詳細・栄養情報表示
  - [x] PFCバランス視覚化（プログレスバー）
  - [x] ヘルスインサイト機能

- [x] **検索・フィルター機能**
  - [x] リアルタイム検索UI
  - [x] 高タンパク質メニューフィルター
  - [x] 距離・価格・カテゴリフィルター
  - [x] 複合フィルター対応
  - [x] アクティブフィルター表示

- [x] **アクセシビリティ対応**
  - [x] 全画面でアクセシビリティラベル・ヒント設定
  - [x] WCAG 2.1 AA準拠カラーパレット
  - [x] タッチターゲットサイズ（44px以上）遵守
  - [x] スクリーンリーダー対応

### 🔄 Phase 2: Firebase統合（準備済み）
- [x] Firebase設定ファイル作成
- [x] RestaurantService実装（Firestore対応）
- [ ] 実際のFirebaseプロジェクト作成・接続
- [ ] ユーザー認証実装
- [ ] リアルタイムデータ同期

### ⏳ Phase 3: 拡張機能（今後の予定）
- [ ] お気に入り機能
- [ ] 食事履歴記録
- [ ] 栄養摂取量グラフ
- [ ] AI栄養価推測
- [ ] 画像認識機能

## 📝 ライセンス

MIT License

## 👥 コントリビューション

プルリクエストやイシューの投稿を歓迎します。

---

**注**: このプロジェクトは健康志向のユーザーをサポートすることを目的としており、医学的なアドバイスを提供するものではありません。