import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme, ThemeColors } from "@/constants/theme";

export default function HelpScreen() {
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
          <IconSymbol name="ArrowLeftIcon" size={20} color={theme.icon} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Help Center</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Body */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>How can we help you?</Text>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <IconSymbol
              name="BriefcaseOutlineIcon"
              size={24}
              color={theme.icon}
            />
            <Text style={styles.menuText}>Help with an order</Text>
          </View>

          <IconSymbol
            name="ChevronRightIcon"
            size={20}
            color={theme.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            router.push("/(auth)/screens/NotRelatedToAnOrder");
          }}
        >
          <View style={styles.menuLeft}>
            <IconSymbol name="UserIcon" size={24} color={theme.icon} />
            <Text style={styles.menuText}>Not related to an order</Text>
          </View>

          <IconSymbol
            name="ChevronRightIcon"
            size={20}
            color={theme.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            router.push("/(auth)/screens/CustomerSupportPage");
          }}
        >
          <View style={styles.menuLeft}>
            <IconSymbol name="EmailIcon" size={24} color={theme.icon} />
            <Text style={styles.menuText}>Inbox</Text>
          </View>

          <IconSymbol
            name="ChevronRightIcon"
            size={20}
            color={theme.textSecondary}
          />
        </TouchableOpacity>
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
      gap: 50,
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
      width: 40,
    },

    content: {
      paddingHorizontal: 20,
      gap: 24,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.textPrimary,
    },

    menuItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 4,
    },

    menuLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
    },

    menuText: {
      fontSize: 18,
      color: theme.textPrimary,
    },
  });
