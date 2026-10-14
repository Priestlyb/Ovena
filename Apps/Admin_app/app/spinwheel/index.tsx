/**
 * app/spinwheel/index.tsx
 *
 * Promotion Engine — Spinwheel Management.
 *
 * Now backed by real endpoints:
 *  GET  /api/admin/coupons/wheel/all/     — list (id, max_entries_amount, is_active)
 *  GET  /api/admin/coupons/wheel/{id}/    — detail (adds full nested `coupons`)
 *  POST /api/admin/coupons/wheel/create/  — create
 *
 * A wheel has NO name field on the backend — confirmed against the real
 * list response. The "Spinwheel Name" field in the create modal is kept as
 * a LOCAL-ONLY label (stored in a local id→name map, not persisted, and
 * lost on app restart / reinstall) since there's currently nowhere on the
 * backend to save it. Wheels without a locally-cached name (e.g. any wheel
 * that existed before this session, or created from another device) just
 * display as "Wheel #{id}".
 *
 * ⚠️ Still no assign endpoint — the Assign Spinwheel modal lists the real
 * wheels but tapping one shows an honest "not available yet" message
 * rather than faking a persisted assignment.
 *
 * Coupon selection in Create Wheel pulls real reward coupons
 * (is_reward === true, not exhausted, not expired) from AppDataContext.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  Switch,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenWrapper                from '@/components/ScreenWrapper';
import { SpinwheelVisual }          from '@/components/spinwheel/SpinwheelVisual';
import { useTheme }                 from '@/context/ThemeContext';
import { useAuth }                  from '@/context/AuthContext';
import { useAppData }               from '@/context/AppDataContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import {
  createSpinWheel,
  fetchAllSpinWheels,
  fetchSpinWheelDetail,
  CouponsActionsApiError,
} from '@/services/actionsApi';
import { Coupon, SpinWheel, SpinWheelDetail } from '@/types/appData';

function isRewardCouponUsable(c: Coupon) {
  const notExpired = new Date(c.valid_until).getTime() > Date.now();
  return c.is_reward && !c.exhausted && notExpired;
}

function couponLabel(c: Coupon) {
  const value = parseFloat(c.discount_value);
  const shown = Number.isFinite(value) ? value : c.discount_value;
  const discount = c.discount_type === 'percent' ? `${shown}% OFF` : `₦${shown} OFF`;
  return `${discount} — ${c.code}`;
}

export default function SpinwheelScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { tokens } = useAuth();
  const { data } = useAppData();

  const rewardCoupons = (data?.coupons ?? []).filter(isRewardCouponUsable);

  // Real wheel list + loading/error state
  const [wheels,     setWheels]     = useState<SpinWheel[]>([]);
  const [wheelsLoading, setWheelsLoading] = useState(false);
  const [wheelsError,   setWheelsError]   = useState<string | null>(null);

  // Local-only name labels (id → name), lost on restart — backend has no
  // name field, this is purely a client-side convenience.
  const [localNames, setLocalNames] = useState<Record<number, string>>({});

  const [showModal,  setShowModal]  = useState(false);
  const [showAssign, setShowAssign] = useState(false);

  // Info modal
  const [infoWheelId, setInfoWheelId] = useState<number | null>(null);
  const [infoDetail,  setInfoDetail]  = useState<SpinWheelDetail | null>(null);
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoError,   setInfoError]   = useState<string | null>(null);

  // Create modal state
  const [wheelName,       setWheelName]       = useState('');
  const [maxEntries,      setMaxEntries]      = useState('100');
  const [isActive,        setIsActive]        = useState(true);
  const [selectedIds,     setSelectedIds]     = useState<Set<number>>(new Set());
  const [couponSearch,    setCouponSearch]    = useState('');
  const [submitting,      setSubmitting]      = useState(false);

  const sheetY    = useRef(new Animated.Value(800)).current;
  const backdropA = useRef(new Animated.Value(0)).current;

  const loadWheels = useCallback(async () => {
    if (!tokens?.accessToken) return;
    setWheelsLoading(true);
    setWheelsError(null);
    try {
      const page = await fetchAllSpinWheels(tokens.accessToken);
      setWheels([...page.results].sort((a, b) => b.id - a.id)); // newest first
    } catch (err) {
      setWheelsError(err instanceof CouponsActionsApiError ? err.message : 'Failed to load spinwheels.');
    } finally {
      setWheelsLoading(false);
    }
  }, [tokens?.accessToken]);

  useEffect(() => {
    loadWheels();
  }, [loadWheels]);

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
      setMaxEntries('100');
      setIsActive(true);
      setCouponSearch('');
    });
  };

  const toggleCoupon = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); return next; }
      next.add(id);
      return next;
    });
  };

  const handleCreate = async () => {
    if (selectedIds.size < 2) {
      return Alert.alert('Select coupons', 'Pick at least 2 reward coupons for the wheel.');
    }
    if (!maxEntries || isNaN(Number(maxEntries)) || Number(maxEntries) <= 0) {
      return Alert.alert('Missing max entries', 'Please enter a valid max entries number.');
    }
    if (!tokens?.accessToken) {
      return Alert.alert('Not signed in', 'Please sign in again and retry.');
    }

    const selectedCoupons = rewardCoupons.filter(c => selectedIds.has(c.id));
    const name = wheelName.trim() || 'New Promo Wheel';

    setSubmitting(true);
    try {
      const created = await createSpinWheel(
        {
          max_entries_amount: Number(maxEntries),
          is_active: isActive,
          coupon_ids: Array.from(selectedIds),
        },
        tokens.accessToken,
      );

      if (created?.id != null) {
        setLocalNames(prev => ({ ...prev, [created.id]: name }));
      }

      await loadWheels(); // refetch so the list reflects the real backend state
      closeModal(true);

      router.push({
        pathname: '/spinwheel/preview',
        params: {
          wheelName: name,
          labels:    JSON.stringify(selectedCoupons.map(c => c.code)),
        },
      });
    } catch (err) {
      const message = err instanceof CouponsActionsApiError ? err.message : 'Something went wrong creating the wheel.';
      Alert.alert("Couldn't create wheel", message);
    } finally {
      setSubmitting(false);
    }
  };

  const openInfo = async (wheelId: number) => {
    setInfoWheelId(wheelId);
    setInfoDetail(null);
    setInfoError(null);
    if (!tokens?.accessToken) {
      setInfoError('Not signed in.');
      return;
    }
    setInfoLoading(true);
    try {
      const detail = await fetchSpinWheelDetail(wheelId, tokens.accessToken);
      setInfoDetail(detail);
    } catch (err) {
      setInfoError(err instanceof CouponsActionsApiError ? err.message : 'Failed to load wheel details.');
    } finally {
      setInfoLoading(false);
    }
  };

  const closeInfo = () => {
    setInfoWheelId(null);
    setInfoDetail(null);
    setInfoError(null);
  };

  const previewLabels = selectedIds.size >= 2
    ? rewardCoupons.filter(c => selectedIds.has(c.id)).map(c => c.code)
    : [];

  const filteredCoupons = rewardCoupons.filter(c =>
    !couponSearch || c.code.toLowerCase().includes(couponSearch.toLowerCase())
  );

  const cardBg   = isDark ? 'rgba(27,27,30,0.8)' : colors.surfaceContainer;
  const cardBord = isDark ? 'rgba(255,255,255,0.10)' : colors.border;
  const sheetBg  = isDark ? '#1c1b20' : colors.surfaceContainerLow;

  const wheelDisplayName = (w: SpinWheel) => localNames[w.id] ?? `Wheel #${w.id}`;

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
        <TouchableOpacity style={styles.iconBtn} onPress={loadWheels}>
          <Ionicons name="refresh-outline" size={20} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero card — static/decorative, not tied to a real wheel record ── */}
        <View style={[styles.heroCard, { backgroundColor: cardBg, borderColor: cardBord }]}>
          <View style={styles.heroInner}>
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

        {/* ── Wheels list ── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Your Wheels</Text>
          {wheels.length > 0 && (
            <Text style={[styles.seeAllHint, { color: colors.onSurfaceVariant }]}>{wheels.length} TOTAL</Text>
          )}
        </View>

        {wheelsLoading && wheels.length === 0 && (
          <View style={styles.centerBlock}>
            <ActivityIndicator color={colors.primaryContainer} />
          </View>
        )}

        {!wheelsLoading && wheelsError && wheels.length === 0 && (
          <View style={styles.centerBlock}>
            <Ionicons name="alert-circle-outline" size={32} color={colors.error} />
            <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>{wheelsError}</Text>
          </View>
        )}

        {!wheelsLoading && !wheelsError && wheels.length === 0 && (
          <View style={styles.centerBlock}>
            <Ionicons name="sync-circle-outline" size={32} color={colors.outlineVariant} />
            <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>No spinwheels yet — create one above.</Text>
          </View>
        )}

        {wheels.map((wheel) => (
          <TouchableOpacity
            key={wheel.id}
            onPress={() => openInfo(wheel.id)}
            activeOpacity={0.8}
            style={[
              styles.wheelRow,
              {
                backgroundColor: cardBg,
                borderColor:     cardBord,
                borderLeftColor: wheel.is_active ? colors.primaryContainer : 'transparent',
                borderLeftWidth: wheel.is_active ? 4 : 1,
              },
            ]}
          >
            <View style={[styles.wheelIcon, { backgroundColor: colors.surfaceContainerHigh }]}>
              <Ionicons name="sparkles-outline" size={22} color={colors.onSurfaceVariant} />
            </View>
            <View style={styles.wheelInfo}>
              <View style={styles.wheelTitleRow}>
                <Text style={[styles.wheelName, { color: colors.onSurface }]}>{wheelDisplayName(wheel)}</Text>
                <View style={[styles.statusPill, { backgroundColor: wheel.is_active ? `${colors.primaryContainer}1A` : colors.surfaceContainerHighest }]}>
                  <Text style={[styles.statusPillText, { color: wheel.is_active ? colors.primaryContainer : colors.onSurfaceVariant }]}>
                    {wheel.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.wheelId, { color: colors.onSurfaceVariant }]}>
                ID: {wheel.id} · Max entries: {wheel.max_entries_amount}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        ))}

        {/* ── Segment weights table — static illustrative example, not tied to a real wheel ── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Segment Weights (Example)</Text>
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
          <View style={[styles.handle, { backgroundColor: colors.outlineVariant }]} />

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
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.onSurfaceVariant }]}>SPINWHEEL NAME (LOCAL LABEL ONLY)</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: isDark ? colors.surfaceContainer : colors.surfaceContainerLow, borderColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border, color: colors.onSurface }]}
                value={wheelName}
                onChangeText={setWheelName}
                placeholder="e.g. Flash Sale Oct"
                placeholderTextColor={colors.onSurfaceVariant + '60'}
                selectionColor={colors.primaryContainer}
              />
              <Text style={[styles.fieldHint, { color: colors.onSurfaceVariant }]}>
                Not saved on the backend — shown only on this device until reinstalled.
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.onSurfaceVariant }]}>MAX ENTRIES</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: isDark ? colors.surfaceContainer : colors.surfaceContainerLow, borderColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border, color: colors.onSurface }]}
                value={maxEntries}
                onChangeText={setMaxEntries}
                keyboardType="number-pad"
                placeholder="100"
                placeholderTextColor={colors.onSurfaceVariant + '60'}
                selectionColor={colors.primaryContainer}
              />
            </View>

            <View style={[styles.formGroup, styles.toggleRow]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.formLabel, { color: colors.onSurfaceVariant }]}>ACTIVE</Text>
                <Text style={[styles.toggleSub, { color: colors.onSurfaceVariant }]}>Whether this wheel accepts entries right away</Text>
              </View>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: colors.surfaceContainerHighest, true: colors.primaryContainer }}
                thumbColor={colors.onSurface}
              />
            </View>

            <View style={styles.formGroup}>
              <View style={styles.selectionHeader}>
                <Text style={[styles.formLabel, { color: colors.onSurfaceVariant }]}>REWARD COUPONS</Text>
                <Text style={[styles.counter, { color: colors.primaryContainer }]}>
                  Selected: {selectedIds.size}
                </Text>
              </View>
              <View style={[styles.couponSearch, { backgroundColor: isDark ? colors.surfaceContainerLow : colors.surfaceContainerLow, borderColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border }]}>
                <Ionicons name="search-outline" size={16} color={colors.onSurfaceVariant} />
                <TextInput
                  style={[styles.couponSearchInput, { color: colors.onSurface }]}
                  value={couponSearch}
                  onChangeText={setCouponSearch}
                  placeholder="Search reward coupons..."
                  placeholderTextColor={colors.onSurfaceVariant + '60'}
                  selectionColor={colors.primaryContainer}
                />
              </View>

              {filteredCoupons.length === 0 ? (
                <Text style={[styles.previewHint, { color: colors.onSurfaceVariant }]}>
                  {rewardCoupons.length === 0
                    ? 'No active reward coupons available. Create one in Coupon Manager first.'
                    : 'No reward coupons match your search.'}
                </Text>
              ) : (
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
                          {couponLabel(c)}
                        </Text>
                        <View style={[styles.checkbox, { borderColor: sel ? colors.primaryContainer : isDark ? 'rgba(255,255,255,0.20)' : colors.border, backgroundColor: sel ? `${colors.primaryContainer}20` : 'transparent' }]}>
                          {sel && <Ionicons name="checkmark" size={12} color={colors.primaryContainer} />}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

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

          <View style={[styles.sheetFooter, { backgroundColor: isDark ? colors.surfaceContainerHigh : colors.surfaceContainer, borderTopColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border }]}>
            <TouchableOpacity
              style={[styles.createBtn, { backgroundColor: colors.primary, opacity: submitting ? 0.7 : 1 }]}
              onPress={handleCreate}
              activeOpacity={0.88}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={[styles.createBtnText, { color: colors.onPrimary }]}>Create Wheel</Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>

      {/* ── Assign Spinwheel modal — real wheel list, no assign endpoint yet ── */}
      <Modal transparent visible={showAssign} animationType="fade" onRequestClose={() => setShowAssign(false)}>
        <TouchableWithoutFeedback onPress={() => setShowAssign(false)}>
          <View style={[styles.backdrop, { opacity: 1 }]} />
        </TouchableWithoutFeedback>
        <View style={[styles.assignModal, { backgroundColor: sheetBg, borderColor: cardBord }]}>
          <Text style={[styles.modalTitle, { color: colors.onSurface, marginBottom: 4 }]}>Assign Spinwheel</Text>
          <Text style={[styles.modalSub, { color: colors.onSurfaceVariant, marginBottom: 4 }]}>
            Select a wheel to assign it to a user segment or campaign.
          </Text>
          <Text style={[styles.assignNotice, { color: colors.onSurfaceVariant }]}>
            ⚠️ No assign endpoint exists on the backend yet — this list is real, but assigning isn't saved anywhere.
          </Text>

          {wheelsLoading && wheels.length === 0 && (
            <View style={styles.centerBlock}><ActivityIndicator color={colors.primaryContainer} /></View>
          )}

          {wheels.map(w => (
            <View key={w.id} style={[styles.assignItem, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : colors.surfaceContainerHigh, borderColor: isDark ? 'rgba(255,255,255,0.08)' : colors.border }]}>
              <TouchableOpacity
                style={styles.assignItemMain}
                onPress={() => Alert.alert('Not available yet', 'There is no assign endpoint on the backend yet, so this can\'t be persisted.')}
              >
                <Text style={[styles.assignItemText, { color: colors.onSurface }]}>{wheelDisplayName(w)}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openInfo(w.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="information-circle-outline" size={20} color={colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.createBtn, { backgroundColor: colors.primaryContainer, marginTop: Spacing.md }]}
            onPress={() => setShowAssign(false)}
          >
            <Text style={[styles.createBtnText, { color: colors.onPrimaryContainer }]}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* ── Wheel info modal — real detail fetch ── */}
      <Modal transparent visible={infoWheelId !== null} animationType="fade" onRequestClose={closeInfo}>
        <TouchableWithoutFeedback onPress={closeInfo}>
          <View style={[styles.backdrop, { opacity: 1 }]} />
        </TouchableWithoutFeedback>
        {infoWheelId !== null && (
          <View style={[styles.infoModal, { backgroundColor: sheetBg, borderColor: cardBord }]}>
            <View style={styles.infoHeader}>
              <Text style={[styles.modalTitle, { color: colors.onSurface }]}>
                {localNames[infoWheelId] ?? `Wheel #${infoWheelId}`}
              </Text>
              <TouchableOpacity onPress={closeInfo} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={20} color={colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            {infoLoading && (
              <View style={styles.centerBlock}><ActivityIndicator color={colors.primaryContainer} /></View>
            )}

            {!infoLoading && infoError && (
              <Text style={[styles.infoNoData, { color: colors.error }]}>{infoError}</Text>
            )}

            {!infoLoading && !infoError && infoDetail && (
              <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
                <View style={styles.infoRows}>
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.onSurfaceVariant }]}>ID</Text>
                    <Text style={[styles.infoValue, { color: colors.onSurface }]}>{infoDetail.id}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.onSurfaceVariant }]}>ACTIVE</Text>
                    <Text style={[styles.infoValue, { color: colors.onSurface }]}>{infoDetail.is_active ? 'Yes' : 'No'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.onSurfaceVariant }]}>MAX ENTRIES</Text>
                    <Text style={[styles.infoValue, { color: colors.onSurface }]}>{infoDetail.max_entries_amount}</Text>
                  </View>
                </View>

                <Text style={[styles.formLabel, { color: colors.onSurfaceVariant, marginTop: Spacing.md, marginBottom: Spacing.xs }]}>
                  COUPONS ({infoDetail.coupons?.length ?? 0})
                </Text>
                {(infoDetail.coupons ?? []).length === 0 ? (
                  <Text style={[styles.infoNoData, { color: colors.onSurfaceVariant }]}>No coupons on this wheel.</Text>
                ) : (
                  <View style={{ gap: 6 }}>
                    {infoDetail.coupons.map(c => (
                      <View key={c.id} style={[styles.couponItem, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : colors.surfaceContainerLow, borderColor: 'transparent' }]}>
                        <Text style={[styles.couponItemText, { color: colors.onSurface }]}>{couponLabel(c)}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
            )}

            <TouchableOpacity
              style={[styles.createBtn, { backgroundColor: colors.primaryContainer, marginTop: Spacing.md }]}
              onPress={closeInfo}
            >
              <Text style={[styles.createBtnText, { color: colors.onPrimaryContainer }]}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
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
  seeAllHint: { fontFamily: FontFamily.mono, fontSize: 9, fontWeight: '500', letterSpacing: 1 },
  centerBlock: { alignItems: 'center', paddingVertical: Spacing.lg, gap: Spacing.sm },
  emptyText: { fontFamily: FontFamily.body, fontSize: 13, textAlign: 'center' },
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
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.72)' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, borderBottomWidth: 0, maxHeight: '88%' },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: Spacing.sm, marginBottom: Spacing.xs },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  modalTitle: { fontFamily: FontFamily.heading, fontSize: 18, fontWeight: '600', letterSpacing: -0.2 },
  modalSub: { fontFamily: FontFamily.body, fontSize: 12, marginTop: 3 },
  sheetScroll: { paddingHorizontal: Spacing.lg },
  formGroup: { paddingTop: Spacing.md, gap: 8 },
  formLabel: { fontFamily: FontFamily.mono, fontSize: 10, fontWeight: '500', letterSpacing: 1.5, textTransform: 'uppercase' },
  fieldHint: { fontFamily: FontFamily.body, fontSize: 11, opacity: 0.75, marginLeft: 4 },
  formInput: { borderRadius: Radius.xl, borderWidth: 1, paddingHorizontal: Spacing.md, paddingVertical: 10, fontFamily: FontFamily.body, fontSize: 14 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleSub: { fontFamily: FontFamily.body, fontSize: 11, marginTop: 2, opacity: 0.8 },
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
  assignNotice: { fontFamily: FontFamily.body, fontSize: 11, lineHeight: 15, marginBottom: Spacing.md },
  assignItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: Radius.xl, borderWidth: 1, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, marginBottom: Spacing.xs },
  assignItemMain: { flex: 1 },
  assignItemText: { fontFamily: FontFamily.body, fontSize: 15, fontWeight: '500' },
  infoModal: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, padding: Spacing.lg, paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.xl, gap: Spacing.md },
  infoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoNoData: { fontFamily: FontFamily.body, fontSize: 13, lineHeight: 18 },
  infoRows: { gap: Spacing.sm },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Spacing.md },
  infoLabel: { fontFamily: FontFamily.mono, fontSize: 10, fontWeight: '500', letterSpacing: 1, paddingTop: 2 },
  infoValue: { fontFamily: FontFamily.body, fontSize: 14, fontWeight: '500', flex: 1, textAlign: 'right' },
});