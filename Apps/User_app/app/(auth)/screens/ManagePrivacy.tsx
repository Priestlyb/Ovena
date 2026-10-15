import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/constants/theme";
import type { ThemeColors } from "@/constants/theme";

export default function ManagePrivacy() {
  const theme = useTheme();
  const styles = createStyles(theme);

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

        <Text style={styles.headerTitle}>Manage Privacy</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Privacy Options */}
      <TouchableOpacity
        onPress={() => router.push("/(auth)/screens/PersonalizedAdsScreen")}
        activeOpacity={0.7}
      >
        <View style={styles.row}>
          <View style={styles.leftSection}>
            <IconSymbol
              name="SettingsIcon"
              size={24}
              color={theme.textPrimary}
            />

            <Text style={styles.rowText}>Personalized Ads</Text>
          </View>

          <IconSymbol
            name="ChevronRightIcon"
            size={20}
            color={theme.textSecondary}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push("/screens/ThemeScreen")}
      >
        <View style={styles.row}>
          <View style={styles.leftSection}>
            <IconSymbol name="MoonIcon" size={24} color={theme.textPrimary} />

            <Text style={styles.rowText}>Theme</Text>
          </View>

          <IconSymbol
            name="ChevronRightIcon"
            size={20}
            color={theme.textSecondary}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push("/screens/NotificationSettings")}
      >
        <View style={styles.row}>
          <View style={styles.leftSection}>
            <IconSymbol name="BellIcon" size={24} color={theme.textPrimary} />

            <Text style={styles.rowText}>Notification</Text>
          </View>

          <IconSymbol
            name="ChevronRightIcon"
            size={20}
            color={theme.textSecondary}
          />
        </View>
      </TouchableOpacity>
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

    row: {
      paddingHorizontal: 30,
      paddingVertical: 14,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    leftSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    rowText: {
      fontSize: 17,
      color: theme.textPrimary,
    },
  });
