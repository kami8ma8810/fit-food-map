import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { 
  TwitterAuthProvider, 
  signInWithCredential 
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Twitter OAuth設定
const TWITTER_OAUTH_CONFIG = {
  clientId: process.env.EXPO_PUBLIC_TWITTER_CLIENT_ID || '',
  clientSecret: process.env.EXPO_PUBLIC_TWITTER_CLIENT_SECRET || '',
};

export class TwitterAuthService {
  static async signInWithTwitter(): Promise<void> {
    try {
      // OAuth 2.0 PKCE リクエストの設定
      const request = new AuthSession.AuthRequest({
        clientId: TWITTER_OAUTH_CONFIG.clientId,
        scopes: ['tweet.read', 'users.read'],
        redirectUri: AuthSession.makeRedirectUri({
          scheme: 'fit-food-map',
          useProxy: true,
        }),
        responseType: AuthSession.ResponseType.Code,
        usePKCE: true,
        additionalParameters: {},
      });

      // 認証セッション開始
      const result = await request.promptAsync({
        authorizationEndpoint: 'https://twitter.com/i/oauth2/authorize',
      });

      if (result.type === 'success') {
        const { code } = result.params;
        
        if (code) {
          // アクセストークンを取得
          const tokenResponse = await AuthSession.exchangeCodeAsync(
            {
              clientId: TWITTER_OAUTH_CONFIG.clientId,
              code,
              redirectUri: AuthSession.makeRedirectUri({
                scheme: 'fit-food-map',
                useProxy: true,
              }),
              extraParams: {
                code_verifier: request.codeVerifier!,
              },
            },
            {
              tokenEndpoint: 'https://api.twitter.com/2/oauth2/token',
            }
          );

          const { accessToken } = tokenResponse;

          if (accessToken) {
            // Firebase認証用のクレデンシャルを作成
            const credential = TwitterAuthProvider.credential(accessToken);
            
            // Firebaseにサインイン
            const userCredential = await signInWithCredential(auth, credential);
            console.log('Twitter認証成功:', userCredential.user.email);
          } else {
            throw new Error('アクセストークンの取得に失敗しました');
          }
        }
      } else if (result.type === 'cancel') {
        console.log('Twitter認証がキャンセルされました');
        throw new Error('Twitter認証がキャンセルされました');
      } else {
        console.log('Twitter認証エラー:', result);
        throw new Error('Twitter認証に失敗しました');
      }
    } catch (error) {
      console.error('Twitter認証サービスエラー:', error);
      throw error;
    }
  }

  static isConfigured(): boolean {
    return !!(
      TWITTER_OAUTH_CONFIG.clientId && 
      TWITTER_OAUTH_CONFIG.clientSecret
    );
  }
}