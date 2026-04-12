// screens/HomeScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Modal,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import { useTheme } from "../context/ThemeContext";

// Modals
import PickUpModal from "../modals/PickUpModal";
import ConfirmPickupModal from "../modals/OnItsWayModal";
import DeliveryingModal from "../modals/DeliveryingModal";
import CustomerModal from "../modals/CustomerModal";
import TakePhotoModal from "../modals/TakePhotoModal";
import OrderSuccessModal from "../modals/OrderSuccessModal";

// Navigation
import NavDrawer, { NavRoute } from "../components/NavDrawer";
import DriverMapView from "../components/DriverMapView";

// Page screens (rendered as full-screen modals)
import ProfileScreen from "../screens/ProfileScreen";
import AccountScreen from "../screens/AccountScreen";
import InboxScreen from "../screens/InboxScreen";
import EarningsScreen from "../screens/EarningsScreen";
import OpportunitiesScreen from "./OpportunitiesScreen";
import ReferFriendsScreen from "../screens/ReferFriendsScreen";
import HelpScreen from "../screens/HelpScreen";
import OvenaBankScreen from "../screens/OvenaBankScreen";

type ActiveScreen =
  | null
  | "Profile"
  | "Account"
  | "Inbox"
  | "Earnings"
  | "OvenaBank"
  | "Opportunities"
  | "ReferFriends"
  | "Help";

const HomeScreen = () => {
  const { colors, isDark } = useTheme();

  const [online, setOnline] = useState(false);

  // Nav drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(null);

  // Delivery flow modals
  const [showPickUp, setShowPickUp] = useState(false);
  const [showConfirmPickup, setShowConfirmPickup] = useState(false);
  const [showDeliverying, setShowDeliverying] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);
  const [showTakePhoto, setShowTakePhoto] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);

  // ── Existing pickup flow ─────────────────────────────────────────────────
  const handlePickUpPress = () => {
    setShowPickUp(false);
    setTimeout(() => setShowConfirmPickup(true), 150);
  };

  // ── Delivery flow ────────────────────────────────────────────────────────
  const handleEarningsPress = () => {
    setPhotoTaken(false);
    setShowCustomer(true);
  };

  const handleTakePhoto = () => {
    setShowCustomer(false);
    setTimeout(() => setShowTakePhoto(true), 150);
  };

  const handlePhotoDone = () => {
    setPhotoTaken(true);
    setShowTakePhoto(false);
    setTimeout(() => setShowCustomer(true), 150);
  };

  const handleCompleteDelivery = () => {
    setShowCustomer(false);
    setTimeout(() => setShowOrderSuccess(true), 150);
  };

  const handleOrderSuccessClose = () => {
    setShowOrderSuccess(false);
    setPhotoTaken(false);
    setOnline(false);
  };

  // ── Navigation ───────────────────────────────────────────────────────────
  const handleNavigate = (route: NavRoute) => {
    if (route === "TipsInfo") return;
    setActiveScreen(route as ActiveScreen);
  };

  const closeScreen = () => setActiveScreen(null);

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case "Profile":       return <ProfileScreen onBack={closeScreen} />;
      case "Account":       return <AccountScreen onBack={closeScreen} />;
      case "Inbox":         return <InboxScreen onBack={closeScreen} />;
      case "Earnings":      return <EarningsScreen onBack={closeScreen} onOpenBank={() => setActiveScreen("OvenaBank")} />;
      case "OvenaBank":     return <OvenaBankScreen onBack={closeScreen} />;
      case "Opportunities": return <OpportunitiesScreen onBack={closeScreen} />;
      case "ReferFriends":  return <ReferFriendsScreen onBack={closeScreen} />;
      case "Help":          return <HelpScreen onBack={closeScreen} />;
      default:              return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#0D0D0D" : "#000" }]}>
      <StatusBar barStyle={colors.statusBarStyle} />

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.menuBtn, { backgroundColor: colors.card }]}
          onPress={() => setDrawerOpen(true)}
        >
          <Text style={[styles.menuIcon, { color: colors.textPrimary }]}>☰</Text>
        </TouchableOpacity>

        <View style={[styles.statusContainer, { backgroundColor: colors.card }]}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: online ? "#18C55D" : "#FF3B30" },
            ]}
          />
        </View>
      </View>

      {/* BOTTOM PANEL */}
      <View style={[styles.bottomPanel, { backgroundColor: isDark ? colors.card : "transparent" }]}>
        <Text style={[styles.earningsTitle, { backgroundColor: colors.card, color: colors.textPrimary }]}>
          TODAY
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 75 }}>
          <IconSymbol
            name="GymIcon"
            size={26}
            color={colors.iconColor}
            style={{ opacity: 0 }}
          />
          <TouchableOpacity onPress={handleEarningsPress}>
            <Text style={[styles.earnAmount, { backgroundColor: isDark ? colors.cardSecondary : "#000", color: colors.accentGreen }]}>
              ₦1,125.00
            </Text>
          </TouchableOpacity>
          <IconSymbol
            name="SunCompass"
            size={26}
            color={colors.iconColor}
            style={{ backgroundColor: colors.card, borderRadius: 50, padding: 4 }}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            {
              backgroundColor: online ? colors.accentOrange : colors.accentGreen,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 30,
            },
          ]}
          onPress={() => setOnline(!online)}
        >
          <IconSymbol
            name={online ? "PersonWalkingDashedLineArrowRightIcon" : "ArrowRightLongIcon"}
            size={22}
            color="#fff"
            style={{ opacity: 0 }}
          />
          <Text style={styles.toggleText}>
            {online ? "Go Offline" : "Go Online"}
          </Text>
          <IconSymbol
            name={online ? "PersonWalkingDashedLineArrowRightIcon" : "ArrowRightLongIcon"}
            size={22}
            color="#fff"
          />
        </TouchableOpacity>

        <Text style={[styles.toggleHint, { color: isDark ? colors.textMuted : "#6B6B78" }]}>
          Tap the button to change your availability
        </Text>
      </View>

      {/* ── NAV DRAWER ───────────────────────────────────────────────────── */}
      <NavDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={handleNavigate}
        driverName="Priestly"
      />

      {/* ── FULL-SCREEN PAGE MODAL ───────────────────────────────────────── */}
      <Modal
        visible={activeScreen !== null}
        animationType="slide"
        onRequestClose={closeScreen}
        presentationStyle="fullScreen"
      >
        {renderActiveScreen()}
      </Modal>

      {/* ── DELIVERY FLOW MODALS ─────────────────────────────────────────── */}
      <PickUpModal
        visible={showPickUp}
        onClose={() => setShowPickUp(false)}
        onPickUp={handlePickUpPress}
      />
      <ConfirmPickupModal
        visible={showConfirmPickup}
        onClose={() => setShowConfirmPickup(false)}
      />
      <DeliveryingModal
        visible={showDeliverying}
        onClose={() => setShowDeliverying(false)}
      />
      <CustomerModal
        visible={showCustomer}
        onClose={() => setShowCustomer(false)}
        onTakePhoto={handleTakePhoto}
        onCompleteDelivery={handleCompleteDelivery}
        photoTaken={photoTaken}
      />
      <TakePhotoModal
        visible={showTakePhoto}
        onClose={() => {
          setShowTakePhoto(false);
          setTimeout(() => setShowCustomer(true), 150);
        }}
        onDone={handlePhotoDone}
      />
      <OrderSuccessModal
        visible={showOrderSuccess}
        onClose={handleOrderSuccessClose}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuBtn: {
    padding: 12,
    borderRadius: 50,
    elevation: 4,
  },
  menuIcon: { fontSize: 22, fontWeight: "700" },
  statusContainer: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 50,
    marginRight: 10,
  },
  statusDot: { width: 17, height: 17, borderRadius: 50 },
  bottomPanel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 24,
    elevation: 12,
    gap: 12,
    alignItems: "center",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  earningsTitle: {
    fontSize: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontWeight: "600",
  },
  earnAmount: {
    fontSize: 18,
    fontWeight: "500",
    marginVertical: 6,
    padding: 10,
    borderRadius: 20,
  },
  toggleButton: {
    width: "100%",
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: "center",
  },
  toggleText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  toggleHint: {
    marginTop: 12,
    fontSize: 12,
    textAlign: "center",
  },
});

