import React, { useEffect } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { IconSymbol } from "./ui/icon-symbol";

type Variant = "success" | "error" | "warning" | "info";

interface Props {
  visible: boolean;
  title?: string;
  message: string;
  variant?: Variant;
  onClose: () => void;

  // ✅ NEW (optional action button)
  actionLabel?: string;
  onAction?: () => void;
}

export default function FeedbackModal({
  visible,
  title,
  message,
  variant = "info",
  onClose,
  actionLabel,
  onAction,
}: Props) {
  const getConfig = () => {
    switch (variant) {
      case "success":
        return {
          iconColor: "#000",
          textColor: "#000",
          color: "#ffb47e45",
          defaultTitle: "Success",
        };
      case "error":
        return {
          iconColor: "#fff",
          textColor: "#fff",
          color: "#FF5920",
          defaultTitle: "Request failed",
        };
      case "warning":
        return {
          iconColor: "#000",
          textColor: "#000",
          color: "#ffb47e45",
          defaultTitle: "Warning",
        };
      default:
        return {
          iconColor: "#000",
          textColor: "#000",
          color: "#ffb47e45",
          defaultTitle: "Notice",
        };
    }
  };

  const { defaultTitle, color, textColor, iconColor } = getConfig();

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 7000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.container, { backgroundColor: color }]}>
              {/* TEXT */}
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: textColor }]}>
                  {title || defaultTitle}
                </Text>

                <Text style={[styles.message, { color: textColor }]}>
                  {message}
                </Text>

                {/* ✅ ACTION BUTTON */}
                {actionLabel && onAction && (
                  <TouchableOpacity
                    onPress={() => {
                      onAction();
                      onClose();
                    }}
                    style={styles.actionButton}
                  >
                    <Text style={styles.actionText}>{actionLabel}</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* CLOSE BUTTON */}
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <IconSymbol name="CloseIcon" size={20} color={iconColor} />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: "6%",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "85%",
    borderRadius: 20,
    padding: 25,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 10,
  },
  button: {
    borderRadius: 10,
  },

  // ✅ NEW ACTION BUTTON
  actionButton: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#2563eb",
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
});
