// modals/OrderHistoryModal.tsx
import React, { useEffect, useRef, useCallback } from "react";
import {
  Modal, View, Text, TouchableOpacity, FlatList,
  StyleSheet, Animated, Easing, Platform,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import { useTheme } from "../context/ThemeContext";
import { OrderRecord, OrderDeliveryStep, isActiveOrder, within24h } from "../hooks/useOrderHistory";

interface OrderHistoryModalProps {
  visible:  boolean;
  onClose:  () => void;
  orders:   OrderRecord[];
  // Called synchronously (no timeout) — HomeScreen owns the close sequencing
  onResume: (order: OrderRecord, step: string) => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: "Pending",    color: "#6B7280", bg: "#F3F4F6" },
  accepted:   { label: "Accepted",   color: "#3B82F6", bg: "#EFF6FF" },
  picked_up:  { label: "Picked Up",  color: "#F97316", bg: "#FFF7ED" },
  on_the_way: { label: "On The Way", color: "#F97316", bg: "#FFF7ED" },
  delivered:  { label: "Delivered",  color: "#22C55E", bg: "#F0FDF4" },
  rejected:   { label: "Rejected",   color: "#EF4444", bg: "#FEF2F2" },
  cancelled:  { label: "Cancelled",  color: "#EF4444", bg: "#FEF2F2" },
};

const STEP_LABEL: Record<OrderDeliveryStep, string> = {
  pickup:     "Awaiting pickup",
  onitsway:   "Heading to restaurant",
  delivering: "Out for delivery",
  success:    "Delivered",
};

// Exported so HomeScreen can use the same logic for the banner
export function resolveResumeStep(order: OrderRecord): string | null {
  if (order.delivery_step && order.delivery_step !== "success") {
    return order.delivery_step;
  }
  switch (order.status) {
    case "accepted":   return "pickup";
    case "picked_up":  return "onitsway";
    case "on_the_way": return "delivering";
    default:           return null;
  }
}

function formatTime(iso: string): string {
  const d  = new Date(iso);
  const h  = d.getHours() % 12 || 12;
  const m  = d.getMinutes().toString().padStart(2, "0");
  const ap = d.getHours() >= 12 ? "pm" : "am";
  return `${h}:${m} ${ap}`;
}

function formatDate(iso: string): string {
  const d   = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "Today";
  const y = new Date(now); y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// ── OrderTile ─────────────────────────────────────────────────────────────────

interface TileProps {
  order:    OrderRecord;
  colors:   any;
  // onResume called directly — no internal timeout here
  onResume: (order: OrderRecord, step: string) => void;
}

const OrderTile: React.FC<TileProps> = ({ order, colors, onResume }) => {
  const active     = isActiveOrder(order);
  const statusCfg  = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const resumeStep = active ? resolveResumeStep(order) : null;
  const canResume  = active && resumeStep !== null && order.fullOrder !== null;

  return (
    <TouchableOpacity
      style={[
        styles.tile,
        {
          backgroundColor: colors.card,
          borderColor: active ? colors.accentOrange : colors.separatorColor,
        },
        active && styles.tileActive,
      ]}
      onPress={canResume ? () => onResume(order, resumeStep!) : undefined}
      activeOpacity={canResume ? 0.75 : 1}
      disabled={!canResume}
    >
      {active && (
        <View style={[styles.activeStripe, { backgroundColor: colors.accentOrange }]} />
      )}

      <View style={styles.tileBody}>
        <View style={styles.tileTopRow}>
          <Text style={[styles.tileRestaurant, { color: colors.textPrimary }]} numberOfLines={1}>
            {order.restaurant_name || order.branch_name || "Order"}
          </Text>
          <Text style={[styles.tileTime, { color: colors.textMuted }]}>
            {formatDate(order.created_at)} · {formatTime(order.created_at)}
          </Text>
        </View>

        <Text style={[styles.tileCustomer, { color: colors.textSecondary }]} numberOfLines={1}>
          {order.customer_name}  ·  Order #{order.order_number || order.id}
        </Text>

        {order.delivery_step && order.delivery_step !== "success" && (
          <Text style={[styles.tileStep, { color: colors.textMuted }]}>
            {STEP_LABEL[order.delivery_step]}
          </Text>
        )}

        <View style={styles.tileFooter}>
          <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
            <Text style={[styles.statusText, { color: statusCfg.color }]}>
              {statusCfg.label}
            </Text>
          </View>

          {active && canResume && (
            <View style={[styles.resumeBtn, { backgroundColor: colors.accentOrange }]}>
              <Text style={styles.resumeBtnText}>
                {resumeStep === "pickup"     ? "Go to Pickup →"   :
                 resumeStep === "onitsway"   ? "Go to Route →"    :
                 resumeStep === "delivering" ? "Go to Delivery →" :
                 "Resume →"}
              </Text>
            </View>
          )}

          {active && !canResume && (
            <View style={[styles.resumeBtn, { backgroundColor: colors.inputBg }]}>
              <Text style={[styles.resumeBtnText, { color: colors.textMuted }]}>
                In progress
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ── Modal ─────────────────────────────────────────────────────────────────────

const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  visible, onClose, orders, onResume,
}) => {
  const { colors } = useTheme();
  const slideAnim  = useRef(new Animated.Value(800)).current;
  const fadeAnim   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1, duration: 220,
          easing: Easing.out(Easing.ease), useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0, friction: 9, tension: 70, useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 0,   duration: 180, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 800, duration: 200, useNativeDriver: true }),
      ]).start();
      setTimeout(() => { fadeAnim.setValue(0); slideAnim.setValue(800); }, 220);
    }
  }, [visible]);

  // KEY FIX: call onResume (which triggers setDeliveryStep in HomeScreen) BEFORE
  // closing the modal. The delivery overlay modals (OnItsWayModal, DeliveryingModal)
  // are Animated.Views — they can coexist briefly. PickUpModal is a React Native
  // Modal but we close this one first so there's no double-Modal conflict.
  const handleResume = useCallback((order: OrderRecord, step: string) => {
    onResume(order, step);   // state update first — HomeScreen renders the right modal
    onClose();               // then slide this sheet away
  }, [onResume, onClose]);

  const renderItem = useCallback(({ item }: { item: OrderRecord }) => (
    <OrderTile order={item} colors={colors} onResume={handleResume} />
  ), [colors, handleResume]);

  // Defensive 24h guard at display level — belt-and-suspenders on top of the
  // filter already applied in useOrderHistory.
  const displayOrders  = orders.filter(o => within24h(o.savedAt));
  const activeOrders   = displayOrders.filter(isActiveOrder);
  const finishedOrders = displayOrders.filter(o => !isActiveOrder(o));
  const sortedOrders   = [...activeOrders, ...finishedOrders];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />

        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: colors.background, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={[styles.header, { borderBottomColor: colors.separatorColor }]}>
            <View>
              <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                Recent Orders
              </Text>
              <Text style={[styles.headerSub, { color: colors.textMuted }]}>
                Last 24 hours · {displayOrders.length} order{displayOrders.length !== 1 ? "s" : ""}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: colors.inputBg }]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <IconSymbol name="XMarkIcon" size={18} color={colors.iconColor} />
            </TouchableOpacity>
          </View>

          {activeOrders.length > 0 && (
            <View style={[styles.sectionHeader, { backgroundColor: colors.accentOrange + "18" }]}>
              <View style={[styles.activeDot, { backgroundColor: colors.accentOrange }]} />
              <Text style={[styles.sectionLabel, { color: colors.accentOrange }]}>
                Active — tap tile to resume delivery
              </Text>
            </View>
          )}

          {sortedOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="InboxIcon" size={40} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                No orders yet today
              </Text>
              <Text style={[styles.emptySub, { color: colors.textMuted }]}>
                Orders you handle will appear here
              </Text>
            </View>
          ) : (
            <FlatList
              data={sortedOrders}
              keyExtractor={item => String(item.id)}
              renderItem={renderItem}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default OrderHistoryModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    paddingBottom: Platform.OS === "ios" ? 36 : 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  headerSub:   { fontSize: 12, marginTop: 2 },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  activeDot:    { width: 8, height: 8, borderRadius: 4 },
  sectionLabel: { fontSize: 12, fontWeight: "600" },
  list:         { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, gap: 10 },

  tile: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    flexDirection: "row",
  },
  tileActive: {
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  activeStripe:   { width: 4 },
  tileBody:       { flex: 1, padding: 14, gap: 4 },
  tileTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tileRestaurant: { fontSize: 15, fontWeight: "700", flex: 1, marginRight: 8 },
  tileTime:       { fontSize: 11 },
  tileCustomer:   { fontSize: 13 },
  tileStep:       { fontSize: 11, fontStyle: "italic" },
  tileFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  statusBadge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8,
  },
  statusText:    { fontSize: 12, fontWeight: "700" },
  resumeBtn:     { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20 },
  resumeBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 10,
    paddingHorizontal: 40,
  },
  emptyTitle: { fontSize: 17, fontWeight: "700" },
  emptySub:   { fontSize: 13, textAlign: "center" },
});