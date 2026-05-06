// screens/ReferFriendsScreen.tsx
import React from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Platform, SafeAreaView, StatusBar,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import { useTheme } from "../context/ThemeContext";
import ScreenWrapper from "../components/ScreenWrapper";

interface ReferFriendsScreenProps {
  onBack: () => void;
}

const SHARE_PLATFORMS = [
  { label: "Telegram",  color: "#2AABEE", icon: "TelegramIcon" },
  { label: "Facebook",  color: "#1877F2", icon: "FacebookIcon" },
  { label: "Gmail",     color: "#EA4335", icon: "GmailIcon" },
  { label: "Messages",  color: "#34C759", icon: "MessageIcon" },
  { label: "WhatsApp",  color: "#25D366", icon: "WhatsAppIcon" },
  { label: "Snapchat",  color: "#FFFC00", icon: "SnapchatIcon" },
  { label: "Instagram", color: "#E1306C", icon: "InstagramIcon" },
];

const ReferFriendsScreen: React.FC<ReferFriendsScreenProps> = ({ onBack }) => {
  const { colors, isDark } = useTheme();

  return (
    <ScreenWrapper>
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.accentYellow }]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.accentYellow} />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Yellow hero area */}
        <View style={[styles.hero, { backgroundColor: colors.accentYellow }]}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol name="ArrowBack" size={22} color="#111" />
          </TouchableOpacity>
        </View>

        {/* Main card */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={[styles.illustration, { backgroundColor: isDark ? colors.inputBg : "#f0e8ff" }]} />

          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            Invite Your friends and{"\n"}get bonus  points!
          </Text>
          <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
            Share your code with your friend{"\n"}and get exciting bonus points
          </Text>

          <TouchableOpacity style={styles.inviteBtn} activeOpacity={0.8}>
            <Text style={styles.inviteBtnText}>Invite</Text>
          </TouchableOpacity>
        </View>

        {/* Share section */}
        <View style={[styles.shareSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.shareTitle, { color: colors.textPrimary }]}>Share</Text>

          <View style={styles.platformsGrid}>
            {SHARE_PLATFORMS.map((p) => (
              <TouchableOpacity key={p.label} style={styles.platformBtn} activeOpacity={0.75}>
                <View style={[styles.platformIcon, { backgroundColor: p.color }]}>
                  <IconSymbol name={p.icon as any} size={22} color="#fff" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Share button */}
        <View style={[styles.shareFooter, { backgroundColor: colors.card }]}>
          <TouchableOpacity style={[styles.shareBtn, { backgroundColor: colors.accentOrange }]} activeOpacity={0.85}>
            <Text style={styles.shareBtnText}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
    </ScreenWrapper>
  );
};

export default ReferFriendsScreen;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  hero: {
    paddingTop: Platform.OS === "ios" ? 16 : 12,
    paddingHorizontal: 24,
    paddingBottom: 0,
    height: 72,
    justifyContent: "flex-start",
  },
  backBtn: {},
  card: {
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  illustration: {
    width: 140, height: 140, borderRadius: 70, marginBottom: 8,
  },
  cardTitle: { fontSize: 20, fontWeight: "700", textAlign: "center", lineHeight: 28 },
  cardSubtitle: { fontSize: 14, textAlign: "center", lineHeight: 22 },
  inviteBtn: {
    borderWidth: 1.5, borderColor: "#7B6EF6",
    borderRadius: 50, paddingVertical: 12, paddingHorizontal: 60, marginTop: 4,
  },
  inviteBtnText: { fontSize: 16, color: "#7B6EF6", fontWeight: "600" },
  shareSection: {
    marginTop: 12, paddingHorizontal: 24,
    paddingTop: 20, paddingBottom: 12,
  },
  shareTitle: { fontSize: 18, fontWeight: "700", marginBottom: 20 },
  platformsGrid: {
    flexDirection: "row", flexWrap: "wrap",
    justifyContent: "center", gap: 18, marginBottom: 8,
  },
  platformBtn: {},
  platformIcon: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: "center", justifyContent: "center",
  },
  shareFooter: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 12 },
  shareBtn: { borderRadius: 50, paddingVertical: 17, alignItems: "center" },
  shareBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});