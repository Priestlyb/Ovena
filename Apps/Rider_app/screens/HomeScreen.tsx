// screens/HomeScreen.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Modal, unstable_batchedUpdates, Animated,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import { useTheme } from "../context/ThemeContext";
import { useAppData } from "../context/appDataContext";
import { MockOrder } from "../data/mockOrders";
import { useDriverWebSocket } from "../hooks/useDriverWebsocket";
import AsyncStorage from "@react-native-async-storage/async-storage";

import PickUpModal       from "../modals/PickUpModal";
import OnItsWayModal     from "../modals/OnItsWayModal";
import DeliveryingModal  from "../modals/DeliveryingModal";
import OrderSuccessModal from "../modals/OrderSuccessModal";
import OrderHistoryModal, { resolveResumeStep } from "../modals/OrderHistoryModal";

import NavDrawer, { NavRoute }         from "../components/NavDrawer";
import DriverMapView, { RouteSummary } from "../components/DriverMapView";

import ProfileScreen       from "../screens/ProfileScreen";
import AccountScreen       from "../screens/AccountScreen";
import InboxScreen         from "../screens/InboxScreen";
import EarningsScreen      from "../screens/EarningsScreen";
import OpportunitiesScreen from "./OpportunitiesScreen";
import ReferFriendsScreen  from "../screens/ReferFriendsScreen";
import HelpScreen          from "../screens/HelpScreen";
import OvenaBankScreen     from "../screens/OvenaBankScreen";

import { useInboxStore }                               from "../hooks/useInboxStore";
import { useOrderHistory, OrderRecord, isActiveOrder } from "../hooks/useOrderHistory";

type ActiveScreen =
  | null | "Profile" | "Account" | "Inbox" | "Earnings"
  | "OvenaBank" | "Opportunities" | "ReferFriends" | "Help";

type DeliveryStep = "idle" | "pickup" | "onitsway" | "delivering" | "success";

function nowTimeLabel(): string {
  const now = new Date();
  const h   = now.getHours() % 12 || 12;
  const mn  = now.getMinutes().toString().padStart(2, "0");
  const ap  = now.getHours() >= 12 ? "pm" : "am";
  return `${h}:${mn} ${ap}`;
}

const HomeScreen = () => {
  const { colors } = useTheme();
  const { data }   = useAppData();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  useEffect(() => { AsyncStorage.getItem("accessToken").then(setAccessToken); }, []);

  const todayBalance = data?.dashboard?.data?.wallet?.available_balance;
  const balanceLabel = todayBalance != null
    ? `₦${todayBalance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
    : "₦0.00";

  const [online,       setOnline]       = useState(false);
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(null);
  const [deliveryStep, setDeliveryStep] = useState<DeliveryStep>("idle");
  const [activeOrder,  setActiveOrder]  = useState<MockOrder | null>(null);
  const [showOrders,   setShowOrders]   = useState(false);
  const [northKey,     setNorthKey]     = useState(0);
  const [recenterKey,  setRecenterKey]  = useState(0);
  const [pickupKey,    setPickupKey]    = useState(0);
  const [navModeKey,   setNavModeKey]   = useState(0);
  const [routeSummary, setRouteSummary] = useState<RouteSummary | null>(null);

  // ── Stores ────────────────────────────────────────────────────────────────
  const {
    messages: inboxMessages, unreadCount: inboxUnreadCount,
    addMessage: addInboxMessage, markAllRead: markInboxAllRead,
    markRead: markInboxRead, deleteAll: deleteInboxAll,
  } = useInboxStore();

  const {
    orders: orderHistory, activeOrder: historyActiveOrder,
    activeCount: activeOrderCount,
    upsertOrder, mergeMyOrders,
  } = useOrderHistory();

  // Declared early — used in banner useEffect dep array below
  const hasActiveHistoryOrder = historyActiveOrder !== null && deliveryStep === "idle";

  // ── Pulse animation for menu badge ────────────────────────────────────────
  const menuPulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (inboxUnreadCount <= 0) { menuPulseAnim.setValue(1); return; }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(menuPulseAnim, { toValue: 1.7, duration: 600, useNativeDriver: true }),
      Animated.timing(menuPulseAnim, { toValue: 1,   duration: 600, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [inboxUnreadCount]);

  // ── Resume banner ─────────────────────────────────────────────────────────
  const [bannerVisible, setBannerVisible] = useState(false);
  const bannerAnim  = useRef(new Animated.Value(0)).current;
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (bannerTimer.current) clearTimeout(bannerTimer.current);

    if (hasActiveHistoryOrder) {
      setBannerVisible(true);
      Animated.spring(bannerAnim, { toValue: 1, friction: 7, tension: 90, useNativeDriver: true }).start();
      bannerTimer.current = setTimeout(() => {
        Animated.timing(bannerAnim, { toValue: 0, duration: 280, useNativeDriver: true })
          .start(() => setBannerVisible(false));
      }, 5000);
    } else {
      Animated.timing(bannerAnim, { toValue: 0, duration: 200, useNativeDriver: true })
        .start(() => setBannerVisible(false));
    }

    return () => { if (bannerTimer.current) clearTimeout(bannerTimer.current); };
  }, [hasActiveHistoryOrder]);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const deliveryStepRef = useRef<DeliveryStep>("idle");
  useEffect(() => { deliveryStepRef.current = deliveryStep; }, [deliveryStep]);

  const onlineRef = useRef(online);
  useEffect(() => { onlineRef.current = online; }, [online]);

  const lastCoordRef   = useRef<{ latitude: number; longitude: number } | null>(null);
  const activeOrderRef = useRef<MockOrder | null>(null);
  useEffect(() => { activeOrderRef.current = activeOrder; }, [activeOrder]);

  // ── Persist step changes to order history ─────────────────────────────────
  useEffect(() => {
    const order = activeOrderRef.current;
    if (!order || deliveryStep === "idle") return;
    upsertOrder({
      id:              Number(order.order_id),
      order_number:    Number(order.orderNumber ?? order.order_id),
      restaurant_name: order.restaurantName ?? "",
      customer_name:   order.customerName   ?? "",
      branch_name:     order.restaurantName ?? "",
      delivery_type:   order.deliveryType   ?? "",
      fullOrder:       order,
      delivery_step:   deliveryStep === "success" ? "success" : deliveryStep,
      status:
        deliveryStep === "pickup"     ? "accepted"   :
        deliveryStep === "onitsway"   ? "picked_up"  :
        deliveryStep === "delivering" ? "on_the_way" :
        deliveryStep === "success"    ? "delivered"  : "accepted",
    });
  }, [deliveryStep]);

  // ── WebSocket ─────────────────────────────────────────────────────────────
  const { sendLocation, postDriverAction } = useDriverWebSocket({
    token:    accessToken,
    isOnline: online,

    onMyOrders: useCallback((serverOrders: any[]) => {
      console.log(`[HomeScreen] 📋 my_orders — merging ${serverOrders.length} orders`);
      mergeMyOrders(serverOrders);
    }, [mergeMyOrders]),

    onOrder: (orderData) => {
      console.log("[Orders WS] 📦 Full order payload:", JSON.stringify(orderData, null, 2));

      const branch         = orderData.branch               ?? {};
      const branchLocation = branch.location                ?? {};
      const customerDest   = orderData.customer_destination ?? {};

      const amountDisplay = orderData.total_amount
        ? `₦${parseFloat(orderData.total_amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
        : orderData.distance_km
        ? `${parseFloat(orderData.distance_km).toFixed(1)} km away`
        : "—";

      const mapped: MockOrder = {
        id:            String(orderData.order_id ?? "ws_order"),
        order_id:      orderData.order_id          ?? 0,
        orderNumber:   orderData.order_number      ?? orderData.order_id ?? 0,
        customerName:  orderData.customer_name     ?? "Customer",
        customerPhone: orderData.customer_phone    ?? "",
        itemCount:     orderData.item_count         ?? 1,
        amount:        amountDisplay,
        restaurantName:    branch.restaurant_name    ?? branch.name    ?? "Restaurant",
        restaurantPhone:   branch.restaurant_phone   ?? branch.phone   ?? "",
        restaurantAddress: branch.restaurant_address ?? branch.address ?? "",
        deliveryAddress:   orderData.delivery_address ?? "",
        deliveryType:      orderData.delivery_type    ?? "Meet at door",
        customerNote:      orderData.customer_note    ?? "",
        restaurantDestination: {
          latitude:  Number(branchLocation.lat) || 5.1065,
          longitude: Number(branchLocation.lng) || 7.3671,
        },
        customerDestination: {
          latitude:  Number(customerDest.lat) || 5.1100,
          longitude: Number(customerDest.lng) || 7.3700,
        },
      };

      console.log("[Orders WS] ✅ Mapped order:", JSON.stringify(mapped, null, 2));

      upsertOrder({
        id:              Number(orderData.order_id ?? 0),
        order_number:    Number(orderData.order_number ?? orderData.order_id ?? 0),
        status:          "accepted",
        created_at:      new Date().toISOString(),
        restaurant_name: branch.restaurant_name ?? branch.name ?? "",
        branch_name:     branch.name ?? "",
        customer_name:   orderData.customer_name ?? "",
        delivery_type:   orderData.delivery_type ?? "",
        delivery_step:   "pickup",
        fullOrder:       mapped,
      });

      if (orderData.message) {
        addInboxMessage({
          id:      `order-${orderData.order_id ?? Date.now()}`,
          sender:  branch.restaurant_name ?? branch.name ?? "Ovena",
          message: orderData.message,
          time:    nowTimeLabel(),
        });
      }

      if (!onlineRef.current) {
        console.log("[Orders WS] ⚠️  Driver offline — stored in history only");
        return;
      }
      if (deliveryStepRef.current !== "idle") {
        console.log("[Orders WS] ⚠️  Mid-delivery — stored in history, modal suppressed");
        return;
      }

      unstable_batchedUpdates(() => {
        setActiveOrder(mapped);
        setDeliveryStep("pickup");
      });
    },

    onInbox: (msgData) => {
      addInboxMessage({
        id:      String(msgData.order_id ?? Date.now()),
        sender:  `Order #${msgData.order_number || msgData.order_id || ""}`,
        message: msgData.message ?? "New notification",
        time:    nowTimeLabel(),
      });
    },
  });

  useEffect(() => {
    if (online) console.log("[Driver Status] ✅ ONLINE");
    else        console.log("[Driver Status] 🔴 OFFLINE");
  }, [online]);

  useEffect(() => {
    if (!online) return;
    const coord = lastCoordRef.current;
    if (coord) sendLocation({ lat: coord.latitude, lng: coord.longitude, heading: 0, speed: 0, accuracy: 5 });
    const interval = setInterval(() => {
      const c = lastCoordRef.current;
      if (!c) return;
      sendLocation({ lat: c.latitude, lng: c.longitude, heading: 0, speed: 0, accuracy: 5 });
    }, 60_000);
    return () => clearInterval(interval);
  }, [online, sendLocation]);

  // ── Delivery handlers ─────────────────────────────────────────────────────

  const handlePickUp = async () => {
    if (!activeOrder) return;
    const order_id = Number(activeOrder.order_id);
    if (Number.isNaN(order_id)) return;
    const response = await postDriverAction("accept", order_id);
    if (response?.message) {
      addInboxMessage({
        id:      `accept-${order_id}-${Date.now()}`,
        sender:  activeOrder.restaurantName ?? "Ovena",
        message: response.message,
        time:    nowTimeLabel(),
      });
    }
    upsertOrder({ id: order_id, status: "picked_up", delivery_step: "onitsway", fullOrder: activeOrder });
    setDeliveryStep("onitsway");
    setPickupKey((k) => k + 1);
  };

  const handleStartDelivery = () => {
    if (activeOrder) {
      upsertOrder({ id: Number(activeOrder.order_id), status: "on_the_way", delivery_step: "delivering", fullOrder: activeOrder });
    }
    setDeliveryStep("delivering");
    setNavModeKey((k) => k + 1);
  };

  const handleDeliveryComplete = async (order_code?: string) => {
    if (!activeOrder) return;
    const order_id    = Number(activeOrder.order_id);
    const cleanedCode = order_code?.trim();
    if (Number.isNaN(order_id)) return;
    try {
      await postDriverAction("deliver", order_id, cleanedCode);
      upsertOrder({ id: order_id, status: "delivered", delivery_step: "success", fullOrder: activeOrder });
      setDeliveryStep("success");
    } catch (err) {
      console.warn("[Deliver] Failed:", err);
    }
  };

  const handleDismissPickup = async () => {
    if (!activeOrder) { setDeliveryStep("idle"); setActiveOrder(null); setRouteSummary(null); return; }
    const order_id = Number(activeOrder.order_id);
    if (!Number.isNaN(order_id)) {
      try { await postDriverAction("reject", order_id); } catch { /* ignore */ }
      upsertOrder({ id: order_id, status: "rejected", delivery_step: null, fullOrder: activeOrder });
    }
    setDeliveryStep("idle");
    setActiveOrder(null);
    setRouteSummary(null);
  };

  const handleSuccessClose = () => {
    setDeliveryStep("idle");
    setActiveOrder(null);
    setRouteSummary(null);
    setOnline(false);
  };

  // Called by both OrderHistoryModal and the banner.
  // The modal now calls this BEFORE closing itself, so state is set in the
  // same synchronous event — no setTimeout needed.
  const handleResumeOrder = useCallback((record: OrderRecord, step: string) => {
    if (!record.fullOrder) {
      console.warn("[Resume] No fullOrder for order", record.id, "— cannot resume");
      return;
    }
    console.log(`[Resume] order ${record.id} → step "${step}"`);
    unstable_batchedUpdates(() => {
      setActiveOrder(record.fullOrder!);
      setDeliveryStep(step as DeliveryStep);
    });
  }, []);

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleNavigate = (route: NavRoute) => {
    if (route === "TipsInfo") return;
    setActiveScreen(route as ActiveScreen);
  };
  const closeScreen = () => setActiveScreen(null);

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case "Profile":       return <ProfileScreen       onBack={closeScreen} />;
      case "Account":       return <AccountScreen       onBack={closeScreen} />;
      case "Inbox":
        return (
          <InboxScreen
            onBack={closeScreen} messages={inboxMessages}
            onMarkAllRead={markInboxAllRead} onMarkRead={markInboxRead} onDeleteAll={deleteInboxAll}
          />
        );
      case "Earnings":      return <EarningsScreen      onBack={closeScreen} onOpenBank={() => setActiveScreen("OvenaBank")} />;
      case "OvenaBank":     return <OvenaBankScreen     onBack={closeScreen} />;
      case "Opportunities": return <OpportunitiesScreen onBack={closeScreen} />;
      case "ReferFriends":  return <ReferFriendsScreen  onBack={closeScreen} />;
      case "Help":          return <HelpScreen          onBack={closeScreen} />;
      default:              return null;
    }
  };

  const mapDestination =
    deliveryStep === "onitsway"   ? (activeOrder?.restaurantDestination ?? null) :
    deliveryStep === "delivering" ? (activeOrder?.customerDestination   ?? null) :
    null;

  const mapLabel =
    deliveryStep === "onitsway"   ? `Pick up at ${activeOrder?.restaurantName}` :
    deliveryStep === "delivering" ? `Deliver to ${activeOrder?.customerName}`   :
    undefined;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={colors.statusBarStyle} translucent backgroundColor="transparent" />

      <View style={StyleSheet.absoluteFill}>
        <DriverMapView
          destination={mapDestination} destinationLabel={mapLabel}
          northTrigger={northKey} recenterTrigger={recenterKey}
          pickupTrigger={pickupKey} navigationModeTrigger={navModeKey}
          onRouteSummary={setRouteSummary}
          onLocationUpdate={(coord) => { lastCoordRef.current = coord; }}
        />
      </View>

      {/* ── TOP BAR ── */}
      <View style={styles.topBar} pointerEvents="box-none">
        {!drawerOpen && (
          <View>
            <TouchableOpacity
              style={[styles.mapBtn, { backgroundColor: colors.card }]}
              onPress={() => setDrawerOpen(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.menuIcon, { color: colors.textPrimary }]}>☰</Text>
            </TouchableOpacity>

            {inboxUnreadCount > 0 && (
              <View style={styles.menuBadgeWrap} pointerEvents="none">
                <Animated.View
                  style={[styles.menuBadgePulse, { backgroundColor: colors.accentOrange, transform: [{ scale: menuPulseAnim }] }]}
                />
                <View style={[styles.menuBadgeDot, { backgroundColor: colors.accentOrange }]} />
              </View>
            )}
          </View>
        )}

        <View style={[styles.statusDotWrap, { backgroundColor: colors.card }]}>
          <View style={[styles.statusDot, { backgroundColor: online ? "#18C55D" : "#FF3B30" }]} />
        </View>
      </View>

      {/* ── MAP CONTROLS ── */}
      <View style={styles.mapControls}>
        <TouchableOpacity
          style={[
            styles.mapControlBtn,
            { backgroundColor: hasActiveHistoryOrder ? colors.accentOrange : colors.card },
          ]}
          onPress={() => setShowOrders(true)}
          activeOpacity={0.8}
        >
          <IconSymbol
            name="ClipboardListIcon"
            size={20}
            color={hasActiveHistoryOrder ? "#fff" : colors.iconColor}
          />
          {/* Badge: active order count only */}
          {activeOrderCount > 0 && (
            <View style={[
              styles.ordersCountBadge,
              { backgroundColor: hasActiveHistoryOrder ? "#fff" : colors.accentOrange },
            ]}>
              <Text style={[
                styles.ordersCountText,
                { color: hasActiveHistoryOrder ? colors.accentOrange : "#fff" },
              ]}>
                {activeOrderCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mapControlBtn, { backgroundColor: colors.card }]}
          onPress={() => setNorthKey((k) => k + 1)}
          activeOpacity={0.8}
        >
          <IconSymbol name="SunCompass" size={22} color={colors.iconColor} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mapControlBtn, { backgroundColor: colors.card }]}
          onPress={() => setRecenterKey((k) => k + 1)}
          activeOpacity={0.8}
        >
          <IconSymbol name="LocationArrowIcon" size={20} color={colors.accentOrange} />
        </TouchableOpacity>
      </View>

      {/* ── RESUME BANNER ── */}
      {bannerVisible && (
        <Animated.View
          style={[
            styles.activeOrderBanner,
            { opacity: bannerAnim, transform: [{ scale: bannerAnim }] },
          ]}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            style={[styles.activeOrderBtn, { backgroundColor: colors.accentOrange }]}
            onPress={() => {
              if (bannerTimer.current) clearTimeout(bannerTimer.current);
              setBannerVisible(false);
              if (historyActiveOrder) {
                const step = resolveResumeStep(historyActiveOrder);
                if (step) handleResumeOrder(historyActiveOrder, step);
              }
            }}
            activeOpacity={0.85}
          >
            <View style={[styles.activeBtnDot, { backgroundColor: "#fff" }]} />
            <Text style={styles.activeOrderBtnText} numberOfLines={1}>
              Resume: {historyActiveOrder?.restaurant_name ?? "Active Order"}
            </Text>
            <IconSymbol name="ArrowRightLongIcon" size={16} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* ── BOTTOM PANEL ── */}
      {deliveryStep === "idle" && (
        <View style={styles.bottomPanel}>
          <View style={styles.bottomRow}>
            <Text style={[styles.earningsTitle, { backgroundColor: colors.card, color: colors.textPrimary }]}>
              TODAY
            </Text>
            <TouchableOpacity onPress={() => setActiveScreen("Earnings")}>
              <Text style={[styles.earnAmount, { backgroundColor: "#111", color: colors.accentGreen }]}>
                {balanceLabel}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.toggleButton, { backgroundColor: online ? colors.accentOrange : colors.accentGreen }]}
            onPress={() => setOnline((v) => !v)}
          >
            <IconSymbol name={online ? "PersonWalkingDashedLineArrowRightIcon" : "ArrowRightLongIcon"} size={22} color="#fff" style={{ opacity: 0 }} />
            <Text style={styles.toggleText}>{online ? "Go Offline" : "Go Online"}</Text>
            <IconSymbol name={online ? "PersonWalkingDashedLineArrowRightIcon" : "ArrowRightLongIcon"} size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={[styles.toggleHint, { color: colors.textMuted }]}>
            Tap the button to change your availability
          </Text>
        </View>
      )}

      {/* ── DELIVERY FLOW ── */}
      <OnItsWayModal
        visible={deliveryStep === "onitsway"}
        order={activeOrder} routeSummary={routeSummary}
        onClose={() => setDeliveryStep("idle")}
        onStartDelivery={handleStartDelivery}
      />
      <DeliveryingModal
        visible={deliveryStep === "delivering"}
        order={activeOrder} routeSummary={routeSummary}
        onDeliveryComplete={handleDeliveryComplete}
      />
      <PickUpModal
        visible={deliveryStep === "pickup"}
        order={activeOrder} routeSummary={routeSummary}
        onPickUp={handlePickUp} onReject={handleDismissPickup} onClose={handleDismissPickup}
      />
      <OrderSuccessModal visible={deliveryStep === "success"} onClose={handleSuccessClose} />

      {/* ── ORDER HISTORY MODAL ── */}
      <OrderHistoryModal
        visible={showOrders}
        onClose={() => setShowOrders(false)}
        orders={orderHistory}
        onResume={handleResumeOrder}
      />

      <NavDrawer
        visible={drawerOpen} onClose={() => setDrawerOpen(false)}
        onNavigate={handleNavigate} inboxUnreadCount={inboxUnreadCount}
      />

      <Modal visible={activeScreen !== null} animationType="slide" onRequestClose={closeScreen} presentationStyle="fullScreen">
        {renderActiveScreen()}
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    position: "absolute", top: 50, left: 16, right: 16,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", zIndex: 10,
  },
  mapBtn: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: "center", justifyContent: "center",
    elevation: 4, shadowColor: "#000", shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 6,
  },
  menuIcon: { fontSize: 20, fontWeight: "700" },
  menuBadgeWrap: {
    position: "absolute", top: 0, right: 0,
    width: 18, height: 18, alignItems: "center", justifyContent: "center",
  },
  menuBadgePulse: { position: "absolute", width: 18, height: 18, borderRadius: 9, opacity: 0.35 },
  menuBadgeDot:   { width: 10, height: 10, borderRadius: 5 },
  statusDotWrap: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: "center", justifyContent: "center",
    elevation: 4, shadowColor: "#000", shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, marginLeft: "auto",
  },
  statusDot: { width: 18, height: 18, borderRadius: 9 },
  mapControls: {
    position: "absolute", right: 16, bottom: 140,
    gap: 10, zIndex: 15, alignItems: "center",
  },
  mapControlBtn: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: "center", justifyContent: "center",
    elevation: 8, shadowColor: "#000", shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 }, shadowRadius: 8,
  },
  ordersCountBadge: {
    position: "absolute", top: -4, right: -4,
    minWidth: 18, height: 18, borderRadius: 9,
    alignItems: "center", justifyContent: "center", paddingHorizontal: 3,
  },
  ordersCountText: { fontSize: 10, fontWeight: "700" },
  activeOrderBanner: {
    position: "absolute", bottom: 210, left: 16, right: 16,
    zIndex: 12, alignItems: "center",
  },
  activeOrderBtn: {
    flexDirection: "row", alignItems: "center", gap: 10,
    borderRadius: 50, paddingVertical: 12, paddingHorizontal: 20,
    shadowColor: "#000", shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 6,
  },
  activeBtnDot:       { width: 8, height: 8, borderRadius: 4 },
  activeOrderBtnText: { color: "#fff", fontWeight: "700", fontSize: 14, flex: 1 },
  bottomPanel: {
    position: "absolute", bottom: 0, width: "100%",
    paddingHorizontal: 20, paddingBottom: 36, paddingTop: 12,
    alignItems: "center", gap: 12, zIndex: 10,
  },
  bottomRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  earningsTitle: {
    fontSize: 14, fontWeight: "600", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
    elevation: 4, shadowColor: "#000", shadowOpacity: 0.12, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6,
  },
  earnAmount: {
    fontSize: 16, fontWeight: "700", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
    elevation: 4, shadowColor: "#000", shadowOpacity: 0.12, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6,
  },
  toggleButton: {
    width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 30, paddingVertical: 16, borderRadius: 50,
    shadowColor: "#000", shadowOpacity: 0.18, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 6,
  },
  toggleText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  toggleHint: { fontSize: 12, textAlign: "center" },
});