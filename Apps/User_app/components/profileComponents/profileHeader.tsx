// components/ProfileHeader.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { router } from "expo-router";
import { useProfile } from "@/hooks/account/useProfile";
import { useTheme, ThemeColors } from "@/constants/theme";

const ProfileHeader: React.FC = () => {
  const { data, isLoading, error } = useProfile();

  const theme = useTheme();
  const styles = createStyles(theme);

  const profile = data?.profile;
  const user = data?.user;

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>
          {(error as Error).message || "Failed to load profile"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.profileHeader}>
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      <TouchableOpacity
        onPress={() => {
          router.push("/(auth)/screens/HelpScreen");
        }}
        style={styles.helpButton}
      >
        <Text style={styles.helpButtonText}>Help</Text>
      </TouchableOpacity>

      <View style={styles.profileContent}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile?.name?.charAt(0)?.toUpperCase() ?? "U"}
          </Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {profile?.name ?? "Unknown User"}
          </Text>

          <Text style={styles.profileTitle}>{user?.email ?? "No email"}</Text>
        </View>

        <View style={styles.pointsSection}>
          <Text style={styles.pointsValue}>{profile?.points ?? 0}</Text>

          <Text style={styles.pointsLabel}>Pts</Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    loader: {
      paddingVertical: 40,
      alignItems: "center",
    },

    loadingText: {
      marginTop: 8,
      color: theme.textPrimary,
    },

    errorText: {
      color: theme.error,
    },

    profileHeader: {
      backgroundColor: theme.profilebackground,
      padding: 24,
      paddingBottom: 55,
      overflow: "hidden",

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },

    decorCircle1: {
      position: "absolute",
      top: -64,
      right: -64,
      width: 128,
      height: 128,
      borderRadius: 64,
      backgroundColor: theme.decorCircle,
    },

    decorCircle2: {
      position: "absolute",
      bottom: -48,
      left: -48,
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: theme.decorCircle,
    },

    helpButton: {
      alignItems: "flex-end",
      paddingTop: 50,
      marginBottom: 50,
    },

    helpButtonText: {
      backgroundColor: theme.primary,
      color: "#FFFFFF",
      fontSize: 16,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
      width: 80,
      textAlign: "center",
      fontWeight: "bold",
    },

    profileContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
      paddingHorizontal: 10,
    },

    avatar: {
      width: 60,
      height: 60,
      borderRadius: 32,
      backgroundColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
    },

    avatarText: {
      color: "#FFFFFF",
      fontSize: 25,
      fontWeight: "bold",
    },

    profileInfo: {
      flex: 1,
    },

    profileName: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.textPrimary,
    },

    profileTitle: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 4,
    },

    pointsSection: {
      alignItems: "flex-end",
    },

    pointsValue: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.textPrimary,
    },

    pointsLabel: {
      fontSize: 12,
      color: theme.textSecondary,
    },
  });

export default ProfileHeader;
