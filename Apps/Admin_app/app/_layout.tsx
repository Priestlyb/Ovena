/**
 * app/_layout.tsx
 *
 * Root layout. Wraps the entire app in ThemeProvider and SafeAreaProvider so
 * every screen and component can access theme tokens and safe-area insets.
 *
 * The ThemeProvider reads the device colour scheme automatically and stores
 * any manual override in AsyncStorage — see context/ThemeContext.tsx.
 *
 * Navigation uses Expo Router's Stack with a single (tabs) entry point.
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { ThemeProvider } from '@/context/ThemeContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)"    options={{ headerShown: false }} />
          <Stack.Screen name="profile"   options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="support"   options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="coupons"   options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="spinwheel" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="modal"     options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        {/* StatusBar is managed per-screen via ScreenWrapper; hide the root one */}
        <StatusBar style="auto" hidden />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}