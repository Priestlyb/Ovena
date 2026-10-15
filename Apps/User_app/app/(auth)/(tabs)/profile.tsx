import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router";

import ProfileHeader from "@/components/profileComponents/profileHeader";
import MenuItem from "@/components/profileComponents/menuItem";
import { useAuth } from "@/context/AuthContext";
import { useTheme, ThemeColors } from "@/constants/theme";

export default function ProfileTab() {
  const { logout, profile } = useAuth();

  const theme = useTheme();
  const styles = createStyles(theme);

  const canClaimReward = profile?.orders_20_this_month === true;

  const menuItems = [
    // Account
    {
      iconName: "PersonOutline" as const,
      label: "Account",
      onPress: () => router.push("/(auth)/screens/AccountScreen"),
    },

    // Notifications
    {
      iconName: "BellIcon" as const,
      label: "Notifications",
      onPress: () => router.push("/(auth)/screens/NotificationsScreen"),
    },

    // Rewards & Loyalty
    {
      iconName: "Awardicon" as const,
      label: "Points",
      onPress: () => router.push("/(auth)/screens/PointScreen"),
    },

    {
      iconName: "TokenIcon" as const,
      label: "Reward",
      disabled: !canClaimReward,
      onPress: () => {
        if (!canClaimReward) return;

        router.push("/(auth)/screens/SpinWheelScreen");
      },
    },

    {
      iconName: "PersonThroughWindowIcon" as const,
      label: "Referral",
      onPress: () => router.push("/(auth)/screens/ReferralScreen"),
    },

    // Help & Support
    {
      iconName: "QuestionCircle" as const,
      label: "FAQ",
      onPress: () => router.push("/(auth)/screens/FaqScreen"),
    },

    {
      iconName: "Supporticon" as const,
      label: "Contact Us",
      onPress: () => router.push("/(auth)/screens/CustomerSupportPage"),
    },

    // Sign Out
    {
      iconName: "LogOutOutline" as const,
      label: "Log Out",
      onPress: async () => {
        await logout();
      },
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProfileHeader />

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <MenuItem
                iconName={item.iconName}
                label={item.label}
                onPress={item.onPress}
                disabled={item.disabled}
              />

              {item.label === "Reward" &&
                profile?.orders_20_this_month === false && (
                  <Text style={styles.rewardDisclaimer}>
                    You're almost there! Complete 20 orders this month to unlock
                    your reward.
                  </Text>
                )}
            </React.Fragment>
          ))}
        </View>

        <Text style={styles.versionText}>
          © {new Date().getFullYear()} Ovena. All rights reserved.
        </Text>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    scrollContent: {
      borderRadius: 24,
    },

    menuContainer: {
      gap: 20,
      borderRadius: 24,
      paddingTop: 30,
      marginTop: -20,
      overflow: "hidden",
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      backgroundColor: theme.background,
    },

    rewardDisclaimer: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: -12,
      marginHorizontal: 16,
      marginBottom: 4,
    },

    versionText: {
      textAlign: "center",
      marginTop: 24,
      marginBottom: 32,
      fontSize: 12,
      color: theme.textSecondary,
      paddingVertical: 16,
    },
  });
