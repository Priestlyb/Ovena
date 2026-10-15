import React, { useState } from "react";
import {
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/constants/theme";
import type { ThemeColors } from "@/constants/theme";

export default function PersonalizedAdsScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [adsEnabled, setAdsEnabled] = useState(true);

  const toggleSwitch = () => setAdsEnabled((prev) => !prev);

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

        <Text style={styles.headerTitle}>Personalized Ads</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.description}>
          Your data helps us improve your experience and, when enabled, allows
          us to show you more relevant deals, offers, and promotions.
        </Text>

        <View style={styles.optionRow}>
          <View style={styles.leftSection}>
            <IconSymbol
              name="LogoThreads"
              size={22}
              color={theme.textPrimary}
            />

            <Text style={styles.optionText}>
              Receive special deals and promotions
            </Text>
          </View>

          <Switch
            value={adsEnabled}
            onValueChange={toggleSwitch}
            trackColor={{
              false: theme.border,
              true: theme.primary,
            }}
            thumbColor={theme.background}
            ios_backgroundColor={theme.border}
          />
        </View>
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
      borderWidth: 1,
      borderRadius: 50,
      borderColor: theme.border,
      backgroundColor: theme.surface,
    },

    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.textPrimary,
    },

    headerSpacer: {
      width: 42,
    },

    content: {
      paddingHorizontal: 30,
      paddingVertical: 10,
      gap: 24,
    },

    description: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.textSecondary,
    },

    optionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    leftSection: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingRight: 16,
    },

    optionText: {
      flex: 1,
      fontSize: 16,
      color: theme.textPrimary,
      lineHeight: 22,
    },
  });