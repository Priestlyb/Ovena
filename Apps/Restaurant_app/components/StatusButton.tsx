import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface StatusButtonProps {
  status: string;
  label?: string;
  onPress?: () => void;
}

export function StatusButton({ status, label, onPress }: StatusButtonProps) {
  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      {
        label: string;
        backgroundColor: string;
        color: string;
      }
    > = {
      incoming: {
        label: "Accept",
        backgroundColor: "#10B981",
        color: "#FFFFFF",
      },
      preparing: {
        label: "Ready",
        backgroundColor: "#FF6B35",
        color: "#FFFFFF",
      },
      ready: {
        label: "Deliver",
        backgroundColor: "#3B82F6",
        color: "#FFFFFF",
      },
      in_transit: {
        label: "In Transit",
        backgroundColor: "#F59E0B",
        color: "#FFFFFF",
      },
      completed: {
        label: "Completed",
        backgroundColor: "#6B7280",
        color: "#FFFFFF",
      },
      rejected: {
        label: "Rejected",
        backgroundColor: "#EF4444",
        color: "#FFFFFF",
      },
    };

    return (
      configs[status] || {
        label: status,
        backgroundColor: "#6B7280",
        color: "#FFFFFF",
      }
    );
  };

  const config = getStatusConfig(status);

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: config.backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, { color: config.color }]}>
        {label ?? config.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: "center",
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
