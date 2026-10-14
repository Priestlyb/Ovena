/**
 * app/_layout.tsx
 *
 * Root layout. Provider nesting order matters:
 *
 *   SafeAreaProvider
 *     └─ AuthProvider        ← session must exist before AppData can fetch
 *          └─ AppDataProvider ← reads tokens from AuthContext
 *               └─ ThemeProvider
 *                    └─ RootNavigator (Stack + auth redirect guard)
 *
 * AuthProvider rehydrates the admin's session from AsyncStorage on launch.
 * AppDataProvider depends on AuthContext's isAuthenticated + access token
 * to decide whether to fetch dashboard data at all, and automatically
 * clears its cache when the admin logs out.
 * ThemeProvider reads the device colour scheme and stores any manual
 * override in AsyncStorage — see context/ThemeContext.tsx.
 *
 * RootNavigator is a small guard component rendered *inside* AuthProvider
 * (so it can call useAuth()) that redirects:
 *  - to /login whenever isAuthenticated is false and the admin isn't
 *    already somewhere in the "login" route
 *  - away from /login to the tab stack once isAuthenticated becomes true
 * It waits for `initializing` to resolve first, so it never redirects an
 * admin to login just because session rehydration hasn't finished yet.
 */

import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AppDataProvider }       from '@/context/AppDataContext';
import { ThemeProvider, useTheme }         from '@/context/ThemeContext';


export const unstable_settings = {
  anchor: '(tabs)',
};

const LOG_TAG = '[RootLayout]';

function RootNavigator() {
  const { isAuthenticated, initializing } = useAuth();
  const segments = useSegments();
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect until session rehydration has resolved — otherwise
    // every cold start would flash the login screen before the cached
    // session has a chance to apply.
    if (initializing) {
      console.log(`${LOG_TAG} ⏳ Still initializing auth — skipping redirect check`);
      return;
    }

    const inLoginRoute = segments[0] === 'login';

    if (!isAuthenticated && !inLoginRoute) {
      console.log(`${LOG_TAG} 🔒 Not authenticated — redirecting to /login`);
      router.replace('/login');
    } else if (isAuthenticated && inLoginRoute) {
      console.log(`${LOG_TAG} 🔓 Authenticated but on /login — redirecting to app`);
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, initializing, segments, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="users" />
      <Stack.Screen name="ops" />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppDataProvider>
          <ThemeProvider>
            <RootNavigator />
            {/* StatusBar is managed per-screen via ScreenWrapper; hide the root one */}
            <StatusBar style="auto" hidden />
          </ThemeProvider>
        </AppDataProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}