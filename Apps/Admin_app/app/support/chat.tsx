/**
 * app/support/chat.tsx
 *
 * Full chat screen between admin and a support requester.
 * Receives `threadId` as a route param from the inbox tile press.
 *
 * HTML source faithfully implemented:
 *  TopBar:  back arrow + avatar (round, online dot) + name/role + call/more actions
 *  Ambient: lava glow blobs (via subtle radial gradients approximated with Views)
 *  Chat:    date pill, inbound messages (surface-container), outbound (primary-container)
 *           corner radius asymmetry — inbound: tr-2xl br-2xl bl-2xl / outbound: tl-2xl bl-2xl br-2xl
 *           "Support Admin is typing..." pulsing indicator
 *  Footer:  attach + text input (rounded-full) + emoji btn + send btn (lava, rounded-full)
 *           Send: active:scale-90 spring
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ScreenWrapper from '@/components/ScreenWrapper';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { ALL_THREADS, ChatMessage } from '@/data/supportData';

// ─── Pulsing dot (typing indicator) ──────────────────────────────────────────
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

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg }: { msg: ChatMessage }) {
  const { colors, isDark } = useTheme();
  const isAdmin = msg.fromAdmin;

  const bubbleBg     = isAdmin
    ? colors.primaryContainer
    : (isDark ? colors.surfaceContainer : colors.surfaceContainerLow);
  const bubbleColor  = isAdmin ? colors.onPrimaryContainer : colors.onSurface;
  const borderColor  = isAdmin ? 'transparent' : (isDark ? 'rgba(255,255,255,0.07)' : colors.border);

  return (
    <View style={[styles.msgRow, isAdmin ? styles.msgRowAdmin : styles.msgRowUser]}>
      <View
        style={[
          styles.bubble,
          isAdmin ? styles.bubbleAdmin : styles.bubbleUser,
          { backgroundColor: bubbleBg, borderColor },
        ]}
      >
        <Text style={[styles.bubbleText, { color: bubbleColor, fontWeight: isAdmin ? '500' : '400' }]}>
          {msg.text}
        </Text>
      </View>
      <Text style={[styles.timeLabel, { color: colors.onSurfaceVariant, alignSelf: isAdmin ? 'flex-end' : 'flex-start' }]}>
        {msg.time}
      </Text>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ChatScreen() {
  const { colors, isDark } = useTheme();
  const insets             = useSafeAreaInsets();
  const { threadId }       = useLocalSearchParams<{ threadId: string }>();

  const thread = ALL_THREADS.find(t => t.id === threadId);
  const flatRef = useRef<FlatList>(null);

  const [messages,    setMessages]    = useState<ChatMessage[]>(thread?.messages ?? []);
  const [inputText,   setInputText]   = useState('');
  const [isTyping,    setIsTyping]    = useState(false);

  // Send button: active:scale-90
  const sendScale = useRef(new Animated.Value(1)).current;
  const onSendIn  = () => Animated.spring(sendScale, { toValue: 0.88, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  const onSendOut = () => Animated.spring(sendScale, { toValue: 1,    useNativeDriver: true, speed: 20, bounciness: 6 }).start();

  // Attach / action buttons: active:scale-90
  const attachScale = useRef(new Animated.Value(1)).current;
  const onAttachIn  = () => Animated.spring(attachScale, { toValue: 0.90, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  const onAttachOut = () => Animated.spring(attachScale, { toValue: 1,    useNativeDriver: true, speed: 20, bounciness: 6 }).start();

  // Simulate "user is typing..." after admin sends
  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const newMsg: ChatMessage = {
      id:        `m_${Date.now()}`,
      text:      trimmed,
      fromAdmin: true,
      time:      new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Show "typing..." for 2s then reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply: ChatMessage = {
        id:        `m_reply_${Date.now()}`,
        text:      getAutoReply(trimmed),
        fromAdmin: false,
        time:      new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, reply]);
    }, 2200);
  };

  // Scroll to bottom on new message
  useEffect(() => {
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 80);
  }, [messages, isTyping]);

  const cardBg     = isDark ? '#1c1b20' : colors.surfaceContainerLow;
  const topBarBg   = colors.surfaceContainerLowest;
  const inputBg    = isDark ? '#262626' : colors.surfaceContainerLow;
  const footerBg   = isDark ? 'rgba(27,27,30,0.85)' : `${colors.surface}E6`;

  if (!thread) {
    return (
      <ScreenWrapper>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.onSurfaceVariant }}>Thread not found</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={{ flex: 1, backgroundColor: colors.background }}>
      {/* ── Ambient glow blobs (approximated) ── */}
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
        {/* Left: back + avatar + name */}
        <View style={styles.topBarLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={22} color={colors.primaryContainer} />
          </TouchableOpacity>

          <View style={styles.avatarContainer}>
            <Image source={{ uri: thread.avatarUri }} style={styles.topAvatar} />
            {thread.isOnline && <View style={styles.onlineDot} />}
          </View>

          <View style={styles.topBarInfo}>
            <Text style={[styles.topBarName, { color: colors.onSurface }]} numberOfLines={1}>
              {thread.name} · {thread.role}
            </Text>
            <View style={styles.onlineRow}>
              <PulsingDot color={thread.isOnline ? '#10b981' : colors.outlineVariant} />
              <Text style={[styles.onlineLabel, { color: colors.onSurfaceVariant }]}>
                {thread.isOnline ? 'ONLINE' : 'OFFLINE'}
              </Text>
            </View>
          </View>
        </View>

        {/* Right: call + more */}
        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="call-outline" size={20} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="ellipsis-vertical" size={20} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Chat area ── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={m => m.id}
          contentContainerStyle={[
            styles.chatContent,
            { paddingBottom: insets.bottom + 80 },
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View style={styles.datePill}>
              <View
                style={[
                  styles.datePillInner,
                  { backgroundColor: cardBg, borderColor: isDark ? 'rgba(89,66,55,0.12)' : colors.border },
                ]}
              >
                <Text style={[styles.datePillText, { color: colors.onSurfaceVariant }]}>TODAY</Text>
              </View>
            </View>
          )}
          renderItem={({ item }) => <MessageBubble msg={item} />}
          ListFooterComponent={() =>
            isTyping ? (
              <View style={[styles.typingRow, { borderColor: isDark ? 'rgba(255,255,255,0.05)' : colors.border }]}>
                <PulsingDot color={colors.primaryContainer} />
                <Text style={[styles.typingText, { color: colors.onSurfaceVariant }]}>
                  {thread.name} is typing...
                </Text>
              </View>
            ) : null
          }
        />

        {/* ── Footer input ── */}
        <View
          style={[
            styles.footer,
            {
              backgroundColor:  footerBg,
              borderTopColor:   isDark ? 'rgba(89,66,55,0.10)' : colors.border,
              paddingBottom:    insets.bottom + 8,
            },
          ]}
        >
          {/* Attach button */}
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

          {/* Text input */}
          <View
            style={[
              styles.inputWrap,
              { backgroundColor: inputBg, borderColor: isDark ? 'rgba(89,66,55,0.20)' : colors.border },
            ]}
          >
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

          {/* Send button */}
          <Animated.View style={{ transform: [{ scale: sendScale }] }}>
            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: colors.primaryContainer }]}
              onPressIn={onSendIn}
              onPressOut={onSendOut}
              onPress={handleSend}
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

// ─── Auto-reply simulation ────────────────────────────────────────────────────
const AUTO_REPLIES = [
  "Thank you for the update. I'll look into this right away.",
  "Got it! Just a moment while I check the details on my end.",
  "I understand. Let me escalate this to the relevant team.",
  "That's helpful context. I've made a note on your account.",
  "Thanks for confirming. The issue should be resolved shortly.",
];
function getAutoReply(msg: string): string {
  return AUTO_REPLIES[Math.abs(msg.length) % AUTO_REPLIES.length];
}

const styles = StyleSheet.create({
  // Ambient glows
  ambientTopRight: {
    position:     'absolute',
    top:          '-10%',
    right:        '-10%',
    width:        '50%',
    aspectRatio:  1,
    backgroundColor: 'rgba(255,182,145,0.04)',
    borderRadius: 999,
    zIndex:       -1,
  },
  ambientBottomLeft: {
    position:     'absolute',
    bottom:       '-10%',
    left:         '-10%',
    width:        '40%',
    aspectRatio:  1,
    backgroundColor: 'rgba(245,110,15,0.04)',
    borderRadius: 999,
    zIndex:       -1,
  },
  // Top bar
  topBar: {
    flexDirection:    'row',
    justifyContent:   'space-between',
    alignItems:       'center',
    paddingHorizontal: Spacing.md,
    paddingBottom:    Spacing.sm,
    borderBottomWidth: 1,
    minHeight:        64,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.sm,
    flex:          1,
  },
  iconBtn: {
    width:          36,
    height:         36,
    borderRadius:   18,
    justifyContent: 'center',
    alignItems:     'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  topAvatar: {
    width:        40,
    height:       40,
    borderRadius: 20,
  },
  onlineDot: {
    position:     'absolute',
    bottom:       0,
    right:        0,
    width:        10,
    height:       10,
    borderRadius: 5,
    backgroundColor: '#10b981',
    borderWidth:  2,
    borderColor:  '#0e0e12',
    shadowColor:  '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  topBarInfo: {
    flex: 1,
    gap:  2,
  },
  topBarName: {
    fontFamily:    FontFamily.heading,
    fontSize:      16,
    fontWeight:    '600',
    letterSpacing: -0.2,
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           5,
  },
  onlineLabel: {
    fontFamily:    FontFamily.mono,
    fontSize:      10,
    fontWeight:    '500',
    letterSpacing: 1,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           4,
  },
  // Chat
  chatContent: {
    paddingHorizontal: Spacing.md,
    paddingTop:        Spacing.md,
    gap:               Spacing.md,
  },
  datePill: {
    alignItems:    'center',
    marginBottom:  Spacing.sm,
    marginTop:     Spacing.xs,
  },
  datePillInner: {
    paddingHorizontal: Spacing.md,
    paddingVertical:   5,
    borderRadius:      Radius.full,
    borderWidth:       1,
  },
  datePillText: {
    fontFamily:    FontFamily.mono,
    fontSize:      12,
    fontWeight:    '500',
    letterSpacing: 0.8,
  },
  msgRow: {
    maxWidth: '85%',
    gap:      4,
  },
  msgRowAdmin: {
    alignSelf:  'flex-end',
    alignItems: 'flex-end',
  },
  msgRowUser: {
    alignSelf:  'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    paddingVertical:   Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth:       1,
  },
  bubbleAdmin: {
    borderTopLeftRadius:     Radius.xl,
    borderBottomLeftRadius:  Radius.xl,
    borderBottomRightRadius: Radius.xl,
    borderTopRightRadius:    4,
    // lava shadow
    shadowColor:   '#f56e0f',
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius:  8,
    elevation:     4,
  },
  bubbleUser: {
    borderTopRightRadius:    Radius.xl,
    borderBottomRightRadius: Radius.xl,
    borderBottomLeftRadius:  Radius.xl,
    borderTopLeftRadius:     4,
  },
  bubbleText: {
    fontFamily:  FontFamily.body,
    fontSize:    14,
    lineHeight:  20,
  },
  timeLabel: {
    fontFamily:    FontFamily.mono,
    fontSize:      10,
    fontWeight:    '500',
    letterSpacing: 0.3,
    marginHorizontal: 4,
  },
  // Typing indicator
  typingRow: {
    flexDirection: 'row',
    alignItems:    'center',
    justifyContent: 'center',
    gap:           Spacing.xs,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginTop:     Spacing.xs,
  },
  typingText: {
    fontFamily:   FontFamily.mono,
    fontSize:     12,
    fontWeight:   '500',
    fontStyle:    'italic',
    letterSpacing: 0.2,
  },
  pulsingDot: {
    width:        8,
    height:       8,
    borderRadius: 4,
  },
  // Footer
  footer: {
    flexDirection:    'row',
    alignItems:       'flex-end',
    gap:              Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingTop:       Spacing.sm,
    borderTopWidth:   1,
  },
  iconCircleBtn: {
    width:          44,
    height:         44,
    borderRadius:   22,
    justifyContent: 'center',
    alignItems:     'center',
  },
  inputWrap: {
    flex:             1,
    flexDirection:    'row',
    alignItems:       'flex-end',
    borderRadius:     Radius.full,
    borderWidth:      1,
    paddingHorizontal: Spacing.md,
    paddingVertical:  4,
    minHeight:        48,
    maxHeight:        120,
  },
  chatInput: {
    flex:        1,
    fontFamily:  FontFamily.body,
    fontSize:    14,
    lineHeight:  20,
    paddingVertical: Spacing.xs,
    maxHeight:   112,
  },
  emojiBtn: {
    paddingBottom: Spacing.xs,
    paddingLeft:   4,
  },
  sendBtn: {
    width:          48,
    height:         48,
    borderRadius:   24,
    justifyContent: 'center',
    alignItems:     'center',
    shadowColor:    '#f56e0f',
    shadowOffset:   { width: 0, height: 2 },
    shadowOpacity:  0.30,
    shadowRadius:   8,
    elevation:      6,
  },
});