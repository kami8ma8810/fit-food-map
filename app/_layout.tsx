import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#ffffff',
          },
          headerTintColor: colorScheme === 'dark' ? '#ffffff' : '#1f2937',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="restaurant/[id]" 
          options={{ 
            title: '店舗詳細',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="menu/[id]" 
          options={{ 
            title: 'メニュー詳細',
            presentation: 'modal'
          }} 
        />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}