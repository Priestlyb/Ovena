// modals/TermsModal.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

interface TermsModalProps {
  visible: boolean;
  onClose: () => void;
  onTermsPress: (event: GestureResponderEvent) => void;
  onContinue: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({
  visible,
  onClose,
  onTermsPress,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  // navigation without explicit type
  const navigation = useNavigation<any>();

  const handleContinue = () => {
    if (isChecked) {
      onClose(); 
      setIsChecked(false);
      navigation.navigate("Signup"); 
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Terms & Conditions</Text>

          {/* Checkbox */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setIsChecked(!isChecked)}
            >
              {isChecked && <View style={styles.checkedBox} />}
            </TouchableOpacity>

            <Text style={styles.checkboxText}>
              I Accept the{" "}
              <Text
                style={{ color: "#5077F7", textDecorationLine: "underline" }}
                onPress={onTermsPress}
              >
                Terms & Conditions
              </Text>
            </Text>
          </View>

          {/* Continue Button */}
          <Pressable
            style={[styles.continueButton, { opacity: isChecked ? 1 : 0.5 }]}
            onPress={handleContinue}
            disabled={!isChecked}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </Pressable>

          <Pressable onPress={onClose} style={{ marginTop: 10 }}>
            <Text style={{ color: "#D44C0C", fontWeight: "bold" }}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default TermsModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  checkbox: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: "#000",
    marginRight: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedBox: {
    width: 15,
    height: 15,
    backgroundColor: "#D44C0C",
    borderRadius: 20,
  },
  checkboxText: { fontSize: 16 },
  continueButton: {
    marginTop: 20,
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 50,
    width: "100%",
  },
  continueButtonText: { color: "#fff", textAlign: "center", fontSize: 18, fontWeight: "bold" },
});
