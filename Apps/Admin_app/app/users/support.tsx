/**
 * app/(tabs)/support.tsx
 *
 * Support Hub inbox — backed by GET /api/admin/support/tickets/ via
 * useSupportTickets, now with an Open/Closed tab split on top of the
 * existing owner-role filter chips.
 *
 * Closing/reopening now call the real endpoints (closeTicket/reopenTicket
 * in services/actionsApi.ts) instead of the old local-only `resolvedIds`
 * simulation. Since useSupportTickets doesn't expose a setter into its
 * internal ticket list, successful close/reopen calls are tracked in a
 * local `statusOverrides` map (ticket id → new status) that's merged over
 * the hook's data at render time — this is what makes a ticket visibly
 * jump from one tab to the other immediately after the action succeeds,
 * without needing a full refetch.
 *
 * Close keeps the existing confirm-modal step (ResolveConfirmModal).
 * Reopen is a direct swipe action with no confirmation — it's
 * non-destructive and easily reversible, so a confirm step didn't seem
 * warranted. (ResolveConfirmModal's source isn't available in this
 * change, so its confirm text/props weren't touched — it's still only
 * used for the close flow, matching its original "resolve" framing.)
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
  Pressable,
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
import { useAuth }             from '@/context/AuthContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { useSupportTickets, OwnerRoleFilter } from '@/hooks/useSupportTickets';
import { SupportTicket, TicketStatus } from '@/types/appData';
import { closeTicket, reopenTicket, SupportActionsApiError } from '@/services/actionsApi';

const FILTER_TABS: { key: OwnerRoleFilter; label: string }[] = [
  { key: 'all',            label: 'All' },
  { key: 'customer',       label: 'Customer' },
  { key: 'driver',         label: 'Driver' },
  { key: 'business_admin', label: 'Business Admin' },
  { key: 'business_staff', label: 'Business Staff' },
];

type StatusTab = 'open' | 'closed';

export default function SupportScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { tokens } = useAuth();

  const {
    tickets, totalCount, ownerRoleFilter, setOwnerRoleFilter,
    loading, loadingMore, error, hasMore, loadMore,
  } = useSupportTickets();

  const [searchQuery, setSearchQuery]     = useState('');
  const [statusTab, setStatusTab]         = useState<StatusTab>('open');
  // Local overrides for tickets whose status has changed via a successful
  // close/reopen call this session — merged over the hook's data at render
  // time, since useSupportTickets doesn't expose a setter for its list.
  const [statusOverrides, setStatusOverrides] = useState<Record<string, TicketStatus>>({});
  const [actioningIds, setActioningIds]   = useState<Set<string>>(new Set());
  const [pendingTicket, setPendingTicket] = useState<SupportTicket | null>(null);
  const [showToast, setShowToast]         = useState(false);
  const [toastMsg, setToastMsg]           = useState('');
  const [toastVariant, setToastVariant]   = useState<'success' | 'error'>('success');

  const effectiveStatus = useCallback(
    (ticket: SupportTicket): TicketStatus => statusOverrides[ticket.id] ?? ticket.status,
    [statusOverrides]
  );

  const ticketsForTab = useMemo(
    () => tickets.filter((t) =>
      statusTab === 'closed'
        ? effectiveStatus(t) === 'closed'
        : effectiveStatus(t) !== 'closed'
    ),
    [tickets, statusTab, effectiveStatus]
  );

  const visibleTickets = useMemo(() => {
    if (!searchQuery.trim()) return ticketsForTab;
    const q = searchQuery.toLowerCase();
    return ticketsForTab.filter(t =>
      t.owner_id.toLowerCase().includes(q)          ||
      (t.owner_email ?? '').toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)          ||
      t.id.toLowerCase().includes(q)
    );
  }, [ticketsForTab, searchQuery]);

  const openCount   = useMemo(() => tickets.filter((t) => effectiveStatus(t) !== 'closed').length, [tickets, effectiveStatus]);
  const closedCount = useMemo(() => tickets.filter((t) => effectiveStatus(t) === 'closed').length, [tickets, effectiveStatus]);

  const runToast = (message: string, variant: 'success' | 'error') => {
    setToastMsg(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  // ── Close flow (confirm modal → API call) ──────────────────────────────
  const handleSwipeClose = (ticket: SupportTicket) => {
    if (effectiveStatus(ticket) === 'closed' || actioningIds.has(ticket.id)) return;
    setPendingTicket(ticket);
  };

  const handleConfirmClose = async () => {
    if (!pendingTicket || !tokens?.accessToken) return;
    const ticket = pendingTicket;
    setPendingTicket(null);
    setActioningIds((prev) => new Set(prev).add(ticket.id));

    try {
      await closeTicket(ticket, tokens.accessToken);
      setStatusOverrides((prev) => ({ ...prev, [ticket.id]: 'closed' }));
      runToast(`Ticket ${ticket.id.slice(-6)} closed`, 'success');
    } catch (err) {
      const message = err instanceof SupportActionsApiError ? err.message : 'Failed to close ticket';
      runToast(message, 'error');
    } finally {
      setActioningIds((prev) => {
        const next = new Set(prev);
        next.delete(ticket.id);
        return next;
      });
    }
  };

  // ── Reopen flow (direct swipe action, no confirm step) ─────────────────
  const handleSwipeReopen = async (ticket: SupportTicket) => {
    if (effectiveStatus(ticket) !== 'closed' || actioningIds.has(ticket.id) || !tokens?.accessToken) return;
    setActioningIds((prev) => new Set(prev).add(ticket.id));

    try {
      await reopenTicket(ticket, tokens.accessToken);
      setStatusOverrides((prev) => ({ ...prev, [ticket.id]: 'open' }));
      runToast(`Ticket ${ticket.id.slice(-6)} reopened`, 'success');
    } catch (err) {
      const message = err instanceof SupportActionsApiError ? err.message : 'Failed to reopen ticket';
      runToast(message, 'error');
    } finally {
      setActioningIds((prev) => {
        const next = new Set(prev);
        next.delete(ticket.id);
        return next;
      });
    }
  };

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

        {/* ── Open / Closed tabs ── */}
        <View style={[styles.statusTabRow, { borderBottomColor: cardBorder }]}>
          <StatusTabButton
            label="Open"
            count={openCount}
            active={statusTab === 'open'}
            onPress={() => setStatusTab('open')}
            colors={colors}
          />
          <StatusTabButton
            label="Closed"
            count={closedCount}
            active={statusTab === 'closed'}
            onPress={() => setStatusTab('closed')}
            colors={colors}
          />
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
            if (hasMore && !loadingMore) loadMore();
          }}
          ListHeaderComponent={
            <>
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
                  {statusTab === 'closed' ? 'No closed tickets' : 'No open conversations found'}
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item: ticket }) => (
            <InboxTile
              ticket={ticket}
              isResolved={effectiveStatus(ticket) === 'closed'}
              onPress={() =>
                router.push({
                  pathname: '/support/chat',
                  params: {
                    threadId:   ticket.id,
                    ownerRole:  ticket.owner_role,
                    ownerId:    ticket.owner_id,
                    ownerEmail: ticket.owner_email ?? '',
                    category:   ticket.category,
                    status:     effectiveStatus(ticket),
                  },
                })
              }
              onSwipeResolve={statusTab === 'closed' ? handleSwipeReopen : handleSwipeClose}
            />
          )}
          ListFooterComponent={
            <>
              {renderFooter()}
              <View style={styles.statsGrid}>
                <View style={[styles.statCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                  <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>OPEN</Text>
                  <Text style={[styles.statValue, { color: colors.primary }]}>
                    {openCount}
                  </Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                  <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>TOTAL LOADED</Text>
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
          onConfirm={handleConfirmClose}
          onCancel={() => setPendingTicket(null)}
        />

        <Toast
          visible={showToast}
          message={toastMsg}
          icon={toastVariant === 'success' ? 'checkmark-circle' : 'alert-circle'}
          variant={toastVariant}
          onHide={() => setShowToast(false)}
        />
      </ScreenWrapper>
    </GestureHandlerRootView>
  );
}

function StatusTabButton({
  label, count, active, onPress, colors,
}: {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <Pressable onPress={onPress} style={styles.statusTabBtn}>
      <Text
        style={[
          styles.statusTabLabel,
          { color: active ? colors.primaryContainer : colors.onSurfaceVariant },
        ]}
      >
        {label} ({count})
      </Text>
      {active && <View style={[styles.statusTabUnderline, { backgroundColor: colors.primaryContainer }]} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 64, justifyContent: 'flex-end', paddingHorizontal: Spacing.gutter,
    paddingBottom: Spacing.sm, borderBottomWidth: 1, zIndex: 10,
  },
  topBarTitle: { fontFamily: FontFamily.heading, fontSize: 24, fontWeight: '700', letterSpacing: -0.4 },

  statusTabRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.gutter,
    borderBottomWidth: 1,
  },
  statusTabBtn: {
    paddingVertical: Spacing.sm,
    marginRight: Spacing.lg,
    alignItems: 'center',
  },
  statusTabLabel: { fontFamily: FontFamily.body, fontSize: 14, fontWeight: '700' },
  statusTabUnderline: { height: 2, width: '100%', marginTop: 6, borderRadius: 1 },

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