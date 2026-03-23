import { createContext, useContext, useState, type ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { themes, defaultTheme } from "./themes";
import type { ThemeName } from "./themes";

interface ThemeContextType {
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeName: defaultTheme,
  setThemeName: () => {},
});

export function useThemeContext() {
  return useContext(ThemeContext);
}

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    const saved = localStorage.getItem("mip-theme");
    return saved && saved in themes ? (saved as ThemeName) : defaultTheme;
  });

  const handleSetTheme = (name: ThemeName) => {
    setThemeName(name);
    localStorage.setItem("mip-theme", name);
  };

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName: handleSetTheme }}>
      <MuiThemeProvider theme={themes[themeName]}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
