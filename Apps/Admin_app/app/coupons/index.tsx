/**
 * app/coupons/index.tsx
 *
 * Coupon Manager — now backed by the real /api/admin/coupons/all/ shape
 * (via AppDataContext, already fetched passively in the bootstrap).
 *
 * The real Coupon has no `status`, `usedCount`/`totalUses`, or
 * `startDate`/`endDate` fields like the earlier mock data did. Derived here:
 *  - "expired" = coupon.exhausted OR valid_until has passed
 *  - usage %   = uses_count / max_uses (max_uses near int32-max is treated
 *                as "unlimited" and shown as ∞ instead of a percent)
 *  - days left = valid_until - now, floored at 0
 *
 * No PATCH/DELETE endpoint has been provided yet, so the toggle switch from
 * the earlier mock UI is gone (there's nothing to persist it to), and Delete
 * shows an honest "not available yet" message instead of silently removing
 * a coupon that would just reappear on the next refresh.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  Alert,
  StyleSheet,
  Clipboard,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenWrapper from '@/components/ScreenWrapper';
import { Toast } from '@/components/support/Toast';
import { useTheme } from '@/context/ThemeContext';
import { useAppData } from '@/context/AppDataContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { Coupon } from '@/types/appData';

// Anything at/above this is treated as "unlimited" rather than a real cap
// (the create-payload stub used 2147483647 = int32 max as its placeholder).
const UNLIMITED_THRESHOLD = 1_000_000_000;

function isUnlimited(c: Coupon) {
  return c.max_uses >= UNLIMITED_THRESHOLD;
}

function isExpired(c: Coupon) {
  return c.exhausted || new Date(c.valid_until).getTime() < Date.now();
}

function daysLeft(c: Coupon) {
  const ms = new Date(c.valid_until).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function usagePercent(c: Coupon) {
  if (isUnlimited(c) || c.max_uses <= 0) return 0;
  return Math.min(100, Math.round((c.uses_count / c.max_uses) * 100));
}

function discountLabel(c: Coupon) {
  const value = parseFloat(c.discount_value);
  const shown = Number.isFinite(value) ? value : c.discount_value;
  return c.discount_type === 'percent'
    ? `${shown}% Discount`
    : `₦${Number(shown).toLocaleString()} Fixed Discount`;
}

// ─── Progress bar ─────────────────────────────────────────────────────────
function UsageBar({ coupon, color }: { coupon: Coupon; color: string }) {
  const { colors } = useTheme();
  const percent = usagePercent(coupon);
  return (
    <View style={styles.usageWrap}>
      <View style={styles.usageRow}>
        <Text style={[styles.usageLabel, { color: colors.onSurfaceVariant }]}>
          Usage: {coupon.uses_count}/{isUnlimited(coupon) ? '∞' : coupon.max_uses}
        </Text>
        {!isUnlimited(coupon) && (
          <Text style={[styles.usagePct, { color: colors.primaryContainer }]}>{percent}%</Text>
        )}
      </View>
      {!isUnlimited(coupon) && (
        <View style={[styles.barTrack, { backgroundColor: colors.surfaceContainerHighest }]}>
          <View style={[styles.barFill, { width: `${percent}%`, backgroundColor: color }]} />
        </View>
      )}
    </View>
  );
}

// ─── Coupon card ────────────────────────────────────────────────────────────
interface CouponCardProps {
  coupon:   Coupon;
  onCopy:   (code: string) => void;
  onEdit:   (id: number) => void;
  onDelete: (id: number) => void;
}

function CouponCard({ coupon, onCopy, onEdit, onDelete }: CouponCardProps) {
  const { colors, isDark } = useTheme();
  const expired = isExpired(coupon);
  const nearLimit = !isUnlimited(coupon) && usagePercent(coupon) >= 90;

  const cardBg     = isDark ? 'rgba(27,27,30,0.7)' : colors.surfaceContainer;
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : colors.border;

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder, opacity: expired ? 0.6 : 1 }]}>
      <View style={styles.cardTop}>
        <View style={styles.cardLeft}>
          <TouchableOpacity
            style={[styles.codePill, { backgroundColor: expired ? `${colors.surfaceContainerHighest}80` : `${colors.primary}1A` }]}
            onPress={() => onCopy(coupon.code)}
            activeOpacity={0.75}
          >
            <Ionicons name="ticket-outline" size={14} color={expired ? colors.onSurfaceVariant : colors.primary} />
            <Text style={[styles.codeText, { color: expired ? colors.onSurfaceVariant : colors.primary }]}>
              {coupon.code}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.cardTitle, { color: colors.onSurface }]}>{discountLabel(coupon)}</Text>
          <Text style={[styles.cardDesc, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
            {coupon.description}
          </Text>

          <View style={styles.badgeRow}>
            {coupon.is_reward && (
              <View style={[styles.badge, { backgroundColor: `${colors.primaryContainer}20` }]}>
                <Text style={[styles.badgeText, { color: colors.primaryContainer }]}>REWARD</Text>
              </View>
            )}
            {coupon.exhausted && (
              <View style={[styles.badge, { backgroundColor: `${colors.error}1A` }]}>
                <Text style={[styles.badgeText, { color: colors.error }]}>EXHAUSTED</Text>
              </View>
            )}
          </View>
        </View>

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

      <View style={[styles.cardBottom, { borderTopColor: isDark ? 'rgba(255,255,255,0.05)' : colors.border }]}>
        {expired ? (
          <>
            <Text style={[styles.inactiveLabel, { color: colors.onSurfaceVariant }]}>
              {coupon.exhausted ? 'EXHAUSTED' : 'EXPIRED'}
            </Text>
            <Text style={[styles.endedLabel, { color: colors.onSurfaceVariant }]}>
              Ended {new Date(coupon.valid_until).toLocaleDateString()}
            </Text>
          </>
        ) : (
          <>
            <UsageBar coupon={coupon} color={colors.primaryContainer} />
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
                    {daysLeft(coupon)}d left
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

// ─── Screen ─────────────────────────────────────────────────────────────────
export default function CouponManagerScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { data, loading, error, refresh } = useAppData();
  type CouponFilter = 'all' | 'reward' | 'marketing';
const [filter, setFilter] = useState<CouponFilter>('all');

  const coupons = data?.coupons ?? [];

  const [search,   setSearch]   = useState('');
  const [toast,    setToast]    = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fabScale = React.useRef(new Animated.Value(1)).current;
  const onFabIn  = () => Animated.spring(fabScale, { toValue: 0.9, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  const onFabOut = () => Animated.spring(fabScale, { toValue: 1,   useNativeDriver: true, speed: 20, bounciness: 6 }).start();

  const filtered = coupons.filter(c =>
    !search ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalActive = coupons.filter(c => !isExpired(c)).length;
  const totalRedemptions = coupons.reduce((s, c) => s + c.uses_count, 0);

  const handleCopy = (code: string) => {
    Clipboard.setString(code);
    setToastMsg(`${code} copied to clipboard`);
    setToast(true);
  };

  const handleDelete = (_id: number) => {
    Alert.alert(
      'Not available yet',
      'A delete endpoint hasn\'t been wired up on the backend yet, so this coupon can\'t be removed from here.',
    );
  };

  const handleEdit = (id: number) => {
    router.push({ pathname: '/coupons/create', params: { editId: String(id) } });
  };

  const cardBg   = isDark ? 'rgba(27,27,30,0.7)' : colors.surfaceContainer;
  const cardBord = isDark ? 'rgba(255,255,255,0.08)' : colors.border;
  const inputBg  = colors.surfaceContainerLow;

  return (
    <ScreenWrapper noPadding>
      <View style={[styles.topBar, { paddingTop: insets.top, backgroundColor: `${colors.background}CC`, borderBottomColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border }]}>
        <View style={styles.topBarRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="arrow-back" size={22} color={colors.onSurface} />
          </TouchableOpacity>
          <Text style={[styles.topBarTitle, { color: colors.onSurface }]}>Coupon Manager</Text>
          <TouchableOpacity style={styles.iconBtn} onPress={() => refresh()}>
            <Ionicons name="refresh-outline" size={22} color={colors.primaryContainer} />
          </TouchableOpacity>
        </View>

        <View style={[styles.searchRow, { backgroundColor: inputBg, borderColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.onSurfaceVariant} />
          <TextInput
            style={[styles.searchInput, { color: colors.onSurface }]}
            placeholder="Search coupons..."
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
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primaryContainer} />}
      >
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: cardBg, borderColor: cardBord }]}>
            <View style={[styles.statStripe, { backgroundColor: colors.primaryContainer }]} />
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>TOTAL ACTIVE</Text>
            <Text style={[styles.statValue, { color: colors.onSurface }]}>{totalActive}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: cardBg, borderColor: cardBord }]}>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>REDEMPTIONS</Text>
            <Text style={[styles.statValue, { color: colors.onSurface }]}>
              {totalRedemptions >= 1000 ? `${(totalRedemptions / 1000).toFixed(1)}k` : totalRedemptions}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitleText, { color: colors.onSurface }]}>Coupons</Text>
        </View>

        {loading && coupons.length === 0 && (
          <View style={styles.emptyState}>
            <ActivityIndicator color={colors.primaryContainer} />
          </View>
        )}

        {!loading && error && coupons.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle-outline" size={40} color={colors.error} />
            <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>{error}</Text>
          </View>
        )}

        {filtered.map(coupon => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            onCopy={handleCopy}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

        {!loading && !error && filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="ticket-outline" size={48} color={colors.outlineVariant} />
            <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>No coupons found</Text>
          </View>
        )}
      </ScrollView>

      <Animated.View style={[styles.fab, { backgroundColor: colors.primaryContainer, bottom: insets.bottom + 88, transform: [{ scale: fabScale }], shadowColor: '#f56e0f' }]}>
        <TouchableOpacity onPressIn={onFabIn} onPressOut={onFabOut} onPress={() => router.push('/coupons/create')} activeOpacity={1} style={styles.fabInner}>
          <Ionicons name="add" size={28} color={colors.onPrimaryContainer} />
        </TouchableOpacity>
      </Animated.View>

      <Toast visible={toast} message={toastMsg} icon="copy-outline" variant="info" onHide={() => setToast(false)} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  topBar: { paddingHorizontal: Spacing.gutter, paddingBottom: Spacing.sm, borderBottomWidth: 1, gap: Spacing.sm, zIndex: 10 },
  topBarRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 48 },
  iconBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  topBarTitle: { fontFamily: FontFamily.heading, fontSize: 18, fontWeight: '600', letterSpacing: -0.2 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderRadius: Radius.xl, borderWidth: 1, paddingHorizontal: Spacing.md, height: 44 },
  searchInput: { flex: 1, fontFamily: FontFamily.body, fontSize: 14 },
  scroll: { flex: 1 },
  content: { padding: Spacing.gutter, gap: Spacing.md },
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statCard: { flex: 1, borderRadius: 24, borderWidth: 1, padding: Spacing.md, gap: 4, overflow: 'hidden' },
  statStripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, borderTopLeftRadius: 24, borderBottomLeftRadius: 24 },
  statLabel: { fontFamily: FontFamily.mono, fontSize: 10, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase' },
  statValue: { fontFamily: FontFamily.heading, fontSize: 28, fontWeight: '700', letterSpacing: -1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4 },
  sectionTitleText: { fontFamily: FontFamily.heading, fontSize: 18, fontWeight: '600', letterSpacing: -0.2 },
  card: { borderRadius: 24, borderWidth: 1, padding: Spacing.md, gap: Spacing.sm },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLeft: { flex: 1, gap: 4, marginRight: Spacing.sm },
  codePill: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  codeText: { fontFamily: FontFamily.mono, fontSize: 12, fontWeight: '700', letterSpacing: 1.5 },
  cardTitle: { fontFamily: FontFamily.heading, fontSize: 18, fontWeight: '600', letterSpacing: -0.2 },
  cardDesc: { fontFamily: FontFamily.body, fontSize: 12, lineHeight: 16 },
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  badgeText: { fontFamily: FontFamily.mono, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  actionBtns: { flexDirection: 'row', gap: Spacing.xs, alignSelf: 'flex-start' },
  actionBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  cardBottom: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, paddingTop: Spacing.sm, gap: Spacing.sm },
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
  emptyText: { fontFamily: FontFamily.body, fontSize: 14, textAlign: 'center' },
  fab: { position: 'absolute', right: Spacing.lg, width: 56, height: 56, borderRadius: 28, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 },
  fabInner: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});