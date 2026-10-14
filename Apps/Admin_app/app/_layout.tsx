/**
 * app/_layout.tsx
 *
 * Root layout. Provider nesting order matters:
 *
 *   SafeAreaProvider
 *     └─ AuthProvider        ← session must exist before AppData/WS can fetch
 *          └─ AppDataProvider ← reads tokens from AuthContext
 *               └─ AdminOrdersWebSocketProvider ← also reads tokens from
 *                    │                             AuthContext; one shared
 *                    │                             /ws/admin/orders/
 *                    │                             connection for every
 *                    │                             screen (dashboard,
 *                    │                             failure_points,
 *                    │                             notifications, etc.)
 *                    └─ ThemeProvider
 *                         ├─ RootNavigator (Stack + auth redirect guard)
 *                         └─ NotificationToast ← mounted ONCE here, not
 *                              per-screen, since notifications aren't
 *                              screen-specific (see component header)
 *
 * AuthProvider rehydrates the admin's session from AsyncStorage on launch.
 * AppDataProvider depends on AuthContext's isAuthenticated + access token
 * to decide whether to fetch dashboard data at all, and automatically
 * clears its cache when the admin logs out.
 * AdminOrdersWebSocketProvider depends on the same access token to open
 * (or close) the admin WS connection, and now also owns notification
 * history + the toast queue — see
 * context/AdminOrdersWebSocketContext.tsx.
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

import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppDataProvider } from "@/context/AppDataContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AdminOrdersWebSocketProvider } from "@/context/AdminOrdersWebSocketContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { NotificationToast } from "@/components/NotificationToast";

export const unstable_settings = {
  anchor: "(tabs)",
};

const LOG_TAG = "[RootLayout]";

function RootNavigator() {
  const { isAuthenticated, initializing } = useAuth();
  const segments = useSegments();
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (initializing) {
      console.log(
        `${LOG_TAG} ⏳ Still initializing auth — skipping redirect check`,
      );
      return;
    }

    const inLoginRoute = segments[0] === "login";

    if (!isAuthenticated && !inLoginRoute) {
      console.log(`${LOG_TAG} 🔒 Not authenticated — redirecting to /login`);
      router.replace("/login");
    } else if (isAuthenticated && inLoginRoute) {
      console.log(
        `${LOG_TAG} 🔓 Authenticated but on /login — redirecting to app`,
      );
      router.replace("/(tabs)");
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
      <Stack.Screen name="orders/active" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppDataProvider>
          <AdminOrdersWebSocketProvider>
            <ThemeProvider>
              <RootNavigator />
              <NotificationToast />
              {/* StatusBar is managed per-screen via ScreenWrapper; hide the root one */}
              <StatusBar style="auto" hidden />
            </ThemeProvider>
          </AdminOrdersWebSocketProvider>
        </AppDataProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}