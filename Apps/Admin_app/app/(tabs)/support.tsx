/**
 * app/(tabs)/support.tsx
 *
 * Support Hub inbox — now backed by GET /api/admin/support/tickets/
 * (via useSupportTickets) instead of static mock data.
 *
 *  TopBar: "Support Hub" + stats
 *  Search bar
 *  Filter tabs: All | Customer | Driver | Business Admin | Business Staff
 *    - filters ticket.owner_role client-side (backend has no role param)
 *  Inbox list: FlatList of InboxTile rows, onEndReached → loadMore()
 *    (automatic pagination as the user scrolls)
 *  Stats bento: Unresolved | Avg Response
 *  Toast + ResolveConfirmModal unchanged
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ScreenWrapper           from '@/components/ScreenWrapper';
import { InboxTile }           from '@/components/support/InboxTile';
import { ResolveConfirmModal } from '@/components/support/ResolveConfirmModal';
import { Toast }               from '@/components/support/Toast';
import { useTheme }            from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { useSupportTickets, OwnerRoleFilter } from '@/hooks/useSupportTickets';
import { SupportTicket } from '@/types/appData';

const FILTER_TABS: { key: OwnerRoleFilter; label: string }[] = [
  { key: 'all',            label: 'All' },
  { key: 'customer',       label: 'Customer' },
  { key: 'driver',         label: 'Driver' },
  { key: 'business_admin', label: 'Business Admin' },
  { key: 'business_staff', label: 'Business Staff' },
];

export default function SupportScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const {
    tickets, totalCount, ownerRoleFilter, setOwnerRoleFilter,
    loading, loadingMore, error, hasMore, loadMore, refresh,
  } = useSupportTickets();

  const [searchQuery, setSearchQuery]     = useState('');
  const [resolvedIds, setResolvedIds]     = useState<Set<string>>(new Set());
  const [pendingTicket, setPendingTicket] = useState<SupportTicket | null>(null);
  const [showToast, setShowToast]         = useState(false);
  const [toastMsg, setToastMsg]           = useState('');

  const visibleTickets = useMemo(() => {
    if (!searchQuery.trim()) return tickets;
    const q = searchQuery.toLowerCase();
    return tickets.filter(t =>
      t.owner_id.toLowerCase().includes(q)          ||
      (t.owner_email ?? '').toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)          ||
      t.id.toLowerCase().includes(q)
    );
  }, [tickets, searchQuery]);

  const handleSwipeResolve = (ticket: SupportTicket) => {
    if (resolvedIds.has(ticket.id) || ticket.status === 'closed') return;
    setPendingTicket(ticket);
  };

  const handleConfirmResolve = () => {
    if (!pendingTicket) return;
    setResolvedIds(prev => new Set([...prev, pendingTicket.id]));
    setToastMsg(`Ticket ${pendingTicket.id.slice(-6)} marked as resolved`);
    setShowToast(true);
    setPendingTicket(null);
  };

  // Unresolved count is based on what's currently loaded, since the
  // tickets endpoint doesn't return a status breakdown of its own.
  const unresolvedCount = tickets.filter(
    t => t.status !== 'closed' && !resolvedIds.has(t.id)
  ).length;

  const cardBg     = isDark ? '#1c1b20' : colors.surfaceContainerLow;
  const cardBorder = isDark ? 'rgba(255,255,255,0.07)' : colors.border;
  const inputBg    = isDark ? '#1c1b20' : colors.surfaceContainerLow;

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color={colors.primaryContainer} />
      </View>
    );
  }, [loadingMore, colors.primaryContainer]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenWrapper noPadding>
        <View
          style={[
            styles.topBar,
            {
              paddingTop:        insets.top,
              backgroundColor:   colors.surfaceContainerLowest,
              borderBottomColor: isDark ? 'rgba(89,66,55,0.15)' : colors.border,
            },
          ]}
        >
          <Text style={[styles.topBarTitle, { color: colors.primaryContainer }]}>
            Support Hub
          </Text>
        </View>

        <FlatList
          data={visibleTickets}
          keyExtractor={(item) => item.id}
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 88 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            // Automatic pagination — only fires when a filter isn't already
            // triggering background loads and the backend has more pages.
            if (hasMore && !loadingMore) loadMore();
          }}
          ListHeaderComponent={
            <>
              {/* Search */}
              <View style={[styles.searchWrap, { backgroundColor: inputBg, borderColor: cardBorder }]}>
                <Ionicons name="search-outline" size={20} color={colors.onSurfaceVariant} style={styles.searchIcon} />
                <TextInput
                  style={[styles.searchInput, { color: colors.onSurface }]}
                  placeholder="Search by owner ID, email, or category..."
                  placeholderTextColor={colors.onSurfaceVariant + '80'}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  selectionColor={colors.primaryContainer}
                  returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                  <TouchableWithoutFeedback onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={18} color={colors.onSurfaceVariant} style={styles.clearIcon} />
                  </TouchableWithoutFeedback>
                )}
              </View>

              {/* Role filter chips — horizontally scrollable, labels are longer than the old category tabs */}
              <FlatList
                data={FILTER_TABS}
                keyExtractor={(t) => t.key}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabBar}
                style={{ marginBottom: Spacing.md }}
                renderItem={({ item: tab }) => {
                  const active = ownerRoleFilter === tab.key;
                  return (
                    <TouchableWithoutFeedback onPress={() => setOwnerRoleFilter(tab.key)}>
                      <View
                        style={[
                          styles.tab,
                          { borderColor: cardBorder, backgroundColor: inputBg },
                          active && { backgroundColor: colors.primaryContainer },
                        ]}
                      >
                        <Text
                          style={[
                            styles.tabText,
                            { color: active ? colors.onPrimaryContainer : colors.onSurfaceVariant },
                          ]}
                        >
                          {tab.label}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                }}
              />

              {loading && tickets.length === 0 && (
                <View style={styles.emptyState}>
                  <ActivityIndicator color={colors.primaryContainer} />
                </View>
              )}

              {!!error && (
                <Text style={{ color: colors.error, marginBottom: Spacing.md }}>{error}</Text>
              )}
            </>
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyState}>
                <Ionicons name="chatbubbles-outline" size={48} color={colors.outlineVariant} />
                <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
                  No conversations found
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item: ticket }) => (
            <InboxTile
              ticket={ticket}
              isResolved={resolvedIds.has(ticket.id)}
             onPress={() =>
                        router.push({
                          pathname: '/support/chat',
                          params: {
                            threadId:   ticket.id,
                            ownerRole:  ticket.owner_role,
                            ownerId:    ticket.owner_id,
                            ownerEmail: ticket.owner_email ?? '',
                            category:   ticket.category,
                            status:     ticket.status,
                          },
                        })
                      }
              onSwipeResolve={handleSwipeResolve}
            />
          )}
          ListFooterComponent={
            <>
              {renderFooter()}
              <View style={styles.statsGrid}>
                <View style={[styles.statCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                  <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>UNRESOLVED</Text>
                  <Text style={[styles.statValue, { color: colors.primary }]}>
                    {Math.max(0, unresolvedCount)}
                  </Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                  <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>TOTAL TICKETS</Text>
                  <Text style={[styles.statValue, { color: colors.secondary ?? colors.onSurface }]}>
                    {totalCount}
                  </Text>
                </View>
              </View>
            </>
          }
        />

        <ResolveConfirmModal
          visible={!!pendingTicket}
          threadName={pendingTicket ? `${pendingTicket.owner_role} #${pendingTicket.owner_id}` : ''}
          onConfirm={handleConfirmResolve}
          onCancel={() => setPendingTicket(null)}
        />

        <Toast
          visible={showToast}
          message={toastMsg}
          icon="checkmark-circle"
          variant="success"
          onHide={() => setShowToast(false)}
        />
      </ScreenWrapper>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 64, justifyContent: 'flex-end', paddingHorizontal: Spacing.gutter,
    paddingBottom: Spacing.sm, borderBottomWidth: 1, zIndex: 10,
  },
  topBarTitle: { fontFamily: FontFamily.heading, fontSize: 24, fontWeight: '700', letterSpacing: -0.4 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.gutter, paddingTop: Spacing.gutter, gap: Spacing.md },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', borderRadius: Radius.xl,
    borderWidth: 1, paddingHorizontal: Spacing.md, height: 52, marginBottom: Spacing.md,
  },
  searchIcon: { marginRight: Spacing.sm },
  searchInput: { flex: 1, fontFamily: FontFamily.body, fontSize: 14, height: '100%' },
  clearIcon: { padding: 4 },
  tabBar: { gap: 8, paddingRight: Spacing.gutter },
  tab: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  tabText: { fontFamily: FontFamily.mono, fontSize: 12, fontWeight: '500', letterSpacing: 0.3 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: Spacing.md },
  emptyText: { fontFamily: FontFamily.body, fontSize: 14 },
  footerLoader: { paddingVertical: Spacing.md },
  statsGrid: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm },
  statCard: { flex: 1, borderRadius: 32, borderWidth: 1, padding: Spacing.lg, gap: Spacing.xs },
  statLabel: { fontFamily: FontFamily.mono, fontSize: 10, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase' },
  statValue: { fontFamily: FontFamily.heading, fontSize: 32, fontWeight: '700', lineHeight: 40, letterSpacing: -1.5 },
});