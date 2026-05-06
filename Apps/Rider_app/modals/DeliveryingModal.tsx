// modals/DeliveryingModal.tsx
//
// Compact bottom card — map fully interactive behind it.
// Hamburger opens CustomerModal → TakePhotoModal → slide-to-complete.
//
// KEY: overlay uses pointerEvents="box-none" (passes touches through to map).
//      card uses pointerEvents="auto" (NOT "box-only") so TouchableOpacity
//      children inside the card receive touches correctly.

import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Easing, Platform,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import { useTheme } from "../context/ThemeContext";
import { MockOrder } from "../data/mockOrders";
import { RouteSummary } from "../components/DriverMapView";
import CustomerModal from "./CustomerModal";
import TakePhotoModal from "./TakePhotoModal";

interface DeliveryingModalProps {
  visible:            boolean;
  order:              MockOrder | null;
  routeSummary:       RouteSummary | null;
  onDeliveryComplete: (orderCode: string) => void;
}

const DeliveryingModal: React.FC<DeliveryingModalProps> = ({
  visible, order, routeSummary, onDeliveryComplete,
}) => {
  const { colors } = useTheme();

  const slideAnim = useRef(new Animated.Value(200)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  const [showCustomer,  setShowCustomer]  = useState(false);
  const [showTakePhoto, setShowTakePhoto] = useState(false);
  const [photoTaken,    setPhotoTaken]    = useState(false);

  useEffect(() => {
    if (visible) {
      // Reset flow state every time this modal becomes visible
      setPhotoTaken(false);
      setShowCustomer(false);
      setShowTakePhoto(false);
      Animated.parallel([
        Animated.timing(fadeAnim,  {
          toValue: 1, duration: 250,
          easing: Easing.out(Easing.ease), useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0, friction: 9, tension: 70, useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(200);
    }
  }, [visible]);

  if (!visible || !order) return null;

  // ── Handlers ─────────────────────────────────────────────────────────────

  // CustomerModal asks to open the camera
  const handleTakePhoto = () => {
    setShowCustomer(false);
    setTimeout(() => setShowTakePhoto(true), 150);
  };

  // TakePhotoModal completed — note + photo are available
  const handlePhotoDone = (_photoUri: string, _note: string) => {
    // TODO: POST photoUri + note to backend here if desired
    setPhotoTaken(true);
    setShowTakePhoto(false);
    setTimeout(() => setShowCustomer(true), 150);
  };

  // CustomerModal slide-to-complete finished — receives the code the driver typed
  const handleCompleteDelivery = (code: string) => {
    setShowCustomer(false);
    setTimeout(() => onDeliveryComplete(code), 150);
  };

  return (
    <>
      {/*
        The Animated.View overlay is NOT inside a <Modal> — it sits directly
        in the React tree so it renders above the map without stealing all
        touch events. pointerEvents="box-none" lets touches through to the map
        except where child Views handle them.
      */}
      <Animated.View
        style={[styles.overlay, { opacity: fadeAnim }]}
        pointerEvents="box-none"
      >
        {/*
          pointerEvents="auto" (the default) is essential here.
          "box-only" would intercept touches for the container but pass nothing
          down to children — breaking every TouchableOpacity inside the card.
        */}
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: colors.card, transform: [{ translateY: slideAnim }] },
          ]}
          pointerEvents="auto"
        >
          {/* ── Row 1: ETA · distance · hamburger ── */}
          <View style={styles.topRow}>
            <Text style={[styles.etaText, { color: colors.textPrimary }]}>
              {routeSummary?.duration ?? "…"}
            </Text>
            <IconSymbol name="Bicycle" size={18} color={colors.iconColor} />
            <Text style={[styles.etaText, { color: colors.textPrimary }]}>
              {routeSummary?.distance ?? ""}
            </Text>

            <View style={{ flex: 1 }} />

            {/* Hamburger — opens CustomerModal */}
            <TouchableOpacity
              style={[styles.hamburgerBtn, { backgroundColor: colors.inputBg }]}
              onPress={() => setShowCustomer(true)}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <IconSymbol name="NavListIcon" size={20} color={colors.iconColor} />
            </TouchableOpacity>
          </View>

          {/* ── Row 2: Deliver to customer ── */}
          <Text style={[styles.deliverLabel, { color: colors.textSecondary }]}>
            Deliver to{" "}
            <Text style={{ fontWeight: "700", color: colors.textPrimary }}>
              {order.customerName}
            </Text>
          </Text>
        </Animated.View>
      </Animated.View>

      {/* ── CustomerModal (opened by hamburger) ── */}
      <CustomerModal
        visible={showCustomer}
        onClose={() => setShowCustomer(false)}
        onTakePhoto={handleTakePhoto}
        onCompleteDelivery={handleCompleteDelivery}
        photoTaken={photoTaken}
        order={order}
        routeSummary={routeSummary}
      />

      {/* ── TakePhotoModal (opened from CustomerModal) ── */}
      <TakePhotoModal
        visible={showTakePhoto}
        onClose={() => {
          setShowTakePhoto(false);
          // Return to CustomerModal when user cancels photo
          setTimeout(() => setShowCustomer(true), 150);
        }}
        onDone={handlePhotoDone}
        order={order}
      />
    </>
  );
};

export default DeliveryingModal;

const CARD_BOTTOM = Platform.OS === "ios" ? 90 : 72; // raised ~100% higher than before

const styles = StyleSheet.create({
  // Fills the screen but passes touches through to the map
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    paddingBottom: CARD_BOTTOM,
    paddingHorizontal: 12,
    zIndex: 20,
    // No background — map is fully visible
  },

  card: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 8,
    // Shadow so card reads against the map
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 20,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  etaText: {
    fontSize: 16,
    fontWeight: "700",
  },
  hamburgerBtn: {
    width: 42, height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  deliverLabel: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
});