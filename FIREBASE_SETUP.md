# Firebase セットアップガイド

## 1. Firebaseプロジェクト作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名: `fit-food-map` 
4. Google Analytics を有効にする（推奨）
5. プロジェクトを作成

## 2. Webアプリの追加

1. プロジェクト概要 > 「</> Webアプリ」をクリック
2. アプリのニックネーム: `Fit Food Map`
3. Firebase Hosting も設定する（オプション）
4. アプリを登録

## 3. 設定情報の取得

Firebase SDK設定から以下の情報をコピー：

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "fit-food-map.firebaseapp.com",
  projectId: "fit-food-map", 
  storageBucket: "fit-food-map.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## 4. 環境変数設定

1. `.env.example` を `.env.local` にコピー
2. 実際の設定値を入力：

```bash
cp .env.example .env.local
```

`.env.local` を編集：
```env
EXPO_PUBLIC_FIREBASE_API_KEY=実際のAPIキー
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=実際のAuth Domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=実際のProject ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=実際のStorage Bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=実際のSender ID
EXPO_PUBLIC_FIREBASE_APP_ID=実際のApp ID
```

## 5. Firestore データベース設定

1. Firebase Console > Firestore Database
2. 「データベースの作成」をクリック
3. 「テストモードで開始」を選択（後でルールを設定）
4. ロケーション: `asia-northeast1 (Tokyo)` を選択

## 6. 初期データ構造作成

### コレクション: `restaurants`

```javascript
{
  name: "サンプル定食屋",
  location: new GeoPoint(35.6762, 139.6503),
  address: "東京都渋谷区...",
  hours: {
    mon: "11:00-23:00",
    tue: "11:00-23:00",
    wed: "11:00-23:00", 
    thu: "11:00-23:00",
    fri: "11:00-23:00",
    sat: "11:00-23:00",
    sun: "11:00-22:00"
  },
  chainId: null,
  verified: true,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

### コレクション: `menus`

```javascript
{
  restaurantId: "restaurant_doc_id",
  name: "鶏の唐揚げ定食",
  price: 850,
  nutrition: {
    calories: 750,
    protein: 35.5,
    fat: 28.2, 
    carbs: 82.4,
    fiber: 3.2,
    sodium: 1200
  },
  dataSource: "official",
  confidence: 1.0,
  imageUrl: null,
  tags: ["定食", "鶏肉", "揚げ物"],
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

## 7. セキュリティルール設定

Firestore セキュリティルール（開発用）：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // レストランデータは読み取り専用
    match /restaurants/{document} {
      allow read: if true;
      allow write: if false; // 管理者のみ
    }
    
    // メニューデータは読み取り専用  
    match /menus/{document} {
      allow read: if true;
      allow write: if false; // 管理者のみ
    }
    
    // ユーザーデータ（Phase 2で実装）
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 8. Authentication設定（Phase 2で実装予定）

1. Firebase Console > Authentication
2. 「始める」をクリック
3. Sign-in method でメールアドレス/パスワードとGoogleを有効化

## 9. 設定完了確認

```bash
npm run test
npm start
```

アプリが正常に起動し、地図が表示されることを確認。

## トラブルシューティング

### 設定エラーの場合
- `.env.local` の値が正しいか確認
- Firebase Console で設定値を再確認

### 権限エラーの場合  
- Firestore ルールを確認
- プロジェクトIDが正しいか確認

### ネットワークエラーの場合
- インターネット接続を確認
- Firebase プロジェクトが有効か確認