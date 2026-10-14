// modals/OnItsWayModal.tsx
//
// NO <Modal> wrapper — rendered directly in the React tree so the Mapbox map
// underneath stays fully interactive. The overlay uses pointerEvents="box-none"
// (touches pass through to the map). Only the destStrip and sheet cards
// are interactive (pointerEvents="auto").
//
// Layout:
//   • Destination strip — pinned top, always visible
//   • Bottom sheet     — collapsible via hamburger; contains all order detail,
//     the accept-time order code, and the "Start delivery" button
//
// ── Order code vs delivery code ──────────────────────────────────────────
// `orderCode` here is the code the backend returned when the driver hit
// "accept" (see useDriverWebSocket.postDriverAction). It is DISPLAY ONLY —
// shown so the driver can read it back to the customer or cross-check it.
// It is NOT the same value that ultimately gets sent on "deliver": that one
// is typed in fresh by the driver at the door, from whatever the customer
// tells them, in a later delivery-confirmation screen.

import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Easing, ScrollView, Platform, Linking, Alert,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import { useTheme } from "../context/ThemeContext";
import { MockOrder } from "../data/mockOrders";
import { RouteSummary } from "../components/DriverMapView";

interface OnItsWayModalProps {
  visible:         boolean;
  onClose:         () => void;
  onStartDelivery: () => void;
  order:           MockOrder | null;
  routeSummary:    RouteSummary | null;
  /**
   * The order_code returned by the backend on accept (see
   * useDriverWebSocket.postDriverAction). Display-only — purely for the
   * driver's reference. Pass null/undefined while it hasn't arrived yet.
   */
  orderCode?:      string | null;
}

const OnItsWayModal: React.FC<OnItsWayModalProps> = ({
  visible, onClose, onStartDelivery, order, routeSummary, orderCode,
}) => {
  const { colors } = useTheme();

  const [expanded, setExpanded] = useState(true);

  const slideAnim = useRef(new Animated.Value(400)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setExpanded(true);
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
      // Reset so re-opening animates in cleanly
      fadeAnim.setValue(0);
      slideAnim.setValue(400);
      setExpanded(true);
    }
  }, [visible]);

  // Log whenever the modal opens with (or without) an order code, so the
  // accept → display flow is traceable in the console.
  useEffect(() => {
    if (!visible || !order) return;
    if (orderCode) {
      console.log(`[OnItsWayModal] 📦 Displaying order code for order ${order.order_id}: "${orderCode}"`);
    } else {
      console.warn(`[OnItsWayModal] ⚠️  No order code available to display for order ${order.order_id} — accept response may not have included one yet.`);
    }
  }, [visible, order, orderCode]);

  // Nothing to render when not visible or no order
  if (!visible || !order) return null;

  return (
    // Fills the entire screen but passes all touches through to the map
    // EXCEPT on the two interactive cards below (pointerEvents="auto")
    <Animated.View
      style={[styles.overlay, { opacity: fadeAnim }]}
      pointerEvents="box-none"
    >

      {/* ── Destination strip — top of screen ────────────────────────────── */}
      <Animated.View
        style={[
          styles.destStrip,
          { backgroundColor: colors.card, transform: [{ translateY: slideAnim }] },
        ]}
        pointerEvents="auto"
      >
 {/* Header row: title + dismiss (X) — collapse/expand hamburger lives
            on the bottom sheet only; the strip doesn't have its own
            expandable content, so it doesn't need one here too. */}
     <View style={styles.destStripHeaderRow}>
         <View style={{ flex: 1 }}>
            <Text style={[styles.statusText, { color: colors.textPrimary }]}>On its way</Text>
            <Text style={[styles.restaurantSmall, { color: colors.textSecondary }]} numberOfLines={1}>
              {order.restaurantName}
             {routeSummary ? `  ·  ${routeSummary.duration}  ·  ${routeSummary.distance}` : ""}
            </Text>
          </View>

          <TouchableOpacity
           style={[styles.closeBtn, { backgroundColor: colors.inputBg }]}
            onPress={onClose}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol name="XMarkIcon" size={18} color={colors.iconColor} />
          </TouchableOpacity>
        </View>

        {/* Destination row: icon + name/address, stacked below the header */}
        <View style={styles.destStripBodyRow}>
          <View style={[styles.destIcon, { backgroundColor: colors.inputBg }]}>
            <IconSymbol name="LocationOutline" size={18} color={colors.accentOrange} />
                      </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.destName, { color: colors.textPrimary }]} numberOfLines={1}>
              {order.restaurantName}
            </Text>
            <Text style={[styles.destAddr, { color: colors.textSecondary }]} numberOfLines={1}>
              {order.restaurantAddress}
            </Text>
         </View>
        </View>
      </Animated.View>

      {/* ── Bottom sheet ──────────────────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.sheet,
          { backgroundColor: colors.card, transform: [{ translateY: slideAnim }] },
        ]}
        pointerEvents="auto"
      >
        {/* Always-visible header row */}
        <View style={styles.sheetHeaderRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.statusText, { color: colors.textPrimary }]}>On its way</Text>
            <Text
              style={[styles.restaurantSmall, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {order.restaurantName}
              {routeSummary ? `  ·  ${routeSummary.duration}  ·  ${routeSummary.distance}` : ""}
            </Text>
          </View>

          {/* Hamburger — collapse / expand */}
          <TouchableOpacity
            style={[styles.hamburgerBtn, { backgroundColor: colors.inputBg }]}
            onPress={() => setExpanded((v) => !v)}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol name="NavListIcon" size={20} color={colors.iconColor} />
          </TouchableOpacity>
        </View>

        {/* Order code strip — always visible (even collapsed) when present */}
        {orderCode && (
          <View style={[styles.orderCodeRow, { backgroundColor: colors.inputBg }]}>
            <IconSymbol name="ClockIcon" size={16} color={colors.accentOrange} />
            <Text style={[styles.orderCodeLabel, { color: colors.textSecondary }]}>
              Order code
            </Text>
            <Text style={[styles.orderCodeValue, { color: colors.textPrimary }]}>
              {orderCode}
            </Text>
          </View>
        )}

        {/* Expandable detail content */}
        {expanded && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.expandContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Restaurant name + call button */}
            <View style={styles.restaurantHeaderRow}>
              <Text style={[styles.restaurantBig, { color: colors.textPrimary, flex: 1 }]}>
                {order.restaurantName}
              </Text>
              <TouchableOpacity
                style={[styles.callBtn, { backgroundColor: colors.accentOrange }]}
                activeOpacity={0.8}
                onPress={() => {
                  const phone = order.restaurantPhone;
                  if (!phone) return;
                  Linking.openURL(`tel:${phone}`).catch(() =>
                    Alert.alert("Error", "Could not open the phone app.")
                  );
                }}
              >
                <IconSymbol name="PhoneIcon" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Note from business */}
            <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>
              Note from business
            </Text>
            <Text style={[styles.noteText, { color: colors.textSecondary }]}>
              • Please check the guidance on where to collect the orders from on the front door of the restaurant
            </Text>

            <View style={[styles.divider, { backgroundColor: colors.separatorColor }]} />

            {/* Full address */}
            <View style={styles.addrRow}>
              <IconSymbol name="Location" size={18} color={colors.accentOrange} />
              <Text style={[styles.addrFull, { color: colors.textPrimary }]}>
                {order.restaurantName}, {order.restaurantAddress}
              </Text>
            </View>

            {/* Order count tag */}
            <View style={[styles.orderTag, { backgroundColor: colors.accentYellow }]}>
              <Text style={styles.orderTagText}>1 order from pick-up</Text>
            </View>

            {/* Customer row */}
            <View style={styles.customerRow}>
              <View>
                <Text style={[styles.customerBig, { color: colors.textPrimary }]}>
                  {order.customerName}
                </Text>
                <Text style={[styles.customerSub, { color: colors.textSecondary }]}>
                  {order.order_id} • {order.itemCount} items
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.detailsBtn, { backgroundColor: colors.accentOrange }]}
                activeOpacity={0.8}
              >
                <Text style={styles.detailsBtnText}>Details</Text>
              </TouchableOpacity>
            </View>

            {/* Rating */}
            <View style={styles.ratingSection}>
              <Text style={[styles.ratingTitle, { color: colors.textPrimary }]}>
                How did the pickup go?
              </Text>
              <View style={styles.ratingRow}>
                <TouchableOpacity
                  style={[styles.ratingBtn, { backgroundColor: colors.actionBtnBg }]}
                  activeOpacity={0.8}
                >
                  <IconSymbol name="ThumbsUpIcon" size={28} color={colors.accentGreen} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.ratingBtn, { backgroundColor: colors.actionBtnBg }]}
                  activeOpacity={0.8}
                >
                  <IconSymbol name="ThumbsDownIcon" size={28} color={colors.accentRed} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer: warn button + start delivery */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.warnBtn, { backgroundColor: colors.inputBg }]}
                activeOpacity={0.8}
              >
                <IconSymbol name="Warning" size={22} color="#f59e0b" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.startBtn, { backgroundColor: colors.accentOrange }]}
                onPress={() => {
                  console.log(`[OnItsWayModal] ▶️  Start delivery pressed for order ${order.order_id} — handing off to delivery-confirmation flow where driver will enter the customer's code.`);
                  onStartDelivery();
                }}
                activeOpacity={0.85}
              >
                <IconSymbol name="ArrowRightLongIcon" size={18} color="#fff" />
                <Text style={styles.startBtnText}>Start delivery</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </Animated.View>
    </Animated.View>
  );
};

export default OnItsWayModal;

const styles = StyleSheet.create({
  // Covers the full screen but lets map touches through
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    // No background — map shows through completely
  },

  // ── Destination strip (top) ───────────────────────────────────────────────
  destStrip: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 48,
    left: 16,
    right: 16,
    flexDirection: "column",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 10,
  },
    destStripHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
    destStripBodyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
    destIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
  },
    destName: { fontSize: 14, fontWeight: "700" },
    destAddr: { fontSize: 12, marginTop: 2 },

  // ── Bottom sheet ──────────────────────────────────────────────────────────
  sheet: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 20,
    maxHeight: "68%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 20,
  },

  // Collapsed header
  sheetHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 12,
  },
  statusText:      { fontSize: 18, fontWeight: "700" },
  restaurantSmall: { fontSize: 12, marginTop: 2 },
  hamburgerBtn: {
    width: 40, height: 40, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
  },

  // ── Order code strip ─────────────────────────────────────────────────────
  orderCodeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  orderCodeLabel: { fontSize: 12, fontWeight: "500" },
  orderCodeValue: { fontSize: 14, fontWeight: "700", marginLeft: "auto", letterSpacing: 1 },

  // Expanded content
  expandContent:       { paddingBottom: 16 },
  restaurantHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  restaurantBig:       { fontSize: 20, fontWeight: "700", lineHeight: 26 },
  callBtn: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center",
    marginLeft: 12,
  },
  sectionLabel: { fontSize: 14, fontWeight: "700", marginBottom: 6 },
  noteText:     { fontSize: 13, lineHeight: 20, marginBottom: 12 },
  divider:      { height: StyleSheet.hairlineWidth, marginVertical: 12 },
  addrRow:      { flexDirection: "row", gap: 10, alignItems: "flex-start", marginBottom: 12 },
  addrFull:     { flex: 1, fontSize: 13, lineHeight: 20 },
  orderTag: {
    borderRadius: 8, paddingHorizontal: 14,
    paddingVertical: 10, marginBottom: 14,
  },
  orderTagText:  { fontWeight: "700", fontSize: 14, color: "#1a1a1a" },
  customerRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  customerBig:   { fontSize: 20, fontWeight: "700" },
  customerSub:   { fontSize: 13, marginTop: 2 },
  detailsBtn:    { borderRadius: 20, paddingVertical: 8, paddingHorizontal: 20 },
  detailsBtnText:{ color: "#fff", fontWeight: "600", fontSize: 14 },
  ratingSection: { alignItems: "center", gap: 10, marginBottom: 16 },
  ratingTitle:   { fontSize: 15, fontWeight: "600" },
  ratingRow:     { flexDirection: "row", gap: 60 },
  ratingBtn:     { padding: 14, borderRadius: 18 },
  footer:        { flexDirection: "row", gap: 12, alignItems: "center" },
  warnBtn:       { width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  startBtn: {
    flex: 1, flexDirection: "row",
    alignItems: "center", justifyContent: "center",
    gap: 10, borderRadius: 50, paddingVertical: 16,
  },
  startBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  closeBtn: {
  width: 40, height: 40, borderRadius: 10,
  alignItems: "center", justifyContent: "center",
  marginLeft: 8,
},
});