import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { 
  GoogleAuthProvider, 
  signInWithCredential,
  OAuthCredential 
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Google OAuth設定
const GOOGLE_OAUTH_CONFIG = {
  // 開発用の設定値（実際のプロジェクトでは環境変数から取得）
  clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
  // iOSクライアントID（Firebase Consoleから取得）
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '',
  // AndroidクライアントID（Firebase Consoleから取得）
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '',
};

export class GoogleAuthService {
  static async signInWithGoogle(): Promise<void> {
    try {
      // OAuth リクエストの設定
      const request = new AuthSession.AuthRequest({
        clientId: GOOGLE_OAUTH_CONFIG.clientId,
        scopes: ['openid', 'profile', 'email'],
        redirectUri: AuthSession.makeRedirectUri({
          scheme: 'fit-food-map',
          useProxy: true, // Expo Go使用時はtrue
        }),
        responseType: AuthSession.ResponseType.Code,
        state: await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          Math.random().toString(),
          { encoding: Crypto.CryptoEncoding.HEX }
        ),
      });

      // 認証セッション開始
      const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      });

      if (result.type === 'success') {
        // 認証成功時の処理
        const { code } = result.params;
        
        if (code) {
          // アクセストークンを取得
          const tokenResponse = await AuthSession.exchangeCodeAsync(
            {
              clientId: GOOGLE_OAUTH_CONFIG.clientId,
              code,
              redirectUri: AuthSession.makeRedirectUri({
                scheme: 'fit-food-map',
                useProxy: true,
              }),
            },
            {
              tokenEndpoint: 'https://oauth2.googleapis.com/token',
            }
          );

          const { accessToken, idToken } = tokenResponse;

          if (idToken) {
            // Firebase認証用のクレデンシャルを作成
            const credential = GoogleAuthProvider.credential(idToken, accessToken);
            
            // Firebaseにサインイン
            const userCredential = await signInWithCredential(auth, credential);
            console.log('Google認証成功:', userCredential.user.email);
          } else {
            throw new Error('IDトークンの取得に失敗しました');
          }
        }
      } else if (result.type === 'cancel') {
        console.log('Google認証がキャンセルされました');
        throw new Error('Google認証がキャンセルされました');
      } else {
        console.log('Google認証エラー:', result);
        throw new Error('Google認証に失敗しました');
      }
    } catch (error) {
      console.error('Google認証サービスエラー:', error);
      throw error;
    }
  }

  static isConfigured(): boolean {
    return !!(
      GOOGLE_OAUTH_CONFIG.clientId ||
      GOOGLE_OAUTH_CONFIG.iosClientId ||
      GOOGLE_OAUTH_CONFIG.androidClientId
    );
  }
}