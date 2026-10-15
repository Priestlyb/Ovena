// app/screens/pointHistory.tsx

import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/constants/theme";

export default function PointHistoryScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <IconSymbol
            name="ArrowLeftIcon"
            size={22}
            color={theme.textPrimary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Point History</Text>

        <View style={{ width: 44 }} />
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <IconSymbol name="GiftIcon" size={30} color={theme.primary} />
        </View>

        <Text style={styles.heroTitle}>Rewards Activity</Text>

        <Text style={styles.heroSubtitle}>
          Track your earned points and withdrawal requests all in one place.
        </Text>
      </View>

      {/* Menu Card */}
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.option}
          onPress={() => {
            router.push("/screens/pointHistory");
          }}
        >
          <View style={styles.optionLeft}>
            <View style={styles.iconWrapper}>
              <IconSymbol name="ClockIcon" size={22} color={theme.primary} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.optionTitle}>Points History</Text>

              <Text style={styles.optionSubtitle}>
                See every point you've earned and redeemed
              </Text>
            </View>
          </View>

          <IconSymbol
            name="ChevronRightIcon"
            size={20}
            color={theme.textSecondary}
          />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.option}
          onPress={() => {
            router.push("/screens/pointsWithdrawalsHistory");
          }}
        >
          <View style={styles.optionLeft}>
            <View style={styles.iconWrapper}>
              <IconSymbol name="WalletIcon" size={22} color={theme.primary} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.optionTitle}>Withdrawal History</Text>

              <Text style={styles.optionSubtitle}>
                View all completed and pending withdrawals
              </Text>
            </View>
          </View>

          <IconSymbol
            name="ChevronRightIcon"
            size={20}
            color={theme.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 60,
      backgroundColor: theme.background,
    },

    header: {
      height: 72,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.background,
    },

    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.surface,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },

    headerTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: theme.textPrimary,
    },

    hero: {
      marginHorizontal: 20,
      marginTop: 20,
      marginBottom: 24,
      backgroundColor: theme.primary,
      borderRadius: 24,
      paddingVertical: 28,
      paddingHorizontal: 24,
      alignItems: "center",
    },

    heroIcon: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: theme.warning,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 18,
    },

    heroTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: "#FFFFFF",
      marginBottom: 8,
    },

    heroSubtitle: {
      color: "#FFFFFF",
      fontSize: 15,
      lineHeight: 22,
      textAlign: "center",
      opacity: 0.95,
    },

    card: {
      marginHorizontal: 20,
      backgroundColor: theme.surface,
      borderRadius: 20,
      overflow: "hidden",

      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 14,
      shadowOffset: {
        width: 0,
        height: 8,
      },

      elevation: 5,

      borderWidth: 1,
      borderColor: theme.border,
    },

    option: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 18,
      paddingVertical: 18,
    },

    optionLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      paddingRight: 10,
    },

    iconWrapper: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: `${theme.primary}15`,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },

    optionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.textPrimary,
    },

    optionSubtitle: {
      marginTop: 4,
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 18,
    },

    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginLeft: 86,
    },
  });
