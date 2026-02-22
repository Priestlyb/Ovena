// screens/HelpScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import PageHeader from "../components/PageHeader";
import MenuItem from "../components/MenuItem";
import ScreenWrapper from "../components/ScreenWrapper";

interface HelpScreenProps {
  onBack: () => void;
}

const HELP_TOPICS = [
  "Safety",
  "Account Issues",
  "Trip Problems",
  "Earning & Payout",
  "Vehicle & Documents",
];

const HelpScreen: React.FC<HelpScreenProps> = ({ onBack }) => {
  const [search, setSearch] = useState("");

  return (
    <ScreenWrapper scrollable>
      <PageHeader title="Help & Support" onBack={onBack} />

      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for help"
          placeholderTextColor="#bbb"
          value={search}
          onChangeText={setSearch}
        />
        <IconSearch />
      </View>

      {/* Topics */}
      <View style={styles.topicsSection}>
        {HELP_TOPICS.map((topic, i) => (
          <MenuItem
            key={topic}
            label={topic}
            onPress={() => {}}
            borderBottom={i < HELP_TOPICS.length - 1}
          />
        ))}
      </View>

      {/* WhatsApp CTA */}
      <View style={styles.ctaSection}>
        <View style={styles.whatsappIcon}>
          <Text style={styles.whatsappEmoji}>📞</Text>
        </View>
        <Text style={styles.ctaLabel}>Chat with an Agent</Text>
        <TouchableOpacity style={styles.contactBtn} activeOpacity={0.85}>
          <Text style={styles.contactBtnText}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

// Inline search icon to avoid missing symbol issue
const IconSearch = () => (
  <View style={styles.searchIcon}>
    <Text style={{ fontSize: 16 }}>🔍</Text>
  </View>
);

export default HelpScreen;

const styles = StyleSheet.create({
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111",
  },
  searchIcon: {
    marginLeft: 8,
  },
  topicsSection: {
    marginHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  ctaSection: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 10,
    marginTop: 16,
  },
  whatsappIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#25D366",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  whatsappEmoji: {
    fontSize: 28,
  },
  ctaLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
  },
  contactBtn: {
    backgroundColor: "#111",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: "100%",
    alignItems: "center",
  },
  contactBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});