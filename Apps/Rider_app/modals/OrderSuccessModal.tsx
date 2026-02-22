// modals/OrderSuccessModal.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";

interface OrderSuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  visible,
  onClose,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.92);
    }
  }, [visible]);

  const handleRate = (rating: "up" | "down") => {
    // Fade out then close
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <IconSymbol name="BikeIcon" size={28} color="#333" />

          <Text style={styles.tripLabel}>Last Delivery trip</Text>
          <Text style={styles.tripAmount}>₦ 1,000.00</Text>
          <Text style={styles.cta}>THERE'S STILL MORE TO BE MADE!</Text>
          <Text style={styles.ratingQuestion}>How did the delivery go?</Text>

          <View style={styles.ratingRow}>
            <TouchableOpacity
              style={styles.ratingBtn}
              onPress={() => handleRate("up")}
              activeOpacity={0.75}
            >
              <IconSymbol name="ThumbsUpIcon" size={36} color="#10AA08" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.ratingBtn}
              onPress={() => handleRate("down")}
              activeOpacity={0.75}
            >
              <IconSymbol name="ThumbsDownIcon" size={36} color="#F12100" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default OrderSuccessModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 28,
    elevation: 20,
  },

  tripLabel: {
    fontSize: 16,
    color: "#555",
    fontWeight: "500",
    marginTop: 4,
  },
  tripAmount: {
    fontSize: 30,
    fontWeight: "800",
    color: "#10AA08",
    letterSpacing: -0.5,
  },
  cta: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111",
    letterSpacing: 0.3,
    marginTop: 4,
    textAlign: "center",
  },
  ratingQuestion: {
    fontSize: 15,
    color: "#444",
    marginTop: 8,
  },

  ratingRow: {
    flexDirection: "row",
    gap: 48,
    marginTop: 12,
  },
  ratingBtn: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 1.5,
    borderColor: "#ebebeb",
  },
});