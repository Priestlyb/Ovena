// modals/PickUpModal.tsx
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import { useTheme } from "../context/ThemeContext";

interface PickUpModalProps {
  visible: boolean;
  onClose: () => void;
  onPickUp: () => void;
}

const PickUpModal: React.FC<PickUpModalProps> = ({
  visible,
  onClose,
  onPickUp,
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlayBg }]}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.accentOrange }]} onPress={onPickUp}>
            <Text style={styles.buttonText}>Pick-up</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.textPrimary }]}>₦1,500.00</Text>
          <View style={{ width: "100%", gap: 30, padding: 25, marginBottom: 20 }}>
            <View style={styles.timeContainer}>
              <IconSymbol name="ClockIcon" size={24} color={colors.iconColor} />
              <Text style={{ color: colors.textPrimary }}>16 min 1.9 ml total</Text>
            </View>
            <View style={styles.timeContainer}>
              <IconSymbol name="LocationArrowIcon" size={24} color={colors.iconColor} />
              <Text style={{ color: colors.textPrimary }}>KFC -Nottingham - Cross Street Retails Park</Text>
            </View>
            <View style={styles.timeContainer}>
              <IconSymbol name="PersonPinCircleIcon" size={24} color={colors.iconColor} />
              <Text style={{ color: colors.textPrimary }}>149 Westminster Crescent, Sheffield, S10 4EW</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={{ position: "absolute", bottom: 15, right: 15 }}
          >
            <IconSymbol name="DeleteEmptyIcon" size={40} color={colors.iconColor} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PickUpModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    position: "absolute",
    bottom: 50,
    width: "90%",
    alignItems: "center",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  button: {
    width: "50%",
    paddingVertical: 10,
    marginBottom: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: { fontSize: 18, color: "#fff", fontWeight: "600" },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 18,
  },
});