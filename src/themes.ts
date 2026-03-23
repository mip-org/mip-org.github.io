import { createTheme } from "@mui/material/styles";

const baseTypography = {
  fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  h1: { fontWeight: 700, fontSize: "3rem", lineHeight: 1.2 },
  h2: { fontWeight: 700, fontSize: "2rem", lineHeight: 1.3 },
  h3: { fontWeight: 600, fontSize: "1.5rem", lineHeight: 1.4 },
  h4: { fontWeight: 600, fontSize: "1.25rem", lineHeight: 1.4 },
  body1: { fontSize: "1rem", lineHeight: 1.7 },
  body2: { fontSize: "0.875rem", lineHeight: 1.6 },
};

const baseComponents = {
  MuiButton: {
    styleOverrides: {
      root: { textTransform: "none", fontWeight: 600, borderRadius: 8 },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: { borderRadius: 12 },
    },
  },
};

// Light 1: Clean Blue
const lightBlue = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1565C0", light: "#42A5F5", dark: "#0D47A1" },
    secondary: { main: "#7C4DFF" },
    background: { default: "#F8FAFC", paper: "#FFFFFF" },
    text: { primary: "#1E293B", secondary: "#64748B" },
  },
  typography: baseTypography,
  components: {
    ...baseComponents,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: "linear-gradient(160deg, #EBF0FF 0%, #F8FAFC 30%, #E8F4FD 60%, #F3F0FF 100%)",
          backgroundAttachment: "scroll",
          minHeight: "100vh",
        },
      },
    },
  },
});

// Light 2: Warm Sand
const lightWarm = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#B45309", light: "#D97706", dark: "#92400E" },
    secondary: { main: "#059669" },
    background: { default: "#FFFBF5", paper: "#FFFFFF" },
    text: { primary: "#292524", secondary: "#78716C" },
  },
  typography: baseTypography,
  components: {
    ...baseComponents,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: "linear-gradient(160deg, #FDE8CD 0%, #FFFBF5 30%, #FEF0DC 60%, #E8F5E9 100%)",
          backgroundAttachment: "scroll",
          minHeight: "100vh",
        },
      },
    },
  },
});

// Dark 1: Navy Electric
const darkNavy = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#60A5FA", light: "#93C5FD", dark: "#3B82F6" },
    secondary: { main: "#A78BFA" },
    background: { default: "#0B1120", paper: "#111827" },
    text: { primary: "#F1F5F9", secondary: "#94A3B8" },
  },
  typography: baseTypography,
  components: {
    ...baseComponents,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: "linear-gradient(160deg, #0B1120 0%, #121B3A 30%, #0B1120 55%, #16132B 100%)",
          backgroundAttachment: "scroll",
          minHeight: "100vh",
        },
      },
    },
  },
});

// Dark 2: Terminal Green
const darkTerminal = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#4ADE80", light: "#86EFAC", dark: "#22C55E" },
    secondary: { main: "#38BDF8" },
    background: { default: "#0A0F0A", paper: "#111611" },
    text: { primary: "#E2E8E2", secondary: "#8CA38C" },
  },
  typography: baseTypography,
  components: {
    ...baseComponents,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: "linear-gradient(160deg, #0A0F0A 0%, #0F1F0F 30%, #0A0F0A 55%, #0A1518 100%)",
          backgroundAttachment: "scroll",
          minHeight: "100vh",
        },
      },
    },
  },
});

export const themes = {
  "Light Blue": lightBlue,
  "Light Warm": lightWarm,
  "Dark Navy": darkNavy,
  "Dark Terminal": darkTerminal,
} as const;

export type ThemeName = keyof typeof themes;
export const themeNames = Object.keys(themes) as ThemeName[];
export const defaultTheme: ThemeName = "Dark Navy";
