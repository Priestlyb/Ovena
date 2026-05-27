// screens/InboxScreen.tsx
import React, { useRef, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, SafeAreaView, StatusBar, Modal,
  Animated, Easing, ScrollView, Alert,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import { useTheme } from "../context/ThemeContext";
import ScreenWrapper from "../components/ScreenWrapper";
import { InboxMessage } from "../hooks/useInboxStore";

// Re-export so HomeScreen can still import the type from here if preferred
export type { InboxMessage };

// ── Props ─────────────────────────────────────────────────────────────────────

interface InboxScreenProps {
  onBack:         () => void;
  messages?:      InboxMessage[];
  onMarkAllRead?: () => void;
  onMarkRead?:    (id: string) => void;
  onDeleteAll?:   () => void;
}

// ── MessageDetailPopup ────────────────────────────────────────────────────────
// Bottom-sheet style modal that shows the full message content.

interface DetailPopupProps {
  message:  InboxMessage | null;
  colors:   any;
  onClose:  () => void;
}

const MessageDetailPopup: React.FC<DetailPopupProps> = ({ message, colors, onClose }) => {
  const slideAnim = useRef(new Animated.Value(400)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  const visible = message !== null;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1, duration: 220,
          easing: Easing.out(Easing.ease), useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0, friction: 9, tension: 70, useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 400, duration: 200, useNativeDriver: true }),
      ]).start();
      // Reset for next open
      setTimeout(() => {
        fadeAnim.setValue(0);
        slideAnim.setValue(400);
      }, 220);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Animated.View
        style={[popupStyles.backdrop, { opacity: fadeAnim }]}
        pointerEvents={visible ? "auto" : "none"}
      >
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />

        {/* Sheet */}
        <Animated.View
          style={[
            popupStyles.sheet,
            { backgroundColor: colors.card, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Handle bar */}
          <View style={[popupStyles.handle, { backgroundColor: colors.separatorColor }]} />

          {/* Header */}
          <View style={[popupStyles.headerRow, { borderBottomColor: colors.separatorColor }]}>
            {/* Avatar */}
            <View style={[popupStyles.avatar, { backgroundColor: colors.accentOrange }]}>
              <Text style={popupStyles.avatarLetter}>
                {message?.sender.charAt(0).toUpperCase() ?? "?"}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[popupStyles.sender, { color: colors.textPrimary }]} numberOfLines={1}>
                {message?.sender}
              </Text>
              <Text style={[popupStyles.time, { color: colors.textMuted }]}>
                {message?.time}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconSymbol name="ChevronDownIcon" size={22} color={colors.iconColor} />
            </TouchableOpacity>
          </View>

          {/* Message body */}
          <ScrollView
            style={popupStyles.bodyScroll}
            contentContainerStyle={popupStyles.bodyContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[popupStyles.bodyText, { color: colors.textPrimary }]}>
              {message?.message}
            </Text>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const popupStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 24,
  },
  handle: {
    width: 40, height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  avatarLetter: { color: "#fff", fontSize: 17, fontWeight: "700" },
  sender: { fontSize: 15, fontWeight: "700" },
  time:   { fontSize: 12, marginTop: 2 },
  bodyScroll:   { flex: 1 },
  bodyContent:  { padding: 20, paddingTop: 16 },
  bodyText:     { fontSize: 15, lineHeight: 24 },
});

// ── MessageCard ───────────────────────────────────────────────────────────────

interface MessageCardProps {
  item:    InboxMessage;
  colors:  any;
  isFirst: boolean;
  onPress: () => void;
}

const MessageCard: React.FC<MessageCardProps> = ({ item, colors, isFirst, onPress }) => (
  <TouchableOpacity
    style={[
      styles.card,
      { backgroundColor: colors.card, borderColor: colors.separatorColor },
      isFirst && styles.cardFirst,
    ]}
    activeOpacity={0.75}
    onPress={onPress}
  >
    {/* Avatar */}
    <View style={[styles.avatar, { backgroundColor: colors.accentOrange }]}>
      <Text style={styles.avatarLetter}>
        {item.sender.charAt(0).toUpperCase()}
      </Text>
    </View>

    {/* Body */}
    <View style={styles.cardBody}>
      <View style={styles.cardHeader}>
        <Text
          style={[
            styles.sender,
            { color: colors.textPrimary },
            !item.read && styles.senderUnread,
          ]}
          numberOfLines={1}
        >
          {item.sender}
        </Text>
        <Text style={[styles.time, { color: colors.textMuted }]}>{item.time}</Text>
      </View>

      <Text
        style={[
          styles.messagePreview,
          { color: item.read ? colors.textSecondary : colors.textPrimary },
        ]}
        numberOfLines={2}
      >
        {item.message}
      </Text>
    </View>

    {/* Unread dot — only shown when unread */}
    {!item.read && (
      <View style={[styles.unreadDot, { backgroundColor: colors.accentOrange }]} />
    )}
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

const InboxScreen: React.FC<InboxScreenProps> = ({
  onBack,
  messages = [],
  onMarkAllRead,
  onMarkRead,
  onDeleteAll,
}) => {
  const { colors } = useTheme();
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);

  const handleCardPress = (item: InboxMessage) => {
    setSelectedMessage(item);
    if (!item.read) onMarkRead?.(item.id);
  };

  const handleDeleteAll = () => {
    Alert.alert(
      "Delete all messages",
      "This will permanently delete all messages from your inbox and device. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete all",
          style: "destructive",
          onPress: () => onDeleteAll?.(),
        },
      ]
    );
  };

  const unreadCount = messages.filter((m) => !m.read).length;
  const hasMessages = messages.length > 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.background} />
      <ScreenWrapper style={{ padding: 0 }}>

        {/* ── Header ── */}
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

          {/* Mark all as read — only active when there are unread messages */}
          <TouchableOpacity
            onPress={() => unreadCount > 0 && onMarkAllRead?.()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            disabled={unreadCount === 0}
          >
            <Text style={[
              styles.markAll,
              { color: unreadCount > 0 ? colors.accentOrange : colors.textMuted },
            ]}>
              mark all as read
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── List or empty state ── */}
        {!hasMessages ? (
          <EmptyInbox colors={colors} />
        ) : (
          <>
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
                  onPress={() => handleCardPress(item)}
                />
              )}
            />

            {/* ── Delete all button ── */}
            <View style={[styles.footer, { borderTopColor: colors.separatorColor }]}>
              <TouchableOpacity
                style={[styles.deleteAllBtn, { backgroundColor: colors.inputBg }]}
                onPress={handleDeleteAll}
                activeOpacity={0.75}
              >
                <IconSymbol name="DeleteEmptyIcon" size={18} color="#EF4444" />
                <Text style={styles.deleteAllText}>Delete all messages</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

      </ScreenWrapper>

      {/* ── Message detail popup ── */}
      <MessageDetailPopup
        message={selectedMessage}
        colors={colors}
        onClose={() => setSelectedMessage(null)}
      />
    </SafeAreaView>
  );
};

export default InboxScreen;

// ── Styles ────────────────────────────────────────────────────────────────────

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
  backBtn:     { width: 36 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  headerCount: { fontSize: 16, fontWeight: "600" },
  markAll:     { fontSize: 13, fontWeight: "500" },

  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
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
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },

  avatar: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  avatarLetter: { color: "#fff", fontSize: 18, fontWeight: "700" },

  cardBody:   { flex: 1 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sender:       { fontSize: 15, fontWeight: "400", flex: 1, marginRight: 8 },
  senderUnread: { fontWeight: "700" },
  time:         { fontSize: 12 },
  messagePreview: { fontSize: 13, lineHeight: 19 },

  unreadDot: {
    position: "absolute",
    top: 16, right: 14,
    width: 8, height: 8, borderRadius: 4,
  },

  // ── Footer: delete all ────────────────────────────────────────────────────
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  deleteAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  deleteAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EF4444",
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
    width: 72, height: 72, borderRadius: 36,
    alignItems: "center", justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
  emptyBody:  { fontSize: 14, textAlign: "center", lineHeight: 21 },
});