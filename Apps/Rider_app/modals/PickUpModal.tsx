import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";

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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.button} onPress={onPickUp}>
            <Text style={styles.buttonText}>Pick-up</Text>
          </TouchableOpacity>
          <Text style={styles.title}>₦1,500.00</Text>
          <View
            style={{ width: "100%", gap: 30, padding: 25, marginBottom: 20 }}
          >
            <View style={styles.timeContainer}>
              <IconSymbol name="ClockIcon" size={24} color="#000" />
              <Text>16 min 1.9 ml total</Text>
            </View>
            <View style={styles.timeContainer}>
              <IconSymbol name="LocationArrowIcon" size={24} color="#000" />
              <Text>KFC -Nottingham - Cross Street Retails Park</Text>
            </View>
            <View style={styles.timeContainer}>
              <IconSymbol name="PersonPinCircleIcon" size={24} color="#000" />
              <Text>149 Westminster Crescent, Sheffield, S10 4EW</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={{ position: "absolute", bottom: 15, right: 15 }}
          >
            <IconSymbol name="DeleteEmptyIcon" size={40} color="#000" />
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    position: "absolute",
    bottom: 50,
    width: "90%",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  button: {
    width: "50%",
    backgroundColor: "#D44C0C",
    paddingVertical: 10,
    marginBottom: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  timeContainer: {
    margin: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 18,
  },
});
