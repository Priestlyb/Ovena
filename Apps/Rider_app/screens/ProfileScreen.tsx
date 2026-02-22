// screens/ProfileScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import PageHeader from "../components/PageHeader";
import ScreenWrapper from "../components/ScreenWrapper";

interface ProfileScreenProps {
  onBack: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack }) => {
  return (
    <ScreenWrapper scrollable>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <IconSymbol name="XMarkIcon" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Customers can see badge */}
      <View style={styles.badgeWrap}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Customers can see what you add</Text>
        </View>
      </View>

      {/* Avatar */}
      <View style={styles.avatarWrap}>
        <View style={styles.avatar} />
      </View>

      {/* Name + date */}
      <Text style={styles.name}>Clinton</Text>
      <Text style={styles.since}>Delivering since August 1990</Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>1,149</Text>
          <Text style={styles.statLabel}>Deliveries</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBlock}>
          <View style={styles.statValueRow}>
            <Text style={styles.statValue}>99%</Text>
            <IconSymbol name="ThumbsUpIcon" size={16} color="#111" />
          </View>
          <TouchableOpacity>
            <Text style={[styles.statLabel, { textDecorationLine: "underline" }]}>
              Satisfaction rate &gt;
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Why I deliver */}
      <Text style={styles.whyTitle}>Why I Deliver</Text>

      <View style={styles.quoteBox}>
        <Text style={styles.quoteText}>
          {`"People Are Always\nHappy To See Me\nAnd Their Food 😁"`}
        </Text>
      </View>
    </ScreenWrapper>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 56 : 40,
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  badgeWrap: {
    alignItems: "center",
    marginBottom: 28,
  },
  badge: {
    backgroundColor: "#FFDA71",
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
  },
  avatarWrap: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#d4d4d4",
  },
  name: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },
  since: {
    textAlign: "center",
    fontSize: 14,
    color: "#777",
    marginBottom: 28,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  statBlock: {
    alignItems: "center",
    gap: 4,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },
  statLabel: {
    fontSize: 13,
    color: "#555",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e0e0e0",
  },
  whyTitle: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 16,
  },
  quoteBox: {
    backgroundColor: "#FFDA71",
    marginHorizontal: 0,
    paddingVertical: 36,
    paddingHorizontal: 32,
  },
  quoteText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111",
    textAlign: "center",
    lineHeight: 34,
  },
});