import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme as useSystemScheme } from "react-native";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  isDark: boolean;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("themeMode").then((val) => {
      if (val === "light" || val === "dark" || val === "system") {
        setThemeModeState(val);
      }
      setLoaded(true);
    });
  }, []);

  const isDark =
    themeMode === "system"
      ? systemScheme === "dark"
      : themeMode === "dark";

  const toggleTheme = () => {
    const next: ThemeMode = isDark ? "light" : "dark";
    setThemeModeState(next);
    AsyncStorage.setItem("themeMode", next);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem("themeMode", mode);
  };

  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ isDark, themeMode, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
