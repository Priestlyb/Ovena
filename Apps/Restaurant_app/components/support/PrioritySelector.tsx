// components/support/PrioritySelector.tsx

import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Text } from "@/components/atoms/Text";

export type SupportPriority = "low" | "medium" | "high";

interface PrioritySelectorProps {
  value: SupportPriority;
  onChange: (priority: SupportPriority) => void;
  disabled?: boolean;
}

const PRIORITIES: SupportPriority[] = ["low", "medium", "high"];

export default function PrioritySelector({
  value,
  onChange,
  disabled = false,
}: PrioritySelectorProps) {
  return (
    <View style={styles.container}>
      {PRIORITIES.map((priority) => {
        const selected = value === priority;

        return (
          <TouchableOpacity
            key={priority}
            onPress={() => onChange(priority)}
            disabled={disabled}
            activeOpacity={0.8}
            style={[
              styles.button,
              selected && styles.selectedButton,
              disabled && styles.disabledButton,
            ]}
          >
            <Text
              variant="body"
              style={[styles.text, selected && styles.selectedText]}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },

  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
  },

  selectedButton: {
    backgroundColor: "#FF592099",
  },

  disabledButton: {
    opacity: 0.6,
  },

  text: {
    textTransform: "capitalize",
    fontWeight: "400",
    color: "#111827",
  },

  selectedText: {
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
