import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Animated,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";

const BASE_URL = "https://ovena-backend-production.up.railway.app/api";
const ORANGE = "#E4572E";

export default function Login() {
  const router = useRouter();
  const { loginWithOtp, loginWithOAuth, loginAsGuest } = useAuth();

  const [phone, setPhone] = useState("");
  const [loadingSMS, setLoadingSMS] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingApple, setLoadingApple] = useState(false);
  const [loadingGuest, setLoadingGuest] = useState(false);

  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  /* ---------------------------
     Phone OTP
  ---------------------------- */
  const handleSendOtp = async () => {
    if (!phone.trim())
      return Alert.alert("Error", "Please enter your phone number");

    const fullPhone = `+234${phone.replace(/^0/, "")}`;

    try {
      setLoadingSMS(true);

      const res = await fetch(`${BASE_URL}/accounts/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: fullPhone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "OTP failed");

      // Navigate to OTP verification screen
      router.push(`/Otp?phone=${fullPhone}`);
    } catch (err: any) {
      Alert.alert("Error", err.message || "OTP failed");
    } finally {
      setLoadingSMS(false);
    }
  };

  /* ---------------------------
     Google login
---------------------------- */
  const handleGoogleLogin = async () => {
    try {
      setLoadingGoogle(true);

      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();

      console.log("✅ Google Raw Result:", result);

      const idToken =
        result?.data?.idToken;

      console.log("🔑 Extracted ID Token:", idToken);

      if (!idToken) throw new Error("Google ID token missing");

      // 🚀 GO TO SIGNUP FORM WITH TOKEN
      router.push({
        pathname: "/GoogleSignUpForm",
        params: { idToken },
      });
    } catch (err: any) {
      console.log("❌ Google Login Error FULL:", err);

      Alert.alert("Google Login Error", err.message || "Something went wrong");
    } finally {
      setLoadingGoogle(false);
    }
  };

  /* ---------------------------
     Apple login
  ---------------------------- */
  const handleAppleLogin = async () => {
    try {
      setLoadingApple(true);

      const cred = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        ],
      });

      if (!cred.identityToken) throw new Error("Apple ID token missing");

      const res = await fetch(`${BASE_URL}/accounts/oauth/exchange/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "apple", code: cred.identityToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Apple OAuth failed");

      await loginWithOAuth(
        "apple",
        data.access,
        data.refresh,
        data.is_new_user,
      );
      // AuthGate will redirect automatically
    } catch (err: any) {
      if (err?.code !== "ERR_CANCELED") {
        Alert.alert("Apple Login Error", err.message || "Sign-in failed");
      }
    } finally {
      setLoadingApple(false);
    }
  };

  /* ---------------------------
     Guest login
  ---------------------------- */
  const handleGuestLogin = async () => {
    try {
      setLoadingGuest(true);
      await loginAsGuest();
      // AuthGate can handle redirect if you set guest flow
    } finally {
      setLoadingGuest(false);
    }
  };

  /* =========================
     UI
  ========================== */
  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Image
            source={require("../../assets/images/loginLogo.png")}
            style={{ width: 150, height: 150 }}
          />
          <Image
            source={require("../../assets/images/loginBanner.png")}
            style={styles.loginBanner}
          />

          <TouchableOpacity style={styles.guestBtn} onPress={handleGuestLogin}>
            {loadingGuest ? (
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <ActivityIndicator color="#000" />
              </Animated.View>
            ) : (
              <>
                <Text style={styles.guestText}>Continue as Guest</Text>
                <Ionicons name="arrow-forward" size={16} />
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.welcome}>Welcome</Text>
        <Text style={styles.subText}>Let’s start with your phone number</Text>

        <View style={styles.phoneRow}>
          <View style={styles.countryBox}>
            <Text style={styles.flag}>🇳🇬</Text>
            <Text style={styles.code}>+234</Text>
          </View>
          <TextInput
            style={styles.phoneInput}
            placeholder="Phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TouchableOpacity
          style={styles.smsBtn}
          onPress={handleSendOtp}
          disabled={loadingSMS}
        >
          {loadingSMS ? (
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <ActivityIndicator color="#fff" />
            </Animated.View>
          ) : (
            <Text style={styles.smsText}>Get SMS</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.orText}>or with</Text>
          <View style={styles.line} />
        </View>

        {/* <TouchableOpacity
          style={styles.socialBtn}
          onPress={handleGoogleLogin}
          disabled={loadingGoogle}
        >
          {loadingGoogle ? (
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <ActivityIndicator />
            </Animated.View>
          ) : (
            <>
              <Ionicons name="logo-google" size={20} />
              <Text style={styles.socialText}>Google</Text>
            </>
          )}
        </TouchableOpacity> */}

        {Platform.OS === "ios" && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={
              AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
            }
            buttonStyle={
              AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
            }
            cornerRadius={14}
            style={{ height: 50, marginHorizontal: 20, marginTop: 10 }}
            onPress={handleAppleLogin}
          />
        )}

        <Text style={styles.terms}>
          By continuing you accept our <Text style={styles.link}>Terms</Text>{" "}
          and <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </View>
  );
}

/* =========================
   STYLES
========================= */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { paddingBottom: 30 },
  hero: {
    backgroundColor: ORANGE,
    height: 375,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  loginBanner: { position: "absolute", width: "100%" },
  guestBtn: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#FBE3D8",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  guestText: { fontWeight: "600" },
  welcome: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 30,
    textAlign: "center",
  },
  subText: { color: "#666", textAlign: "center" },
  phoneRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 20,
    gap: 10,
  },
  countryBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 10,
    gap: 6,
  },
  flag: { fontSize: 18 },
  code: { fontWeight: "600" },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  smsBtn: {
    backgroundColor: "#000",
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  smsText: { color: "#fff", fontWeight: "700" },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 20,
    gap: 10,
  },
  line: { flex: 1, height: 1, backgroundColor: "#ddd" },
  orText: { color: "#777", fontSize: 12 },
  socialBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    alignItems: "center",
  },
  socialText: { fontWeight: "600" },
  terms: { fontSize: 11, color: "#777", textAlign: "center", marginTop: 10 },
  link: { color: ORANGE },
});
