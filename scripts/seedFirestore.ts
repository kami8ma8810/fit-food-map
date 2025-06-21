#!/usr/bin/env tsx

import * as dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';

// .env.localファイルを読み込み
dotenv.config({ path: '.env.local' });
import { 
  getFirestore, 
  collection, 
  addDoc, 
  GeoPoint, 
  serverTimestamp,
  connectFirestoreEmulator
} from 'firebase/firestore';
import { sampleRestaurants } from '../data/sampleRestaurants';
import { sampleMenus } from '../data/sampleMenus';

// Firebase設定（環境変数から読み込み）
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// 設定値チェック
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Firebase設定が不完全です。.env.localファイルを確認してください。');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 本番環境以外ではエミュレーターを使用（オプション）
if (process.env.NODE_ENV !== 'production' && process.env.USE_FIRESTORE_EMULATOR === 'true') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('🔗 Firestoreエミュレーターに接続しました');
  } catch (error) {
    console.log('ℹ️  Firestoreエミュレーターへの接続をスキップ（既に接続済みまたは本番環境）');
  }
}

async function seedRestaurants() {
  console.log('🏪 レストランデータを投入中...');
  const restaurantIds: string[] = [];
  
  for (const restaurant of sampleRestaurants) {
    try {
      const docRef = await addDoc(collection(db, 'restaurants'), {
        name: restaurant.name,
        location: new GeoPoint(restaurant.location.lat, restaurant.location.lng),
        address: restaurant.location.address,
        hours: restaurant.hours,
        chainId: restaurant.chainId,
        verified: restaurant.verified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      restaurantIds.push(docRef.id);
      console.log(`  ✅ ${restaurant.name} (ID: ${docRef.id})`);
    } catch (error) {
      console.error(`  ❌ ${restaurant.name} の投入に失敗:`, error);
    }
  }
  
  return restaurantIds;
}

async function seedMenus(restaurantIds: string[]) {
  console.log('🍽️  メニューデータを投入中...');
  
  // レストランIDマッピングを作成
  const restaurantIdMap: { [key: string]: string } = {};
  const originalIds = ['yoshinoya_shibuya', 'sukiya_shinjuku', 'matsuya_harajuku', 'ootoya_shibuya', 'kfc_shibuya'];
  
  for (let i = 0; i < originalIds.length && i < restaurantIds.length; i++) {
    restaurantIdMap[originalIds[i]] = restaurantIds[i];
  }
  
  for (const menu of sampleMenus) {
    const firestoreRestaurantId = restaurantIdMap[menu.restaurantId];
    
    if (!firestoreRestaurantId) {
      console.log(`  ⚠️  ${menu.name} のレストランIDが見つかりません: ${menu.restaurantId}`);
      continue;
    }
    
    try {
      await addDoc(collection(db, 'menus'), {
        restaurantId: firestoreRestaurantId,
        name: menu.name,
        price: menu.price,
        nutrition: menu.nutrition,
        dataSource: menu.dataSource,
        confidence: menu.confidence,
        imageUrl: menu.imageUrl,
        tags: menu.tags,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log(`  ✅ ${menu.name} (レストラン: ${firestoreRestaurantId})`);
    } catch (error) {
      console.error(`  ❌ ${menu.name} の投入に失敗:`, error);
    }
  }
}

async function main() {
  console.log('🚀 Firestoreデータ投入を開始します...');
  console.log(`📊 プロジェクト: ${firebaseConfig.projectId}`);
  console.log('');
  
  try {
    // レストランデータを投入
    const restaurantIds = await seedRestaurants();
    console.log(`✨ ${restaurantIds.length}件のレストランを投入しました\n`);
    
    // メニューデータを投入
    await seedMenus(restaurantIds);
    console.log('✨ メニューデータの投入が完了しました\n');
    
    console.log('🎉 すべてのデータ投入が完了しました！');
    console.log('');
    console.log('次のステップ:');
    console.log('1. Firebase Consoleでデータを確認');
    console.log('2. アプリを起動して動作確認');
    console.log('   npm start');
    
  } catch (error) {
    console.error('❌ データ投入中にエラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
if (require.main === module) {
  main();
}

export { seedRestaurants, seedMenus };