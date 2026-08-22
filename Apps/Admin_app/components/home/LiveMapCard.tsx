/**
 * components/home/LiveMapCard.tsx
 *
 * Placeholder for "Live map of active deliveries".
 * 🗺️ No map library wired yet — this renders a mock map surface with
 * positioned marker dots so the layout/interaction pattern is correct.
 * Swap the mockSurface View's body for a real <MapView> (react-native-maps)
 * later; MapMarkerData is shaped to map onto real lat/lng once available —
 * x/y here are 0–1 fractions of the mock surface, NOT coordinates.
 *
 * Tapping a marker OR the "View all active orders" button both lead to
 * order detail / the active orders list, per the combined routing choice.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';

export interface MapMarkerData {
  orderId: string;
  x: number;
  y: number;
  status: 'enroute' | 'delayed' | 'preparing';
}

interface LiveMapCardProps {
  markers: MapMarkerData[];
  onMarkerPress?: (orderId: string) => void;
}

export function LiveMapCard({ markers, onMarkerPress }: LiveMapCardProps) {
  const { colors } = useTheme();

  const handleMarkerPress = (orderId: string) => {
    console.log('🗺️📍 [LiveMapCard] marker pressed', orderId);
    if (onMarkerPress) {
      onMarkerPress(orderId);
    } else {
      router.push({ pathname: 'users/order/[orderId].tsx', params: { orderId } } as any);
    }
  };

  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="map-outline" size={16} color={colors.onSurfaceVariant} />
          <Text style={[styles.title, { color: colors.onSurface }]}>Live Deliveries</Text>
        </View>
        <View style={[styles.countBadge, { backgroundColor: colors.primaryContainer }]}>
          <Text style={styles.countText}>{markers.length}</Text>
        </View>
      </View>

      <View style={[styles.mockSurface, { backgroundColor: colors.surfaceContainerLow }]}>
        {Array.from({ length: 4 }).map((_, i) => (
          <View
            key={`h-${i}`}
            style={[
              styles.gridLineH,
              { top: `${(i + 1) * 20}%`, backgroundColor: colors.borderSubtle },
            ]}
          />
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <View
            key={`v-${i}`}
            style={[
              styles.gridLineV,
              { left: `${(i + 1) * 20}%`, backgroundColor: colors.borderSubtle },
            ]}
          />
        ))}

        {markers.map((marker) => (
          <Pressable
            key={marker.orderId}
            onPress={() => handleMarkerPress(marker.orderId)}
            hitSlop={8}
            style={[
              styles.marker,
              {
                left: `${marker.x * 100}%`,
                top: `${marker.y * 100}%`,
                backgroundColor: markerColor(colors, marker.status),
              },
            ]}
          />
        ))}
      </View>

      <Pressable
        onPress={() => router.push({ pathname: '/orders/active' } as any)}
        style={({ pressed }) => [
          styles.viewAllBtn,
          { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Text style={[styles.viewAllText, { color: colors.onSurface }]}>
          View all active orders
        </Text>
        <Ionicons name="chevron-forward" size={14} color={colors.onSurfaceVariant} />
      </Pressable>
    </View>
  );
}

function markerColor(
  colors: ReturnType<typeof useTheme>['colors'],
  status: MapMarkerData['status']
) {
  switch (status) {
    case 'delayed':
      return colors.error;
    case 'preparing':
      return colors.onSurfaceVariant;
    default:
      return colors.primaryContainer;
  }
}

const MAP_HEIGHT = 160;

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.sm,
    gap: Spacing.sm,
    marginHorizontal: Spacing.gutter,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontFamily: FontFamily.heading,
    fontSize: 14,
    fontWeight: '600',
  },
  countBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  mockSurface: {
    height: MAP_HEIGHT,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
  },
  marker: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: Radius.full,
    marginLeft: -5,
    marginTop: -5,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  viewAllText: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    fontWeight: '600',
  },
});