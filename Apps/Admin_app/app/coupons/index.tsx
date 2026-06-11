/**
 * app/coupons/index.tsx
 *
 * Coupon Manager — mirrors HTML doc 10 exactly:
 *  TopBar: back arrow + avatar + "Coupon Manager" + search bar
 *  Stats bento: Total Active | Redemptions
 *  Active Coupons list:
 *    - Code pill (tap to copy → toast)
 *    - Discount title + description
 *    - Toggle switch (active/inactive with opacity change)
 *    - Edit / Delete buttons
 *    - Usage progress bar
 *    - Days left or warning
 *  FAB (+) → navigates to Create Coupon
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Animated,
  Alert,
  StyleSheet,
  Clipboard,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenWrapper        from '@/components/ScreenWrapper';
import { Toast }            from '@/components/support/Toast';
import { useTheme }         from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { INITIAL_COUPONS, Coupon } from '@/data/couponData';

// ─── Progress bar ─────────────────────────────────────────────────────────────
function UsageBar({ used, total, percent, color }: { used: number; total: number; percent: number; color: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.usageWrap}>
      <View style={styles.usageRow}>
        <Text style={[styles.usageLabel, { color: colors.onSurfaceVariant }]}>
          Usage: {used}/{total}
        </Text>
        <Text style={[styles.usagePct, { color: colors.primaryContainer }]}>{percent}%</Text>
      </View>
      <View style={[styles.barTrack, { backgroundColor: colors.surfaceContainerHighest }]}>
        <View style={[styles.barFill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

// ─── Coupon card ──────────────────────────────────────────────────────────────
interface CouponCardProps {
  coupon:   Coupon;
  onCopy:   (code: string) => void;
  onToggle: (id: string, val: boolean) => void;
  onDelete: (id: string) => void;
  onEdit:   (id: string) => void;
}

function CouponCard({ coupon, onCopy, onToggle, onDelete, onEdit }: CouponCardProps) {
  const { colors, isDark } = useTheme();
  const isActive   = coupon.status === 'active';
  const isExpired  = coupon.status === 'expired' || coupon.status === 'inactive';
  const percent    = Math.round((coupon.usedCount / coupon.totalUses) * 100);
  const nearLimit  = percent >= 90;

  const cardBg     = isDark ? 'rgba(27,27,30,0.7)' : colors.surfaceContainer;
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : colors.border;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor:     cardBorder,
          opacity:         isExpired ? 0.6 : 1,
        },
      ]}
    >
      {/* Top row */}
      <View style={styles.cardTop}>
        <View style={styles.cardLeft}>
          {/* Code pill */}
          <TouchableOpacity
            style={[
              styles.codePill,
              {
                backgroundColor: isActive
                  ? `${colors.primary}1A`
                  : `${colors.surfaceContainerHighest}80`,
              },
            ]}
            onPress={() => onCopy(coupon.code)}
            activeOpacity={0.75}
          >
            <Ionicons
              name="ticket-outline"
              size={14}
              color={isActive ? colors.primary : colors.onSurfaceVariant}
            />
            <Text
              style={[
                styles.codeText,
                { color: isActive ? colors.primary : colors.onSurfaceVariant },
              ]}
            >
              {coupon.code}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.cardTitle, { color: colors.onSurface }]}>
            {coupon.discountType === 'percentage'
              ? `${coupon.discountValue}% Discount`
              : `$${coupon.discountValue} Fixed Discount`}
          </Text>
          <Text style={[styles.cardDesc, { color: colors.onSurfaceVariant }]}>
            {coupon.description}
          </Text>
        </View>

        {/* Right controls */}
        <View style={styles.cardRight}>
          <Switch
            value={isActive}
            onValueChange={(v) => onToggle(coupon.id, v)}
            trackColor={{ false: colors.surfaceContainerHighest, true: colors.primaryContainer }}
            thumbColor={colors.onSurface}
            ios_backgroundColor={colors.surfaceContainerHighest}
          />
          <View style={styles.actionBtns}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: `${colors.surfaceContainerHighest}50` }]}
              onPress={() => onEdit(coupon.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil-outline" size={15} color={colors.onSurface} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: `${colors.error}1A` }]}
              onPress={() => onDelete(coupon.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={15} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bottom row */}
      <View style={[styles.cardBottom, { borderTopColor: isDark ? 'rgba(255,255,255,0.05)' : colors.border }]}>
        {isExpired ? (
          <>
            <Text style={[styles.inactiveLabel, { color: colors.onSurfaceVariant }]}>
              STATUS: INACTIVE
            </Text>
            <Text style={[styles.endedLabel, { color: colors.onSurfaceVariant }]}>
              Ended {coupon.endDate}
            </Text>
          </>
        ) : (
          <>
            <UsageBar
              used={coupon.usedCount}
              total={coupon.totalUses}
              percent={percent}
              color={colors.primaryContainer}
            />
            <View style={styles.timeWrap}>
              {nearLimit ? (
                <View style={styles.warningRow}>
                  <Ionicons name="warning-outline" size={13} color={colors.error} />
                  <Text style={[styles.warningText, { color: colors.error }]}>Near limit</Text>
                </View>
              ) : (
                <View style={styles.timeRow}>
                  <Ionicons name="time-outline" size={13} color={colors.onSurfaceVariant} />
                  <Text style={[styles.timeText, { color: colors.onSurfaceVariant }]}>
                    {coupon.daysLeft}d left
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function CouponManagerScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [coupons,     setCoupons]    = useState<Coupon[]>(INITIAL_COUPONS);
  const [search,      setSearch]     = useState('');
  const [toast,       setToast]      = useState(false);
  const [toastMsg,    setToastMsg]   = useState('');

  // FAB scale
  const fabScale = useRef(new Animated.Value(1)).current;
  const onFabIn  = () => Animated.spring(fabScale, { toValue: 0.9, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  const onFabOut = () => Animated.spring(fabScale, { toValue: 1,   useNativeDriver: true, speed: 20, bounciness: 6 }).start();

  const filtered = coupons.filter(c =>
    !search || c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const activeCoupons = coupons.filter(c => c.status === 'active').length;
  const totalRedemptions = coupons.reduce((s, c) => s + c.usedCount, 0);

  const handleCopy = (code: string) => {
    Clipboard.setString(code);
    setToastMsg(`${code} copied to clipboard`);
    setToast(true);
  };

  const handleToggle = (id: string, val: boolean) => {
    setCoupons(prev => prev.map(c =>
      c.id === id ? { ...c, status: val ? 'active' : 'inactive' } : c
    ));
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Coupon', 'Are you sure you want to delete this coupon?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: () => setCoupons(prev => prev.filter(c => c.id !== id)),
      },
    ]);
  };

  const handleEdit = (id: string) => {
    router.push({ pathname: '/coupons/create', params: { editId: id } });
  };

  const cardBg   = isDark ? 'rgba(27,27,30,0.7)' : colors.surfaceContainer;
  const cardBord = isDark ? 'rgba(255,255,255,0.08)' : colors.border;
  const inputBg  = isDark ? colors.surfaceContainerLow : colors.surfaceContainerLow;

  return (
    <ScreenWrapper noPadding>
      {/* ── Top bar ── */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop:        insets.top,
            backgroundColor:   `${colors.background}CC`,
            borderBottomColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border,
          },
        ]}
      >
        <View style={styles.topBarRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={22} color={colors.onSurface} />
          </TouchableOpacity>
          <Text style={[styles.topBarTitle, { color: colors.onSurface }]}>Coupon Manager</Text>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={22} color={colors.primaryContainer} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View
          style={[
            styles.searchRow,
            { backgroundColor: inputBg, borderColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border },
          ]}
        >
          <Ionicons name="search-outline" size={18} color={colors.onSurfaceVariant} />
          <TextInput
            style={[styles.searchInput, { color: colors.onSurface }]}
            placeholder="Search active coupons..."
            placeholderTextColor={colors.onSurfaceVariant + '80'}
            value={search}
            onChangeText={setSearch}
            selectionColor={colors.primaryContainer}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Stats bento */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: cardBg, borderColor: cardBord }]}>
            {/* Lava left stripe */}
            <View style={[styles.statStripe, { backgroundColor: colors.primaryContainer }]} />
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>TOTAL ACTIVE</Text>
            <View style={styles.statValueRow}>
              <Text style={[styles.statValue, { color: colors.onSurface }]}>{activeCoupons}</Text>
              <Text style={[styles.statDelta, { color: colors.primary }]}> +2</Text>
            </View>
          </View>
          <View style={[styles.statCard, { backgroundColor: cardBg, borderColor: cardBord }]}>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>REDEMPTIONS</Text>
            <Text style={[styles.statValue, { color: colors.onSurface }]}>
              {totalRedemptions >= 1000
                ? `${(totalRedemptions / 1000).toFixed(1)}k`
                : totalRedemptions}
            </Text>
          </View>
        </View>

        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Active Coupons</Text>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={[styles.filterText, { color: colors.primaryContainer }]}>Filter</Text>
            <Ionicons name="filter-outline" size={14} color={colors.primaryContainer} />
          </TouchableOpacity>
        </View>

        {/* Coupon list */}
        {filtered.map(coupon => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            onCopy={handleCopy}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="ticket-outline" size={48} color={colors.outlineVariant} />
            <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
              No coupons found
            </Text>
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <Animated.View
        style={[
          styles.fab,
          {
            backgroundColor: colors.primaryContainer,
            bottom: insets.bottom + 88,
            transform: [{ scale: fabScale }],
            shadowColor: '#f56e0f',
          },
        ]}
      >
        <TouchableOpacity
          onPressIn={onFabIn}
          onPressOut={onFabOut}
          onPress={() => router.push('/coupons/create')}
          activeOpacity={1}
          style={styles.fabInner}
        >
          <Ionicons name="add" size={28} color={colors.onPrimaryContainer} />
        </TouchableOpacity>
      </Animated.View>

      <Toast
        visible={toast}
        message={toastMsg}
        icon="copy-outline"
        variant="info"
        onHide={() => setToast(false)}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: Spacing.gutter,
    paddingBottom:     Spacing.sm,
    borderBottomWidth: 1,
    gap:               Spacing.sm,
    zIndex:            10,
  },
  topBarRow: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    minHeight:       48,
  },
  iconBtn: {
    width:  36, height: 36,
    justifyContent: 'center', alignItems: 'center',
  },
  topBarTitle: {
    fontFamily:    FontFamily.heading,
    fontSize:      18, fontWeight: '600', letterSpacing: -0.2,
  },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.xl, borderWidth: 1,
    paddingHorizontal: Spacing.md, height: 44,
  },
  searchInput: {
    flex: 1, fontFamily: FontFamily.body, fontSize: 14,
  },
  scroll: { flex: 1 },
  content: { padding: Spacing.gutter, gap: Spacing.md },
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statCard: {
    flex: 1, borderRadius: 24, borderWidth: 1,
    padding: Spacing.md, gap: 4, overflow: 'hidden',
  },
  statStripe: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
    borderTopLeftRadius: 24, borderBottomLeftRadius: 24,
  },
  statLabel: { fontFamily: FontFamily.mono, fontSize: 10, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase' },
  statValueRow: { flexDirection: 'row', alignItems: 'flex-end' },
  statValue: { fontFamily: FontFamily.heading, fontSize: 28, fontWeight: '700', letterSpacing: -1 },
  statDelta: { fontFamily: FontFamily.body, fontSize: 12, marginBottom: 4, marginLeft: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4 },
  sectionTitle: { fontFamily: FontFamily.heading, fontSize: 18, fontWeight: '600', letterSpacing: -0.2 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  filterText: { fontFamily: FontFamily.mono, fontSize: 12, fontWeight: '500' },
  card: { borderRadius: 24, borderWidth: 1, padding: Spacing.md, gap: Spacing.sm },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLeft: { flex: 1, gap: 4, marginRight: Spacing.sm },
  codePill: {
    alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center',
    gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full,
  },
  codeText: { fontFamily: FontFamily.mono, fontSize: 12, fontWeight: '700', letterSpacing: 1.5 },
  cardTitle: { fontFamily: FontFamily.heading, fontSize: 18, fontWeight: '600', letterSpacing: -0.2 },
  cardDesc: { fontFamily: FontFamily.body, fontSize: 12, lineHeight: 16 },
  cardRight: { alignItems: 'flex-end', gap: Spacing.sm },
  actionBtns: { flexDirection: 'row', gap: Spacing.xs },
  actionBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  cardBottom: {
    flexDirection: 'row', alignItems: 'center',
    borderTopWidth: 1, paddingTop: Spacing.sm, gap: Spacing.sm,
  },
  usageWrap: { flex: 1, gap: 6 },
  usageRow: { flexDirection: 'row', justifyContent: 'space-between' },
  usageLabel: { fontFamily: FontFamily.mono, fontSize: 10, fontWeight: '500' },
  usagePct: { fontFamily: FontFamily.mono, fontSize: 10, fontWeight: '700' },
  barTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  timeWrap: { flexShrink: 0 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  timeText: { fontFamily: FontFamily.body, fontSize: 12 },
  warningRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  warningText: { fontFamily: FontFamily.body, fontSize: 12, fontWeight: '500' },
  inactiveLabel: { fontFamily: FontFamily.mono, fontSize: 10, fontWeight: '500', letterSpacing: 1, flex: 1 },
  endedLabel: { fontFamily: FontFamily.body, fontSize: 12 },
  emptyState: { alignItems: 'center', paddingVertical: 48, gap: Spacing.md },
  emptyText: { fontFamily: FontFamily.body, fontSize: 14 },
  fab: {
    position: 'absolute', right: Spacing.lg,
    width: 56, height: 56, borderRadius: 28,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },
  fabInner: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});