import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ThemeContextProvider from "./theme/ThemeContext";
import AuthProvider from "./auth/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthProvider>
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>
  </AuthProvider>
);
