import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Animated,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useOtpLogin } from "@/hooks/useOtpLogin";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useAppleAuth } from "@/hooks/useAppleAuth";
import { useGuestAuth } from "@/hooks/useGuestAuth";
import PhoneInput from "@/components/PhoneInput";

const ORANGE = "#E4572E";

export default function Login() {
  const [phone, setPhone] = useState("");

  const otp = useOtpLogin({ phone });
  const google = useGoogleAuth();
  const apple = useAppleAuth();
  const guest = useGuestAuth();

  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  /* Apple Button Component */
  const AppleButton = () => {
    const AppleAuthentication = require("expo-apple-authentication");
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={
          AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
        }
        buttonStyle={
          AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
        }
        cornerRadius={14}
        style={{ height: 50, marginHorizontal: 20, marginTop: 10 }}
        onPress={apple.login}
      />
    );
  };

  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Image
            source={require("../../assets/images/loginLogo.png")}
            style={{ width: 150, height: 150 }}
          />
          <Image
            source={require("../../assets/images/loginBanner.png")}
            style={styles.loginBanner}
          />

          {/* Guest Button */}
          <TouchableOpacity style={styles.guestBtn} onPress={guest.login}>
            {guest.loading ? (
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

        {/* Welcome Text */}
        <Text style={styles.welcome}>Welcome</Text>
        <Text style={styles.subText}>Let’s start with your phone number</Text>

        {/* Phone Input */}
        <View style={styles.phoneRow}>
          <PhoneInput value={phone} onChange={setPhone} />
        </View>

        {/* Get SMS Button */}
        <TouchableOpacity
          style={styles.smsBtn}
          onPress={() => otp.sendOtp()}
          disabled={otp.sending}
        >
          {otp.sending ? (
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <ActivityIndicator color="#fff" />
            </Animated.View>
          ) : (
            <Text style={styles.smsText}>Get SMS</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.orText}>or with</Text>
          <View style={styles.line} />
        </View>

        {/* Social Buttons */}
        <TouchableOpacity
          style={styles.socialBtn}
          onPress={google.login}
          disabled={google.loading}
        >
          {google.loading ? (
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

        {Platform.OS === "ios" && <AppleButton />}

        {/* Terms */}
        <Text style={styles.terms}>
          By continuing you accept our <Text style={styles.link}>Terms</Text>{" "}
          and <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </View>
  );
}

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