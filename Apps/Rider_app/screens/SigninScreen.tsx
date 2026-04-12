// screens/SignInScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  Alert, ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconSymbol } from "../components/ui/icon-symbol";
import { PhoneInput } from "../components/FormInput";
import { driverLogin } from "../services/signupApi";
import { useAppData } from "../context/appDataContext";

// ── DEV TOGGLE ───────────────────────────────────────────────────────────────
// true  → skip API, jump straight to HomeScreen
// false → real sign-in flow
const DEV_BYPASS_AUTH = false;

type RootStackParamList = {
  Login_SignUp: undefined;
  SignIn:       undefined;
  HomeScreen:   undefined;
};

type SignInNavProp = NativeStackNavigationProp<RootStackParamList, "SignIn">;

const SignIn = () => {
  const navigation      = useNavigation<SignInNavProp>();
  const { refresh }     = useAppData();

  const [fullPhone, setFullPhone]       = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    if (loginSuccess) {
      navigation.reset({ index: 0, routes: [{ name: "HomeScreen" }] });
    }
  }, [loginSuccess]);

  const handleSignIn = async () => {
    if (DEV_BYPASS_AUTH) {
      console.log("⚠️  DEV_BYPASS_AUTH is ON — skipping real sign-in");
      // Still trigger a data refresh so screens get real data if a token exists
      refresh();
      setLoginSuccess(true);
      return;
    }

    if (!fullPhone.trim()) {
      Alert.alert("Missing Phone Number", "Please enter your phone number.");
      return;
    }
    if (!password) {
      Alert.alert("Missing Password", "Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const { access, refresh: refreshToken } = await driverLogin(fullPhone.trim(), password);
      console.log("🔑 Tokens received:", access);

      // Persist tokens first
      await AsyncStorage.setItem("accessToken", access);
      await AsyncStorage.setItem("refreshToken", refreshToken);

      // Kick off data fetch in background — don't await so navigation isn't blocked
      refresh();

      setLoginSuccess(true);
    } catch (err: any) {
      setLoading(false);
      Alert.alert("Sign-in Failed", err.message ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
        disabled={loading}
      >
        <IconSymbol name="ArrowLeft" size={24} color="#000000" />
      </TouchableOpacity>

      <Text style={styles.title}>Sign In</Text>

      {DEV_BYPASS_AUTH && (
        <View style={styles.devBadge}>
          <Text style={styles.devBadgeText}>⚠️ DEV — auth bypassed</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <View style={styles.phoneWrapper}>
          <Text style={styles.phoneLabel}>Phone Number</Text>
          <PhoneInput
            value=""
            onChange={(full) => setFullPhone(full)}
            placeholder="Phone number"
          />
        </View>

        <View style={styles.passwordWrapper}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Password"
            placeholderTextColor="#A0A0A0"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword
              ? <IconSymbol name="EyeInvisibleIcon" size={24} color="#000000" />
              : <IconSymbol name="EyeIcon"          size={24} color="#000000" />
            }
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.forgotButton} disabled={loading}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#000" />
          : <Text style={styles.buttonText}>
              {DEV_BYPASS_AUTH ? "Skip to Home (dev)" : "Sign In"}
            </Text>
        }
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "#F9F9FB", padding: 24, justifyContent: "center",
  },
  backBtn: { marginBottom: 16 },
  title: { fontSize: 32, fontWeight: "700", color: "#1B1B1F", marginBottom: 8 },
  devBadge: {
    alignSelf: "flex-start", backgroundColor: "#FFF3CD",
    borderWidth: 1, borderColor: "#FFCA28", borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4, marginBottom: 16,
  },
  devBadgeText: { fontSize: 12, fontWeight: "600", color: "#7A5800" },
  inputContainer: { marginBottom: 24 },
  phoneWrapper: { marginBottom: 16 },
  phoneLabel: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 8 },
  input: {
    backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 14,
    borderRadius: 12, fontSize: 16, marginBottom: 16,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1, color: "#000",
  },
  passwordWrapper: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 12, paddingRight: 8,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  eyeButton: { paddingHorizontal: 8 },
  button: {
    backgroundColor: "#efeded", paddingVertical: 16,
    borderRadius: 50, alignItems: "center", marginBottom: 12,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#000", fontSize: 16, fontWeight: "600" },
  forgotButton: { alignSelf: "flex-start", marginBottom: 24 },
  forgotText: { color: "#D44C0C", fontSize: 14 },
});