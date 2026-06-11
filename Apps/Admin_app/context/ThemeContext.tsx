/**
 * context/ThemeContext.tsx
 *
 * Provides the active ThemeColors object to every component in the tree.
 *
 * Behaviour:
 *  - On mount, reads the device colour scheme via useColorScheme().
 *  - Automatically re-renders when the OS scheme changes (e.g. auto dark mode
 *    at sunset).
 *  - Exposes `toggleTheme()` so the user can manually override the system
 *    preference — the override is stored in AsyncStorage and rehydrated on
 *    next launch.
 *  - `isDark` is a convenience boolean for the rare case where a component
 *    needs to branch on the mode directly.
 *
 * Usage:
 *   // Wrap your root layout:
 *   <ThemeProvider>…</ThemeProvider>
 *
 *   // Consume anywhere:
 *   const { colors, isDark, toggleTheme } = useTheme();
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeColors, DarkColors, LightColors } from '@/constants/theme';

// ─── Storage key ─────────────────────────────────────────────────────────────
const THEME_OVERRIDE_KEY = '@ovena/theme_override';
type ThemeOverride = 'dark' | 'light' | null;

// ─── Context shape ────────────────────────────────────────────────────────────
interface ThemeContextValue {
  colors:       ThemeColors;
  isDark:       boolean;
  toggleTheme:  () => void;
  /** 'system' means following device; 'dark'/'light' is a user override */
  themeSource:  'system' | 'dark' | 'light';
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceScheme = useColorScheme(); // 'dark' | 'light' | null
  const [override, setOverride] = useState<ThemeOverride>(null);
  const [hydrated, setHydrated] = useState(false);

  // Rehydrate override from storage on mount
  useEffect(() => {
    AsyncStorage.getItem(THEME_OVERRIDE_KEY)
      .then((stored) => {
        if (stored === 'dark' || stored === 'light') {
          setOverride(stored);
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  // Resolve the active mode: user override wins, then device, then dark default
  const activeMode: 'dark' | 'light' = useMemo(() => {
    if (override) return override;
    return deviceScheme === 'light' ? 'light' : 'dark';
  }, [override, deviceScheme]);

  const isDark = activeMode === 'dark';
  const colors = isDark ? DarkColors : LightColors;

  const themeSource: ThemeContextValue['themeSource'] = override ?? 'system';

  const toggleTheme = useCallback(() => {
    const next: ThemeOverride = isDark ? 'light' : 'dark';
    setOverride(next);
    AsyncStorage.setItem(THEME_OVERRIDE_KEY, next).catch(() => {
      // Non-fatal — preference just won't survive relaunch
    });
  }, [isDark]);

  // Don't render children until we've read AsyncStorage to prevent a
  // single-frame flash of the wrong theme.
  if (!hydrated) return null;

  return (
    <ThemeContext.Provider value={{ colors, isDark, toggleTheme, themeSource }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme() must be used inside <ThemeProvider>');
  }
  return ctx;
}