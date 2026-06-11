/**
 * components/home/Header.tsx
 *
 * Mirrors HTML exactly:
 *  - Fixed top bar: "Ovena Admin" (primary colour) + notifications icon (right)
 *  - Below bar: "OPERATOR CONSOLE" label + "Welcome back, Smith" headline + avatar (right)
 *  - Avatar has border border-white/10 + hover scale-95
 *  - Notification bell: active:scale-95
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';

interface HeaderProps {
  adminName:            string;
  avatarUri?:           string;
  onNotificationPress?: () => void;
  onAvatarPress?:       () => void;
}

/** Reusable spring-press scale hook — mirrors active:scale-95 */
function usePressScale(toValue = 0.95) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn  = () => Animated.spring(scale, { toValue, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,      useNativeDriver: true, speed: 20, bounciness: 6 }).start();
  return { scale, onPressIn, onPressOut };
}

export function Header({ adminName, avatarUri, onNotificationPress, onAvatarPress }: HeaderProps) {
  const { colors } = useTheme();
  const bell   = usePressScale();
  const avatar = usePressScale();

  return (
    <View style={styles.wrapper}>
      {/* ── Top app bar ── */}
      <View style={[styles.topBar, { backgroundColor: colors.surface + 'CC', borderBottomColor: colors.divider }]}>
        <Text style={[styles.appName, { color: colors.primaryContainer }]}>Ovena Admin</Text>
        <Animated.View style={{ transform: [{ scale: bell.scale }] }}>
          <TouchableOpacity
            onPress={onNotificationPress}
            onPressIn={bell.onPressIn}
            onPressOut={bell.onPressOut}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="notifications" size={24} color={colors.primaryContainer} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* ── Operator console greeting ── */}
      <View style={styles.greetingRow}>
        <View style={styles.greetingLeft}>
          <Text style={[styles.consoleLabel, { color: colors.onSurfaceVariant }]}>
            OPERATOR CONSOLE
          </Text>
          <Text style={[styles.headline, { color: colors.onSurface }]}>
            Welcome back, {adminName}
          </Text>
        </View>

        <Animated.View style={{ transform: [{ scale: avatar.scale }] }}>
          <TouchableOpacity
            onPress={onAvatarPress}
            onPressIn={avatar.onPressIn}
            onPressOut={avatar.onPressOut}
            activeOpacity={1}
          >
            {avatarUri ? (
              <Image
                source={{ uri: avatarUri }}
                style={[styles.avatar, { borderColor: 'rgba(255,255,255,0.10)' }]}
              />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: colors.surfaceContainerHigh, borderColor: 'rgba(255,255,255,0.10)' }]}>
                <Text style={[styles.avatarInitial, { color: colors.onSurface }]}>
                  {adminName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 0,
  },
  // Fixed top bar — h-14 = 56px
  topBar: {
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'center',
    paddingHorizontal: Spacing.gutter,
    height:          56,
    borderBottomWidth: 1,
  },
  appName: {
    fontFamily:    FontFamily.heading,
    fontSize:      18,
    fontWeight:    '700',
    letterSpacing: -0.4,
  },
  // Greeting section below the bar
  greetingRow: {
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'center',
    paddingHorizontal: Spacing.gutter,
    paddingVertical:   Spacing.md,
  },
  greetingLeft: {
    flex: 1,
    gap:  4,
  },
  consoleLabel: {
    fontFamily:    FontFamily.mono,
    fontSize:      10,
    fontWeight:    '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  headline: {
    fontFamily:    FontFamily.heading,
    fontSize:      28,
    fontWeight:    '700',
    lineHeight:    34,
    letterSpacing: -0.5,
  },
  avatar: {
    width:        56,
    height:       56,
    borderRadius: Radius.lg,
    borderWidth:  1,
  },
  avatarFallback: {
    width:          56,
    height:         56,
    borderRadius:   Radius.lg,
    borderWidth:    1,
    justifyContent: 'center',
    alignItems:     'center',
  },
  avatarInitial: {
    fontFamily:  FontFamily.heading,
    fontSize:    22,
    fontWeight:  '700',
  },
});