import { createContext, useContext } from "react";
import type { ThemeMode } from "../styles/theme";

export type ThemeContextValue = {
  mode: ThemeMode;
  toggleTheme: () => void;
};

export const ThemeModeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

export function useThemeMode() {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error("useThemeMode must be used within AppThemeProvider");
  }

  return context;
}
