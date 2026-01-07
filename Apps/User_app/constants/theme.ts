type ThemeColors = {
  primary: string;
  secondary: string;
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

type ColorsType = {
  light: ThemeColors;
  dark: ThemeColors;
};

export const Colors: ColorsType = {
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
};
