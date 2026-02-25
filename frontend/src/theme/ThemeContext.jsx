import React, { createContext, useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export const ColorModeContext = createContext();

export default function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("themeMode");
    if (saved) setMode(saved);
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,

          ...(mode === "light"
            ? {
                background: {
                  default: "#f5f6fa",    // Light gray smooth background
                  paper: "#ffffff",
                },
                text: {
                  primary: "#1a1a1a",
                  secondary: "#606060",
                },
                primary: {
                  main: "#1976d2",
                },
              }
            : {
                background: {
                  default: "#121212",     // Deep modern dark mode like GitHub
                  paper: "#1e1e1e",
                },
                text: {
                  primary: "#ffffff",
                  secondary: "rgba(255, 255, 255, 0.7)",
                },
                primary: {
                  main: "#90caf9",      // Softer, smooth blue for dark mode
                },
              }),
        },

        typography: {
          fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
        },

        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                transition: "background-color 0.3s ease, color 0.3s ease",
              },
            },
          },

          MuiAppBar: {
            styleOverrides: {
              colorPrimary: {
                backgroundColor: mode === "light" ? "#ffffff" : "#1e1e1e",
                color: mode === "light" ? "#000" : "#fff",
              },
            },
          },

          MuiDrawer: {
            styleOverrides: {
              paper: {
                transition: "width 0.3s ease",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
