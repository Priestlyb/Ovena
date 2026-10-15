// /constants/theme.ts

import { useColorScheme } from "react-native";

import { useThemePreference } from "@/context/ThemeContext";

export type ThemeColors = {
  mode: "light" | "dark";

  primary: string;
  secondary: string;
  decorCircle: string;
  profilebackground: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  icon: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  transparent: string;
};

export type ColorsType = {
  light: ThemeColors;
  dark: ThemeColors;
};

export const Colors: ColorsType = {
  light: {
    mode: "light",

    primary: "#D9502E",
    secondary: "#0E0E10",
    decorCircle: "#D9502E25",
    profilebackground: "#f6d44fff",
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
    mode: "dark",

    primary: "#D9502E",
    secondary: "#FFFFFF",
    decorCircle: "#FF7A4D1F",
    profilebackground: "#0E0E10",
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
};

export function useTheme(): ThemeColors {
  const systemScheme = useColorScheme();

  const { themeMode } = useThemePreference();

  const activeMode =
    themeMode === "system"
      ? systemScheme
      : themeMode;

  return activeMode === "dark"
    ? Colors.dark
    : Colors.light;
}