// screens/HomeScreen.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Modal,
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

import NavDrawer, { NavRoute } from "../components/NavDrawer";
import DriverMapView, { RouteSummary } from "../components/DriverMapView";

import ProfileScreen       from "../screens/ProfileScreen";
import AccountScreen       from "../screens/AccountScreen";
import InboxScreen, { InboxMessage } from "../screens/InboxScreen";
import EarningsScreen      from "../screens/EarningsScreen";
import OpportunitiesScreen from "./OpportunitiesScreen";
import ReferFriendsScreen  from "../screens/ReferFriendsScreen";
import HelpScreen          from "../screens/HelpScreen";
import OvenaBankScreen     from "../screens/OvenaBankScreen";

type ActiveScreen =
  | null | "Profile" | "Account" | "Inbox" | "Earnings"
  | "OvenaBank" | "Opportunities" | "ReferFriends" | "Help";

type DeliveryStep = "idle" | "pickup" | "onitsway" | "delivering" | "success";

const HomeScreen = () => {
  const { colors } = useTheme();
  const { data }   = useAppData();

  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Load token once on mount
  useEffect(() => {
    AsyncStorage.getItem("accessToken").then(setAccessToken);
  }, []);

  const todayBalance = data?.dashboard?.data?.wallet?.available_balance;
  const balanceLabel = todayBalance != null
    ? `₦${todayBalance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
    : "₦0.00";

  const [online,       setOnline]      = useState(false);
  const [drawerOpen,   setDrawerOpen]  = useState(false);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(null);
  const [deliveryStep, setDeliveryStep] = useState<DeliveryStep>("idle");
  const [activeOrder,  setActiveOrder]  = useState<MockOrder | null>(null);
  const [northKey,       setNorthKey]       = useState(0);  // compass → face north
  const [recenterKey,    setRecenterKey]    = useState(0);  // location btn → fly to driver
  const [pickupKey,      setPickupKey]      = useState(0);  // pick-up → fitBounds driver+restaurant
  const [navModeKey,     setNavModeKey]     = useState(0);  // start delivery → nav perspective
  // Live route summary computed by DriverMapView from the Mapbox Directions API
  const [routeSummary, setRouteSummary] = useState<RouteSummary | null>(null);

  // Inbox messages — populated from WS order notifications
  const [inboxMessages, setInboxMessages] = useState<InboxMessage[]>([]);

  // Latest driver coordinate ref — used for the 60 s location interval
  const lastCoordRef = useRef<{latitude: number; longitude: number} | null>(null);

  // ── WebSocket connection ──────────────────────────────────────────────────
  const { sendLocation, postDriverAction } = useDriverWebSocket({
    token: accessToken,
    isOnline: online,

    // ── Full order payload  (inner type: "order.driver_assigned") ──────────
    // Hook unwraps the outer "notification" envelope before calling this.
    // Confirmed field names from the real backend payload logged above.
    onOrder: (orderData) => {
      console.log("[Orders WS] 📦 Full order payload received:", JSON.stringify(orderData, null, 2));

      const branch         = orderData.branch               ?? {};
      const branchLocation = branch.location                 ?? {};
      const customerDest   = orderData.customer_destination  ?? {};

      const amountDisplay = orderData.total_amount
        ? `₦${parseFloat(orderData.total_amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
        : orderData.distance_km
        ? `${parseFloat(orderData.distance_km).toFixed(1)} km away`
        : "—";

      const mapped: MockOrder = {
        id:          String(orderData.order_id  ?? "ws_order"),
        orderId:     orderData.order_id          ?? 0,
        orderNumber: orderData.order_number      ?? orderData.order_id ?? 0,

        customerName:  orderData.customer_name  ?? "Customer",
        customerPhone: orderData.customer_phone ?? "",
        itemCount:     orderData.item_count      ?? 1,
        amount:        amountDisplay,

        restaurantName:    branch.restaurant_name    ?? branch.name    ?? "Restaurant",
        restaurantPhone:   branch.restaurant_phone   ?? branch.phone   ?? "",
        restaurantAddress: branch.restaurant_address ?? branch.address ?? "",

        deliveryAddress: orderData.delivery_address ?? "",
        deliveryType:    orderData.delivery_type     ?? "Meet at door",
        customerNote:    orderData.customer_note     ?? "",

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

      // Push the order assignment message to the inbox too
      if (orderData.message) {
        const now = new Date();
        const h   = now.getHours() % 12 || 12;
        const mn  = now.getMinutes().toString().padStart(2, "0");
        const ap  = now.getHours() >= 12 ? "pm" : "am";
        setInboxMessages((prev) => [
          {
            id:      `order-${orderData.order_id ?? Date.now()}`,
            sender:  branch.restaurant_name ?? branch.name ?? "Ovena",
            message: orderData.message,
            time:    `${h}:${mn} ${ap}`,
          },
          ...prev,
        ]);
        console.log("[Orders WS] 📬 Order message added to inbox:", orderData.message);
      }

      // Only trigger pickup modal when idle — don't interrupt an active delivery
      setDeliveryStep((currentStep) => {
        if (currentStep === "idle") {
          setActiveOrder(mapped);
          console.log(`[Orders WS] 🚨 Pickup modal triggered — Order #${mapped.orderNumber} from ${mapped.restaurantName}`);
          return "pickup";
        }
        console.log("[Orders WS] ⚠️  Mid-delivery — new order stored in inbox, not shown");
        return currentStep;
      });
    },

    // ── Short notification (inner type: "order_message") → inbox ──────────
    // Payload: { type, order_id, order_number, status, timestamp, message }
    onInbox: (msgData) => {
      console.log("[Orders WS] INBOX message:", JSON.stringify(msgData, null, 2));
      const now = new Date();
      const h   = now.getHours() % 12 || 12;
      const m   = now.getMinutes().toString().padStart(2, "0");
      const ap  = now.getHours() >= 12 ? "pm" : "am";
      setInboxMessages((prev) => [
        {
          id:      String(msgData.order_id ?? Date.now()),
          sender:  `Order #${msgData.order_number || msgData.order_id || ""}`,
          message: msgData.message ?? "New notification",
          time:    `${h}:${m} ${ap}`,
        },
        ...prev,
      ]);
    },
  });

  // ── Log when driver goes online / offline ─────────────────────────────────
  useEffect(() => {
    if (online) {
      console.log("[Driver Status] ✅ Driver is now ONLINE — availability set to true");
    } else {
      console.log("[Driver Status] 🔴 Driver is now OFFLINE — availability set to false");
    }
  }, [online]);

  // ── Location interval: send GPS every 60 s when online ─────────────────────
  useEffect(() => {
    if (!online) return;

    // Send immediately on going online
    const coord = lastCoordRef.current;
    if (coord) {
      console.log(
        `[Location] 📍 Initial location sent — lat: ${coord.latitude.toFixed(6)}, lng: ${coord.longitude.toFixed(6)}`
      );
      sendLocation({
        lat:      coord.latitude,
        lng:      coord.longitude,
        heading:  0,
        speed:    0,
        accuracy: 5,
      });
    } else {
      console.warn("[Location] ⚠️  Went online but GPS fix not yet available — waiting for first coordinate");
    }

    const interval = setInterval(() => {
      const c = lastCoordRef.current;
      if (!c) {
        console.warn("[Location] ⚠️  Interval fired but no GPS coordinate available yet");
        return;
      }
      console.log(
        `[Location] 📍 60 s interval tick — lat: ${c.latitude.toFixed(6)}, lng: ${c.longitude.toFixed(6)}`
      );
      sendLocation({
        lat:      c.latitude,
        lng:      c.longitude,
        heading:  0,
        speed:    0,
        accuracy: 5,
      });
    }, 60_000);

    return () => {
      console.log("[Location] ⏹️  Location interval cleared (driver went offline)");
      clearInterval(interval);
    };
  }, [online, sendLocation]);

  // ── Open drawer ──────────────────────────────────────────────────────────
  const openDrawer = () => {
    // Delivery modals are non-Modal Views so they stay rendered, but the
    // drawer will stack on top of them (zIndex 9999). The user can close
    // the drawer and the delivery flow will still be intact.
    setDrawerOpen(true);
  };

  // ── Close drawer ─────────────────────────────────────────────────────────
  const closeDrawer = () => setDrawerOpen(false);

  // ── Orders arrive via WebSocket (useDriverWebSocket.onOrder above) ────────
  // No mock timer — real orders are pushed by the backend to the Orders WS channel.

  const handlePickUp = () => {
    // Tell the backend the driver has accepted this order
    if (activeOrder?.orderId) {
      postDriverAction("accept", activeOrder.orderId);
    }
    setDeliveryStep("onitsway");
    setPickupKey((k) => k + 1);
  };

  const handleStartDelivery = () => {
    setDeliveryStep("delivering");
    setNavModeKey((k) => k + 1);
  };

  // Called from CustomerModal after photo + delivery code submitted
  const handleDeliveryComplete = (orderCode?: string) => {
    if (activeOrder?.orderId) {
      postDriverAction("deliver", activeOrder.orderId, orderCode);
    }
    setDeliveryStep("success");
  };

  const handleDismissPickup = () => {
    setDeliveryStep("idle");
    setActiveOrder(null);
    setRouteSummary(null);
    // Waiting for the next real order via WebSocket
  };

  const handleSuccessClose = () => {
    setDeliveryStep("idle");
    setActiveOrder(null);
    setRouteSummary(null);
    setOnline(false);
  };

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
      case "Inbox":         return <InboxScreen         onBack={closeScreen} messages={inboxMessages} />;
      case "Earnings":      return <EarningsScreen      onBack={closeScreen} onOpenBank={() => setActiveScreen("OvenaBank")} />;
      case "OvenaBank":     return <OvenaBankScreen     onBack={closeScreen} />;
      case "Opportunities": return <OpportunitiesScreen onBack={closeScreen} />;
      case "ReferFriends":  return <ReferFriendsScreen  onBack={closeScreen} />;
      case "Help":          return <HelpScreen          onBack={closeScreen} />;
      default:              return null;
    }
  };

  // ── Map destination changes by delivery step ─────────────────────────────
  // onitsway   → route to the RESTAURANT (pick up)
  // delivering → route to the CUSTOMER   (drop off)
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

      {/* ── MAP — full screen base layer ── */}
      <View style={StyleSheet.absoluteFill}>
        <DriverMapView
          destination={mapDestination}
          destinationLabel={mapLabel}
          northTrigger={northKey}
          recenterTrigger={recenterKey}
          pickupTrigger={pickupKey}
          navigationModeTrigger={navModeKey}
          onRouteSummary={setRouteSummary}
          onLocationUpdate={(coord) => {
            // Store latest coord in ref — sent to backend every 60 s via interval above
            lastCoordRef.current = coord;
          }}
        />
      </View>

      {/* ── TOP BAR ──────────────────────────────────────────────────────── */}
      <View style={styles.topBar} pointerEvents="box-none">
        {/*
          Menu button — completely removed (not rendered) when drawer is open.
          Using conditional rendering (not opacity) ensures it has no hit area
          that could block touches to NavDrawer's profile row.
        */}
        {!drawerOpen && (
          <TouchableOpacity
            style={[styles.mapBtn, { backgroundColor: colors.card }]}
            onPress={openDrawer}
            activeOpacity={0.8}
          >
            <Text style={[styles.menuIcon, { color: colors.textPrimary }]}>☰</Text>
          </TouchableOpacity>
        )}

        {/* Status dot — always present, right side */}
        <View style={[styles.statusDotWrap, { backgroundColor: colors.card }]}>
          <View style={[styles.statusDot, { backgroundColor: online ? "#18C55D" : "#FF3B30" }]} />
        </View>
      </View>

      {/* ── MAP CONTROLS — always visible, bottom-right ───────────────────── */}
      <View style={styles.mapControls}>
        {/* Compass — reset map to face north */}
        <TouchableOpacity
          style={[styles.mapControlBtn, { backgroundColor: colors.card }]}
          onPress={() => setNorthKey((k) => k + 1)}
          activeOpacity={0.8}
        >
          <IconSymbol name="SunCompass" size={22} color={colors.iconColor} />
        </TouchableOpacity>

        {/* Location — re-centre on driver's position */}
        <TouchableOpacity
          style={[styles.mapControlBtn, { backgroundColor: colors.card }]}
          onPress={() => setRecenterKey((k) => k + 1)}
          activeOpacity={0.8}
        >
          <IconSymbol name="LocationArrowIcon" size={20} color={colors.accentOrange} />
        </TouchableOpacity>
      </View>

      {/* ── BOTTOM PANEL — only when idle ─────────────────────────────────── */}
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
            onPress={() => {
              const goingOnline = !online;
              console.log(`[Driver Status] Button pressed — going ${goingOnline ? "ONLINE" : "OFFLINE"}`);
              setOnline(goingOnline);
            }}
          >
            <IconSymbol
              name={online ? "PersonWalkingDashedLineArrowRightIcon" : "ArrowRightLongIcon"}
              size={22} color="#fff" style={{ opacity: 0 }}
            />
            <Text style={styles.toggleText}>{online ? "Go Offline" : "Go Online"}</Text>
            <IconSymbol
              name={online ? "PersonWalkingDashedLineArrowRightIcon" : "ArrowRightLongIcon"}
              size={22} color="#fff"
            />
          </TouchableOpacity>

          <Text style={[styles.toggleHint, { color: colors.textMuted }]}>
            Tap the button to change your availability
          </Text>
        </View>
      )}

      {/* ── DELIVERY FLOW OVERLAYS (non-Modal, z 20) ─────────────────────── */}
      <OnItsWayModal
        visible={deliveryStep === "onitsway"}
        order={activeOrder}
        routeSummary={routeSummary}
        onClose={() => {}}
        onStartDelivery={handleStartDelivery}
      />
      <DeliveryingModal
        visible={deliveryStep === "delivering"}
        order={activeOrder}
        routeSummary={routeSummary}
        onDeliveryComplete={handleDeliveryComplete}
      />

      {/* ── PICKUP MODAL (React Native Modal) ────────────────────────────── */}
      <PickUpModal
        visible={deliveryStep === "pickup"}
        order={activeOrder}
        routeSummary={routeSummary}
        onPickUp={handlePickUp}
        onClose={handleDismissPickup}
      />

      {/* ── SUCCESS MODAL ────────────────────────────────────────────────── */}
      <OrderSuccessModal
        visible={deliveryStep === "success"}
        onClose={handleSuccessClose}
      />

      {/*
        ── NAV DRAWER — rendered LAST so it sits on top of everything ───────
        zIndex 9999 in the NavDrawer wrapper guarantees it overlays all
        delivery modals, the compass, and the bottom panel.
        The hamburger button is fully unmounted when drawerOpen=true so
        it can never block the drawer's profile row touch target.
      */}
      <NavDrawer
        visible={drawerOpen}
        onClose={closeDrawer}
        onNavigate={handleNavigate}
      />

      {/* ── PAGE MODALS (full-screen slides) ─────────────────────────────── */}
      <Modal
        visible={activeScreen !== null}
        animationType="slide"
        onRequestClose={closeScreen}
        presentationStyle="fullScreen"
      >
        {renderActiveScreen()}
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },

  topBar: {
    position: "absolute",
    top: 50, left: 16, right: 16,
    flexDirection: "row",
    alignItems: "center",
    // Use space-between so status dot stays right whether menu is shown or not
    justifyContent: "space-between",
    zIndex: 10,
  },
  mapBtn: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: "center", justifyContent: "center",
    elevation: 4,
    shadowColor: "#000", shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 6,
  },
  menuIcon: { fontSize: 20, fontWeight: "700" },

  statusDotWrap: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: "center", justifyContent: "center",
    elevation: 4,
    shadowColor: "#000", shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 6,
    // When menu is hidden this stays right because topBar is space-between
    marginLeft: "auto",
  },
  statusDot: { width: 18, height: 18, borderRadius: 9 },

  // Map controls column — always visible, bottom-right
  mapControls: {
    position: "absolute",
    right: 16,
    bottom: 140,
    gap: 10,
    zIndex: 15,
    alignItems: "center",
  },
  mapControlBtn: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: "center", justifyContent: "center",
    elevation: 8,
    shadowColor: "#000", shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 }, shadowRadius: 8,
  },

  // Bottom panel — floats over map with no background
  bottomPanel: {
    position: "absolute",
    bottom: 0, width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
    alignItems: "center",
    gap: 12,
    zIndex: 10,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  earningsTitle: {
    fontSize: 14, fontWeight: "600",
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000", shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 6,
  },
  earnAmount: {
    fontSize: 16, fontWeight: "700",
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000", shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 6,
  },
  toggleButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 50,
    shadowColor: "#000", shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 8,
    elevation: 6,
  },
  toggleText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  toggleHint: { fontSize: 12, textAlign: "center" },
});