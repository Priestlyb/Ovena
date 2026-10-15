import React, { useMemo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as Clipboard from "expo-clipboard";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/constants/theme";
import { useProfile } from "@/hooks/account/useProfile";

import type { ThemeColors } from "@/constants/theme";
import { createStyles } from "@/constants/styles/accountDetail.styles";

type InfoRowProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  theme: ThemeColors;
  styles: ReturnType<typeof createStyles>;
  showDivider?: boolean;
  onPress?: () => void;
  right?: React.ReactNode;
};

const InfoRow = ({
  icon,
  title,
  value,
  theme,
  styles,
  showDivider = true,
  onPress,
  right,
}: InfoRowProps) => {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.row,
        {
          borderBottomColor: theme.border,
          borderBottomWidth: showDivider ? StyleSheet.hairlineWidth : 0,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrapper,
          {
            backgroundColor: `${theme.primary}15`,
          },
        ]}
      >
        {icon}
      </View>

      <View style={styles.rowContent}>
        <Text
          style={[
            styles.rowTitle,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.rowValue,
            {
              color: theme.textPrimary,
            },
          ]}
        >
          {value}
        </Text>
      </View>

      {right}
    </Wrapper>
  );
};

const SectionTitle = ({
  title,
  theme,
  styles,
}: {
  title: string;
  theme: ThemeColors;
  styles: ReturnType<typeof createStyles>;
}) => (
  <Text
    style={[
      styles.sectionTitle,
      {
        color: theme.textSecondary,
      },
    ]}
  >
    {title}
  </Text>
);

export default function AccountDetails() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const { data, isLoading, isRefetching, refetch, error } = useProfile();

  const profile = data?.profile;
  const user = data?.user;

  const initials = useMemo(() => {
    if (!profile?.name) return "?";

    return profile.name
      .split(" ")
      .map((x: string) => x[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }, [profile?.name]);

  const birthday = useMemo(() => {
    if (!profile?.birth_date) return "-";

    return new Date(profile.birth_date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [profile?.birth_date]);

  const copyReferral = async () => {
    if (!profile?.referral_code) return;

    await Clipboard.setStringAsync(profile.referral_code);
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />

        <Text
          style={[
            styles.loadingText,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          Loading account...
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        <View
          style={[
            styles.errorCircle,
            {
              backgroundColor: `${theme.error}15`,
            },
          ]}
        >
          <IconSymbol name="TriangleAlerticon" size={34} color={theme.error} />
        </View>

        <Text
          style={[
            styles.errorTitle,
            {
              color: theme.textPrimary,
            },
          ]}
        >
          Failed to load profile
        </Text>

        <Text
          style={[
            styles.errorSubtitle,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          Pull down or tap below to try again.
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            refetch();
          }}
          style={[
            styles.retryButton,
            {
              backgroundColor: theme.primary,
            },
          ]}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
      >
        {/* HEADER */}

        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.primary,
            },
          ]}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <Text style={styles.name}>{profile?.name}</Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {data?.active_profile_type?.toUpperCase()}
            </Text>
          </View>

          <View style={styles.contactContainer}>
            <View style={styles.contactRow}>
              <IconSymbol name="AccountCardIcon" color="#fff" size={18} />

              <Text style={styles.contactText}>{user?.phone_number}</Text>
            </View>

            <View style={styles.contactRow}>
              <IconSymbol name="EmailIcon" color="#fff" size={18} />

              <Text style={styles.contactText}>{user?.email}</Text>
            </View>
          </View>
        </View>

        {/* PERSONAL */}

        <SectionTitle
          title="PERSONAL INFORMATION"
          theme={theme}
          styles={styles}
        />

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
            },
          ]}
        >
          <InfoRow
            theme={theme}
            styles={styles}
            icon={
              <IconSymbol name="ProfileIcon" color={theme.primary} size={22} />
            }
            title="Full Name"
            value={profile?.name ?? "-"}
          />

          <InfoRow
            styles={styles}
            theme={theme}
            icon={
              <IconSymbol
                name="UserOutlineIcon"
                color={theme.primary}
                size={20}
              />
            }
            title="Age"
            value={`${profile?.age ?? "-"}`}
          />

          <InfoRow
            styles={styles}
            theme={theme}
            icon={
              <IconSymbol name="ClockIcon" color={theme.primary} size={20} />
            }
            title="Date of Birth"
            value={birthday}
            showDivider={false}
          />
        </View>

        {/* ADDRESS */}

        <SectionTitle title="DEFAULT ADDRESS" theme={theme} styles={styles} />

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
            },
          ]}
        >
          <InfoRow
            styles={styles}
            theme={theme}
            icon={
              <IconSymbol
                name="LocationDotIcon"
                color={theme.primary}
                size={20}
              />
            }
            title={profile?.default_address?.label ?? "Home"}
            value={profile?.default_address?.address ?? "-"}
            showDivider={false}
          />
        </View>

        {/* REFERRAL */}

        <SectionTitle title="REFERRAL" theme={theme} styles={styles} />

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
            },
          ]}
        >
          <InfoRow
            styles={styles}
            theme={theme}
            icon={
              <IconSymbol name="GiftIcon" color={theme.primary} size={22} />
            }
            title="Referral Code"
            value={profile?.referral_code ?? "-"}
            showDivider={false}
            onPress={copyReferral}
            right={
              <IconSymbol name="Paperclip" color={theme.primary} size={20} />
            }
          />
        </View>

        {/* PREFERENCES */}

        <SectionTitle title="PREFERENCES" theme={theme} styles={styles} />

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
            },
          ]}
        >
          <InfoRow
            theme={theme}
            styles={styles}
            icon={
              <IconSymbol
                name="ShoppingbasketIcon"
                color={theme.primary}
                size={20}
              />
            }
            title="Pickup Orders"
            value={profile?.pickup_food ? "Enabled" : "Disabled"}
            showDivider={false}
            right={
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: profile?.pickup_food
                      ? `${theme.success}15`
                      : `${theme.error}15`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: profile?.pickup_food
                        ? theme.success
                        : theme.error,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.statusText,
                    {
                      color: profile?.pickup_food ? theme.success : theme.error,
                    },
                  ]}
                >
                  {profile?.pickup_food ? "ON" : "OFF"}
                </Text>
              </View>
            }
          />
        </View>

        {/* ACCOUNT 

        <SectionTitle title="ACCOUNT" theme={theme} styles={styles} />

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
            },
          ]}
        >
          <InfoRow
          styles={styles}
            theme={theme}
            icon={
              <IconSymbol name="ShieldIcon" color={theme.primary} size={20} />
            }
            title="Role"
            value={data?.roles?.join(", ") ?? "-"}
          />

          <InfoRow
          styles={styles}
            theme={theme}
            icon={
              <IconSymbol name="ProfileIcon" color={theme.primary} size={20} />
            }
            title="Profile ID"
            value={`#${profile?.id ?? "-"}`}
          />

          <InfoRow
            theme={theme}
            styles={styles}
            icon={
              <IconSymbol name="ProfileIcon" color={theme.primary} size={20} />
            }
            title="User ID"
            value={`#${user?.id ?? "-"}`}
            showDivider={false}
          />
        </View>
        */}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
