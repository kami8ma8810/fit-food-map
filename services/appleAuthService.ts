import * as AppleAuthentication from 'expo-apple-authentication';
import { 
  OAuthProvider, 
  signInWithCredential 
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { Platform } from 'react-native';

export class AppleAuthService {
  static async signInWithApple(): Promise<void> {
    try {
      // Apple認証はiOSでのみ利用可能
      if (Platform.OS !== 'ios') {
        throw new Error('Apple認証はiOSでのみ利用可能です');
      }

      // Apple認証が利用可能かチェック
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('このデバイスではApple認証を利用できません');
      }

      // Apple認証を実行
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Firebaseで使用するOAuthプロバイダーを作成
      const provider = new OAuthProvider('apple.com');
      
      // Firebase認証用のクレデンシャルを作成
      const firebaseCredential = provider.credential({
        idToken: credential.identityToken!,
        rawNonce: credential.nonce || undefined,
      });

      // Firebaseにサインイン
      const userCredential = await signInWithCredential(auth, firebaseCredential);
      
      // ユーザー名が設定されていない場合、Appleから取得した名前を設定
      if (!userCredential.user.displayName && credential.fullName) {
        const { givenName, familyName } = credential.fullName;
        const displayName = [givenName, familyName].filter(Boolean).join(' ');
        
        if (displayName) {
          await userCredential.user.updateProfile({ displayName });
        }
      }

      console.log('Apple認証成功:', userCredential.user.email);
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        console.log('Apple認証がキャンセルされました');
        throw new Error('Apple認証がキャンセルされました');
      }
      
      console.error('Apple認証サービスエラー:', error);
      throw error;
    }
  }

  static async isAvailable(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      return false;
    }
    
    try {
      return await AppleAuthentication.isAvailableAsync();
    } catch (error) {
      console.error('Apple認証可用性チェックエラー:', error);
      return false;
    }
  }

  static isConfigured(): boolean {
    // Apple認証は特別な環境変数設定は不要（iOS端末のみ）
    return Platform.OS === 'ios';
  }
}