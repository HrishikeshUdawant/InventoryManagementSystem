import React, { useState } from "react";
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

import {
  SignedIn,
  SignedOut,
  SignIn,
} from "@clerk/clerk-react";

export default function App() {
  const [selected, setSelected] = useState("Dashboard");

  const renderPage = () => {
    switch (selected) {
      case "Dashboard":
        return <DashboardPage />;

      case "Products":
        return <ProductsPage />;

      case "Software":
        return <SoftwarePage />;

      case "Categories":
        return <CategoriesPage />;

      case "Suppliers":
        return <SuppliersPage />;

      case "Stock Movement":
        return <StockMovementPage />;

      case "Reports":
        return <ReportsPage />;

      case "Settings":
        return <SettingsPage />;

      default:
        return <DashboardPage />;
    }
  };

  return (
    <>
      {/* Clerk Login Screen */}
      <SignedOut>
        <SignIn routing="hash" />
      </SignedOut>

      {/* Your App After Login */}
      <SignedIn>
        <div style={{ display: "flex" }}>
          <Sidebar selected={selected} setSelected={setSelected} />
          <div style={{ flexGrow: 1, padding: 20 }}>
            {renderPage()}
          </div>
        </div>
      </SignedIn>
    </>
  );
}