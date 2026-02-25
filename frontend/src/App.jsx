import React, { useContext, useState } from "react";
import { AuthContext } from "./auth/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import Sidebar from "./layout/Sidebar";

// Pages
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import SuppliersPage from "./pages/SuppliersPage";
import StockMovementPage from "./pages/StockMovementPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import SoftwarePage from "./pages/SoftwarePage";



export default function App() {
  const { isAuthenticated } = useContext(AuthContext);
  const [authScreen, setAuthScreen] = useState("login");
  const [selected, setSelected] = useState("Dashboard");

  const switchToSignup = () => setAuthScreen("signup");
  const switchToLogin = () => setAuthScreen("login");

  if (!isAuthenticated) {
    return authScreen === "login" ? (
      <LoginPage switchToSignup={switchToSignup} />
    ) : (
      <SignupPage switchToLogin={switchToLogin} />
    );
  }

  const renderPage = () => {
    switch (selected) {
      case "Dashboard": return <DashboardPage />;
      case "Products": return <ProductsPage />;
      case "Software": return < SoftwarePage/>;
      case "Categories": return <CategoriesPage />;
      case "Suppliers": return <SuppliersPage />;
      case "Stock Movement": return <StockMovementPage />;
      case "Reports": return <ReportsPage />;
      case "Settings": return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar selected={selected} setSelected={setSelected} />
      <div style={{ flexGrow: 1, padding: 20 }}>{renderPage()}</div>
    </div>
  );
}
