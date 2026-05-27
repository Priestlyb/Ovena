// modals/PickUpModal.tsx
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import { useTheme } from "../context/ThemeContext";
import { MockOrder } from "../data/mockOrders";
import { RouteSummary } from "../components/DriverMapView";


interface PickUpModalProps {
  visible: boolean;
  onClose: () => void;    // modal-level dismiss (Android back / onRequestClose)
  onPickUp: () => void;   // accept  → POST action:"accept"
  onReject: () => void;   // reject  → POST action:"reject"  (trash button)
  order: MockOrder | null;
  routeSummary: RouteSummary | null;
}

const PickUpModal: React.FC<PickUpModalProps> = ({
  visible, onClose, onPickUp, onReject, order, routeSummary,
}) => {
  const { colors } = useTheme();
  if (!order) return null;



  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: colors.overlayBg }]}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>

          {/* Pick-up CTA */}
          <TouchableOpacity
            style={[styles.pickupBtn, { backgroundColor: colors.accentOrange }]}
            onPress={onPickUp}
          >
            <Text style={styles.pickupBtnText}>Pick-up</Text>
          </TouchableOpacity>

          {/* Amount */}
          <Text style={[styles.amount, { color: colors.textPrimary }]}>{order.amount}</Text>

          {/* Info rows */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <IconSymbol name="ClockIcon" size={22} color={colors.iconColor} />
              <Text style={[styles.infoText, { color: colors.textPrimary }]}>
                {routeSummary ? `${routeSummary.duration}  ·  ${routeSummary.distance}` : "Calculating route…"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <IconSymbol name="LocationArrowIcon" size={22} color={colors.iconColor} />
              <Text style={[styles.infoText, { color: colors.textPrimary }]}>
                {order.restaurantName}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <IconSymbol name="PersonPinCircleIcon" size={22} color={colors.iconColor} />
              <Text style={[styles.infoText, { color: colors.textPrimary }]}>
                {order.deliveryAddress}
              </Text>
            </View>
          </View>

          {/* Dismiss */}
          {/* Reject — notifies backend then closes modal */}
          <TouchableOpacity style={styles.dismissBtn} onPress={onReject}>
            <IconSymbol name="DeleteEmptyIcon" size={40} color={colors.iconColor} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PickUpModal;

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end", alignItems: "center", paddingBottom: 30 },
  card: {
    width: "92%",
    alignItems: "center",
    borderRadius: 24,
    paddingTop: 24,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
  },
  pickupBtn: {
    width: "52%",
    paddingVertical: 12,
    marginBottom: 16,
    borderRadius: 50,
    alignItems: "center",
  },
  pickupBtnText: { fontSize: 18, color: "#fff", fontWeight: "700" },
  amount: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  infoSection: { width: "100%", gap: 22, paddingHorizontal: 28, marginTop: 8, marginBottom: 24 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  infoText: { flex: 1, fontSize: 14, lineHeight: 20 },
  dismissBtn: { position: "absolute", bottom: 14, right: 14 },
});