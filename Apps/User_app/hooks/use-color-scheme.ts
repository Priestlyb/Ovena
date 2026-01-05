import { useColorScheme as _useColorScheme } from "react-native";

export const Colors = {
  light: {
    primary: "#FF6B00",
    secondary: "#0E0E10",

    background: "#FFFFFF",
    surface: "#F7F7F7",

    textPrimary: "#111111",
    textSecondary: "#6B6B6B",

    icon: "#1C1C1E",
    border: "#E5E5EA",

    success: "#2ECC71",
    warning: "#F1C40F",
    error: "#E74C3C",

    transparent: "transparent",
  },

  dark: {
    primary: "#FF6B00",
    secondary: "#FFFFFF",

    background: "#0E0E10",
    surface: "#1C1C1E",

    textPrimary: "#FFFFFF",
    textSecondary: "#A1A1AA",

    icon: "#F4F4F5",
    border: "#2C2C2E",

    success: "#2ECC71",
    warning: "#F1C40F",
    error: "#E74C3C",

    transparent: "transparent",
  },
} as const;

export function useColorScheme(): "light" | "dark" {
  const colorScheme = _useColorScheme();

  return colorScheme === "dark" ? "dark" : "light";
}
