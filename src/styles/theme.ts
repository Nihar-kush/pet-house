export type ThemeMode = "light" | "dark";

export type Theme = {
  mode: ThemeMode;
  colors: {
    background: string;
    surface: string;
    surfaceStrong: string;
    surfaceInverse: string;
    text: string;
    textMuted: string;
    textInverse: string;
    border: string;
    primary: string;
    primaryHover: string;
    primaryText: string;
    accent: string;
    shadow: string;
    focus: string;
  };
  layout: {
    maxWidth: string;
    headerHeight: string;
  };
  radii: {
    sm: string;
    md: string;
    lg: string;
    pill: string;
  };
  space: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
};

const shared = {
  layout: {
    maxWidth: "1440px",
    headerHeight: "74px",
  },
  radii: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    pill: "999px",
  },
  space: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
};

export const lightTheme: Theme = {
  mode: "light",
  colors: {
    background: "#ffffff",
    surface: "#ffffff",
    surfaceStrong: "#f5f5f5",
    surfaceInverse: "#111111",
    text: "#313131",
    textMuted: "#6f6f6f",
    textInverse: "#ffffff",
    border: "#d0d0d0",
    primary: "#111111",
    primaryHover: "#313131",
    primaryText: "#ffffff",
    accent: "#111111",
    shadow: "0 18px 40px rgba(0, 0, 0, 0.14)",
    focus: "#111111",
  },
  ...shared,
};

export const darkTheme: Theme = {
  mode: "dark",
  colors: {
    background: "#0f0f0f",
    surface: "#141414",
    surfaceStrong: "#202020",
    surfaceInverse: "#ffffff",
    text: "#f4f4f4",
    textMuted: "#b8b8b8",
    textInverse: "#111111",
    border: "#2b2b2b",
    primary: "#ffffff",
    primaryHover: "#e8e8e8",
    primaryText: "#111111",
    accent: "#ffffff",
    shadow: "0 18px 40px rgba(0, 0, 0, 0.34)",
    focus: "#ffffff",
  },
  ...shared,
};
