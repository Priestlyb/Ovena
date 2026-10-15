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
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/constants/theme";

import { useOtpLogin } from "@/hooks/signup/useOtpLogin";
import { useGoogleAuth } from "@/hooks/signup/useGoogleAuth";
import { useAppleAuth } from "@/hooks/signup/useAppleAuth";

import PhoneInput from "@/components/PhoneInput";
import { router } from "expo-router";

export default function Login() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [phone, setPhone] = useState("");

  const otp = useOtpLogin({ phone });
  const google = useGoogleAuth();
  const apple = useAppleAuth();

  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ).start();
  }, [spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  /* Apple Button Component */
  const AppleButton = () => {
    const AppleAuthentication = require("expo-apple-authentication");

    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={
          theme.background === "#FFFFFF"
            ? AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
            : AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
        }
        cornerRadius={14}
        style={{
          height: 50,
          marginHorizontal: 20,
          marginTop: 10,
        }}
        onPress={apple.login}
      />
    );
  };

  return (
    <View style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.hero}>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push("/FoodDeliveryChoiceScreen")}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <Image
              source={require("../../assets/images/loginLogo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Image
              source={require("../../assets/images/loginBanner.png")}
              style={styles.loginBanner}
              resizeMode="cover"
            />
          </View>

          {/* Ad banner */}
          <View style={styles.AdContainer}>
            <View style={styles.AdHolder}>
              <Image
                source={require("../../assets/images/Deliveryguy.png")}
                style={styles.AdImage}
                resizeMode="cover"
              />

              <View style={styles.AdTextContainer}>
                <Text style={styles.AdText}>
                  First order with free delivery!
                </Text>

                <Text style={styles.AdSubText}>For new customers only</Text>
              </View>
            </View>
          </View>

          {/* Welcome Text */}
          <Text style={styles.welcome}>Welcome</Text>

          <Text style={styles.subText}>Let's start with your phone number</Text>

          {/* Phone Input */}
          <View style={styles.phoneRow}>
            <PhoneInput value={phone} onChange={setPhone} />
          </View>

          {/* Get SMS Button */}
          <TouchableOpacity
            style={styles.smsBtn}
            onPress={() => otp.sendOtp()}
            disabled={otp.sending}
            activeOpacity={0.85}
          >
            {otp.sending ? (
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <ActivityIndicator color="#FFFFFF" />
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

          {/* Google */}
          <TouchableOpacity
            style={styles.socialBtn}
            onPress={google.login}
            disabled={google.loading}
            activeOpacity={0.85}
          >
            {google.loading ? (
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <ActivityIndicator color={theme.primary} />
              </Animated.View>
            ) : (
              <>
                <Ionicons
                  name="logo-google"
                  size={20}
                  color={theme.textPrimary}
                />

                <Text style={styles.socialText}>Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Apple */}
          {Platform.OS === "ios" && <AppleButton />}

          {/* Terms */}
          <Text style={styles.terms}>
            By continuing you accept our{" "}
            <Text
              style={styles.link}
              onPress={() => router.push("/ourPoliciesPage")}
            >
              Terms
            </Text>{" "}
            and{" "}
            <Text
              style={styles.link}
              onPress={() => router.push("/ourPoliciesPage")}
            >
              Privacy Policy
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.background,
    },

    keyboardView: {
      flex: 1,
    },

    container: {
      paddingBottom: 30,
      gap: 10,
      backgroundColor: theme.background,
    },

    hero: {
      backgroundColor: theme.primary,
      height: 375,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
    },

    /*
     * Back button
     */
    backButton: {
      position: "absolute",
      top: Platform.OS === "ios" ? 58 : 50,
      left: 20,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "rgba(0, 0, 0, 0.25)",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
    },

    logo: {
      width: 150,
      height: 150,
      zIndex: 2,
    },

    loginBanner: {
      position: "absolute",
      width: "100%",
      height: "100%",
    },

    AdContainer: {
      marginTop: 25,
      alignItems: "center",
      width: "100%",
    },

    AdHolder: {
      width: "90%",
      minHeight: 110,
      paddingHorizontal: 18,
      paddingVertical: 16,
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 20,
      backgroundColor: "#D9502E",
      gap: 15,
    },

    AdImage: {
      width: 65,
      height: 65,
      flexShrink: 0,
      transform: [{ scaleX: -1 }],
    },

    AdTextContainer: {
      flex: 1,
      minWidth: 0,
    },

    AdText: {
      fontSize: 18,
      lineHeight: 23,
      fontWeight: "800",
      color: "#FFFFFF",
    },

    AdSubText: {
      marginTop: 4,
      fontSize: 14,
      lineHeight: 19,
      fontWeight: "300",
      color: "#FFFFFF",
    },

    welcome: {
      fontSize: 24,
      fontWeight: "700",
      marginTop: 30,
      textAlign: "center",
      color: theme.textPrimary,
    },

    subText: {
      color: theme.textSecondary,
      textAlign: "center",
      fontSize: 15,
    },

    phoneRow: {
      flexDirection: "row",
      marginHorizontal: 20,
      marginTop: 20,
      gap: 10,
    },

    smsBtn: {
      backgroundColor: theme.primary,
      marginHorizontal: 20,
      marginTop: 20,
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },

    smsText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 16,
    },

    dividerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 20,
      marginVertical: 20,
      gap: 10,
    },

    line: {
      flex: 1,
      height: 1,
      backgroundColor: theme.border,
    },

    orText: {
      color: theme.textSecondary,
      fontSize: 12,
    },

    socialBtn: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      marginHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 14,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    },

    socialText: {
      fontWeight: "600",
      color: theme.textPrimary,
    },

    terms: {
      fontSize: 11,
      color: theme.textSecondary,
      textAlign: "center",
      marginTop: 10,
      paddingHorizontal: 20,
      lineHeight: 18,
    },

    link: {
      color: theme.primary,
      fontWeight: "600",
    },
  });
