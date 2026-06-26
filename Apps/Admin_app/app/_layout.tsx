/**
 * app/_layout.tsx
 *
 * Root layout. Provider nesting order matters:
 *
 *   SafeAreaProvider
 *     └─ AuthProvider        ← session must exist before AppData can fetch
 *          └─ AppDataProvider ← reads tokens from AuthContext
 *               └─ ThemeProvider
 *                    └─ Stack (navigation)
 *
 * AuthProvider rehydrates the admin's session from AsyncStorage on launch.
 * AppDataProvider depends on AuthContext's access token to fetch dashboard
 * data, and automatically clears its cache when the admin logs out.
 * ThemeProvider reads the device colour scheme and stores any manual
 * override in AsyncStorage — see context/ThemeContext.tsx.
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { AuthProvider }     from '@/context/AuthContext';
import { AppDataProvider }  from '@/context/AppDataContext';
import { ThemeProvider }    from '@/context/ThemeContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppDataProvider>
          <ThemeProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="login"     />
              <Stack.Screen name="(tabs)"   />
              <Stack.Screen name="profile" />
              <Stack.Screen name="support"   />
              <Stack.Screen name="modal"    options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            {/* StatusBar is managed per-screen via ScreenWrapper; hide the root one */}
            <StatusBar style="auto" hidden />
          </ThemeProvider>
        </AppDataProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}