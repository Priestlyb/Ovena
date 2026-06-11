/**
 * components/support/InboxTile.tsx
 *
 * Key constraint: a single Animated.Value must use the same useNativeDriver
 * value for every animation that touches it. Mixing native (transform) and
 * non-native (backgroundColor) on the SAME Animated.View causes a crash.
 *
 * Solution: two nested Animated.Views
 *   Outer  → backgroundColor via non-native interpolation (hoverBg)
 *   Inner  → transform: scale via native driver (pressScale)
 *
 * Swipe right → resolve confirm modal (habits swipeActionRight pattern).
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { SupportThread, ThreadStatus } from '@/data/supportData';

interface InboxTileProps {
  thread:         SupportThread;
  onPress:        () => void;
  onSwipeResolve: (thread: SupportThread) => void;
  isResolved:     boolean;
}

function useBadgeStyle(status: ThreadStatus) {
  const { colors } = useTheme();
  switch (status) {
    case 'new':      return { bg: colors.primaryContainer,                text: colors.onPrimaryContainer,              label: 'NEW'      };
    case 'urgent':   return { bg: colors.errorContainer,                  text: colors.onErrorContainer ?? colors.error, label: 'URGENT'   };
    case 'pending':  return { bg: colors.secondaryContainer ?? '#474746', text: colors.onSecondaryContainer ?? '#b7b5b4', label: 'PENDING'  };
    case 'resolved': return { bg: colors.surfaceContainerHighest,         text: colors.onSurfaceVariant,                 label: 'RESOLVED' };
  }
}

function RightSwipeAction() {
  return (
    <View style={styles.swipeActionRight}>
      <Ionicons name="checkmark-circle-outline" size={32} color="#fff" />
      <Text style={styles.swipeActionText}>Resolve</Text>
    </View>
  );
}

export function InboxTile({ thread, onPress, onSwipeResolve, isResolved }: InboxTileProps) {
  const { colors, isDark } = useTheme();
  const swipeRef = useRef<Swipeable>(null);
  const badge    = useBadgeStyle(isResolved ? 'resolved' : thread.status);

  // ── Native-driver value: transform only ───────────────────────────────────
  const pressScale = useRef(new Animated.Value(1)).current;

  // ── Non-native value: backgroundColor only ────────────────────────────────
  // Must NEVER share an Animated.View with pressScale.
  const hoverBg = useRef(new Animated.Value(0)).current;
  const bgColor  = hoverBg.interpolate({
    inputRange:  [0, 1],
    outputRange: [
      isDark ? 'rgba(255,255,255,0.00)' : 'rgba(0,0,0,0.00)',
      isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
    ],
  });

  const onPressIn = () => {
    // Two separate .start() calls — never Animated.parallel across different drivers
    Animated.spring(pressScale, { toValue: 0.98, useNativeDriver: true,  speed: 60, bounciness: 2 }).start();
    Animated.timing(hoverBg,   { toValue: 1,    useNativeDriver: false, duration: 120 }).start();
  };
  const onPressOut = () => {
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true,  speed: 25, bounciness: 4 }).start();
    Animated.timing(hoverBg,   { toValue: 0, useNativeDriver: false, duration: 200 }).start();
  };

  const cardBase   = isDark ? '#1c1b20' : colors.surfaceContainerLow;
  const cardBorder = isDark ? 'rgba(255,255,255,0.07)' : colors.border;
  const showStripe = !isResolved && (thread.status === 'new' || thread.status === 'urgent');
  const stripeColor = thread.status === 'urgent' ? colors.error : colors.primaryContainer;
  const tileOpacity = isResolved || thread.status === 'resolved' ? 0.65 : 1;

  return (
    <Swipeable
      ref={swipeRef}
      overshootRight={false}
      renderRightActions={() => <RightSwipeAction />}
      onSwipeableOpen={(direction) => {
        if (direction === 'right') {
          swipeRef.current?.close();
          onSwipeResolve(thread);
        }
      }}
    >
      <TouchableWithoutFeedback
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
      >
        {/*
          OUTER Animated.View — non-native only (backgroundColor).
          Must NOT have transform here.
        */}
        <Animated.View
          style={[
            styles.outerWrap,
            {
              backgroundColor: bgColor,   // non-native
              borderColor:     cardBorder,
              opacity:         tileOpacity,
            },
          ]}
        >
          {/* Static card background sits below everything */}
          <View style={[StyleSheet.absoluteFill, { backgroundColor: cardBase, borderRadius: 32 }]} />

          {/* Left accent stripe */}
          {showStripe && (
            <View style={[styles.stripe, { backgroundColor: stripeColor }]} />
          )}

          {/*
            INNER Animated.View — native only (transform: scale).
            Must NOT have backgroundColor here.
          */}
          <Animated.View
            style={[
              styles.innerRow,
              { transform: [{ scale: pressScale }] },   // native
            ]}
          >
            {/* Avatar */}
            <View style={[styles.avatarWrap, { borderColor: cardBorder }]}>
              <Image
                source={{ uri: thread.avatarUri }}
                style={[
                  styles.avatar,
                  (isResolved || thread.status === 'resolved') && styles.avatarGray,
                ]}
              />
            </View>

            {/* Body */}
            <View style={styles.body}>
              <View style={styles.topRow}>
                <Text style={[styles.name, { color: colors.onSurface }]} numberOfLines={1}>
                  {thread.name}
                </Text>
                <Text style={[styles.timeAgo, { color: colors.onSurfaceVariant }]}>
                  {thread.timeAgo}
                </Text>
              </View>
              <Text style={[styles.preview, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                {thread.preview}
              </Text>
              <View style={styles.metaRow}>
                <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.badgeText, { color: badge.text }]}>
                    {isResolved ? 'RESOLVED' : badge.label}
                  </Text>
                </View>
                <Text style={[styles.refCode, { color: colors.onSurfaceVariant + '66' }]}>
                  {thread.refCode}
                </Text>
              </View>
            </View>

            {/* Chevron */}
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.onSurfaceVariant}
            />
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  // Outer: non-native bg animation lives here
  outerWrap: {
    borderRadius: 32,
    borderWidth:  1,
    overflow:     'hidden',
    marginBottom: Spacing.sm,
  },
  // Inner: native scale animation lives here — flex row for content
  innerRow: {
    flexDirection: 'row',
    alignItems:    'center',
    padding:       Spacing.md,
    gap:           Spacing.md,
  },
  stripe: {
    position: 'absolute',
    left:     0,
    top:      0,
    bottom:   0,
    width:    4,
    borderTopLeftRadius:    32,
    borderBottomLeftRadius: 32,
  },
  avatarWrap: {
    width:        56,
    height:       56,
    borderRadius: Radius.xl,
    borderWidth:  1,
    overflow:     'hidden',
    flexShrink:   0,
  },
  avatar: {
    width:  '100%',
    height: '100%',
  },
  avatarGray: {
    opacity: 0.5,
  },
  body: {
    flex: 1,
    gap:  3,
  },
  topRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'flex-start',
  },
  name: {
    fontFamily:    FontFamily.heading,
    fontSize:      18,
    fontWeight:    '600',
    lineHeight:    24,
    letterSpacing: -0.2,
    flex:          1,
    marginRight:   Spacing.xs,
  },
  timeAgo: {
    fontFamily: FontFamily.mono,
    fontSize:   10,
    fontWeight: '500',
    lineHeight: 14,
    flexShrink: 0,
  },
  preview: {
    fontFamily: FontFamily.body,
    fontSize:   14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.sm,
    marginTop:     2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical:   2,
    borderRadius:      Radius.full,
  },
  badgeText: {
    fontFamily:    FontFamily.mono,
    fontSize:      10,
    fontWeight:    '500',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  refCode: {
    fontFamily:    FontFamily.mono,
    fontSize:      10,
    fontWeight:    '500',
    letterSpacing: 0.5,
  },
  swipeActionRight: {
    justifyContent:  'center',
    alignItems:      'flex-end',
    flex:            1,
    backgroundColor: '#16a34a',
    borderRadius:    32,
    marginBottom:    Spacing.sm,
    paddingRight:    Spacing.lg,
    gap:             4,
  },
  swipeActionText: {
    fontFamily:    FontFamily.mono,
    fontSize:      10,
    fontWeight:    '500',
    color:         '#fff',
    letterSpacing: 0.5,
  },
});