import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { IconSymbol, IconName } from "./ui/icon-symbol";

type MenuAction = {
  label: string;
  icon: IconName;
  onPress: () => void;
};

type MenuModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  actions: MenuAction[];
};

const RestuarantsModal = ({
  visible,
  onClose,
  title = "Menu",
  actions,
}: MenuModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={styles.title}>{title}</Text>

          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              onPress={() => {
                onClose();
                action.onPress();
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <IconSymbol name={action.icon} size={18} color="#000" />
                <Text style={styles.actionText}>{action.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default RestuarantsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    padding: 75,
    width: "100%",
    height: 250,
    borderTopLeftRadius: 200,
    borderTopRightRadius: 150,
    backgroundColor: "#F6D44F",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  actionButton: {
    paddingVertical: 12,
  },
  actionText: {
    fontSize: 16,
  },
});
