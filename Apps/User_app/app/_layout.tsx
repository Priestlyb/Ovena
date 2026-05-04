import "./lib/googleAuth";
import { Slot, Redirect, usePathname } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { CartProvider } from "@/context/CartContext";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <CartProvider>
          <AuthGate>
            <Slot />
          </AuthGate>
        </CartProvider>
      </AuthProvider>
      <Toast />
    </GestureHandlerRootView>
  );
}

/* ================= AUTH GATE ================= */
function AuthGate({ children }: { children: React.ReactNode }) {
  const { authStatus, guestUsage } = useAuth();
  const pathname = usePathname();

  /* ---------------- LOADING / BOOT ---------------- */
  if (authStatus === "booting") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#D9502E" />
      </View>
    );
  }

  /* ---------------- ROUTE FLAGS ---------------- */
  const publicRoutes = ["/", "/login", "/otp", "/delivery-or-pickup"];

  const isPublic =
    pathname === "/" ||
    pathname === "/login" ||
    pathname.startsWith("/otp") ||
    pathname.startsWith("/googleSignUpForm") ||
    pathname.startsWith("/delivery-or-pickup");

  const isOtpSignup = pathname.startsWith("/otpSignUpForm");
  const isGoogleSignup = pathname.startsWith("/googleSignUpForm");

  const isAuthPage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname.startsWith("/otp") ||
    pathname.startsWith("/googleSignUpForm");

  /* ---------------- UNAUTHENTICATED ---------------- */
  if (authStatus === "unauthenticated") {
    if (isPublic) return <>{children}</>;
    return <Redirect href="/login" />;
  }

  /* ---------------- OTP SIGNUP ---------------- */
  if (authStatus === "otp_signup") {
    if (isOtpSignup) return <>{children}</>;
    return <Redirect href="/otpSignUpForm" />;
  }

  /* ---------------- GOOGLE SIGNUP ---------------- */
  if (authStatus === "google_signup") {
    if (isGoogleSignup) return <>{children}</>;
    return <Redirect href="/googleSignUpForm" />;
  }

  /* ---------------- GUEST ---------------- */
  if (authStatus === "guest") {
    if (guestUsage >= 4) return <Redirect href="/login" />;

    // Redirect ONLY from auth pages
    if (isAuthPage) {
      return <Redirect href="/homepage" />;
    }

    return <>{children}</>;
  }

  /* ---------------- AUTHENTICATED ---------------- */
  if (authStatus === "authenticated") {
    // Prevent going back to login/signup screens
    if (isAuthPage) {
      return <Redirect href="/homepage" />;
    }

    return <>{children}</>;
  }

  /* ---------------- DEFAULT ---------------- */
  return <Redirect href="/login" />;
}
