import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AppViewport } from '@/src/components/AppViewport';
import { BottomSheetProvider, GlobalBottomSheetHost } from '@/src/components/BottomSheet';
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
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

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
          <BottomSheetProvider>
            <AppViewport>
              <Stack
                screenOptions={{
                  contentStyle: { backgroundColor: palette.bg },
                  headerShown: false,
                }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="auth/onboarding" />
                <Stack.Screen name="auth/index" />
                <Stack.Screen name="auth/register" />
                <Stack.Screen name="auth/forgot-password" />
                <Stack.Screen name="instrument/[id]" />
                <Stack.Screen name="order/[id]" />
                <Stack.Screen name="client/[id]" />
                <Stack.Screen name="account-details/[id]" />
              </Stack>
              <GlobalBottomSheetHost />
            </AppViewport>
            <ProductControlPanel />
          </BottomSheetProvider>
        </ToastProvider>
      </BrokerProvider>
    </ThemeProvider>
  );
}
