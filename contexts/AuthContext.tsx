import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { View, Text } from 'react-native';

// モック用のUser型定義
interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // モック: 初期化のみ
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // モック認証: 簡単なバリデーション
    if (email && password.length >= 6) {
      const mockUser: MockUser = {
        uid: 'mock-user-' + Date.now(),
        email: email,
        displayName: email.split('@')[0]
      };
      setUser(mockUser);
    } else {
      throw new Error('メールアドレスまたはパスワードが正しくありません');
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    // モック認証: 新規登録
    if (email && password.length >= 6) {
      const mockUser: MockUser = {
        uid: 'mock-user-' + Date.now(),
        email: email,
        displayName: displayName
      };
      setUser(mockUser);
    } else {
      throw new Error('入力内容に不備があります');
    }
  };

  const signInWithGoogle = async () => {
    // モック Google認証
    const mockUser: MockUser = {
      uid: 'mock-google-user-' + Date.now(),
      email: 'google.user@gmail.com',
      displayName: 'Google User'
    };
    setUser(mockUser);
    try {
      localStorage?.setItem('mockUser', JSON.stringify(mockUser));
    } catch (error) {
      console.log('Failed to save user');
    }
  };

  const logout = async () => {
    setUser(null);
  };

  const updateUserProfile = async (displayName: string) => {
    if (user) {
      const updatedUser = { ...user, displayName };
      setUser(updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}