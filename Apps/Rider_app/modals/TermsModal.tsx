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
import { useTheme } from "../context/ThemeContext";

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
  const { colors } = useTheme();
  const [isChecked, setIsChecked] = useState(false);
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
      <View style={[styles.modalOverlay, { backgroundColor: colors.overlayBg }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Terms & Conditions</Text>

          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[styles.checkbox, { borderColor: colors.textPrimary }]}
              onPress={() => setIsChecked(!isChecked)}
            >
              {isChecked && <View style={[styles.checkedBox, { backgroundColor: colors.accentOrange }]} />}
            </TouchableOpacity>

            <Text style={[styles.checkboxText, { color: colors.textPrimary }]}>
              I Accept the{" "}
              <Text
                style={{ color: "#5077F7", textDecorationLine: "underline" }}
                onPress={onTermsPress}
              >
                Terms & Conditions
              </Text>
            </Text>
          </View>

          <Pressable
            style={[
              styles.continueButton,
              {
                backgroundColor: colors.accentDark,
                opacity: isChecked ? 1 : 0.5,
              },
            ]}
            onPress={handleContinue}
            disabled={!isChecked}
          >
            <Text style={[styles.continueButtonText, { color: colors.textOnAccent }]}>Continue</Text>
          </Pressable>

          <Pressable onPress={onClose} style={{ marginTop: 10 }}>
            <Text style={{ color: colors.accentOrange, fontWeight: "bold" }}>Cancel</Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
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
    marginRight: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedBox: { width: 15, height: 15, borderRadius: 20 },
  checkboxText: { fontSize: 16 },
  continueButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 50,
    width: "100%",
  },
  continueButtonText: { textAlign: "center", fontSize: 18, fontWeight: "bold" },
});