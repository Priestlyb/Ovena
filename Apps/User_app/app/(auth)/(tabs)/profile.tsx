// app/(tabs)/profile.tsx
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router";

import ProfileHeader from "@/components/profileComponents/profileHeader";
import MenuItem from "@/components/profileComponents/menuItem";
import { useAuth } from "@/context/AuthContext";

export default function ProfileTab() {
  const { logout } = useAuth();
  const menuItems = [
    {
      iconName: "BagOutline" as const,
      label: "Orders",
      onPress: () => router.push("/(auth)/screens/Favorite"),
    },
    {
      iconName: "HeartOutline" as const,
      label: "Favourites",
      onPress: () => router.push("/(auth)/screens/Favorite"),
    },
    {
      iconName: "PersonOutline" as const,
      label: "Account",
      onPress: () => router.push("/(auth)/screens/AccountScreen"),
    },
    {
      iconName: "SettingsIcon" as const,
      label: "Ovena Prime",
      onPress: () => router.push("/(auth)/screens/OvenaPrimeScreen"),
    },
    {
      iconName: "GlobeOutline" as const,
      label: "Languages",
      onPress: () => router.push("/(auth)/screens/Favorite"),
    },
    {
      iconName: "QuestionCircle" as const,
      label: "FAQ",
      onPress: () => router.push("/(auth)/screens/FaqScreen"),
    },
    {
      iconName: "TokenIcon" as const,
      label: "Reward",
      onPress: () => router.push("/(auth)/screens/SpinWheelScreen"),
    },
    {
      iconName: "PersonThroughWindowIcon" as const,
      label: "Referral",
      onPress: () => router.push("/(auth)/screens/ReferralScreen"),
    },
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
        {/* Profile Header */}
        <ProfileHeader />

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              iconName={item.iconName}
              label={item.label}
              onPress={item.onPress}
            />
          ))}
        </View>

        {/* Version Footer */}
        <Text style={styles.versionText}>version 1.0017.022.6740</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  menuContainer: {
    height: "65%",
    backgroundColor: "#ffffffff",
    marginTop: -60,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 40,
    overflow: "hidden",
  },
  versionText: {
    textAlign: "center",
    marginTop: 24,
    marginBottom: 32,
    fontSize: 12,
    color: "#999",
    backgroundColor: "#fff",
    paddingVertical: 16,
  },
});
