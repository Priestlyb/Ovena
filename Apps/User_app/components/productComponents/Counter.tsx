import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

import { useTheme } from "@/constants/theme";

interface CounterProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: "small" | "large";
  minValue?: number;
}

export const Counter: React.FC<CounterProps> = ({
  value,
  onIncrement,
  onDecrement,
  size = "small",
  minValue = 0,
}) => {
  const theme = useTheme();

  const styles = createStyles(theme);

  return (
    <View style={[styles.counter, size === "large" && styles.counterLarge]}>
      <TouchableOpacity
        onPress={onDecrement}
        style={styles.counterButton}
        disabled={value <= minValue}
      >
        <Text style={styles.counterButtonText}>−</Text>
      </TouchableOpacity>

      <Text
        style={[
          styles.counterValue,
          size === "large" && styles.counterValueLarge,
        ]}
      >
        {value}
      </Text>

      <TouchableOpacity
        onPress={onIncrement}
        style={[styles.counterButton, styles.counterButtonPrimary]}
      >
        <Text style={[styles.counterButtonText, styles.counterButtonTextWhite]}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    counter: {
      flexDirection: "row",

      alignItems: "center",

      backgroundColor: theme.surface,

      borderRadius: 20,

      paddingHorizontal: 6,

      paddingVertical: 4,
    },

    counterLarge: {
      paddingHorizontal: 8,

      paddingVertical: 6,
    },

    counterButton: {
      width: 28,

      height: 28,

      borderRadius: 14,

      alignItems: "center",

      justifyContent: "center",

      backgroundColor: theme.background,
    },

    counterButtonPrimary: {
      backgroundColor: theme.primary,
    },

    counterButtonText: {
      fontSize: 18,

      fontWeight: "bold",

      color: theme.textPrimary,
    },

    counterButtonTextWhite: {
      color: theme.background,
    },

    counterValue: {
      marginHorizontal: 14,

      fontSize: 14,

      fontWeight: "600",

      color: theme.textPrimary,
    },

    counterValueLarge: {
      fontSize: 16,

      marginHorizontal: 16,
    },
  });
