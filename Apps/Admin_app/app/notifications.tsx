/**
 * app/notifications.tsx
 *
 * Full notification history — every admin/branch/driver notification
 * received over the shared admin WS this session, newest first. Reached
 * from the bell icon on Home.
 *
 * ⚠️ Session-only: notifications live in AdminOrdersWebSocketContext's
 * React state, not persisted to disk — a cold restart starts this list
 * empty again. Worth revisiting (AsyncStorage, or a real backend-side
 * notifications endpoint if one ever exists) if history needs to survive
 * restarts.
 */

import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import ScreenWrapper from '@/components/ScreenWrapper';
import { useTheme } from '@/context/ThemeContext';
import { useAdminOrdersWS } from '@/context/AdminOrdersWebSocketContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { AppNotification, NotificationSource } from '@/types/notifications';

const SOURCE_ICON: Record<NotificationSource, keyof typeof Ionicons.glyphMap> = {
  admin: 'alert-circle-outline',
  branch: 'storefront-outline',
  driver: 'bicycle-outline',
};

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const { notifications, unreadCount, markAllNotificationsRead } = useAdminOrdersWS();

  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: 'Notifications' }} />
      <FlatList
        data={notifications}
        keyExtractor={(n) => n.id}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
        ListHeaderComponent={
          unreadCount > 0 ? (
            <Pressable
              onPress={markAllNotificationsRead}
              style={[styles.markAllBtn, { borderColor: colors.borderSubtle }]}
            >
              <Text style={[styles.markAllText, { color: colors.primaryContainer }]}>
                Mark all read ({unreadCount})
              </Text>
            </Pressable>
          ) : null
        }
        renderItem={({ item }) => <NotificationRow notification={item} />}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
            No notifications yet this session.
          </Text>
        }
      />
    </ScreenWrapper>
  );
}

function NotificationRow({ notification }: { notification: AppNotification }) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle },
        !notification.read && { borderColor: colors.primaryContainer },
      ]}
    >
      <Ionicons name={SOURCE_ICON[notification.source]} size={18} color={colors.primaryContainer} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[styles.title, { color: colors.onSurface }]}>{notification.title}</Text>
        <Text style={[styles.message, { color: colors.onSurfaceVariant }]} numberOfLines={3}>
          {notification.message}
        </Text>
        <Text style={[styles.time, { color: colors.onSurfaceVariant }]}>
          {new Date(notification.timestamp).toLocaleString()}
        </Text>
      </View>
      {!notification.read && <View style={[styles.unreadDot, { backgroundColor: colors.primaryContainer }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.gutter, paddingBottom: Spacing.xl },
  markAllBtn: {
    alignSelf: 'flex-end', borderWidth: 1, borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 6, marginBottom: Spacing.sm,
  },
  markAllText: { fontFamily: FontFamily.body, fontSize: 12, fontWeight: '700' },
  row: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.sm,
  },
  title: { fontFamily: FontFamily.heading, fontSize: 13, fontWeight: '700' },
  message: { fontFamily: FontFamily.body, fontSize: 12, lineHeight: 16 },
  time: { fontFamily: FontFamily.body, fontSize: 10, marginTop: 2 },
  unreadDot: { width: 8, height: 8, borderRadius: Radius.full, marginTop: 4 },
  emptyText: { fontFamily: FontFamily.body, fontSize: 13, textAlign: 'center', marginTop: Spacing.xl },
});