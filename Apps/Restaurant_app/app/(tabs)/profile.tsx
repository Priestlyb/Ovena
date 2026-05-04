// ProfilePage.tsx
import { useRouter } from "expo-router";
import {
  BarChart3,
  Bell,
  Edit,
  Key,
  Lock,
  LogOut,
  Settings,
  Shield,
  User,
  Users,
  Wallet,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { useAuthStore } from "@/stores/authStore";
import { clearAuth, getRefreshToken } from "@/utils/authStorage";

// Services
import apiClient from "@/services/apiClient";

let isLoggingOutGlobal = false;

export default function ProfilePage() {
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const [userProfile, setUserProfile] = useState<{
    name?: string;
    email?: string;
    phone_number?: string;
  }>({});

  const [loadingProfile, setLoadingProfile] = useState(true);

  const getInitials = (name?: string) => {
    if (!name) return "UC";

    const names = name.trim().split(" ");
    if (names.length === 1) return names[0][0]?.toUpperCase();

    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  // ----------------------
  // Fetch profile
  // ----------------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("/accounts/profile/", {
          params: { profile_type: "businessadmin" },
        });

        console.log("🚀 User profile data:", response.data);

        setUserProfile({
          name: response.data.user.name,
          email: response.data.user.email,
          phone_number: response.data.user.phone_number,
        });
      } catch (err: any) {
        console.warn(
          "❌ Failed to fetch profile:",
          err.response?.data || err.message,
        );
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  // ----------------------
  // Logout handler
  // ----------------------
  const handleLogout = async () => {
    if (isLoggingOut || isLoggingOutGlobal) return;

    try {
      setIsLoggingOut(true);
      isLoggingOutGlobal = true;

      console.log("🚪 Logging out safely...");

      const refreshToken = await getRefreshToken();

      // ✅ Call backend FIRST
      if (refreshToken) {
        try {
          await fetch(`${process.env.EXPO_PUBLIC_API_URL}/accounts/logout/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: refreshToken }),
          });

          console.log("✅ Server logout successful");
        } catch (err) {
          console.warn("⚠️ Server logout failed (ignored)");
        }
      }

      // ✅ THEN clear local auth
      await clearAuth();
      console.log("🧹 Tokens cleared");

      const { bumpVersion } = useAuthStore.getState();
      bumpVersion();

      router.replace("/screens/Loginpage");
    } catch (err: any) {
      console.log("❌ Logout failed:", err.message);
    } finally {
      setIsLoggingOut(false);
      isLoggingOutGlobal = false;
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

          {/* User Info */}
          {/* 
          <View>
            <View style={profileBookingStyles.profileUserInfo}>
              <Avatar size="lg" initials={getInitials(userProfile.name)} />
            </View>

            <View style={profileBookingStyles.profileRatingBadge}>
              <Text variant="bodySmall" weight="semibold" color="white">
                5.00 ⭐
              </Text>
            </View>
          </View> */}

          <Spacer size="sm" />

          {/* Profile */}
          {loadingProfile ? (
            <ActivityIndicator size="large" color="#F65513" />
          ) : (
            <>
              <Text
                variant="body"
                weight="bold"
                align="center"
                style={{ marginTop: 4, fontWeight: "900", fontSize: 18 }}
              >
                {userProfile.name || "{Admin_name}"}
              </Text>
              <Text variant="bodySmall" color="secondary" align="center">
                {userProfile.email || "{Admin_email}"}
              </Text>
            </>
          )}

          <Spacer size="xl" />

          {/* Sections */}
          <CollapsibleSection title="Account Settings" defaultExpanded>
            <ProfileMenuItem
              icon={User}
              label="Your Details"
              onPress={() => router.push("/screens/yourDetails")}
            />

            <ProfileMenuItem
              icon={Lock}
              label={"Change password"}
              onPress={() => router.push("/screens/changePassword")}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Store Settings" defaultExpanded>
            <ProfileMenuItem
              icon={Wallet}
              label="Payment Details"
              onPress={() => router.push("/screens/paymentDetails")}
            />
            <ProfileMenuItem
              icon={BarChart3}
              label="Store Analytics"
              onPress={() => router.push("/screens/StoreAnalyticsPage")}
            />
            <ProfileMenuItem
              icon={Wallet}
              label="Your Finances"
              onPress={() => router.push("/screens/YourFinancesPage")}
            />
            {/*<ProfileMenuItem
              icon={Store}
              label="Store Details"
              onPress={() => router.push("/screens/storeDetails")}
            /> */}
            <ProfileMenuItem
              icon={Settings}
              label="Store Hub"
              onPress={() => router.push("/screens/StoreHubPage")}
            />
            <ProfileMenuItem
              icon={Users}
              label="Manage users"
              onPress={() => router.push("/screens/ManageUsersPage")}
            />
          </CollapsibleSection>

          <CollapsibleSection title="App Settings" defaultExpanded>
            <ProfileMenuItem
              icon={Shield}
              label="Privacy"
              onPress={() => router.push("/screens/ourPoliciesPage")}
            />
            <ProfileMenuItem
              icon={Bell}
              label="Notifications"
              onPress={() => router.push("/screens/NotificationsPage")}
            />
            <ProfileMenuItem
              icon={Key}
              label="Reset PIN"
              onPress={() => router.push("/screens/ResetTransactionPinPage")}
            />
          </CollapsibleSection>

          <Spacer size="lg" />

          {/* Logout */}
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
              <ActivityIndicator size="small" color="#EF4444" />
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
