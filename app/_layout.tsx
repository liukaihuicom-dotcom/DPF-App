import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AppViewport } from '@/src/components/AppViewport';
import { ProductControlPanel } from '@/src/components/ProductControlPanel';
import { ToastProvider } from '@/src/feedback/Toast';
import { ProductSettingsProvider, useProductSettings } from '@/src/settings/ProductSettings';
import { BrokerProvider } from '@/src/state/BrokerStore';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ProductSettingsProvider>
      <RootLayoutNav />
    </ProductSettingsProvider>
  );
}

function RootLayoutNav() {
  const { palette } = useProductSettings();

  return (
    <ThemeProvider
      value={{
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: palette.bg,
          border: palette.line,
          card: palette.panel,
          primary: palette.brand,
          text: palette.text,
        },
      }}>
      <BrokerProvider>
        <ToastProvider>
          <AppViewport>
            <Stack
              screenOptions={{
                contentStyle: { backgroundColor: palette.bg },
                headerShown: false,
              }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="auth/index" />
              <Stack.Screen name="auth/register" />
              <Stack.Screen name="auth/forgot-password" />
              <Stack.Screen name="instrument/[id]" />
              <Stack.Screen name="order/[id]" />
              <Stack.Screen name="client/[id]" />
            </Stack>
          </AppViewport>
          <ProductControlPanel />
        </ToastProvider>
      </BrokerProvider>
    </ThemeProvider>
  );
}
