/**
 * app/support/chat.tsx
 *
 * Full chat screen between admin and a support requester, now backed by:
 *   GET  /api/admin/support/tickets/{id}/messages/
 *   POST /api/admin/support/tickets/{id}/messages/
 *
 * Ticket identity (owner role/id/email/category/status) arrives via route
 * params from the inbox tile press — there's no thread lookup against mock
 * data anymore, and no "is typing..." simulation, since replies now come
 * from a real backend on its own schedule.
 *
 * HTML source layout preserved:
 *  TopBar:  back arrow + role icon avatar + name/role + call/more actions
 *  Ambient: lava glow blobs
 *  Chat:    date pill, inbound (surface-container), outbound (primary-container)
 *           corner radius asymmetry as before
 *  Footer:  attach + text input (rounded-full) + emoji btn + send btn (lava, rounded-full)
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ScreenWrapper from '@/components/ScreenWrapper';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { useTicketMessages, OptimisticMessage } from '@/hooks/useTicketMessages';
import { OwnerRole } from '@/types/appData';

const ROLE_LABEL: Record<string, string> = {
  customer:       'Customer',
  driver:         'Driver',
  business_admin: 'Business Admin',
  business_staff: 'Business Staff',
};

const ROLE_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  customer:       'person-outline',
  driver:         'bicycle-outline',
  business_admin: 'briefcase-outline',
  business_staff: 'people-outline',
};

function PulsingDot({ color }: { color: string }) {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.2, duration: 500, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1,   duration: 500, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return <Animated.View style={[styles.pulsingDot, { backgroundColor: color, opacity }]} />;
}

// Replace MessageBubble entirely:
function MessageBubble({
  msg,
  isFromRequester,
  onRetry,
}: {
  msg: OptimisticMessage;
  isFromRequester: boolean;
  onRetry: (id: string) => void;
}) {
  const { colors, isDark } = useTheme();
  const isAdmin = !isFromRequester; // support-side renders right, requester renders left

  const bubbleBg    = isAdmin ? colors.primaryContainer : (isDark ? colors.surfaceContainer : colors.surfaceContainerLow);
  const bubbleColor = isAdmin ? colors.onPrimaryContainer : colors.onSurface;
  const borderColor = isAdmin ? 'transparent' : (isDark ? 'rgba(255,255,255,0.07)' : colors.border);

  const time = new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <View style={[styles.msgRow, isAdmin ? styles.msgRowAdmin : styles.msgRowUser]}>
      <View
        style={[
          styles.bubble,
          isAdmin ? styles.bubbleAdmin : styles.bubbleUser,
          { backgroundColor: bubbleBg, borderColor, opacity: msg.pending ? 0.6 : 1 },
        ]}
      >
        {!!msg.message && (
          <Text style={[styles.bubbleText, { color: bubbleColor, fontWeight: isAdmin ? '500' : '400' }]}>
            {msg.message}
          </Text>
        )}

        {msg.attachments.length > 0 && (
  <View style={[styles.attachmentGrid, msg.message ? { marginTop: Spacing.xs } : null]}>
    {msg.attachments.map(att =>
      att.content_type.startsWith('image/') ? (
        <Image
          key={att.id}
          source={{ uri: att.file }}
          style={styles.attachmentImage}
          resizeMode="cover"
        />
      ) : (
        <View key={att.id} style={[styles.attachmentFile, { borderColor }]}>
          <Ionicons name="document-outline" size={16} color={bubbleColor} />
          <Text style={[styles.attachmentFileName, { color: bubbleColor }]} numberOfLines={1}>
            {att.original_filename}
          </Text>
        </View>
      )
    )}
  </View>
)}
      </View>
      <View style={styles.timeRow}>
        {msg.pending && (
          <Text style={[styles.timeLabel, { color: colors.onSurfaceVariant }]}>Sending…</Text>
        )}
        {msg.failed && (
          <TouchableOpacity onPress={() => onRetry(msg.id)}>
            <Text style={[styles.timeLabel, { color: colors.error }]}>Failed — tap to retry</Text>
          </TouchableOpacity>
        )}
        {!msg.pending && !msg.failed && (
          <Text style={[styles.timeLabel, { color: colors.onSurfaceVariant, alignSelf: isAdmin ? 'flex-end' : 'flex-start' }]}>
            {time}
          </Text>
        )}
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const { colors, isDark } = useTheme();
  const insets             = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    threadId:   string;
    ownerRole:  string;
    ownerId:    string;
    ownerEmail: string;
    category:   string;
    status:     string;
  }>();

  const ticketId  = params.threadId;
  const ownerRole = (params.ownerRole ?? 'customer') as OwnerRole;
  const roleLabel = ROLE_LABEL[ownerRole] ?? ownerRole;
  const roleIcon  = ROLE_ICON[ownerRole] ?? 'help-circle-outline';
  const isOnline  = params.status !== 'closed';

// Update the hook call — ownerId param is no longer needed for direction logic:
const { messages, loading, error, sending, sendMessage, retryMessage, isFromRequester } =
  useTicketMessages(ticketId);

  const flatRef = useRef<FlatList>(null);
  const [inputText, setInputText] = useState('');

  const sendScale = useRef(new Animated.Value(1)).current;
  const onSendIn  = () => Animated.spring(sendScale, { toValue: 0.88, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  const onSendOut = () => Animated.spring(sendScale, { toValue: 1,    useNativeDriver: true, speed: 20, bounciness: 6 }).start();

  const attachScale = useRef(new Animated.Value(1)).current;
  const onAttachIn  = () => Animated.spring(attachScale, { toValue: 0.90, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  const onAttachOut = () => Animated.spring(attachScale, { toValue: 1,    useNativeDriver: true, speed: 20, bounciness: 6 }).start();

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed || sending) return;
    setInputText('');
    sendMessage(trimmed);
  };

  useEffect(() => {
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 80);
  }, [messages]);

  const cardBg   = isDark ? '#1c1b20' : colors.surfaceContainerLow;
  const topBarBg = colors.surfaceContainerLowest;
  const inputBg  = isDark ? '#262626' : colors.surfaceContainerLow;
  const footerBg = isDark ? 'rgba(27,27,30,0.85)' : `${colors.surface}E6`;

  if (!ticketId) {
    return (
      <ScreenWrapper>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.onSurfaceVariant }}>Ticket not found</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.ambientTopRight} />
      <View style={styles.ambientBottomLeft} />

      {/* ── Top app bar ── */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop:        insets.top,
            backgroundColor:   topBarBg,
            borderBottomColor: isDark ? 'rgba(89,66,55,0.10)' : colors.border,
          },
        ]}
      >
        <View style={styles.topBarLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={22} color={colors.primaryContainer} />
          </TouchableOpacity>

          <View style={[styles.avatarWrap, { borderColor: isDark ? 'rgba(255,255,255,0.07)' : colors.border, backgroundColor: cardBg }]}>
            <Ionicons name={roleIcon} size={20} color={colors.onSurfaceVariant} />
            {isOnline && <View style={styles.onlineDot} />}
          </View>

          <View style={styles.topBarInfo}>
            <Text style={[styles.topBarName, { color: colors.onSurface }]} numberOfLines={1}>
              {roleLabel} #{params.ownerId} · {params.category}
            </Text>
            <View style={styles.onlineRow}>
              <PulsingDot color={isOnline ? '#10b981' : colors.outlineVariant} />
              <Text style={[styles.onlineLabel, { color: colors.onSurfaceVariant }]}>
                {isOnline ? 'OPEN' : 'CLOSED'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="call-outline" size={20} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="ellipsis-vertical" size={20} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {loading && messages.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color={colors.primaryContainer} />
          </View>
        ) : (
          <FlatList
            ref={flatRef}
            data={messages}
            keyExtractor={m => m.id}
            contentContainerStyle={[styles.chatContent, { paddingBottom: insets.bottom + 80 }]}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <>
                <View style={styles.datePill}>
                  <View style={[styles.datePillInner, { backgroundColor: cardBg, borderColor: isDark ? 'rgba(89,66,55,0.12)' : colors.border }]}>
                    <Text style={[styles.datePillText, { color: colors.onSurfaceVariant }]}>
                      {params.ownerEmail || 'No email on file'}
                    </Text>
                  </View>
                </View>
                {!!error && (
                  <Text style={{ color: colors.error, textAlign: 'center', marginBottom: Spacing.sm }}>
                    {error}
                  </Text>
                )}
                {!loading && messages.length === 0 && !error && (
                  <Text style={{ color: colors.onSurfaceVariant, textAlign: 'center', marginTop: Spacing.lg }}>
                    No messages yet — start the conversation below.
                  </Text>
                )}
              </>
            )}
            
            renderItem={({ item }) => (
              <MessageBubble msg={item} isFromRequester={isFromRequester(item)} onRetry={retryMessage} />
            )}
          />
        )}

        {/* ── Footer input ── */}
        <View
          style={[
            styles.footer,
            { backgroundColor: footerBg, borderTopColor: isDark ? 'rgba(89,66,55,0.10)' : colors.border, paddingBottom: insets.bottom + 8 },
          ]}
        >
          <Animated.View style={{ transform: [{ scale: attachScale }] }}>
            <TouchableOpacity
              style={[styles.iconCircleBtn, { backgroundColor: colors.surfaceContainerHigh }]}
              onPressIn={onAttachIn}
              onPressOut={onAttachOut}
              activeOpacity={1}
            >
              <Ionicons name="attach" size={20} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </Animated.View>

          <View style={[styles.inputWrap, { backgroundColor: inputBg, borderColor: isDark ? 'rgba(89,66,55,0.20)' : colors.border }]}>
            <TextInput
              style={[styles.chatInput, { color: colors.onSurface }]}
              placeholder="Type a message..."
              placeholderTextColor={colors.onSurfaceVariant + '80'}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
              selectionColor={colors.primaryContainer}
            />
            <TouchableOpacity style={styles.emojiBtn}>
              <Ionicons name="happy-outline" size={20} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          <Animated.View style={{ transform: [{ scale: sendScale }] }}>
            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: colors.primaryContainer, opacity: sending ? 0.6 : 1 }]}
              onPressIn={onSendIn}
              onPressOut={onSendOut}
              onPress={handleSend}
              disabled={sending}
              activeOpacity={1}
            >
              <Ionicons name="send" size={20} color={colors.onPrimaryContainer} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  ambientTopRight: { position: 'absolute', top: '-10%', right: '-10%', width: '50%', aspectRatio: 1, backgroundColor: 'rgba(255,182,145,0.04)', borderRadius: 999, zIndex: -1 },
  ambientBottomLeft: { position: 'absolute', bottom: '-10%', left: '-10%', width: '40%', aspectRatio: 1, backgroundColor: 'rgba(245,110,15,0.04)', borderRadius: 999, zIndex: -1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm, borderBottomWidth: 1, minHeight: 64 },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  avatarWrap: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  onlineDot: {
    position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#10b981', borderWidth: 2, borderColor: '#0e0e12',
    shadowColor: '#10b981', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 4,
  },
  topBarInfo: { flex: 1, gap: 2 },
  topBarName: { fontFamily: FontFamily.heading, fontSize: 16, fontWeight: '600', letterSpacing: -0.2 },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  onlineLabel: { fontFamily: FontFamily.mono, fontSize: 10, fontWeight: '500', letterSpacing: 1 },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  chatContent: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, gap: Spacing.md },
  datePill: { alignItems: 'center', marginBottom: Spacing.sm, marginTop: Spacing.xs },
  datePillInner: { paddingHorizontal: Spacing.md, paddingVertical: 5, borderRadius: Radius.full, borderWidth: 1 },
  datePillText: { fontFamily: FontFamily.mono, fontSize: 12, fontWeight: '500', letterSpacing: 0.8 },
  msgRow: { maxWidth: '85%', gap: 4 },
  msgRowAdmin: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  msgRowUser: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderWidth: 1 },
  bubbleAdmin: {
    borderTopLeftRadius: Radius.xl, borderBottomLeftRadius: Radius.xl, borderBottomRightRadius: Radius.xl, borderTopRightRadius: 4,
    shadowColor: '#f56e0f', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.20, shadowRadius: 8, elevation: 4,
  },
  bubbleUser: { borderTopRightRadius: Radius.xl, borderBottomRightRadius: Radius.xl, borderBottomLeftRadius: Radius.xl, borderTopLeftRadius: 4 },
  bubbleText: { fontFamily: FontFamily.body, fontSize: 14, lineHeight: 20 },
  timeRow: { marginHorizontal: 4 },
  timeLabel: { fontFamily: FontFamily.mono, fontSize: 10, fontWeight: '500', letterSpacing: 0.3 },
  pulsingDot: { width: 8, height: 8, borderRadius: 4 },
  footer: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, borderTopWidth: 1 },
  iconCircleBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  inputWrap: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', borderRadius: Radius.full, borderWidth: 1, paddingHorizontal: Spacing.md, paddingVertical: 4, minHeight: 48, maxHeight: 120 },
  chatInput: { flex: 1, fontFamily: FontFamily.body, fontSize: 14, lineHeight: 20, paddingVertical: Spacing.xs, maxHeight: 112 },
  emojiBtn: { paddingBottom: Spacing.xs, paddingLeft: 4 },
  sendBtn: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', shadowColor: '#f56e0f', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.30, shadowRadius: 8, elevation: 6 },
  // Add to StyleSheet.create({...}):
attachmentGrid: {
  flexDirection: 'row',
  flexWrap:      'wrap',
  gap:           6,
},
attachmentImage: {
  width:        160,
  height:       160,
  borderRadius: Radius.md,
},
attachmentFile: {
  flexDirection:     'row',
  alignItems:        'center',
  gap:               6,
  paddingHorizontal: Spacing.sm,
  paddingVertical:   6,
  borderWidth:       1,
  borderRadius:      Radius.md,
  maxWidth:          200,
},
attachmentFileName: {
  fontFamily: FontFamily.mono,
  fontSize:   11,
  flexShrink: 1,
},
});