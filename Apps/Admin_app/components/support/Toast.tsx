/**
 * components/support/Toast.tsx
 *
 * Animated slide-up toast notification.
 * Used for "request completed" confirmation after swipe-resolve.
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { FontFamily, Spacing, Radius } from '@/constants/theme';

interface ToastProps {
  visible:  boolean;
  message:  string;
  icon?:    keyof typeof Ionicons.glyphMap;
  variant?: 'success' | 'error' | 'info';
  onHide:   () => void;
  duration?: number;
}

export function Toast({
  visible,
  message,
  icon = 'checkmark-circle',
  variant = 'success',
  onHide,
  duration = 2600,
}: ToastProps) {
  const { colors } = useTheme();
  const insets     = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide up + fade in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue:         0,
          useNativeDriver: true,
          speed:           22,
          bounciness:      8,
        }),
        Animated.timing(opacity, {
          toValue:         1,
          duration:        180,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide
      const t = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, { toValue: 100, duration: 260, useNativeDriver: true }),
          Animated.timing(opacity,    { toValue: 0,   duration: 200, useNativeDriver: true }),
        ]).start(() => onHide());
      }, duration);

      return () => clearTimeout(t);
    } else {
      translateY.setValue(100);
      opacity.setValue(0);
    }
  }, [visible]);

  const iconColor =
    variant === 'success' ? colors.primaryContainer :
    variant === 'error'   ? colors.error            :
    colors.primary;

  const bgColor =
    variant === 'success' ? colors.surfaceContainerHigh :
    variant === 'error'   ? colors.errorContainer        :
    colors.surfaceContainerHigh;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.toast,
        {
          backgroundColor: bgColor,
          borderColor:     iconColor + '33',
          bottom:          insets.bottom + (Platform.OS === 'ios' ? 90 : 74), // above tab bar
          transform:       [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconColor + '22' }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={[styles.message, { color: colors.onSurface }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position:      'absolute',
    alignSelf:     'center',
    left:          Spacing.lg,
    right:         Spacing.lg,
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.sm,
    paddingVertical:   Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius:  Radius.full,
    borderWidth:   1,
    zIndex:        999,
    // shadow
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius:  12,
    elevation:     10,
  },
  iconWrap: {
    width:          32,
    height:         32,
    borderRadius:   16,
    justifyContent: 'center',
    alignItems:     'center',
  },
  message: {
    fontFamily:  FontFamily.body,
    fontSize:    14,
    fontWeight:  '500',
    flex:        1,
  },
});