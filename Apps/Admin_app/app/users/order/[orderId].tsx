/**
 * app/users/order/[orderId].tsx
 *
 * Order detail screen. Route params (branch, orderer, driver, status,
 * subtotal, grand_total) are the instant fallback display while this
 * screen fetches GET /api/admin/orders/<id>/ for itself on mount — that
 * fetch is also reused as the refresh step after Change Status / Assign
 * Driver succeed, so the screen always reflects the server's current
 * state rather than the possibly-stale values it was navigated in with.
 *
 * ── Change Status ──
 * Opens a centered popup listing every status in ALL_ORDER_STATUSES
 * (types/dashboard.ts) except the current one. Picking one calls
 * POST /api/admin/orders/<id>/force-status/ { status, reason }.
 *
 * ── Assign Rider ──
 * Opens a centered popup that fetches GET /api/admin/employees/drivers/
 * and filters to is_available === true && is_online === true (both
 * logged — raw fetch, then the filtered subset). Picking a driver calls
 * POST /api/admin/orders/<id>/assign-driver/ { driver_id }. Note: in the
 * one real sample captured so far, EVERY driver had is_online: false, so
 * an empty list here is an expected real state, not necessarily a bug.
 *
 * Both actions: on success, close the popup, refetch the order, and
 * re-request order_events (a status/driver change should produce a new
 * event, so the Status History section should reflect it too). On
 * failure, the popup stays open with an inline error instead of silently
 * closing. Every request and response is logged to console.
 *
 * ⚠️ Items are NOT available from any confirmed endpoint yet — the Items
 * section below is a deliberate placeholder, not a bug.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView, View, Text, Pressable, StyleSheet, Modal, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import ScreenWrapper from '@/components/ScreenWrapper';
import { Skeleton } from '@/components/Skeleton';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useAdminOrdersWS } from '@/context/AdminOrdersWebSocketContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { ALL_ORDER_STATUSES, ORDER_STATUS_LABEL } from '@/types/dashboard';
import {
  AdminOrdersApiError,
  fetchAdminOrderDetail,
  forceOrderStatus,
  assignDriverToOrder,
} from '@/services/adminOrdersApi';
import {
  AdminDriver,
  AdminDriversApiError,
  fetchAdminDrivers,
} from '@/services/adminDriversApi';

const LOG_TAG = '[OrderDetail]';

interface OrderDetailParams {
  orderId: string;
  branchName?: string;
  ordererName?: string;
  driverName?: string;
  status?: string;
  subtotal?: string;
  grandTotal?: string;
}

interface DisplayOrder {
  branchName?: string;
  ordererName?: string;
  driverName?: string;
  status?: string;
  subtotal?: string;
  grandTotal?: string;
}

export default function OrderDetailScreen() {
  const params = useLocalSearchParams<OrderDetailParams>();
  const { colors } = useTheme();
  const { tokens } = useAuth();
  const {
    requestOrderEvents,
    orderEvents,
    orderEventsLoading,
    orderEventsOrderId,
  } = useAdminOrdersWS();

  const numericOrderId = Number(params.orderId);
  const hasValidId = Number.isFinite(numericOrderId);

  // ── Order detail state — starts from params, overwritten once the real
  // fetch resolves, and refetched after any successful action. ──────────
  const [order, setOrder] = useState<DisplayOrder | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [orderFetchError, setOrderFetchError] = useState<string | null>(null);

  const display: DisplayOrder = order ?? {
    branchName: params.branchName,
    ordererName: params.ordererName,
    driverName: params.driverName,
    status: params.status,
    subtotal: params.subtotal,
    grandTotal: params.grandTotal,
  };

  const loadOrderDetail = useCallback(async () => {
    if (!tokens?.accessToken || !hasValidId) return;
    setOrderLoading(true);
    setOrderFetchError(null);
    try {
      const data = await fetchAdminOrderDetail(tokens.accessToken, numericOrderId);
      setOrder({
        branchName: data.branch_name ?? params.branchName,
        ordererName: data.orderer_name ?? params.ordererName,
        driverName: data.driver_name ?? '',
        status: data.status ?? params.status,
        subtotal: data.subtotal ?? params.subtotal,
        grandTotal: data.grand_total ?? params.grandTotal,
      });
    } catch (err) {
      const message = err instanceof AdminOrdersApiError ? err.message : 'Failed to load order detail';
      console.error(`${LOG_TAG} ❌`, message);
      setOrderFetchError(message);
    } finally {
      setOrderLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens?.accessToken, hasValidId, numericOrderId]);

  useEffect(() => { loadOrderDetail(); }, [loadOrderDetail]);

  useEffect(() => {
    if (hasValidId) {
      requestOrderEvents(numericOrderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numericOrderId, hasValidId]);

  const statusLabel = ORDER_STATUS_LABEL[display.status ?? ''] ?? display.status ?? 'Unknown';

  const isCurrentOrder = orderEventsOrderId === numericOrderId;
  const showEventsSkeleton = isCurrentOrder && orderEventsLoading;
  const eventsList =
    !showEventsSkeleton && isCurrentOrder && Array.isArray(orderEvents) ? orderEvents : null;
  const eventsShapeUnexpected =
    !showEventsSkeleton && isCurrentOrder && orderEvents != null && !Array.isArray(orderEvents);

  if (eventsShapeUnexpected) {
    console.warn(`${LOG_TAG} ⚠️ order_events response was not an array — raw payload:`, JSON.stringify(orderEvents, null, 2));
  }

  const refreshAfterAction = useCallback(async () => {
    await loadOrderDetail();
    if (hasValidId) requestOrderEvents(numericOrderId);
  }, [loadOrderDetail, hasValidId, numericOrderId, requestOrderEvents]);

  // ── Change Status modal state ───────────────────────────────────────────
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const handleChangeStatus = async (newStatus: string) => {
    if (!tokens?.accessToken || !hasValidId) return;
    setStatusUpdating(true);
    setStatusError(null);
    const reason = `Manual admin override via Ops app (${display.status ?? 'unknown'} → ${newStatus})`;
    console.log(`${LOG_TAG} 🔧 force_status request:`, { orderId: numericOrderId, status: newStatus, reason });
    try {
      const result = await forceOrderStatus(tokens.accessToken, numericOrderId, newStatus, reason);
      console.log(`${LOG_TAG} ✅ force_status succeeded:`, result);
      setStatusModalVisible(false);
      await refreshAfterAction();
    } catch (err) {
      const message = err instanceof AdminOrdersApiError ? err.message : 'Failed to change status';
      console.error(`${LOG_TAG} ❌ force_status failed:`, message);
      setStatusError(message);
    } finally {
      setStatusUpdating(false);
    }
  };

  // ── Assign Driver modal state ───────────────────────────────────────────
  const [driverModalVisible, setDriverModalVisible] = useState(false);
  const [drivers, setDrivers] = useState<AdminDriver[]>([]);
  const [driversLoading, setDriversLoading] = useState(false);
  const [driversError, setDriversError] = useState<string | null>(null);
  const [assigningDriverId, setAssigningDriverId] = useState<number | null>(null);

  useEffect(() => {
    if (!driverModalVisible || !tokens?.accessToken) return;
    let cancelled = false;
    (async () => {
      setDriversLoading(true);
      setDriversError(null);
      try {
        const page = await fetchAdminDrivers(tokens.accessToken!, { limit: 100, offset: 0 });
        const available = page.results.filter((d) => d.is_available === true && d.is_online === true);
        console.log(`${LOG_TAG} 🛵 drivers fetched: ${page.results.length} total, ${available.length} available+online:`, available);
        if (!cancelled) setDrivers(available);
      } catch (err) {
        const message = err instanceof AdminDriversApiError ? err.message : 'Failed to load drivers';
        console.error(`${LOG_TAG} ❌ drivers fetch failed:`, message);
        if (!cancelled) setDriversError(message);
      } finally {
        if (!cancelled) setDriversLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [driverModalVisible, tokens?.accessToken]);

  const handleAssignDriver = async (driver: AdminDriver) => {
    if (!tokens?.accessToken || !hasValidId) return;
    setAssigningDriverId(driver.id);
    setDriversError(null);
    console.log(`${LOG_TAG} 🚚 assign_driver request:`, { orderId: numericOrderId, driverId: driver.id, driver });
    try {
      const result = await assignDriverToOrder(tokens.accessToken, numericOrderId, driver.id);
      console.log(`${LOG_TAG} ✅ assign_driver succeeded:`, result);
      setDriverModalVisible(false);
      await refreshAfterAction();
    } catch (err) {
      const message = err instanceof AdminDriversApiError ? err.message : 'Failed to assign driver';
      console.error(`${LOG_TAG} ❌ assign_driver failed:`, message);
      setDriversError(message);
    } finally {
      setAssigningDriverId(null);
    }
  };

  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: `Order #${params.orderId}` }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle }]}>
          <View style={styles.rowBetween}>
            <View style={styles.rowInline}>
              <Text style={[styles.orderId, { color: colors.onSurface }]}>Order #{params.orderId}</Text>
              {orderLoading && <ActivityIndicator size="small" color={colors.primaryContainer} style={{ marginLeft: 8 }} />}
            </View>
            <StatusPill status={display.status} label={statusLabel} colors={colors} />
          </View>
          {!!display.branchName && <InfoRow label="Branch" value={display.branchName} colors={colors} />}
          {!!display.ordererName && <InfoRow label="Orderer" value={display.ordererName} colors={colors} />}
          {!!orderFetchError && (
            <Text style={[styles.subtle, { color: colors.error }]}>Couldn't refresh: {orderFetchError}</Text>
          )}
        </View>

        <Section title="Driver" colors={colors}>
          {display.driverName ? (
            <InfoRow label="Name" value={display.driverName} colors={colors} />
          ) : (
            <Text style={[styles.subtle, { color: colors.onSurfaceVariant }]}>Not yet assigned</Text>
          )}
        </Section>

        <Section title="Pricing" colors={colors}>
          <InfoRow label="Subtotal" value={formatNaira(display.subtotal)} colors={colors} />
          <InfoRow label="Grand Total" value={formatNaira(display.grandTotal)} colors={colors} bold />
        </Section>

        <Section title="Items" colors={colors}>
          {/* ⚠️ TODO: no items/line-item data is available from any
              confirmed endpoint yet. Wire this block once a real items
              source exists — intentionally left as a placeholder. */}
          <Text style={[styles.subtle, { color: colors.onSurfaceVariant }]}>
            Item-level detail isn't available from the API yet.
          </Text>
        </Section>

        <Section title="Status History" colors={colors}>
          {showEventsSkeleton && (
            <View style={{ gap: Spacing.sm }}>
              <Skeleton height={13} width="90%" />
              <Skeleton height={13} width="75%" />
              <Skeleton height={13} width="60%" />
            </View>
          )}

          {!showEventsSkeleton && !isCurrentOrder && (
            <Text style={[styles.subtle, { color: colors.onSurfaceVariant }]}>No status history yet.</Text>
          )}

          {eventsShapeUnexpected && (
            <Text style={[styles.subtle, { color: colors.error }]}>
              Unexpected order_events shape — check the console log for the raw payload.
            </Text>
          )}

          {eventsList && eventsList.length === 0 && (
            <Text style={[styles.subtle, { color: colors.onSurfaceVariant }]}>No events recorded for this order.</Text>
          )}

          {eventsList?.map((event) => (
            <View key={event.id} style={styles.historyRow}>
              <Ionicons name="ellipse" size={8} color={colors.primaryContainer} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.subtle, { color: colors.onSurfaceVariant }]}>
                  {event.old_status
                    ? `${ORDER_STATUS_LABEL[event.old_status] ?? event.old_status} → ${ORDER_STATUS_LABEL[event.new_status] ?? event.new_status}`
                    : (ORDER_STATUS_LABEL[event.new_status] ?? event.new_status)}
                  {'  '}
                  <Text style={{ fontWeight: '600' }}>({event.actor_type})</Text>
                  {' — '}
                  {new Date(event.timestamp).toLocaleString()}
                </Text>
                {event.metadata && Object.keys(event.metadata).length > 0 && (
                  <Text style={[styles.metaText, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                    {Object.entries(event.metadata).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </Section>

        <View style={styles.actionsGrid}>
          <ActionButton label="Track Rider" icon="navigate-outline" onPress={() => console.log('track_rider', params.orderId)} colors={colors} accent="lava" />
          <ActionButton label="Change Status" icon="swap-horizontal-outline" onPress={() => { setStatusError(null); setStatusModalVisible(true); }} colors={colors} />
          <ActionButton label="Assign Rider" icon="person-add-outline" onPress={() => { setDriversError(null); setDriverModalVisible(true); }} colors={colors} />
          {/* ⚠️ POST /api/admin/orders/<id>/cancel/ { reason } is now
              documented but not wired here — out of scope for this pass,
              left as a stub like before. */}
          <ActionButton label="Cancel Order" icon="close-circle-outline" onPress={() => console.log('cancel_order', params.orderId)} colors={colors} accent="error" />
          <ActionButton label="Contact Customer" icon="call-outline" onPress={() => console.log('contact_customer', params.orderId)} colors={colors} />
          <ActionButton label="Contact Restaurant" icon="storefront-outline" onPress={() => console.log('contact_restaurant', params.orderId)} colors={colors} />
        </View>
      </ScrollView>

      {/* ── Change Status popup ─────────────────────────────────────────── */}
      <Modal visible={statusModalVisible} transparent animationType="fade" onRequestClose={() => setStatusModalVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => !statusUpdating && setStatusModalVisible(false)}>
          <Pressable style={[styles.modalCard, { backgroundColor: colors.surfaceContainer }]} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.modalTitle, { color: colors.onSurface }]}>Change Status</Text>
            <Text style={[styles.subtle, { color: colors.onSurfaceVariant, marginBottom: Spacing.sm }]}>
              Current: {statusLabel}
            </Text>

            {!!statusError && <Text style={[styles.subtle, { color: colors.error, marginBottom: Spacing.xs }]}>{statusError}</Text>}

            <ScrollView style={{ maxHeight: 320 }}>
              {ALL_ORDER_STATUSES.filter((s) => s !== display.status).map((s) => (
                <Pressable
                  key={s}
                  disabled={statusUpdating}
                  onPress={() => handleChangeStatus(s)}
                  style={[styles.modalRow, { borderColor: colors.borderSubtle, opacity: statusUpdating ? 0.5 : 1 }]}
                >
                  <Text style={[styles.modalRowText, { color: colors.onSurface }]}>{ORDER_STATUS_LABEL[s] ?? s}</Text>
                  {statusUpdating && <ActivityIndicator size="small" color={colors.primaryContainer} />}
                </Pressable>
              ))}
            </ScrollView>

            <Pressable disabled={statusUpdating} onPress={() => setStatusModalVisible(false)} style={styles.modalCloseBtn}>
              <Text style={[styles.modalCloseText, { color: colors.onSurfaceVariant }]}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Assign Driver popup ─────────────────────────────────────────── */}
      <Modal visible={driverModalVisible} transparent animationType="fade" onRequestClose={() => setDriverModalVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => !assigningDriverId && setDriverModalVisible(false)}>
          <Pressable style={[styles.modalCard, { backgroundColor: colors.surfaceContainer }]} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.modalTitle, { color: colors.onSurface }]}>Assign Driver</Text>
            <Text style={[styles.subtle, { color: colors.onSurfaceVariant, marginBottom: Spacing.sm }]}>
              Only drivers currently available and online are shown.
            </Text>

            {driversLoading && (
              <View style={{ gap: Spacing.sm, paddingVertical: Spacing.sm }}>
                <Skeleton height={36} />
                <Skeleton height={36} />
                <Skeleton height={36} />
              </View>
            )}

            {!driversLoading && !!driversError && (
              <Text style={[styles.subtle, { color: colors.error, marginBottom: Spacing.xs }]}>{driversError}</Text>
            )}

            {!driversLoading && !driversError && drivers.length === 0 && (
              <Text style={[styles.subtle, { color: colors.onSurfaceVariant }]}>
                No drivers are currently available and online.
              </Text>
            )}

            {!driversLoading && (
              <ScrollView style={{ maxHeight: 320 }}>
                {drivers.map((d) => {
                  const assigning = assigningDriverId === d.id;
                  return (
                    <Pressable
                      key={d.id}
                      disabled={assigningDriverId !== null}
                      onPress={() => handleAssignDriver(d)}
                      style={[styles.modalRow, { borderColor: colors.borderSubtle, opacity: assigningDriverId !== null && !assigning ? 0.5 : 1 }]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.modalRowText, { color: colors.onSurface }]}>
                          {d.first_name} {d.last_name}
                        </Text>
                        <Text style={[styles.metaText, { color: colors.onSurfaceVariant }]}>
                          {d.vehicle_type ?? 'Unknown vehicle'} · {d.total_deliveries} deliveries · ★{d.avg_rating}
                        </Text>
                      </View>
                      {assigning && <ActivityIndicator size="small" color={colors.primaryContainer} />}
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}

            <Pressable disabled={assigningDriverId !== null} onPress={() => setDriverModalVisible(false)} style={styles.modalCloseBtn}>
              <Text style={[styles.modalCloseText, { color: colors.onSurfaceVariant }]}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenWrapper>
  );
}

function Section({
  title, colors, children,
}: { title: string; colors: ReturnType<typeof useTheme>['colors']; children: React.ReactNode }) {
  return (
    <View style={[styles.card, { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle }]}>
      <Text style={[styles.sectionTitle, { color: colors.onSurfaceVariant }]}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function InfoRow({
  label, value, colors, bold,
}: { label: string; value: string; colors: ReturnType<typeof useTheme>['colors']; bold?: boolean }) {
  return (
    <View style={styles.rowBetween}>
      <Text style={[styles.subtle, { color: colors.onSurfaceVariant }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.onSurface, fontWeight: bold ? '700' : '500' }]}>{value}</Text>
    </View>
  );
}

function StatusPill({ status, label, colors }: { status?: string; label: string; colors: ReturnType<typeof useTheme>['colors'] }) {
  const fg =
    status === 'cancelled' || status === 'payment_initialization_failed' ? colors.error :
    status === 'delivered' || status === 'ready' ? colors.success :
    colors.primaryContainer;
  return (
    <View style={[styles.pill, { backgroundColor: fg + '22' }]}>
      <Text style={[styles.pillText, { color: fg }]}>{label}</Text>
    </View>
  );
}

function ActionButton({
  label, icon, onPress, colors, accent,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
  accent?: 'error' | 'lava';
}) {
  const fg = accent === 'error' ? colors.error : accent === 'lava' ? colors.primaryContainer : colors.onSurface;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionBtn,
        { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <Ionicons name={icon} size={18} color={fg} />
      <Text style={[styles.actionLabel, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

function formatNaira(amount?: string) {
  const n = parseFloat(amount ?? '');
  if (Number.isNaN(n)) return '—';
  return `₦${n.toLocaleString()}`;
}

const styles = StyleSheet.create({
  content: { gap: Spacing.md, paddingBottom: Spacing.xl, paddingHorizontal: Spacing.gutter },
  card: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, gap: Spacing.xs },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowInline: { flexDirection: 'row', alignItems: 'center' },
  orderId: { fontFamily: FontFamily.heading, fontSize: 18, fontWeight: '700' },
  subtle: { fontFamily: FontFamily.body, fontSize: 12 },
  metaText: { fontFamily: FontFamily.body, fontSize: 10, marginTop: 2 },
  sectionTitle: {
    fontFamily: FontFamily.body, fontSize: 11, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  sectionBody: { gap: Spacing.xs },
  infoValue: { fontFamily: FontFamily.body, fontSize: 13 },
  historyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingTop: 2 },
  pill: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  pillText: { fontFamily: FontFamily.body, fontSize: 11, fontWeight: '700' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  actionBtn: {
    flexBasis: '47%', flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: Radius.md, borderWidth: 1, padding: Spacing.sm,
  },
  actionLabel: { fontFamily: FontFamily.body, fontSize: 12, fontWeight: '600' },

  backdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center', padding: Spacing.lg,
  },
  modalCard: {
    width: '100%', maxWidth: 420, borderRadius: Radius.lg, padding: Spacing.md,
  },
  modalTitle: { fontFamily: FontFamily.heading, fontSize: 16, fontWeight: '700', marginBottom: 2 },
  modalRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 1, paddingVertical: Spacing.sm,
  },
  modalRowText: { fontFamily: FontFamily.body, fontSize: 14, fontWeight: '600' },
  modalCloseBtn: { alignItems: 'center', paddingTop: Spacing.md },
  modalCloseText: { fontFamily: FontFamily.body, fontSize: 13, fontWeight: '600' },
});