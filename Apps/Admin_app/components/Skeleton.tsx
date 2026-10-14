/**
 * components/Skeleton.tsx
 *
 * Minimal pulsing loading placeholder — a rounded rect that fades in/out
 * on a loop. Used wherever we're waiting on a request with no cached data
 * yet: Active Orders' initial fetch, Order Detail's Status History section
 * while request_order_events is in flight, Ops Orders' initial fetch.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 14, borderRadius = 6, style }: SkeletonProps) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 650, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: colors.surfaceContainerHigh },
        { opacity },
        style,
      ]}
    />
  );
}
