/**
 * components/home/PanicProtocol.tsx
 *
 * Animation fix: btnScale (native/transform) and bgAnim (non-native/backgroundColor)
 * must live on separate Animated.View nodes.
 *   OUTER → backgroundColor interpolation (useNativeDriver: false)
 *   INNER → transform: scale for button + separate node for icon scale
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';

interface PanicProtocolProps {
  onActivate?: () => void;
}

export function PanicProtocol({ onActivate }: PanicProtocolProps) {
  const { colors } = useTheme();

  // Non-native: backgroundColor interpolation
  const bgAnim  = useRef(new Animated.Value(0)).current;
  const bgColor = bgAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['rgba(147,0,10,0.00)', 'rgba(147,0,10,0.10)'],
  });

  // Native: button scale (transform only)
  const btnScale  = useRef(new Animated.Value(1)).current;
  // Native: icon scale (transform only)
  const iconScale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    // Native animations — both transform, parallel is fine between them
    Animated.spring(btnScale,  { toValue: 0.95, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
    Animated.spring(iconScale, { toValue: 1.25, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
    // Non-native — fired independently, never in parallel with native
    Animated.timing(bgAnim, { toValue: 1, useNativeDriver: false, duration: 150 }).start();
  };

  const onPressOut = () => {
    Animated.spring(btnScale,  { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }).start();
    Animated.spring(iconScale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }).start();
    Animated.timing(bgAnim, { toValue: 0, useNativeDriver: false, duration: 250 }).start();
  };

  const handlePress = () => {
    Alert.alert(
      'Initiate Panic Protocol',
      'This will freeze all active operations. Are you absolutely sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', style: 'destructive', onPress: onActivate },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={handlePress}
      >
        {/* OUTER: backgroundColor (non-native) — no transform */}
        <Animated.View
          style={[
            styles.outerWrap,
            {
              backgroundColor: bgColor,
              borderColor:     `${colors.error}4D`,
            },
          ]}
        >
          {/* INNER: scale (native) — no backgroundColor */}
          <Animated.View
            style={[styles.innerRow, { transform: [{ scale: btnScale }] }]}
          >
            {/* Icon gets its own native-only node */}
            <Animated.View style={{ transform: [{ scale: iconScale }] }}>
              <Ionicons name="warning" size={24} color={colors.error} />
            </Animated.View>
            <Text style={[styles.btnText, { color: colors.error }]}>
              Initiate Panic Protocol
            </Text>
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>

      <Text style={[styles.caption, { color: colors.onSurfaceVariant }]}>
        Use only in case of complete system gridlock.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.gutter,
    gap:               Spacing.sm,
  },
  // Outer: non-native bg — must not have transform
  outerWrap: {
    width:         '100%',
    borderRadius:  Radius.xl,
    borderWidth:   1.5,
    overflow:      'hidden',
  },
  // Inner: native scale — must not have backgroundColor
  innerRow: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             Spacing.md,
    paddingVertical:   Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  btnText: {
    fontFamily:    FontFamily.heading,
    fontSize:      20,
    fontWeight:    '600',
    lineHeight:    28,
    letterSpacing: -0.2,
  },
  caption: {
    fontFamily: FontFamily.body,
    fontSize:   12,
    lineHeight: 16,
    textAlign:  'center',
    marginTop:  Spacing.sm,
  },
});