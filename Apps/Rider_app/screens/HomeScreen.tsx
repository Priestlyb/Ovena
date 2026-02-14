import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import PickUpModal from "../modals/PickUpModal";
import ConfirmPickupModal from "../modals/OnItsWayModal";
import DeliveryingModal from "../modals/DeliveryingModal";

const HomeScreen = () => {
  const [online, setOnline] = useState(false);

  const [showPickUp, setShowPickUp] = useState(false);
  const [showConfirmPickup, setShowConfirmPickup] = useState(false);
  const [showDeliverying, setShowDeliverying] = useState (false);

  const handlePickUpPress = () => {
    // Close first modal
    setShowPickUp(false);

    // Open next modal after a short delay (important on Android)
    setTimeout(() => {
      setShowConfirmPickup(true);
    }, 150);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* BACKGROUND IMAGE */}
      <Image
        source={require("../assets/road.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* DARK OVERLAY */}
      <View style={styles.overlay} />

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: online ? "#18C55D" : "#FF3B30" },
            ]}
          />
        </View>
      </View>

      {/* BOTTOM PANEL */}
      <View style={styles.bottomPanel}>
        <Text style={styles.earningsTitle}>TODAY</Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 75 }}>
          <IconSymbol
            name="GymIcon"
            size={26}
            color="#000"
            style={{ opacity: 0 }}
          />

          <TouchableOpacity onPress={() => setShowPickUp(true)}>
            <Text style={styles.earnAmount}>₦1,125.00</Text>
          </TouchableOpacity>

          <IconSymbol
            name="SunCompass"
            size={26}
            color="#000"
            style={{ backgroundColor: "#FFF", borderRadius: 50, padding: 4 }}
          />
        </View>

        {/* GO ONLINE / OFFLINE */}
        <TouchableOpacity
          style={[
            styles.toggleButton,
            {
              backgroundColor: online ? "#D44C0C" : "#18C55D",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 30,
            },
          ]}
          onPress={() => setOnline(!online)}
        >
          <IconSymbol
            name={
              online
                ? "PersonWalkingDashedLineArrowRightIcon"
                : "ArrowRightLongIcon"
            }
            size={22}
            color="#fff"
            style={{ opacity: 0 }}
          />

          <Text style={styles.toggleText}>
            {online ? "Go Offline" : "Go Online"}
          </Text>

          <IconSymbol
            name={
              online
                ? "PersonWalkingDashedLineArrowRightIcon"
                : "ArrowRightLongIcon"
            }
            size={22}
            color="#fff"
          />
        </TouchableOpacity>

        <Text style={styles.toggleHint}>
          Tap the button to change your availability
        </Text>
      </View>

      {/* PICKUP MODAL */}
      <PickUpModal
        visible={showPickUp}
        onClose={() => setShowPickUp(false)}
        onPickUp={handlePickUpPress}
      />

      {/* CONFIRM PICKUP MODAL */}
      <ConfirmPickupModal
        visible={showConfirmPickup}
        onClose={() => setShowConfirmPickup(false)}
      />

      {/* Deliverying MODAL */}
      <DeliveryingModal
        visible={showDeliverying}
        onClose={() => setShowDeliverying(false)}
      />
    </View>
  );
};

export default HomeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  /* ---------- BACKGROUND ---------- */
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  /* ---------- TOP BAR ---------- */
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
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 50,
    elevation: 4,
  },

  menuIcon: {
    fontSize: 22,
    fontWeight: "700",
  },

  statusContainer: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderRadius: 50,
    marginRight: 10,
  },

  statusDot: {
    width: 17,
    height: 17,
    borderRadius: 50,
  },

  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },

  /* ---------- BOTTOM PANEL ---------- */
  bottomPanel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 24,
    elevation: 12,
    display: "flex",
    gap: 12,
    alignItems: "center",
  },

  earningsTitle: {
    fontSize: 15,
    color: "#000",
    backgroundColor: "#FFFFFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontWeight: "600",
  },

  earnAmount: {
    fontSize: 18,
    fontWeight: "500",
    marginVertical: 6,
    color: "#10AA08",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#000",
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
    color: "#6B6B78",
    textAlign: "center",
  },
});
