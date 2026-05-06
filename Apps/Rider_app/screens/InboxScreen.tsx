// screens/InboxScreen.tsx
import React from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, SafeAreaView, StatusBar,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import { useTheme } from "../context/ThemeContext";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface InboxMessage {
  id:      string;
  sender:  string;  // e.g. restaurant name or "Ovena Support"
  message: string;  // the actual message text from the backend "message" field
  time:    string;  // formatted time string e.g. "10:05 am"
}

interface InboxScreenProps {
  onBack:    () => void;
  messages?: InboxMessage[];
}

// ── MessageCard component ─────────────────────────────────────────────────────

interface MessageCardProps {
  item:    InboxMessage;
  colors:  any;
  isFirst: boolean;
}

const MessageCard: React.FC<MessageCardProps> = ({ item, colors, isFirst }) => (
  <TouchableOpacity
    style={[
      styles.card,
      { backgroundColor: colors.card, borderColor: colors.separatorColor },
      isFirst && styles.cardFirst,
    ]}
    activeOpacity={0.75}
  >
    {/* Avatar circle with first letter */}
    <View style={[styles.avatar, { backgroundColor: colors.accentOrange }]}>
      <Text style={styles.avatarLetter}>
        {item.sender.charAt(0).toUpperCase()}
      </Text>
    </View>

    {/* Body */}
    <View style={styles.cardBody}>
      {/* Row: sender name + time */}
      <View style={styles.cardHeader}>
        <Text
          style={[styles.sender, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {item.sender}
        </Text>
        <Text style={[styles.time, { color: colors.textMuted }]}>
          {item.time}
        </Text>
      </View>

      {/* Message preview */}
      <Text
        style={[styles.messagePreview, { color: colors.textSecondary }]}
        numberOfLines={2}
      >
        {item.message}
      </Text>
    </View>

    {/* Unread dot */}
    <View style={[styles.unreadDot, { backgroundColor: colors.accentOrange }]} />
  </TouchableOpacity>
);

// ── Empty state ───────────────────────────────────────────────────────────────

const EmptyInbox: React.FC<{ colors: any }> = ({ colors }) => (
  <View style={styles.emptyContainer}>
    <View style={[styles.emptyIcon, { backgroundColor: colors.inputBg }]}>
      <IconSymbol name="InboxIcon" size={32} color={colors.textMuted} />
    </View>
    <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
      No messages yet
    </Text>
    <Text style={[styles.emptyBody, { color: colors.textMuted }]}>
      Order notifications and trip updates will appear here
    </Text>
  </View>
);

// ── Screen ────────────────────────────────────────────────────────────────────

const InboxScreen: React.FC<InboxScreenProps> = ({ onBack, messages = [] }) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.separatorColor }]}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconSymbol name="ArrowBack" size={22} color={colors.iconColor} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Inbox
          {messages.length > 0 && (
            <Text style={[styles.headerCount, { color: colors.accentOrange }]}>
              {" "}({messages.length})
            </Text>
          )}
        </Text>

        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={[styles.markAll, { color: colors.textMuted }]}>
            mark all as read
          </Text>
        </TouchableOpacity>
      </View>

      {/* List or empty state */}
      {messages.length === 0 ? (
        <EmptyInbox colors={colors} />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <MessageCard
              item={item}
              colors={colors}
              isFirst={index === 0}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default InboxScreen;

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe:   { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn:     { width: 36 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  headerCount: { fontSize: 16, fontWeight: "600" },
  markAll:     { fontSize: 13 },

  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 2,
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 14,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    position: "relative",
  },
  cardFirst: {
    // Slightly elevated appearance for the most recent message
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarLetter: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  cardBody:   { flex: 1 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sender: {
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  time:           { fontSize: 12 },
  messagePreview: { fontSize: 13, lineHeight: 19 },

  // Unread indicator dot
  unreadDot: {
    position: "absolute",
    top: 16,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 40,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
  emptyBody:  { fontSize: 14, textAlign: "center", lineHeight: 21 },
});