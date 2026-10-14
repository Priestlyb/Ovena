/**
 * components/NotificationToast.tsx
 *
 * App-wide toast banner for admin/branch/driver notifications arriving
 * over the shared admin WS (AdminOrdersWebSocketContext). Mounted ONCE at
 * the app root (app/_layout.tsx) — notifications aren't screen-specific,
 * the WS connection they ride on is app-wide, so this shows on every
 * screen rather than being duplicated per-screen.
 *
 * Positioned below the status bar/notch using safe-area insets (same
 * pattern as app/(tabs)/ops.tsx's top bar) so it never touches it.
 * Auto-dismisses after AUTO_DISMISS_MS; the X button dismisses
 * immediately either way. If another notification arrived while this one
 * was showing, it's already queued in context and appears right after.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeContext';
import { useAdminOrdersWS } from '@/context/AdminOrdersWebSocketContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';

const AUTO_DISMISS_MS = 4000;

export function NotificationToast() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { toast, dismissToast } = useAdminOrdersWS();

  const translateY = useRef(new Animated.Value(-140)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (toast) {
      Animated.spring(translateY, {
        toValue: 0, useNativeDriver: true, speed: 14, bounciness: 6,
      }).start();
      timerRef.current = setTimeout(() => {
        dismissToast();
      }, AUTO_DISMISS_MS);
    } else {
      Animated.timing(translateY, {
        toValue: -140, duration: 200, useNativeDriver: true,
      }).start();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast, dismissToast, translateY]);

  // Still rendered (translated off-screen) even with no toast, so the
  // dismiss animation has something to animate — returning null here
  // would yank it away instantly instead of sliding out.
  return (
    <Animated.View
      pointerEvents={toast ? 'box-none' : 'none'}
      style={[
        styles.wrapper,
        { paddingTop: insets.top + Spacing.sm, transform: [{ translateY }] },
      ]}
    >
      {toast && (
        <View style={[styles.card, { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle }]}>
          <View style={styles.textWrap}>
            <Text style={[styles.title, { color: colors.onSurface }]} numberOfLines={1}>
              {toast.title}
            </Text>
            <Text style={[styles.message, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
              {toast.message}
            </Text>
          </View>
          <Pressable onPress={dismissToast} hitSlop={10} style={styles.closeBtn}>
            <Ionicons name="close" size={16} color={colors.onSurfaceVariant} />
          </Pressable>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 999,
    paddingHorizontal: Spacing.gutter,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  textWrap: { flex: 1, gap: 2 },
  title: { fontFamily: FontFamily.heading, fontSize: 13, fontWeight: '700' },
  message: { fontFamily: FontFamily.body, fontSize: 11, lineHeight: 15 },
  closeBtn: { padding: 2 },
});