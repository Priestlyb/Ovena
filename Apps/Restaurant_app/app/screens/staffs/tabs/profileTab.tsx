import { useRouter } from "expo-router";
import {
  Clock3,
  LogOut,
  ShieldCheck,
  Star,
  Store,
  Truck,
  User,
} from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { profileBookingStyles } from "@/constants/profile-booking-styles";
import { styles } from "@/constants/styles";

// Atomic Components
import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";

// Components
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { ProfileMenuItem } from "@/components/ProfileMenuItem";

// Hooks
import useFetchProfile from "@/hooks/staff/useFetchProfile";
import useLogout from "@/hooks/staff/useLogout";

const COLORS = {
  primary: "#F65513",
  success: "#86C65B",
  danger: "#DC2626",
  warning: "#F59E0B",

  text: "#111827",
  secondary: "#6B7280",

  background: "#F8FAFC",
  white: "#FFFFFF",

  border: "#E5E7EB",

  successBg: "#ECFDF5",
  dangerBg: "#FEF2F2",
};

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <View style={localStyles.infoRow}>
      <Text variant="bodySmall" color="secondary">
        {label}
      </Text>

      <Text
        variant="bodySmall"
        weight="semibold"
        style={{
          flex: 1,
          textAlign: "right",
          marginLeft: 16,
        }}
      >
        {value ?? "-"}
      </Text>
    </View>
  );
}

function StatusBadge({ active }: { active?: boolean }) {
  return (
    <View
      style={[
        localStyles.statusBadge,
        {
          backgroundColor: active ? COLORS.successBg : COLORS.dangerBg,
        },
      ]}
    >
      <View
        style={[
          localStyles.statusDot,
          {
            backgroundColor: active ? COLORS.success : COLORS.danger,
          },
        ]}
      />

      <Text
        variant="caption"
        weight="semibold"
        style={{
          color: active ? COLORS.success : COLORS.danger,
        }}
      >
        {active ? "Accepting Orders" : "Not Accepting Orders"}
      </Text>
    </View>
  );
}

function MetricCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value?: string | number | null;
}) {
  return (
    <View style={localStyles.metricCard}>
      {icon}

      <Spacer size="xs" />

      <Text variant="caption" color="secondary">
        {title}
      </Text>

      <Spacer size="xs" />

      <Text variant="body" weight="bold">
        {value ?? "-"}
      </Text>
    </View>
  );
}

export default function ProfileTab() {
  const router = useRouter();

  const { loadingProfile, userProfile } = useFetchProfile("businessstaff");

  const { logout, isLoggingOut } = useLogout();

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: COLORS.background,
        },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 40,
          }}
        >
          {/* Header */}
          <View style={profileBookingStyles.profileHeader}>
            <Text style={{ fontWeight: 800, fontSize: 22 }}>Profile</Text>

            {/*<TouchableOpacity onPress={() => console.log("Edit Profile")}>
              <Edit size={22} color={COLORS.text} />
            </TouchableOpacity> */}
          </View>

          <Spacer size="lg" />

          {loadingProfile ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <>
              {/* ===========================
                  STAFF PROFILE CARD
              ============================ */}
              <View style={localStyles.profileCard}>
                <View style={localStyles.avatar}>
                  <User size={34} color={COLORS.primary} />
                </View>

                <Spacer size="md" />

                <Text variant="h3" weight="bold" align="center">
                  {userProfile.name || "Unknown Staff"}
                </Text>

                <Spacer size="md" />

                <StatusBadge active={userProfile.is_accepting_orders} />

                <Spacer size="lg" />

                {/*
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Phone size={16} color={COLORS.secondary} />

                  <Text
                    variant="bodySmall"
                    style={{
                      marginLeft: 8,
                    }}
                  >
                    {userProfile.phone_number ?? "No Phone Number"}
                  </Text>
                </View>

                <Spacer size="md" />

                 <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    paddingHorizontal: 12,
                  }}
                >
                  <MapPin size={16} color={COLORS.secondary} />

                  <Text
                    variant="bodySmall"
                    color="secondary"
                    align="center"
                    style={{
                      marginLeft: 8,
                      flex: 1,
                    }}
                  >
                    {userProfile.branch_name}
                    {"\n"}
                    {userProfile.branch_address}
                  </Text>
                </View>
                */}

                <Spacer size="lg" />

                <View style={localStyles.metricsRow}>
                  <MetricCard
                    icon={<Star size={18} color="#F59E0B" />}
                    title="Rating"
                    value={userProfile.avg_rating}
                  />

                  <MetricCard
                    icon={<Clock3 size={18} color={COLORS.primary} />}
                    title="Prep Time"
                    value={
                      userProfile.average_prep_time
                        ? `${userProfile.average_prep_time} min`
                        : "-"
                    }
                  />

                  <MetricCard
                    icon={<Truck size={18} color={COLORS.success} />}
                    title="Delivery"
                    value={userProfile.delivery_method}
                  />
                </View>

                <Spacer size="lg" />
              </View>

              <Spacer size="lg" />

              {/* ===========================
                  BRANCH INFORMATION
              ============================ */}
              <View style={localStyles.card}>
                <View style={localStyles.sectionHeader}>
                  <Store size={18} color={COLORS.primary} />
                  <Text variant="body" weight="bold" style={{ marginLeft: 8 }}>
                    Branch Information
                  </Text>
                </View>

                <Spacer size="md" />

                <InfoRow label="Branch" value={userProfile.branch_name} />

                <InfoRow label="Address" value={userProfile.branch_address} />

                {/*  <InfoRow label="Business ID" value={userProfile.business_id} />

                <InfoRow label="Branch ID" value={userProfile.branch_id} />

                <InfoRow label="Delivery" value={userProfile.delivery_method} />

                <InfoRow
                  label="Prep Time"
                  value={
                    userProfile.average_prep_time
                      ? `${userProfile.average_prep_time} mins`
                      : "-"
                  }
                />

                <InfoRow
                  label="Rating"
                  value={
                    userProfile.avg_rating != null
                      ? `${userProfile.avg_rating} (${userProfile.rating_count ?? 0} reviews)`
                      : "-"
                  }
                />
                */}
              </View>

              <Spacer size="lg" />

              {/* ===========================
                  STAFF INFORMATION
              ============================ */}
              <View style={localStyles.card}>
                <View style={localStyles.sectionHeader}>
                  <ShieldCheck size={18} color={COLORS.primary} />

                  <Text variant="body" weight="bold" style={{ marginLeft: 8 }}>
                    Staff Information
                  </Text>
                </View>

                <Spacer size="md" />

                <InfoRow label="Role" value={userProfile.role} />

                <InfoRow label="Phone" value={userProfile.phone_number} />

                {/*
                <InfoRow label="Staff ID" value={userProfile.staff_id} />

                <InfoRow
                  label="Status"
                  value={userProfile.is_active ? "Active" : "Inactive"}
                />

                <InfoRow label="Device" value={userProfile.device_name} />

                <InfoRow
                  label="Email"
                  value={userProfile.email || "Not Available"}
                />
                */}
              </View>

              <Spacer size="xl" />
            </>
          )}

          {/* Store Settings */}
          <CollapsibleSection title="Store Settings" defaultExpanded>
            <ProfileMenuItem
              icon="SettingsIcon"
              label="Working Hours"
              onPress={() => router.push("/screens/workingHours")}
            />
          </CollapsibleSection>

          {/* App Settings */}
          <CollapsibleSection title="App Settings" defaultExpanded>
            <ProfileMenuItem
              icon="ShieldIcon"
              label="Privacy"
              onPress={() => router.push("/screens/ourPoliciesPage")}
            />

            <ProfileMenuItem
              icon="BellIcon"
              label="Notifications"
              onPress={() => router.push("/screens/NotificationsPage")}
            />
          </CollapsibleSection>

          <Spacer size="lg" />

          <TouchableOpacity
            style={[
              profileBookingStyles.logoutButton,
              {
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              },
              isLoggingOut && {
                opacity: 0.7,
              },
            ]}
            onPress={logout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <>
                <LogOut size={20} color={COLORS.danger} />

                <Text
                  variant="body"
                  weight="semibold"
                  style={{
                    color: COLORS.danger,
                    marginLeft: 8,
                  }}
                >
                  Logout
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Spacer size="sm" />

          <Text variant="caption" color="secondary" align="center">
            v2.0.3 (v699)
          </Text>

          <Spacer size="xxl" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },

  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#FFF4EE",
    alignItems: "center",
    justifyContent: "center",
  },

  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  metricCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
});
