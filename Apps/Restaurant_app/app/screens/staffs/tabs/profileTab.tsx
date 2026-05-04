// ProfilePage.tsx
import { useRouter } from "expo-router";
import { Bell, Edit, LogOut, Settings, Shield } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

import { profileBookingStyles } from "@/constants/profile-booking-styles";
import { styles } from "@/constants/styles";

// Atomic Components
import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";

// Custom Components
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { ProfileMenuItem } from "@/components/ProfileMenuItem";

// API Client
import api from "@/services/apiClient";

import { clearAuth, getRefreshToken } from "@/utils/authStorage";

import { setIsLoggingOut as setGlobalLogout } from "@/services/apiClient";

export default function ProfileTab() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [userProfile, setUserProfile] = useState<{
    name?: string;
    phone_number?: string;
  }>({});

  // ----------------------
  // FETCH PROFILE
  // ----------------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);

        const response = await api.get("/accounts/profile/", {
          params: { profile_type: "businessstaff" },
        });

        const data = response.data;

        setUserProfile({
          name: data.user?.name,
          phone_number: data.user?.phone_number,
        });
      } catch (error: any) {
        console.error("Profile fetch error:", error);
        Alert.alert("Error", "Could not load profile. Please try again later.");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  // ----------------------
  // LOGOUT HANDLER
  // ----------------------
  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setGlobalLogout(true);

    try {
      const refreshToken = await getRefreshToken();

      if (refreshToken) {
        await api.post("/accounts/logout/", {
          refresh: refreshToken,
        });
      }

      console.log("✅ Logout successful");
    } catch (error: any) {
      console.warn("Logout error:", error?.response?.data || error.message);
    } finally {
      try {
        await clearAuth();
      } catch (clearError) {
        console.warn("Error clearing auth:", clearError);
      }
      setGlobalLogout(false);

      router.replace("/");

      setIsLoggingOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {/* Header */}
          <View style={profileBookingStyles.profileHeader}>
            <Text variant="h3" weight="bold">
              Profile
            </Text>
            <TouchableOpacity onPress={() => console.log("Edit profile")}>
              <Edit size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          <Spacer size="lg" />

          {/* User Info 
          <View style={profileBookingStyles.profileUserInfo}>
            <Avatar
              size="lg"
              initials={userProfile.name ? userProfile.name[0] : "U"}
            />
            <View style={profileBookingStyles.profileRatingBadge}>
              <Text variant="bodySmall" weight="semibold" color="white">
                5.00 ⭐
              </Text>
            </View>
          </View> */}

          <Spacer size="sm" />

          {/* Profile Display */}
          {loadingProfile ? (
            <ActivityIndicator size="small" color="#F65513" />
          ) : (
            <>
              <Text
                variant="body"
                weight="semibold"
                align="center"
                style={{ marginTop: 4, fontWeight: "900", fontSize: 18 }}
              >
                {userProfile.name || "No Name"}
              </Text>
              <Text variant="bodySmall" color="secondary" align="center">
                {userProfile.phone_number || "No Phone Number"}
              </Text>
            </>
          )}

          <Spacer size="xl" />

          {/* Sections */}
          <CollapsibleSection title="Store Settings" defaultExpanded>
            <ProfileMenuItem
              icon={Settings}
              label="Working Hours"
              onPress={() => router.push("/screens/workingHours")}
            />
          </CollapsibleSection>

          <CollapsibleSection title="App Settings" defaultExpanded>
            <ProfileMenuItem
              icon={Shield}
              label="Privacy"
              onPress={() => router.push("/")}
            />
            <ProfileMenuItem
              icon={Bell}
              label="Notifications"
              onPress={() => router.push("/screens/NotificationsPage")}
            />
          </CollapsibleSection>

          <Spacer size="lg" />

          {/* Logout Button */}
          <TouchableOpacity
            style={[
              profileBookingStyles.logoutButton,
              {
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              },
              isLoggingOut && { opacity: 0.7 },
            ]}
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator size="small" color="#F65513" />
            ) : (
              <>
                <LogOut size={20} color="#EF4444" />
                <Text
                  variant="body"
                  weight="semibold"
                  style={{ color: "#EF4444", marginLeft: 8 }}
                >
                  Logout
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Spacer size="sm" />

          <Text variant="caption" color="secondary" align="center">
            v2.0.3(v699)
          </Text>

          <Spacer size="xxl" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
