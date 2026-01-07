import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack, Redirect, usePathname, useRouter } from "expo-router";
import { ActivityIndicator, View, Alert } from "react-native";
import { AuthProvider, useAuth } from "@/context/AuthContext";

/* =========================
   AUTH GATE
========================= */
function AuthGate() {
  const {
    accessToken,
    isOtpVerified,
    isNewUser,
    loading,
    logout, // <-- make sure your AuthContext exposes a logout function
  } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Public routes allowed without login
  const publicRoutes = [
    "/delivery-or-pickup",
    "/login",
    "/screens/Otp",
    "/screens/SignUpForm",
  ];

  /* -------------------------
     AUTO LOGOUT IF TOKEN EXPIRED
  -------------------------- */
  useEffect(() => {
    if (!accessToken) return;

    // Replace this with your actual token expiration check
    const checkTokenValidity = () => {
      try {
        const tokenExp = parseJwt(accessToken).exp * 1000; // JWT exp is in seconds
        if (Date.now() > tokenExp) {
          logout();
          Alert.alert("Session Expired", "Please login again.");
          router.replace("/login");
        }
      } catch (err) {
        console.log("Failed to parse token:", err);
        logout();
        router.replace("/login");
      }
    };

    const interval = setInterval(checkTokenValidity, 60 * 1000); // check every 1 min
    checkTokenValidity(); // check immediately on mount

    return () => clearInterval(interval);
  }, [accessToken]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 1️⃣ Not logged in
  if (!accessToken) {
    if (!publicRoutes.includes(pathname)) {
      return <Redirect href="/delivery-or-pickup" />;
    }
    return null;
  }

  // 2️⃣ Logged in but OTP not verified
  if (!isOtpVerified) {
    if (pathname !== "/screens/Otp") {
      return <Redirect href="/screens/Otp" />;
    }
    return null;
  }

  // 3️⃣ New user after OTP
  if (isNewUser) {
    if (pathname !== "/screens/SignUpForm") {
      return <Redirect href="/screens/SignUpForm" />;
    }
    return null;
  }

  // 4️⃣ Fully authenticated user
  if (!pathname.startsWith("/(tabs)")) {
    return <Redirect href="/(tabs)/homepage" />;
  }

  return null;
}

/* =========================
   ROOT LAYOUT
========================= */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AuthLayout />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

/* =========================
   AUTH-AWARE STACK
========================= */
function AuthLayout() {
  const { loading } = useAuth();

  // 🚫 Prevent Stack mounting before auth is ready
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <AuthGate />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="delivery-or-pickup" />
        <Stack.Screen name="login" />
        <Stack.Screen name="screens/Otp" />
        <Stack.Screen name="screens/SignUpForm" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

/* =========================
   HELPER: PARSE JWT
========================= */
function parseJwt(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}
