import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme, ThemeColors } from "@/constants/theme";

export default function NotRelatedToAnOrder() {
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
          <IconSymbol name="ArrowLeftIcon" size={22} color={theme.icon} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Not related to an order</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Menu */}
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            router.push("/(auth)/screens/AccountDetails");
          }}
        >
          <View style={styles.menuLeft}>
            <IconSymbol name="UserOutlineIcon" size={24} color={theme.icon} />
            <Text style={styles.menuText}>My account details</Text>
          </View>

          <IconSymbol
            name="ChevronRightIcon"
            size={20}
            color={theme.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <IconSymbol name="LocationDotIcon" size={24} color={theme.icon} />
            <Text style={styles.menuText}>Work with us</Text>
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
            router.push("/(auth)/screens/ourPoliciesPage");
          }}
        >
          <View style={styles.menuLeft}>
            <IconSymbol name="LawIcon" size={24} color={theme.icon} />
            <Text style={styles.menuText}>Our Policies</Text>
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
      flex: 1,
      textAlign: "center",
      fontSize: 22,
      fontWeight: "bold",
      color: theme.textPrimary,
    },

    headerSpacer: {
      width: 42,
    },

    content: {
      marginTop: 20,
      paddingHorizontal: 30,
      gap: 25,
    },

    menuItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
