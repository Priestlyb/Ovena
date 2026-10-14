// App.tsx
import "react-native-gesture-handler"; // ✅ MUST be first

import React, { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Animated, Dimensions, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemeProvider } from "./context/ThemeContext";
import { AppDataProvider } from "./context/appDataContext";

import Login_SignUp from "./screens/Login_SignUp";
import TermsScreen from "./screens/TermsScreen";
import Signup from "./screens/SignupScreen";
import Signin from "./screens/SigninScreen";
import HomeScreen from "./screens/HomeScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";

// ── Navigation types ──────────────────────────────────────────────────────────

type RootStackParamList = {
  Splash:       undefined;
  Login_SignUp: undefined;
  TermsScreen:  undefined;
  Signup:       undefined;
  SignIn:        undefined;
  HomeScreen:   undefined;
  ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
type SplashProps = NativeStackScreenProps<RootStackParamList, "Splash">;

const { width } = Dimensions.get("window");

// ── Token validation ──────────────────────────────────────────────────────────
// Decode the JWT payload (no verification — just check the exp field).
// If the stored access token is still valid, the user goes straight to HomeScreen.

function isTokenValid(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    // atob isn't available in all RN versions — use Buffer or manual base64
    const payload = JSON.parse(
      decodeURIComponent(
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    );
    if (!payload.exp) return false;
    // Give a 30-second buffer so we don't navigate then immediately get a 401
    return payload.exp * 1000 > Date.now() + 30_000;
  } catch {
    return false;
  }
}

// ── Splash screen ─────────────────────────────────────────────────────────────

function SplashScreen({ navigation }: SplashProps) {
  const scaleAnim     = useRef(new Animated.Value(0.5)).current;
  const opacityAnim   = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Run logo animation, then decide where to navigate
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1, friction: 4, tension: 50, useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1, duration: 1000, useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0, duration: 1000, useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.05, duration: 200, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1,    duration: 200, useNativeDriver: true }),
      ]),
    ]).start(async () => {
      // Check for a valid stored token
      const token = await AsyncStorage.getItem("accessToken");
      if (token && isTokenValid(token)) {
        // Valid token → skip auth screens and go straight home
        navigation.replace("HomeScreen");
      } else {
        // No token or expired → clear stale tokens and go to auth
        await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
        navigation.replace("Login_SignUp");
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("./assets/bright_logo.png")}
        style={[
          styles.image,
          {
            transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
            opacity: opacityAnim,
          },
        ]}
        resizeMode="contain"
      />
      <StatusBar style="light" />
    </View>
  );
}

// ── App root ──────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppDataProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Splash"       component={SplashScreen} />
              <Stack.Screen name="Login_SignUp" component={Login_SignUp} />
              <Stack.Screen name="TermsScreen"  component={TermsScreen} />
              <Stack.Screen name="Signup"       component={Signup} />
              <Stack.Screen name="SignIn"       component={Signin} />
              <Stack.Screen name="HomeScreen"   component={HomeScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </AppDataProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D44C0C",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
  },
});