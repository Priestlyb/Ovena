import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/constants/theme";

type Props = {
  visible: boolean;
  onPress: () => void;
};

export default function BackToTopButton({ visible, onPress }: Props) {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: theme.primary,
          shadowColor: theme.secondary,
        },
      ]}
      onPress={onPress}
    >
      <Ionicons name="arrow-up" size={22} color={"#fff"} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
});
