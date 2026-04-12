// screens/InboxScreen.tsx
import React from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, SafeAreaView, StatusBar,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import { useTheme } from "../context/ThemeContext";

interface InboxScreenProps {
  onBack: () => void;
}

const MESSAGES = [
  { id: "1", sender: "Ovena Support", time: "10:00 am" },
  { id: "2", sender: "Trip Update",   time: "10:00 am" },
];

const InboxScreen: React.FC<InboxScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.separatorColor }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <IconSymbol name="ArrowBack" size={22} color={colors.iconColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Inbox</Text>
        <TouchableOpacity>
          <Text style={[styles.markAll, { color: colors.textMuted }]}>mark all as read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={MESSAGES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.messageCard, { backgroundColor: colors.cardSecondary }]}
            activeOpacity={0.75}
          >
            <View style={[styles.messageAvatar, { backgroundColor: colors.card }]} />
            <View style={styles.messageBody}>
              <Text style={[styles.messageSender, { color: colors.textPrimary }]}>
                {item.sender}
              </Text>
              <Text style={[styles.messageTime, { color: colors.textMuted }]}>
                {item.time}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default InboxScreen;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 36 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  markAll: { fontSize: 13, fontWeight: "400" },
  list: { paddingHorizontal: 16, paddingTop: 12, gap: 10 },
  messageCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 14,
    padding: 16,
  },
  messageAvatar: {
    width: 44, height: 44, borderRadius: 22, flexShrink: 0,
  },
  messageBody: { flex: 1 },
  messageSender: { fontSize: 15, fontWeight: "600", marginBottom: 4 },
  messageTime: { fontSize: 13, textAlign: "right" },
});