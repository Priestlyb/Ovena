import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { homepageStyles as styles } from "@/constants/styles/homepageStyles";
import { IconSymbol } from "../ui/icon-symbol";
import { ThemeColors, useTheme } from "@/constants/theme";

export default function ErrorState({
  onRetry,
  loading,
}: {
  onRetry: () => void;
  loading?: boolean;
}) {
  const theme = useTheme();
  const localStyles = createStyles(theme);

  return (
    <View style={styles.loader}>
      <View style={localStyles.iconContainer}>
        <IconSymbol name="TriangleAlerticon" size={34} color={theme.primary} />
      </View>

      <Text style={localStyles.title}>Something went wrong</Text>

      <Text style={localStyles.description}>
        We couldn't load the homepage. Please check your internet connection and
        try again.
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        disabled={loading}
        onPress={onRetry}
        style={[localStyles.button, loading && localStyles.buttonDisabled]}
      >
        {loading ? (
          <>
            <ActivityIndicator size="small" color={theme.secondary} />
            <Text style={localStyles.buttonText}>Retrying...</Text>
          </>
        ) : (
          <Text style={localStyles.buttonText}>Try Again</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    iconContainer: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor:
        theme.background === "#FFFFFF" ? "#FDECE8" : theme.surface,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },

    title: {
      fontSize: 22,
      fontWeight: "700",
      color: theme.textPrimary,
      marginBottom: 8,
    },

    description: {
      fontSize: 15,
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: 22,
      paddingHorizontal: 32,
      marginBottom: 28,
    },

    button: {
      backgroundColor: theme.primary,
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 28,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 160,
    },

    buttonDisabled: {
      opacity: 0.7,
    },

    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
  });
