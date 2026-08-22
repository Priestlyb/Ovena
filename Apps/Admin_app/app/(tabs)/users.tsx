/**
 * app/(tabs)/users.tsx
 *
 * Users tab — ONE searchable, paginated list backed by GET /api/admin/users/
 * via useAdminUsers (mirrors useSupportTickets' onEndReached pattern from
 * app/(tabs)/support.tsx).
 *
 * Search filters only currently-loaded users — see useAdminUsers.ts header
 * comment for why (no confirmed server-side ?search= param).
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, Pressable, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenWrapper from '@/components/ScreenWrapper';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { AdminAppUser } from '@/types/appData';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { normalizeRole, ROLE_LABEL, ROLE_ACCENT, NormalizedRole } from '@/utils/roles';

export default function UsersScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const { users, totalCount, loading, loadingMore, error, hasMore, loadMore } = useAdminUsers();

  const filtered = useMemo(() => {
    if (!query.trim()) return users;
    const q = query.toLowerCase();
    return users.filter((u) => {
      const roleLabels = u.roles.map((r) => ROLE_LABEL[normalizeRole(r) as NormalizedRole] ?? r).join(' ');
      return (
        String(u.id).includes(q) ||
        (u.email ?? '').toLowerCase().includes(q) ||
        (u.phone_number ?? '').toLowerCase().includes(q) ||
        roleLabels.toLowerCase().includes(q)
      );
    });
  }, [users, query]);

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color={colors.primaryContainer} />
      </View>
    );
  }, [loadingMore, colors.primaryContainer]);

  return (
    <ScreenWrapper noPadding>
      <View
        style={[
          styles.topBar,
          { paddingTop: insets.top, backgroundColor: colors.surfaceContainerLowest, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.topBarTitle, { color: colors.primaryContainer }]}>Users</Text>
        <Pressable
          onPress={() => router.push('/users/support' as any)}
          style={[styles.supportLink, { borderColor: colors.border }]}
        >
          <Ionicons name="chatbubbles-outline" size={16} color={colors.onSurfaceVariant} />
          <Text style={[styles.supportLinkText, { color: colors.onSurfaceVariant }]}>Support Hub</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        <View style={[styles.searchWrap, { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle }]}>
          <Ionicons name="search-outline" size={18} color={colors.onSurfaceVariant} />
          <TextInput
            style={[styles.searchInput, { color: colors.onSurface }]}
            placeholder="Search loaded users by ID, email, phone, or role..."
            placeholderTextColor={colors.onSurfaceVariant + '80'}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.onSurfaceVariant} />
            </Pressable>
          )}
        </View>

        {!!error && (
          <Text style={{ color: colors.error, marginHorizontal: Spacing.gutter, marginBottom: Spacing.sm }}>
            {error}
          </Text>
        )}

        {loading && filtered.length === 0 ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={colors.primaryContainer} />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(u) => String(u.id)}
            style={styles.list}
            contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + Spacing.xl }]}
            ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
            onEndReachedThreshold={0.4}
            onEndReached={() => {
              // Only auto-page when not actively searching — otherwise
              // scrolling a filtered (short) list would keep triggering
              // loadMore even though the visible results aren't affected
              // by more data arriving off-screen.
              if (!query.trim() && hasMore && !loadingMore) loadMore();
            }}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
                {query.trim() ? 'No loaded users match your search.' : 'No users found.'}
              </Text>
            }
            ListFooterComponent={
              <>
                {renderFooter()}
                {!query.trim() && (
                  <Text style={[styles.countFooter, { color: colors.onSurfaceVariant }]}>
                    Showing {users.length} of {totalCount}
                  </Text>
                )}
              </>
            }
            renderItem={({ item }) => <UserRow user={item} colors={colors} />}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}

function UserRow({ user, colors }: { user: AdminAppUser; colors: ReturnType<typeof useTheme>['colors'] }) {
  const normalizedRoles = user.roles.map((r) => normalizeRole(r) as NormalizedRole);

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/users/detail/[userId]', params: { userId: String(user.id) } })}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[styles.avatar, { backgroundColor: colors.surfaceContainerHigh }]}>
        <Ionicons name="person-outline" size={18} color={colors.onSurfaceVariant} />
      </View>
      <View style={styles.rowMain}>
        <Text style={[styles.rowTitle, { color: colors.onSurface }]} numberOfLines={1}>
          {user.email ?? user.phone_number ?? `User #${user.id}`}
        </Text>
        <Text style={[styles.rowSubtitle, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
          {user.phone_number ?? 'No phone on file'} · {user.is_active ? 'Active' : 'Inactive'}
        </Text>
        <View style={styles.badgeRow}>
          {normalizedRoles.length === 0 ? (
            <View style={[styles.badge, { backgroundColor: colors.secondaryContainer }]}>
              <Text style={[styles.badgeText, { color: colors.onSecondaryContainer }]}>No role</Text>
            </View>
          ) : (
            normalizedRoles.map((role) => {
              const accent =
                ROLE_ACCENT[role] === 'success' ? colors.success :
                ROLE_ACCENT[role] === 'lava'    ? colors.primaryContainer :
                colors.onSurfaceVariant;
              return (
                <View key={role} style={[styles.badge, { backgroundColor: accent + '22' }]}>
                  <Text style={[styles.badgeText, { color: accent }]}>{ROLE_LABEL[role] ?? role}</Text>
                </View>
              );
            })
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.onSurfaceVariant} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topBar: {
    minHeight: 64,
    paddingHorizontal: Spacing.gutter,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarTitle: { fontFamily: FontFamily.heading, fontSize: 24, fontWeight: '700', letterSpacing: -0.4 },
  supportLink: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.sm, paddingVertical: 6, borderRadius: Radius.full, borderWidth: 1,
  },
  supportLinkText: { fontFamily: FontFamily.body, fontSize: 11, fontWeight: '600' },
  body: { flex: 1 },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    marginHorizontal: Spacing.gutter, marginTop: Spacing.md, marginBottom: Spacing.sm,
    borderWidth: 1, borderRadius: Radius.full,
    paddingHorizontal: Spacing.md, height: 44,
  },
  searchInput: { flex: 1, fontFamily: FontFamily.body, fontSize: 13, height: '100%' },
  list: { flex: 1 },
  listContent: { paddingHorizontal: Spacing.gutter, gap: Spacing.sm, flexGrow: 1 },
  loadingState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontFamily: FontFamily.body, fontSize: 13, textAlign: 'center', marginTop: Spacing.lg },
  footerLoader: { paddingVertical: Spacing.md },
  countFooter: {
    fontFamily: FontFamily.mono, fontSize: 10, textAlign: 'center',
    paddingVertical: Spacing.sm, letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.sm,
  },
  avatar: { width: 40, height: 40, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  rowMain: { flex: 1, gap: 4 },
  rowTitle: { fontFamily: FontFamily.heading, fontSize: 14, fontWeight: '700' },
  rowSubtitle: { fontFamily: FontFamily.body, fontSize: 12 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  badgeText: { fontFamily: FontFamily.body, fontSize: 10, fontWeight: '700' },
});