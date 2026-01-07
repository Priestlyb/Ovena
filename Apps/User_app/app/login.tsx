import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as AppleAuthentication from "expo-apple-authentication";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

/* =========================
   CONSTANTS
========================= */
const BASE_URL = "https://ovena-backend-production.up.railway.app/api";
const ORANGE = "#E4572E";

const GOOGLE_ANDROID_CLIENT_ID =
  "759419359264-ecignvcfoa2e6o6m2bodoval53dmpgq7.apps.googleusercontent.com";
const GOOGLE_WEB_CLIENT_ID =
  "759419359264-l64jb3cv965csakroir36hqska36vrpf.apps.googleusercontent.com";

/* =========================
   REDIRECT URI (EXPO PROXY)
========================= */
const redirectUri = AuthSession.makeRedirectUri({
  useProxy: true,
});

export default function Login() {
  const { loginWithOtp, loginAsGuest } = useAuth();

  const [phone, setPhone] = useState("");
  const [loadingSMS, setLoadingSMS] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingApple, setLoadingApple] = useState(false);
  const [loadingGuest, setLoadingGuest] = useState(false);

  /* =========================
     SPIN ANIMATION
  ========================== */
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  /* =========================
     GOOGLE AUTH
  ========================== */
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
    scopes: ["profile", "email"],
    responseType: "code",
    usePKCE: true,
    redirectUri,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const code = response.params?.code;
      const verifier = request?.codeVerifier;

      if (!code || !verifier) {
        Alert.alert("Google Login Error", "Invalid OAuth response");
        setLoadingGoogle(false);
        return;
      }

      exchangeOAuthCode("google", code, verifier).finally(() =>
        setLoadingGoogle(false)
      );
    }

    if (response?.type === "error") {
      Alert.alert("Google Login Error", "Authentication failed");
      setLoadingGoogle(false);
    }
  }, [response]);

  /* =========================
     BACKEND OAUTH EXCHANGE
  ========================== */
  const exchangeOAuthCode = async (
    provider: "google" | "apple",
    code: string,
    codeVerifier?: string,
    idToken?: string
  ) => {
    try {
      const body: any = { provider };

      if (provider === "google") {
        body.code = code;
        body.code_verifier = codeVerifier;
      }

      if (provider === "apple") {
        body.code = code;
        body.id_token = idToken;
      }

      const res = await fetch(`${BASE_URL}/accounts/oauth/exchange/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "OAuth failed");

      await loginWithOtp(
        data.access_token,
        data.refresh_token,
        data.is_new_user,
        data.phone_number ?? ""
      );
    } catch (err) {
      Alert.alert(
        "Login Error",
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  };

  /* =========================
     PHONE OTP
  ========================== */
  const handleSendOtp = async () => {
    if (!phone.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }

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

      router.push({
        pathname: "/screens/Otp",
        params: { phone: fullPhone },
      });
    } catch (err) {
      Alert.alert(
        "Error",
        err instanceof Error ? err.message : "OTP failed"
      );
    } finally {
      setLoadingSMS(false);
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
            source={require("../assets/images/loginLogo.png")}
            style={{ width: 150, height: 150 }}
          />
          <Image
            source={require("../assets/images/loginBanner.png")}
            style={styles.loginBanner}
          />

          <TouchableOpacity
            style={styles.guestBtn}
            onPress={async () => {
              setLoadingGuest(true);
              await loginAsGuest();
              setLoadingGuest(false);
            }}
          >
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

        <View style={styles.promoCard}>
          <Image
            source={require("../assets/images/Deliveryguy.png")}
            style={{ width: 54, height: 59 }}
          />
          <View>
            <Text style={styles.promoTitle}>
              First order with free delivery!
            </Text>
            <Text style={styles.promoSub}>For new customers only</Text>
          </View>
        </View>

        <Text style={styles.welcome}>Welcome</Text>
        <Text style={styles.subText}>
          Let’s start with your phone number
        </Text>

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

        <TouchableOpacity
          style={styles.socialBtn}
          disabled={!request || loadingGoogle}
          onPress={() => {
            setLoadingGoogle(true);
            promptAsync();
          }}
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
        </TouchableOpacity>

        {Platform.OS === "ios" && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={
              AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
            }
            buttonStyle={
              AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
            }
            cornerRadius={14}
            style={{ height: 50, marginHorizontal: 20 }}
            onPress={async () => {
              try {
                setLoadingApple(true);
                const cred = await AppleAuthentication.signInAsync({
                  requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                  ],
                });

                if (cred.authorizationCode) {
                  await exchangeOAuthCode(
                    "apple",
                    cred.authorizationCode,
                    undefined,
                    cred.identityToken ?? undefined
                  );
                }
              } catch (err: any) {
                if (err?.code !== "ERR_CANCELED") {
                  Alert.alert("Apple Login Error", err.message);
                }
              } finally {
                setLoadingApple(false);
              }
            }}
          />
        )}

        <Text style={styles.terms}>
          By continuing you accept our{" "}
          <Text style={styles.link}>Terms</Text> and{" "}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </View>
  );
}

/* =========================
   STYLES (UNCHANGED)
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
  promoCard: {
    backgroundColor: ORANGE,
    marginHorizontal: 20,
    marginTop: 50,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    gap: 12,
  },
  promoTitle: { fontSize: 18, color: "#fff", fontWeight: "700" },
  promoSub: { color: "#FBE3D8" },
  welcome: { fontSize: 24, fontWeight: "700", marginTop: 30, textAlign: "center" },
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
  terms: {
    fontSize: 11,
    color: "#777",
    textAlign: "center",
    marginTop: 10,
  },
  link: { color: ORANGE },
});
