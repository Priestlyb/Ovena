// context/ThemeContext.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "system" | "light" | "dark";

type ThemeContextType = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType>({
  themeMode: "system",
  setThemeMode: async () => {},
});

const STORAGE_KEY = "theme-mode";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const value = await AsyncStorage.getItem(STORAGE_KEY);

        if (value === "light" || value === "dark" || value === "system") {
          setThemeModeState(value);
        }
      } catch (error) {
        console.warn("Failed to load theme preference:", error);
      }
    };

    loadTheme();
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(STORAGE_KEY, mode);
    } catch (error) {
      console.warn("Failed to save theme preference:", error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemePreference() {
  return useContext(ThemeContext);
}
