// context/ThemeContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useColorScheme } from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NightModeOption = "off" | "on" | "auto";

export interface ThemeColors {
  // Backgrounds
  background: string;
  card: string;
  cardBorder: string;
  cardSecondary: string;
  inputBg: string;
  overlayBg: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnAccent: string;

  // UI elements
  statusBarStyle: "dark-content" | "light-content";
  iconColor: string;
  separatorColor: string;
  actionBtnBg: string;
  actionBtnBorder: string;

  // Accents (stay consistent)
  accentOrange: string;
  accentGreen: string;
  accentRed: string;
  accentYellow: string;
  accentDark: string;
}

export interface ThemeContextValue {
  nightMode: NightModeOption;
  setNightMode: (mode: NightModeOption) => void;
  isDark: boolean;
  colors: ThemeColors;
}

// ─── Palettes ─────────────────────────────────────────────────────────────────

const lightColors: ThemeColors = {
  background: "#FFFFFF",
  card: "#FFFFFF",
  cardBorder: "#000000",
  cardSecondary: "#F4F9FD",
  inputBg: "#F0F0F0",
  overlayBg: "rgba(0,0,0,0.5)",

  textPrimary: "#111111",
  textSecondary: "#555555",
  textMuted: "#999999",
  textOnAccent: "#FFFFFF",

  statusBarStyle: "dark-content",
  iconColor: "#111111",
  separatorColor: "#E0E0E0",
  actionBtnBg: "#F5F5F5",
  actionBtnBorder: "#E8E8E8",

  accentOrange: "#D44C0C",
  accentGreen: "#10AA08",
  accentRed: "#F12100",
  accentYellow: "#FFDA71",
  accentDark: "#1A1A1A",
};

const darkColors: ThemeColors = {
  background: "#0D0D0D",
  card: "#1C1C1E",
  cardBorder: "#3A3A3C",
  cardSecondary: "#2C2C2E",
  inputBg: "#2C2C2E",
  overlayBg: "rgba(0,0,0,0.72)",

  textPrimary: "#F2F2F7",
  textSecondary: "#AEAEB2",
  textMuted: "#636366",
  textOnAccent: "#FFFFFF",

  statusBarStyle: "light-content",
  iconColor: "#F2F2F7",
  separatorColor: "#3A3A3C",
  actionBtnBg: "#2C2C2E",
  actionBtnBorder: "#3A3A3C",

  accentOrange: "#FF6B2B",
  accentGreen: "#30D158",
  accentRed: "#FF453A",
  accentYellow: "#FFD60A",
  accentDark: "#F2F2F7",
};

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue>({
  nightMode: "off",
  setNightMode: () => {},
  isDark: false,
  colors: lightColors,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemScheme = useColorScheme(); // "light" | "dark" | null
  const [nightMode, setNightModeState] = useState<NightModeOption>("off");

  const setNightMode = useCallback((mode: NightModeOption) => {
    setNightModeState(mode);
  }, []);

  const isDark =
    nightMode === "on"
      ? true
      : nightMode === "off"
      ? false
      : systemScheme === "dark";

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ nightMode, setNightMode, isDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;