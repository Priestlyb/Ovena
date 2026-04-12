// modals/OrderSuccessModal.tsx
import React, { useEffect, useRef } from "react";
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
import { useTheme } from "../context/ThemeContext";

interface OrderSuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors } = useTheme();

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

  const handleRate = (_rating: "up" | "down") => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={[styles.overlay, { backgroundColor: colors.overlayBg }]}>
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <IconSymbol name="BikeIcon" size={28} color={colors.iconColor} />

          <Text style={[styles.tripLabel, { color: colors.textSecondary }]}>Last Delivery trip</Text>
          <Text style={[styles.tripAmount, { color: colors.accentGreen }]}>₦ 1,000.00</Text>
          <Text style={[styles.cta, { color: colors.textPrimary }]}>THERE'S STILL MORE TO BE MADE!</Text>
          <Text style={[styles.ratingQuestion, { color: colors.textSecondary }]}>How did the delivery go?</Text>

          <View style={styles.ratingRow}>
            <TouchableOpacity
              style={[styles.ratingBtn, { backgroundColor: colors.actionBtnBg, borderColor: colors.actionBtnBorder }]}
              onPress={() => handleRate("up")}
              activeOpacity={0.75}
            >
              <IconSymbol name="ThumbsUpIcon" size={36} color={colors.accentGreen} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ratingBtn, { backgroundColor: colors.actionBtnBg, borderColor: colors.actionBtnBorder }]}
              onPress={() => handleRate("down")}
              activeOpacity={0.75}
            >
              <IconSymbol name="ThumbsDownIcon" size={36} color={colors.accentRed} />
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
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
  tripLabel: { fontSize: 16, fontWeight: "500", marginTop: 4 },
  tripAmount: { fontSize: 30, fontWeight: "800", letterSpacing: -0.5 },
  cta: { fontSize: 15, fontWeight: "800", letterSpacing: 0.3, marginTop: 4, textAlign: "center" },
  ratingQuestion: { fontSize: 15, marginTop: 8 },
  ratingRow: { flexDirection: "row", gap: 48, marginTop: 12 },
  ratingBtn: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
  },
});