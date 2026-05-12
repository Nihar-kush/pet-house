import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { darkTheme, lightTheme, type ThemeMode } from "../styles/theme";
import { ThemeModeContext } from "./themeModeContext";

const getInitialMode = (): ThemeMode => {
  const savedMode = window.localStorage.getItem("pet-house-theme");

  if (savedMode === "light" || savedMode === "dark") {
    return savedMode;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  useEffect(() => {
    window.localStorage.setItem("pet-house-theme", mode);
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleTheme: () =>
        setMode((currentMode) => (currentMode === "light" ? "dark" : "light")),
    }),
    [mode],
  );

  const theme = mode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeModeContext.Provider value={value}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeModeContext.Provider>
  );
}
