import { Text } from "@/components/atoms/Text";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type Variant = "danger" | "warning" | "info";

interface Props {
  visible: boolean;
  title: string;
  message: string;

  confirmText?: string;
  cancelText?: string;

  loading?: boolean;
  variant?: Variant;

  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  variant = "danger",
  onConfirm,
  onCancel,
}: Props) {
  const colorMap = {
    danger: "#F84E10",
    warning: "#f59e0b",
    info: "#3b82f6",
  };

  const accent = colorMap[variant];

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              onPress={onCancel}
              disabled={loading}
            >
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: accent }]}
              onPress={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmText}>{confirmText}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  message: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },

  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: 90,
    alignItems: "center",
  },

  cancelBtn: {
    backgroundColor: "#f3f4f6",
  },

  cancelText: {
    color: "#111827",
    fontWeight: "600",
  },

  confirmText: {
    color: "#fff",
    fontWeight: "700",
  },
});
