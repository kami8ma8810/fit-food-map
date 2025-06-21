import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// getAuthは後で必要になったときにインポート

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemoApiKey123456789",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:123456789012:web:abc123def456"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
// authは後でPhase 3で実装予定
// export const auth = getAuth(app);

export default app;