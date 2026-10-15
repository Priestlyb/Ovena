// components/pointHistory/EmptyPointHistory.tsx

import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme, ThemeColors } from "@/constants/theme";

const EmptyPointHistory = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <IconSymbol
          name="StarIcon"
          size={42}
          color={theme.primary}
        />
      </View>

      <Text style={styles.title}>
        No Point History Yet
      </Text>

      <Text style={styles.description}>
        Your reward activities will appear here.
        {"\n\n"}
        Earn points by:
      </Text>

      <View style={styles.list}>
        <View style={styles.item}>
          <Text style={styles.bullet}>•</Text>

          <Text style={styles.itemText}>
            Completing eligible orders
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.bullet}>•</Text>

          <Text style={styles.itemText}>
            Referring friends
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.bullet}>•</Text>

          <Text style={styles.itemText}>
            Receiving promotional bonuses
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.bullet}>•</Text>

          <Text style={styles.itemText}>
            Participating in future reward campaigns
          </Text>
        </View>
      </View>
    </View>
  );
};

export default EmptyPointHistory;

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 28,
      paddingVertical: 60,
      backgroundColor: theme.background,
    },

    iconWrapper: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: theme.surface,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
      borderWidth: 1,
      borderColor: theme.border,
    },

    title: {
      fontSize: 22,
      fontWeight: "700",
      color: theme.textPrimary,
      textAlign: "center",
    },

    description: {
      marginTop: 12,
      fontSize: 15,
      lineHeight: 24,
      color: theme.textSecondary,
      textAlign: "center",
    },

    list: {
      width: "100%",
      marginTop: 28,
      backgroundColor: theme.surface,
      borderRadius: 18,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },

    item: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 16,
    },

    bullet: {
      fontSize: 20,
      color: theme.primary,
      marginRight: 10,
      lineHeight: 22,
    },

    itemText: {
      flex: 1,
      fontSize: 15,
      color: theme.textPrimary,
      lineHeight: 22,
    },
  });