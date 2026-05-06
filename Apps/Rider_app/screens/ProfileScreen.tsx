// screens/ProfileScreen.tsx
import React from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Platform, SafeAreaView, StatusBar,
  ActivityIndicator,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import { useTheme } from "../context/ThemeContext";
import { useAppData } from "../context/appDataContext";
import ScreenWrapper from "../components/ScreenWrapper";

interface ProfileScreenProps {
  onBack: () => void;
}

// Formats seconds into "Xm Ys" or "Xh Ym"
function formatDuration(secs: number): string {
  if (secs < 60) return `${Math.round(secs)}s`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ${Math.round(secs % 60)}s`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack }) => {
  const { colors }        = useTheme();
  const { data, loading } = useAppData();

  const profile     = data?.dashboard?.data?.profile;
  const perf        = data?.performance?.data;
  const wallet      = data?.dashboard?.data?.wallet;

  const displayName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : "—";

  const initials = profile
    ? `${profile.first_name[0]}${profile.last_name[0]}`
    : "?";

  return (
   
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
       <ScreenWrapper>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.background} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol name="XMarkIcon" size={22} color={colors.iconColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Profile</Text>
          <View style={{ width: 22 }} />
        </View>

        {/* Badge */}
        <View style={styles.badgeWrap}>
          <View style={[styles.badge, { backgroundColor: colors.accentYellow }]}>
            <Text style={[styles.badgeText, { color: "#1a1a1a" }]}>
              Customers can see what you add
            </Text>
          </View>
        </View>

        {loading && !data ? (
          <ActivityIndicator
            color={colors.accentOrange}
            size="large"
            style={{ marginTop: 48 }}
          />
        ) : (
          <>
            {/* Avatar with initials */}
            <View style={styles.avatarWrap}>
              <View style={[styles.avatar, { backgroundColor: colors.inputBg }]}>
                <Text style={[styles.avatarInitials, { color: colors.textPrimary }]}>
                  {initials}
                </Text>
              </View>
              {/* Online status dot */}
              <View style={[
                styles.statusDot,
                { backgroundColor: profile?.is_online ? colors.accentGreen : colors.textMuted },
              ]} />
            </View>

            {/* Name */}
            <Text style={[styles.name, { color: colors.textPrimary }]}>{displayName}</Text>
            <Text style={[styles.since, { color: colors.textSecondary }]}>
              {profile?.is_available ? "Available for deliveries" : "Currently unavailable"}
            </Text>

            {/* Wallet balance pill */}
            {wallet && (
              <View style={styles.walletWrap}>
                <View style={[styles.walletPill, { backgroundColor: colors.cardSecondary }]}>
                  <Text style={[styles.walletLabel, { color: colors.textMuted }]}>Balance</Text>
                  <Text style={[styles.walletAmount, { color: colors.accentGreen }]}>
                    ₦{wallet.available_balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>
            )}

            {/* Stats row */}
            <View style={styles.statsRow}>
              <View style={styles.statBlock}>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                  {profile?.total_deliveries ?? "—"}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Deliveries</Text>
              </View>

              <View style={[styles.statDivider, { backgroundColor: colors.separatorColor }]} />

              <View style={styles.statBlock}>
                <View style={styles.statValueRow}>
                  <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                    {profile?.rating.toFixed(1) ?? "—"}
                  </Text>
                  <IconSymbol name="ThumbsUpIcon" size={16} color={colors.iconColor} />
                </View>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rating</Text>
              </View>

              <View style={[styles.statDivider, { backgroundColor: colors.separatorColor }]} />

              <View style={styles.statBlock}>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                  {perf ? `${perf.completion_rate.toFixed(0)}%` : "—"}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completion</Text>
              </View>
            </View>

            {/* Performance cards */}
            {perf && (
              <View style={[styles.perfGrid, { borderTopColor: colors.separatorColor }]}>
                <View style={[styles.perfCard, { backgroundColor: colors.cardSecondary }]}>
                  <Text style={[styles.perfValue, { color: colors.textPrimary }]}>
                    {perf.acceptance_rate.toFixed(0)}%
                  </Text>
                  <Text style={[styles.perfLabel, { color: colors.textMuted }]}>Acceptance rate</Text>
                </View>
                <View style={[styles.perfCard, { backgroundColor: colors.cardSecondary }]}>
                  <Text style={[styles.perfValue, { color: colors.textPrimary }]}>
                    {perf.cancellation_rate.toFixed(0)}%
                  </Text>
                  <Text style={[styles.perfLabel, { color: colors.textMuted }]}>Cancellation rate</Text>
                </View>
                <View style={[styles.perfCard, { backgroundColor: colors.cardSecondary }]}>
                  <Text style={[styles.perfValue, { color: colors.textPrimary }]}>
                    {formatDuration(perf.avg_delivery_duration_seconds)}
                  </Text>
                  <Text style={[styles.perfLabel, { color: colors.textMuted }]}>Avg delivery time</Text>
                </View>
                <View style={[styles.perfCard, { backgroundColor: colors.cardSecondary }]}>
                  <Text style={[styles.perfValue, { color: colors.textPrimary }]}>
                    {perf.active_hours.toFixed(1)}h
                  </Text>
                  <Text style={[styles.perfLabel, { color: colors.textMuted }]}>Active hours</Text>
                </View>
              </View>
            )}

            {/* Why I deliver */}
            <Text style={[styles.whyTitle, { color: colors.textPrimary }]}>Why I Deliver</Text>
            <View style={[styles.quoteBox, { backgroundColor: colors.accentYellow }]}>
              <Text style={[styles.quoteText, { color: "#1a1a1a" }]}>
                {`"People Are Always\nHappy To See Me\nAnd Their Food 😁"`}
              </Text>
            </View>
          </>
        )}
      </ScrollView>
      </ScreenWrapper>
    </SafeAreaView>
    
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 8 : 16,
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  badgeWrap: { alignItems: "center", marginBottom: 28 },
  badge: { borderRadius: 50, paddingVertical: 8, paddingHorizontal: 20 },
  badgeText: { fontSize: 14, fontWeight: "500" },
  avatarWrap: { alignItems: "center", marginBottom: 20, position: "relative" },
  avatar: {
    width: 160, height: 160, borderRadius: 80,
    alignItems: "center", justifyContent: "center",
  },
  avatarInitials: { fontSize: 48, fontWeight: "800" },
  statusDot: {
    position: "absolute",
    bottom: 4, right: "30%",
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2.5, borderColor: "#fff",
  },
  name: { textAlign: "center", fontSize: 24, fontWeight: "700", marginBottom: 6 },
  since: { textAlign: "center", fontSize: 14, marginBottom: 16 },
  walletWrap: { alignItems: "center", marginBottom: 24 },
  walletPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  walletLabel: { fontSize: 14, fontWeight: "500" },
  walletAmount: { fontSize: 18, fontWeight: "800" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 28,
    marginBottom: 28,
    paddingHorizontal: 24,
  },
  statBlock: { alignItems: "center", gap: 4 },
  statValueRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  statValue: { fontSize: 20, fontWeight: "700" },
  statLabel: { fontSize: 12 },
  statDivider: { width: 1, height: 40 },
  perfGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 28,
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  perfCard: {
    width: "47%",
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  perfValue: { fontSize: 20, fontWeight: "700" },
  perfLabel: { fontSize: 12 },
  whyTitle: { textAlign: "center", fontSize: 16, fontWeight: "600", marginBottom: 16 },
  quoteBox: { paddingVertical: 36, paddingHorizontal: 32 },
  quoteText: { fontSize: 22, fontWeight: "600", textAlign: "center", lineHeight: 34 },
});