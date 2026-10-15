import React, { useState, useEffect, useRef } from "react";
import { useTheme, ThemeColors } from "@/constants/theme";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useAuth } from "@/context/AuthContext";
import { IconSymbol } from "@/components/ui/icon-symbol";

const BASE_URL = "https://ovena-backend-production.up.railway.app/api";

export default function ChangePhoneNumber() {
  const { accessToken } = useAuth();
  const theme = useTheme();
  const styles = createStyles(theme);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Countdown state for rate-limit
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (cooldown > 0) {
      intervalRef.current = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [cooldown]);

  // --- Phone Formatter Function ---
  const formatPhoneNumber = (input: string) => {
    let cleaned = input.trim().replace(/\D/g, ""); // remove non-digits

    if (cleaned.startsWith("0")) {
      // 08012345678 → +2348012345678
      return "+234" + cleaned.slice(1);
    } else if (cleaned.startsWith("234")) {
      // 2348012345678 → +2348012345678
      return "+" + cleaned;
    } else if (
      cleaned.startsWith("7") ||
      cleaned.startsWith("8") ||
      cleaned.startsWith("9")
    ) {
      // 7012345678 → +2347012345678
      return "+234" + cleaned;
    } else if (cleaned.startsWith("+234")) {
      return cleaned;
    } else {
      return null; // invalid
    }
  };

  const handleSendOtp = async () => {
    const formattedPhone = formatPhoneNumber(phone);
    if (!formattedPhone) {
      Toast.show({
        type: "error",
        text1: "Enter a valid Nigerian phone number",
      });
      return;
    }

    console.log("Sending OTP to:", formattedPhone);

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/accounts/send-otp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        body: JSON.stringify({ phone: formattedPhone }),
      });

      const data = await res.json();
      console.log("OTP Response:", data, "Status:", res.status);

      if (!res.ok) {
        const errorMessage =
          data?.error || data?.detail || data?.message || "Failed to send OTP";
        Toast.show({ type: "error", text1: errorMessage });

        if (res.status === 429) {
          const match = errorMessage.match(/(\d+)\s*minutes?/i);
          const waitTime = match ? parseInt(match[1], 10) * 60 : 10 * 60;
          setCooldown(waitTime);
        }
        return;
      }

      Toast.show({ type: "success", text1: "OTP sent successfully!" });
      router.push(`/auth/screens/ChangePhoneOtpScreen?phone=${formattedPhone}`);
      Keyboard.dismiss();
    } catch (error) {
      console.error("OTP Error:", error);
      Toast.show({
        type: "error",
        text1: "Something went wrong. Check console.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <IconSymbol
            name="ArrowLeftIcon"
            size={22}
            color={theme.textPrimary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Change Phone Number</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.description}>
          we’ll send a 4-digit verification code to this number.
        </Text>

        {/* Phone Input */}
        <View style={styles.phoneRow}>
          <View style={styles.countryBox}>
            <Text style={styles.flag}>🇳🇬</Text>
            <Text style={styles.code}>+234</Text>
          </View>

          <TextInput
            style={styles.phoneInput}
            placeholder="Phone number"
            placeholderTextColor={theme.textSecondary}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* Button */}
        <TouchableOpacity
          style={[styles.button, cooldown > 0 && { opacity: 0.6 }]}
          onPress={handleSendOtp}
          disabled={loading || cooldown > 0}
        >
          {loading ? (
            <ActivityIndicator color={theme.background} />
          ) : cooldown > 0 ? (
            <Text style={styles.buttonText}>
              Try again in{" "}
              {Math.floor(cooldown / 60)
                .toString()
                .padStart(2, "0")}
              :{(cooldown % 60).toString().padStart(2, "0")}
            </Text>
          ) : (
            <Text style={styles.buttonText}>Change Number</Text>
          )}
        </TouchableOpacity>
        <Toast />
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 60,
      backgroundColor: theme.background,
    },

    header: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },

    backButton: {
      padding: 10,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 50,
      backgroundColor: theme.surface,
    },

    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.textPrimary,
    },

    headerSpacer: {
      width: 34,
    },

    content: {
      paddingHorizontal: 30,
      paddingVertical: 10,
    },

    description: {
      marginBottom: 10,
      fontSize: 18,
      lineHeight: 30,
      color: theme.textSecondary,
    },

    phoneRow: {
      flexDirection: "row",
      marginTop: 20,
      gap: 10,
    },

    countryBox: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 10,
      gap: 6,
      backgroundColor: theme.surface,
    },

    flag: {
      fontSize: 18,
    },

    code: {
      fontWeight: "600",
      color: theme.textPrimary,
    },

    phoneInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 12,
      color: theme.textPrimary,
      backgroundColor: theme.surface,
    },

    button: {
      marginTop: 30,
      backgroundColor: theme.primary,
      padding: 15,
      borderRadius: 12,
      alignItems: "center",
    },

    buttonText: {
      fontSize: 20,
      color: theme.background,
      fontWeight: "bold",
    },
  });
