// context/ThemeContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NightModeOption = "off" | "on" | "auto";

const STORAGE_KEY = "ovena_night_mode_v1";

export interface ThemeColors {
  background: string;
  card: string;
  cardBorder: string;
  cardSecondary: string;
  inputBg: string;
  overlayBg: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnAccent: string;

  statusBarStyle: "dark-content" | "light-content";
  iconColor: string;
  separatorColor: string;
  actionBtnBg: string;
  actionBtnBorder: string;

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
  isThemeLoaded: boolean;
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

const VALID_MODES: NightModeOption[] = ["off", "on", "auto"];

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue>({
  nightMode: "off",
  setNightMode: () => {},
  isDark: false,
  colors: lightColors,
  isThemeLoaded: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [nightMode, setNightModeState] = useState<NightModeOption>("off");
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  // Fresh read at mount — this is what makes "auto" adopt whatever the
  // device's theme actually is at the moment the app opens, rather than
  // whatever it happened to be during some earlier render.
  const [systemScheme, setSystemScheme] = useState(
    Appearance.getColorScheme() // "light" | "dark" | null
  );

  // ── Load persisted preference on mount ──────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (cancelled) return;
        if (stored && VALID_MODES.includes(stored as NightModeOption)) {
          setNightModeState(stored as NightModeOption);
        }
      })
      .catch((err) => {
        console.warn("[ThemeContext] Failed to load stored night mode:", err);
      })
      .finally(() => {
        if (!cancelled) setIsThemeLoaded(true);
      });
    return () => { cancelled = true; };
  }, []);

  // ── Subscribe to live OS theme changes ──────────────────────────────────
  // useColorScheme() alone doesn't reliably re-render on every native
  // theme-change event (notably Android while foregrounded), so we
  // subscribe directly to Appearance instead.
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      console.log('[Theme] OS appearance changed →', colorScheme);
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  // ── Re-sync to current system theme every time "auto" is (re)selected ──
  // Guarantees switching into auto immediately reflects the device's
  // current appearance, even if Appearance's cached value is momentarily
  // behind (e.g. right after backgrounding/foregrounding).
  useEffect(() => {
    if (nightMode === "auto") {
      setSystemScheme(Appearance.getColorScheme());
    }
  }, [nightMode]);

  // ── Persist on every change ─────────────────────────────────────────────
  const setNightMode = useCallback((mode: NightModeOption) => {
    setNightModeState(mode);
    AsyncStorage.setItem(STORAGE_KEY, mode).catch((err) => {
      console.warn("[ThemeContext] Failed to persist night mode:", err);
    });
  }, []);

  const isDark =
    nightMode === "on"
      ? true
      : nightMode === "off"
      ? false
      : systemScheme === "dark";

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{ nightMode, setNightMode, isDark, colors, isThemeLoaded }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;