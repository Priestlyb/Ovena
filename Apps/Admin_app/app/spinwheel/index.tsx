/**
 * app/spinwheel/index.tsx
 *
 * Promotion Engine — Spinwheel Management. Mirrors HTML doc 11.
 *
 * Sections:
 *  Hero: animated spinwheel + "Summer Sizzler Wheel" active status + CTA buttons
 *  Main Actions: Create New Wheel | Assign Spinwheel
 *  Assigned Wheels list
 *  Segment Weights table
 *
 * "Create New Wheel" opens a bottom-sheet modal where admin:
 *  1. Names the wheel
 *  2. Sets number of coupon slots
 *  3. Selects coupons from the list
 *  4. Sees a LIVE PREVIEW of the spinwheel with their selections rendering as segments
 *  5. Confirms → wheel added to list with "Drafting" status
 *
 * The SpinwheelVisual shows the visual with slow rotation + Spin to Preview button.
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenWrapper                from '@/components/ScreenWrapper';
import { SpinwheelVisual }          from '@/components/spinwheel/SpinwheelVisual';
import { useTheme }                 from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { INITIAL_COUPONS }          from '@/data/couponData';

// ─── Assigned wheel item ──────────────────────────────────────────────────────
interface WheelItem {
  id:     string;
  name:   string;
  status: 'live' | 'paused' | 'drafting';
  icon:   string; // Ionicons name
}

const INITIAL_WHEELS: WheelItem[] = [
  { id: 'w1', name: 'New User Welcome',  status: 'live',   icon: 'gift-outline'   },
  { id: 'w2', name: 'Retention Burst',   status: 'paused', icon: 'time-outline'   },
];

function statusColor(status: WheelItem['status'], colors: any) {
  switch (status) {
    case 'live':     return { bg: `${colors.primaryContainer}1A`, text: colors.primaryContainer };
    case 'paused':   return { bg: colors.surfaceContainerHighest, text: colors.onSurfaceVariant };
    case 'drafting': return { bg: `${colors.secondary ?? '#c8c6c5'}22`, text: colors.secondary ?? '#c8c6c5' };
  }
}

export default function SpinwheelScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [wheels,     setWheels]     = useState<WheelItem[]>(INITIAL_WHEELS);
  const [showModal,  setShowModal]  = useState(false);
  const [showAssign, setShowAssign] = useState(false);

  // Modal state
  const [wheelName,       setWheelName]      = useState('');
  const [couponLimit,     setCouponLimit]     = useState('3');
  const [selectedIds,     setSelectedIds]     = useState<Set<string>>(new Set());
  const [couponSearch,    setCouponSearch]    = useState('');

  // Modal slide animation
  const sheetY   = useRef(new Animated.Value(800)).current;
  const backdropA = useRef(new Animated.Value(0)).current;

  const openModal = () => {
    setShowModal(true);
    Animated.parallel([
      Animated.spring(sheetY,   { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 4 }),
      Animated.timing(backdropA, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const closeModal = (force = false) => {
    if (!force && (wheelName || selectedIds.size > 0)) {
      Alert.alert('Discard Changes?', 'Your work is not saved.', [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => closeModal(true) },
      ]);
      return;
    }
    Animated.parallel([
      Animated.timing(sheetY,    { toValue: 800, duration: 260, useNativeDriver: true }),
      Animated.timing(backdropA, { toValue: 0,   duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setShowModal(false);
      setWheelName('');
      setSelectedIds(new Set());
      setCouponLimit('3');
      setCouponSearch('');
    });
  };

  const toggleCoupon = (id: string) => {
    const limit = parseInt(couponLimit) || 0;
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); return next; }
      if (next.size >= limit) {
        Alert.alert('Limit reached', `You can only select ${limit} coupons.`);
        return prev;
      }
      next.add(id);
      return next;
    });
  };

  const handleCreate = () => {
    const name   = wheelName.trim() || 'New Promo Wheel';
    const id     = `w${Date.now()}`;
    const labels = selectedIds.size >= 2
      ? INITIAL_COUPONS.filter(c => selectedIds.has(c.id)).map(c => c.code)
      : ['50% OFF', 'Free Delivery', '$20 OFF', 'LAVA25'];

    // Add to list as drafting
    setWheels(prev => [
      { id, name, status: 'drafting', icon: 'sparkles-outline' },
      ...prev,
    ]);

    closeModal(true);

    // Navigate to full-screen preview
    router.push({
      pathname: '/spinwheel/preview',
      params: {
        wheelName: name,
        labels:    JSON.stringify(labels),
      },
    });
  };

  // Coupon labels for wheel preview (selected coupons → use codes as labels)
  const previewLabels = selectedIds.size >= 2
    ? INITIAL_COUPONS.filter(c => selectedIds.has(c.id)).map(c => c.code)
    : ['A', 'B', 'C', 'D']; // placeholder until selections made

  const filteredCoupons = INITIAL_COUPONS.filter(c =>
    !couponSearch || c.code.toLowerCase().includes(couponSearch.toLowerCase())
  );

  const cardBg   = isDark ? 'rgba(27,27,30,0.8)' : colors.surfaceContainer;
  const cardBord = isDark ? 'rgba(255,255,255,0.10)' : colors.border;
  const sheetBg  = isDark ? '#1c1b20' : colors.surfaceContainerLow;

  return (
    <ScreenWrapper noPadding>
      {/* TopBar */}
      <View style={[
        styles.topBar,
        { paddingTop: insets.top, backgroundColor: `${colors.background}CC`, borderBottomColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border },
      ]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.onSurface }]}>Promotion Engine</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={22} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero card ── */}
        <View style={[styles.heroCard, { backgroundColor: cardBg, borderColor: cardBord }]}>
          <View style={styles.heroInner}>
            {/* Spinning wheel visual */}
            <SpinwheelVisual
              labels={['50% OFF', 'Free Delivery', '$20 OFF', 'LAVA25', '15% OFF', 'FREESHIP']}
              size={140}
              autoSpin
            />
            <View style={styles.heroText}>
              <View style={styles.heroPill}>
                <View style={[styles.statusDot, { backgroundColor: colors.primaryContainer, shadowColor: colors.primaryContainer }]} />
                <Text style={[styles.statusLabel, { color: colors.primaryContainer }]}>ACTIVE ENGINE</Text>
              </View>
              <Text style={[styles.heroTitle, { color: colors.onSurface }]}>Summer Sizzler Wheel</Text>
              <Text style={[styles.heroDesc, { color: colors.onSurfaceVariant }]}>
                Live campaign — 14.2k interactions this week · 62% engagement rate
              </Text>
              <View style={styles.heroBtns}>
                <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.primaryContainer }]} activeOpacity={0.85}>
                  <Text style={[styles.primaryBtnText, { color: colors.onPrimaryContainer }]}>Configure</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.secondaryBtn, { backgroundColor: `${colors.secondaryContainer ?? '#474746'}50`, borderColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border }]} activeOpacity={0.7}>
                  <Text style={[styles.secondaryBtnText, { color: colors.onSurface }]}>View Logs</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* ── Main actions ── */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: cardBg, borderColor: cardBord }]}
            onPress={openModal}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: `${colors.primaryContainer}1A` }]}>
              <Ionicons name="add-circle-outline" size={26} color={colors.primaryContainer} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.onSurface }]}>Create New Wheel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: cardBg, borderColor: cardBord }]}
            onPress={() => setShowAssign(true)}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: `${colors.primaryContainer}1A` }]}>
              <Ionicons name="checkmark-circle-outline" size={26} color={colors.primaryContainer} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.onSurface }]}>Assign Spinwheel</Text>
          </TouchableOpacity>
        </View>

        {/* ── Assigned wheels ── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Assigned Wheels</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: colors.primaryContainer }]}>SEE ALL</Text>
          </TouchableOpacity>
        </View>

        {wheels.map((wheel, i) => {
          const sc = statusColor(wheel.status, colors);
          return (
            <View
              key={wheel.id}
              style={[
                styles.wheelRow,
                {
                  backgroundColor: cardBg,
                  borderColor:     cardBord,
                  borderLeftColor: wheel.status === 'live' ? colors.primaryContainer : 'transparent',
                  borderLeftWidth: wheel.status === 'live' ? 4 : 1,
                },
              ]}
            >
              <View style={[styles.wheelIcon, { backgroundColor: colors.surfaceContainerHigh }]}>
                <Ionicons name={wheel.icon as any} size={22} color={colors.onSurfaceVariant} />
              </View>
              <View style={styles.wheelInfo}>
                <View style={styles.wheelTitleRow}>
                  <Text style={[styles.wheelName, { color: colors.onSurface }]}>{wheel.name}</Text>
                  <View style={[styles.statusPill, { backgroundColor: sc.bg }]}>
                    <Text style={[styles.statusPillText, { color: sc.text }]}>
                      {wheel.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.wheelId, { color: colors.onSurfaceVariant }]}>
                  ID: WHEEL-{wheel.id.slice(-4).toUpperCase().padStart(4, '0')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceVariant} />
            </View>
          );
        })}

        {/* ── Segment weights table ── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Segment Weights</Text>
          <View style={[styles.totalPill, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : colors.surfaceContainerHigh }]}>
            <Text style={[styles.totalText, { color: colors.onSurfaceVariant }]}>TOTAL: 100%</Text>
          </View>
        </View>

        <View style={[styles.table, { backgroundColor: cardBg, borderColor: cardBord }]}>
          <View style={[styles.tableHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : colors.surfaceContainerHigh, borderBottomColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border }]}>
            <Text style={[styles.tableHeaderText, { color: colors.onSurfaceVariant, flex: 1 }]}>REWARD</Text>
            <Text style={[styles.tableHeaderText, { color: colors.onSurfaceVariant }]}>PROBABILITY</Text>
          </View>
          {[
            { label: '5% Discount Code',    pct: '50.0%', dot: colors.primary },
            { label: 'Free Delivery Voucher', pct: '30.0%', dot: colors.secondary ?? '#c8c6c5' },
            { label: 'Mystery Bonus',        pct: '20.0%', dot: '#a78bfa' },
          ].map((row, i) => (
            <View
              key={i}
              style={[
                styles.tableRow,
                { borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : colors.border, borderBottomWidth: i < 2 ? 1 : 0 },
              ]}
            >
              <View style={styles.tableCell}>
                <View style={[styles.rowDot, { backgroundColor: row.dot }]} />
                <Text style={[styles.rowLabel, { color: colors.onSurface }]}>{row.label}</Text>
              </View>
              <Text style={[styles.rowPct, { color: colors.primaryContainer }]}>{row.pct}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ── Create Wheel Modal ── */}
      <Modal transparent visible={showModal} animationType="none" onRequestClose={() => closeModal()}>
        <TouchableWithoutFeedback onPress={() => closeModal()}>
          <Animated.View style={[styles.backdrop, { opacity: backdropA }]} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: sheetBg, borderColor: cardBord, transform: [{ translateY: sheetY }] },
          ]}
        >
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: colors.outlineVariant }]} />

          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={[styles.modalTitle, { color: colors.onSurface }]}>Create New Wheel</Text>
              <Text style={[styles.modalSub, { color: colors.onSurfaceVariant }]}>Configure your promotion wheel</Text>
            </View>
            <TouchableOpacity onPress={() => closeModal()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.sheetScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Wheel name */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.onSurfaceVariant }]}>SPINWHEEL NAME</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: isDark ? colors.surfaceContainer : colors.surfaceContainerLow, borderColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border, color: colors.onSurface }]}
                value={wheelName}
                onChangeText={setWheelName}
                placeholder="e.g. Flash Sale Oct"
                placeholderTextColor={colors.onSurfaceVariant + '60'}
                selectionColor={colors.primaryContainer}
              />
            </View>

            {/* Coupon limit */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.onSurfaceVariant }]}>NUMBER OF COUPONS</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: isDark ? colors.surfaceContainer : colors.surfaceContainerLow, borderColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border, color: colors.onSurface }]}
                value={couponLimit}
                onChangeText={(v) => { setCouponLimit(v); setSelectedIds(new Set()); }}
                keyboardType="number-pad"
                selectionColor={colors.primaryContainer}
              />
            </View>

            {/* Coupon selection */}
            <View style={styles.formGroup}>
              <View style={styles.selectionHeader}>
                <Text style={[styles.formLabel, { color: colors.onSurfaceVariant }]}>AVAILABLE COUPONS</Text>
                <Text style={[styles.counter, { color: colors.primaryContainer }]}>
                  Selected: {selectedIds.size}/{couponLimit}
                </Text>
              </View>
              {/* Search */}
              <View style={[styles.couponSearch, { backgroundColor: isDark ? colors.surfaceContainerLow : colors.surfaceContainerLow, borderColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border }]}>
                <Ionicons name="search-outline" size={16} color={colors.onSurfaceVariant} />
                <TextInput
                  style={[styles.couponSearchInput, { color: colors.onSurface }]}
                  value={couponSearch}
                  onChangeText={setCouponSearch}
                  placeholder="Search coupons..."
                  placeholderTextColor={colors.onSurfaceVariant + '60'}
                  selectionColor={colors.primaryContainer}
                />
              </View>
              {/* List */}
              <View style={styles.couponList}>
                {filteredCoupons.map(c => {
                  const sel = selectedIds.has(c.id);
                  return (
                    <TouchableOpacity
                      key={c.id}
                      style={[
                        styles.couponItem,
                        {
                          backgroundColor: sel ? `${colors.primaryContainer}12` : isDark ? 'rgba(255,255,255,0.05)' : colors.surfaceContainerLow,
                          borderColor:     sel ? colors.primaryContainer : 'transparent',
                        },
                      ]}
                      onPress={() => toggleCoupon(c.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.couponItemText, { color: colors.onSurface }]}>
                        {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `$${c.discountValue} OFF`} — {c.code}
                      </Text>
                      <View style={[styles.checkbox, { borderColor: sel ? colors.primaryContainer : isDark ? 'rgba(255,255,255,0.20)' : colors.border, backgroundColor: sel ? `${colors.primaryContainer}20` : 'transparent' }]}>
                        {sel && <Ionicons name="checkmark" size={12} color={colors.primaryContainer} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* ── Live spinwheel preview ── */}
            {selectedIds.size >= 2 && (
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.onSurfaceVariant }]}>LIVE PREVIEW</Text>
                <View style={[styles.previewCard, { backgroundColor: isDark ? colors.surfaceContainerLowest : colors.surfaceContainer, borderColor: isDark ? 'rgba(255,255,255,0.08)' : colors.border }]}>
                  <SpinwheelVisual
                    labels={previewLabels}
                    size={200}
                    autoSpin={false}
                  />
                </View>
              </View>
            )}
            {selectedIds.size < 2 && selectedIds.size > 0 && (
              <Text style={[styles.previewHint, { color: colors.onSurfaceVariant }]}>
                Select at least 2 coupons to see the wheel preview
              </Text>
            )}

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Footer CTA */}
          <View style={[styles.sheetFooter, { backgroundColor: isDark ? colors.surfaceContainerHigh : colors.surfaceContainer, borderTopColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border }]}>
            <TouchableOpacity
              style={[styles.createBtn, { backgroundColor: colors.primary }]}
              onPress={handleCreate}
              activeOpacity={0.88}
            >
              <Text style={[styles.createBtnText, { color: colors.onPrimary }]}>Create Wheel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>

      {/* Assign Spinwheel — simple placeholder modal */}
      <Modal transparent visible={showAssign} animationType="fade" onRequestClose={() => setShowAssign(false)}>
        <TouchableWithoutFeedback onPress={() => setShowAssign(false)}>
          <View style={[styles.backdrop, { opacity: 1 }]} />
        </TouchableWithoutFeedback>
        <View style={[styles.assignModal, { backgroundColor: sheetBg, borderColor: cardBord }]}>
          <Text style={[styles.modalTitle, { color: colors.onSurface, marginBottom: 8 }]}>Assign Spinwheel</Text>
          <Text style={[styles.modalSub, { color: colors.onSurfaceVariant, marginBottom: Spacing.lg }]}>
            Select a wheel and assign it to a user segment or campaign.
          </Text>
          {wheels.map(w => (
            <TouchableOpacity
              key={w.id}
              style={[styles.assignItem, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : colors.surfaceContainerHigh, borderColor: isDark ? 'rgba(255,255,255,0.08)' : colors.border }]}
              onPress={() => { Alert.alert('Assigned', `"${w.name}" has been assigned.`); setShowAssign(false); }}
            >
              <Text style={[styles.assignItemText, { color: colors.onSurface }]}>{w.name}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.createBtn, { backgroundColor: colors.primaryContainer, marginTop: Spacing.md }]}
            onPress={() => setShowAssign(false)}
          >
            <Text style={[styles.createBtnText, { color: colors.onPrimaryContainer }]}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.gutter, paddingBottom: Spacing.sm, borderBottomWidth: 1, minHeight: 56 },
  iconBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  topBarTitle: { fontFamily: FontFamily.heading, fontSize: 18, fontWeight: '600', letterSpacing: -0.2 },
  scroll: { flex: 1 },
  content: { padding: Spacing.gutter, gap: Spacing.md },
  heroCard: { borderRadius: 28, borderWidth: 1, padding: Spacing.lg, overflow: 'hidden' },
  heroInner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, flexWrap: 'wrap' },
  heroText: { flex: 1, minWidth: 160, gap: Spacing.xs },
  heroPill: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 4 },
  statusLabel: { fontFamily: FontFamily.mono, fontSize: 10, fontWeight: '500', letterSpacing: 2, textTransform: 'uppercase' },
  heroTitle: { fontFamily: FontFamily.heading, fontSize: 20, fontWeight: '600', letterSpacing: -0.3 },
  heroDesc: { fontFamily: FontFamily.body, fontSize: 12, lineHeight: 18 },
  heroBtns: { flexDirection: 'row', gap: Spacing.sm, marginTop: 4 },
  primaryBtn: { paddingHorizontal: Spacing.lg, paddingVertical: 8, borderRadius: Radius.full },
  primaryBtnText: { fontFamily: FontFamily.heading, fontSize: 14, fontWeight: '700' },
  secondaryBtn: { paddingHorizontal: Spacing.lg, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1 },
  secondaryBtnText: { fontFamily: FontFamily.body, fontSize: 14, fontWeight: '500' },
  actionsRow: { flexDirection: 'row', gap: Spacing.md },
  actionCard: { flex: 1, borderRadius: 24, borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.lg, paddingHorizontal: Spacing.md },
  actionIcon: { width: 48, height: 48, borderRadius: Radius.xl, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { fontFamily: FontFamily.body, fontSize: 14, fontWeight: '500', textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontFamily: FontFamily.heading, fontSize: 18, fontWeight: '600', letterSpacing: -0.2 },
  seeAll: { fontFamily: FontFamily.mono, fontSize: 10, fontWeight: '500', letterSpacing: 1 },
  wheelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderRadius: 24, borderWidth: 1, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, overflow: 'hidden' },
  wheelIcon: { width: 48, height: 48, borderRadius: Radius.lg, justifyContent: 'center', alignItems: 'center' },
  wheelInfo: { flex: 1, gap: 3 },
  wheelTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wheelName: { fontFamily: FontFamily.body, fontSize: 15, fontWeight: '600' },
  statusPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  statusPillText: { fontFamily: FontFamily.mono, fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  wheelId: { fontFamily: FontFamily.mono, fontSize: 10 },
  totalPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.md },
  totalText: { fontFamily: FontFamily.mono, fontSize: 10, fontWeight: '500' },
  table: { borderRadius: 24, borderWidth: 1, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: 10, borderBottomWidth: 1 },
  tableHeaderText: { fontFamily: FontFamily.mono, fontSize: 10, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  tableCell: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  rowDot: { width: 8, height: 8, borderRadius: 4 },
  rowLabel: { fontFamily: FontFamily.body, fontSize: 14 },
  rowPct: { fontFamily: FontFamily.mono, fontSize: 12, fontWeight: '700' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.72)' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, borderBottomWidth: 0, maxHeight: '88%' },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: Spacing.sm, marginBottom: Spacing.xs },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  modalTitle: { fontFamily: FontFamily.heading, fontSize: 18, fontWeight: '600', letterSpacing: -0.2 },
  modalSub: { fontFamily: FontFamily.body, fontSize: 12, marginTop: 3 },
  sheetScroll: { paddingHorizontal: Spacing.lg },
  formGroup: { paddingTop: Spacing.md, gap: 8 },
  formLabel: { fontFamily: FontFamily.mono, fontSize: 10, fontWeight: '500', letterSpacing: 1.5, textTransform: 'uppercase' },
  formInput: { borderRadius: Radius.xl, borderWidth: 1, paddingHorizontal: Spacing.md, paddingVertical: 10, fontFamily: FontFamily.body, fontSize: 14 },
  selectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  counter: { fontFamily: FontFamily.mono, fontSize: 10, fontWeight: '500' },
  couponSearch: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: Radius.xl, borderWidth: 1, paddingHorizontal: Spacing.md, height: 40 },
  couponSearchInput: { flex: 1, fontFamily: FontFamily.body, fontSize: 13 },
  couponList: { gap: 6 },
  couponItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: Radius.xl, borderWidth: 1, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  couponItemText: { fontFamily: FontFamily.body, fontSize: 14, flex: 1 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  previewCard: { borderRadius: 24, borderWidth: 1, padding: Spacing.lg, alignItems: 'center' },
  previewHint: { fontFamily: FontFamily.body, fontSize: 12, textAlign: 'center', paddingVertical: Spacing.sm },
  sheetFooter: { borderTopWidth: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Platform.OS === 'ios' ? 36 : Spacing.lg },
  createBtn: { borderRadius: Radius.xl, paddingVertical: Spacing.sm + 2, alignItems: 'center' },
  createBtnText: { fontFamily: FontFamily.heading, fontSize: 15, fontWeight: '700' },
  assignModal: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, padding: Spacing.lg, paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.xl },
  assignItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: Radius.xl, borderWidth: 1, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, marginBottom: Spacing.xs },
  assignItemText: { fontFamily: FontFamily.body, fontSize: 15, fontWeight: '500' },
});