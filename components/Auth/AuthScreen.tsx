import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LoginScreen } from './LoginScreen';
import { SignUpScreen } from './SignUpScreen';

export function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  const switchToSignUp = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <View style={styles.container}>
      {isLogin ? (
        <LoginScreen onSwitchToSignUp={switchToSignUp} />
      ) : (
        <SignUpScreen onSwitchToLogin={switchToLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});