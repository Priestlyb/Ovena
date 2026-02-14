// RootLayout.tsx
import "./lib/googleAuth";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { Redirect, usePathname } from "expo-router";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AuthGate>
          <Slot />
        </AuthGate>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { authStatus, signupRoute } = useAuth();
  const pathname = usePathname();

  if (authStatus === "booting") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const publicRoutes = ["/delivery-or-pickup", "/login", "/otp"];
  const isPublic = publicRoutes.some((r) => pathname.toLowerCase().startsWith(r));

  if (authStatus === "unauthenticated") {
    if (isPublic) return <>{children}</>;
    return <Redirect href="/delivery-or-pickup" />;
  }

  if (authStatus === "signup_pending") {
    if (signupRoute && pathname.startsWith(signupRoute)) return <>{children}</>;
    return <Redirect href={signupRoute ?? "/"} />;
  }

  if (authStatus === "guest") {
    if (pathname.startsWith("/(tabs)")) return <>{children}</>;
    return <Redirect href="/(tabs)/homepage" />;
  }

  if (authStatus === "authenticated") {
    if (pathname.startsWith("/(tabs)")) return <>{children}</>;
    return <Redirect href="/(tabs)/homepage" />;
  }

  return <>{children}</>;
}
