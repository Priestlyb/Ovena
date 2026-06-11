/**
 * app/(tabs)/staff.tsx
 *
 * Support Hub inbox — mirrors HTML exactly:
 *
 *  TopBar: "Support Hub" + stats
 *  Search bar (rounded-2xl, icon left)
 *  Filter tabs: All | Drivers | Restaurants | Customers
 *    - All: chronological order (urgent first)
 *    - Others: filtered by category
 *    - Tab switching animates opacity like HTML fade
 *  Inbox list: InboxTile rows (swipeable)
 *  Stats bento: Unresolved | Avg Response
 *  Toast: shown after confirm resolve
 *  ResolveConfirmModal: shown on swipe-right
 */

import React, { useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ScreenWrapper               from '@/components/ScreenWrapper';
import { InboxTile }               from '@/components/support/InboxTile';
import { ResolveConfirmModal }     from '@/components/support/ResolveConfirmModal';
import { Toast }                   from '@/components/support/Toast';
import { useTheme }                from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import {
  ALL_THREADS,
  THREADS_BY_CATEGORY,
  SUPPORT_STATS,
  SupportThread,
  SupportCategory,
} from '@/data/supportData';

type FilterTab = 'all' | SupportCategory;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all',         label: 'All' },
  { key: 'drivers',     label: 'Drivers' },
  { key: 'restaurants', label: 'Restaurants' },
  { key: 'customers',   label: 'Customers' },
];

export default function SupportScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [activeTab,    setActiveTab]    = useState<FilterTab>('all');
  const [searchQuery,  setSearchQuery]  = useState('');
  const [resolvedIds,  setResolvedIds]  = useState<Set<string>>(new Set());
  const [pendingThread, setPendingThread] = useState<SupportThread | null>(null);
  const [showToast,    setShowToast]    = useState(false);
  const [toastMsg,     setToastMsg]     = useState('');

  // List fade animation — mirrors HTML setTimeout opacity toggle
  const listOpacity = useRef(new Animated.Value(1)).current;

  const switchTab = (tab: FilterTab) => {
    Animated.timing(listOpacity, { toValue: 0, duration: 100, useNativeDriver: true }).start(() => {
      setActiveTab(tab);
      Animated.timing(listOpacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    });
  };

  // Filtered thread list
  const threads = useMemo(() => {
    const base = activeTab === 'all'
      ? ALL_THREADS
      : THREADS_BY_CATEGORY[activeTab];

    if (!searchQuery.trim()) return base;
    const q = searchQuery.toLowerCase();
    return base.filter(t =>
      t.name.toLowerCase().includes(q)      ||
      t.refCode.toLowerCase().includes(q)   ||
      t.preview.toLowerCase().includes(q)
    );
  }, [activeTab, searchQuery]);

  // Swipe right → show confirm modal
  const handleSwipeResolve = (thread: SupportThread) => {
    if (resolvedIds.has(thread.id)) return; // already resolved
    setPendingThread(thread);
  };

  // Confirm → mark resolved + show toast
  const handleConfirmResolve = () => {
    if (!pendingThread) return;
    setResolvedIds(prev => new Set([...prev, pendingThread.id]));
    setToastMsg(`${pendingThread.name}'s request marked as completed`);
    setShowToast(true);
    setPendingThread(null);
  };

  // Computed unresolved count (subtracts locally resolved)
  const unresolvedCount = SUPPORT_STATS.unresolved - resolvedIds.size;

  const cardBg     = isDark ? '#1c1b20' : colors.surfaceContainerLow;
  const cardBorder = isDark ? 'rgba(255,255,255,0.07)' : colors.border;
  const inputBg    = isDark ? '#1c1b20' : colors.surfaceContainerLow;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenWrapper noPadding>
        {/* ── Top app bar ── */}
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

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 88 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Search ── */}
          <View
            style={[
              styles.searchWrap,
              { backgroundColor: inputBg, borderColor: cardBorder },
            ]}
          >
            <Ionicons name="search-outline" size={20} color={colors.onSurfaceVariant} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.onSurface }]}
              placeholder="Search conversations, IDs, or users..."
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

          {/* ── Filter tabs ── */}
          <View
            style={[
              styles.tabBar,
              { backgroundColor: inputBg, borderColor: cardBorder },
            ]}
          >
            {FILTER_TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <TouchableWithoutFeedback key={tab.key} onPress={() => switchTab(tab.key)}>
                  <View
                    style={[
                      styles.tab,
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
            })}
          </View>

          {/* ── Inbox list ── */}
          <Animated.View style={{ opacity: listOpacity }}>
            {threads.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="chatbubbles-outline" size={48} color={colors.outlineVariant} />
                <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
                  No conversations found
                </Text>
              </View>
            ) : (
              threads.map((thread) => (
                <InboxTile
                  key={thread.id}
                  thread={thread}
                  isResolved={resolvedIds.has(thread.id)}
                  onPress={() =>
                    router.push({
                      pathname: '/support/chat',
                      params:   { threadId: thread.id },
                    })
                  }
                  onSwipeResolve={handleSwipeResolve}
                />
              ))
            )}
          </Animated.View>

          {/* ── Stats bento ── */}
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>
                UNRESOLVED
              </Text>
              <View style={styles.statValueRow}>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {Math.max(0, unresolvedCount)}
                </Text>
                <Text style={[styles.statDelta, { color: colors.error }]}>
                  {SUPPORT_STATS.unresolvedDelta}
                </Text>
              </View>
            </View>
            <View style={[styles.statCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>
                AVG RESPONSE
              </Text>
              <View style={styles.statValueRow}>
                <Text style={[styles.statValue, { color: colors.secondary ?? colors.onSurface }]}>
                  {SUPPORT_STATS.avgResponse}
                </Text>
                <Text style={[styles.statDelta, { color: colors.primaryContainer }]}>
                  {SUPPORT_STATS.avgResponseDelta}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* ── Modals + Toast ── */}
        <ResolveConfirmModal
          visible={!!pendingThread}
          threadName={pendingThread?.name ?? ''}
          onConfirm={handleConfirmResolve}
          onCancel={() => setPendingThread(null)}
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
    height:            64,
    justifyContent:    'flex-end',
    paddingHorizontal: Spacing.gutter,
    paddingBottom:     Spacing.sm,
    borderBottomWidth: 1,
    zIndex:            10,
  },
  topBarTitle: {
    fontFamily:    FontFamily.heading,
    fontSize:      24,
    fontWeight:    '700',
    letterSpacing: -0.4,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.gutter,
    gap:     Spacing.md,
  },
  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems:    'center',
    borderRadius:  Radius.xl,
    borderWidth:   1,
    paddingHorizontal: Spacing.md,
    height:        52,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex:       1,
    fontFamily: FontFamily.body,
    fontSize:   14,
    height:     '100%',
  },
  clearIcon: {
    padding: 4,
  },
  // Filter tabs: pill row
  tabBar: {
    flexDirection: 'row',
    borderRadius:  20,
    borderWidth:   1,
    padding:       6,
    gap:           4,
  },
  tab: {
    flex:           1,
    paddingVertical: 8,
    borderRadius:   16,
    alignItems:     'center',
    justifyContent: 'center',
  },
  tabText: {
    fontFamily:    FontFamily.mono,
    fontSize:      12,
    fontWeight:    '500',
    letterSpacing: 0.3,
  },
  // Empty state
  emptyState: {
    alignItems:      'center',
    justifyContent:  'center',
    paddingVertical: 48,
    gap:             Spacing.md,
  },
  emptyText: {
    fontFamily: FontFamily.body,
    fontSize:   14,
  },
  // Stats bento
  statsGrid: {
    flexDirection: 'row',
    gap:           Spacing.md,
    marginTop:     Spacing.sm,
  },
  statCard: {
    flex:         1,
    borderRadius: 32,
    borderWidth:  1,
    padding:      Spacing.lg,
    gap:          Spacing.xs,
  },
  statLabel: {
    fontFamily:    FontFamily.mono,
    fontSize:      10,
    fontWeight:    '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems:    'flex-end',
    gap:           Spacing.xs,
  },
  statValue: {
    fontFamily:    FontFamily.heading,
    fontSize:      32,
    fontWeight:    '700',
    lineHeight:    40,
    letterSpacing: -1.5,
  },
  statDelta: {
    fontFamily:  FontFamily.mono,
    fontSize:    10,
    fontWeight:  '500',
    marginBottom: 5,
  },
});