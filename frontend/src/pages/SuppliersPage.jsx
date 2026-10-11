import React from "react";
import SmartTable from "../components/SmartTable";

const DEFAULT_COLS = ["Supplier Name", "Contact Person", "Email", "Phone", "City", "Products Supplied", "Rating", "Status"];
const DEFAULT_ROW  = {
  "Supplier Name": "",
  "Contact Person": "",
  Email: "",
  Phone: "",
  City: "",
  "Products Supplied": "",
  Rating: "",
  Status: "Active",
};

const COLUMN_OPTIONS = {
  "Status": ["Active", "Inactive", "Blacklisted"],
  "Rating": ["1", "2", "3", "4", "5"],
};

const kpiBuilder = (rows) => {
  const validRows = rows.filter((r) => r["Supplier Name"]);
  const active = validRows.filter((r) => (r.Status || "").toLowerCase() === "active").length;
  const ratings = validRows.map((r) => Number(r.Rating)).filter((n) => !isNaN(n) && n > 0);
  const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "—";

  return [
    { label: "Total Suppliers", value: validRows.length, color: "#06b6d4" },
    { label: "Active",          value: active,            color: "#10b981" },
    { label: "Inactive",        value: validRows.length - active, color: "#ef4444" },
    { label: "Avg Rating",      value: avgRating,         color: "#f59e0b" },
  ];
};

export default function SuppliersPage() {
  return (
    <SmartTable
      storageKey="suppliersTable"
      title="Suppliers"
      icon="🚚"
      defaultCols={DEFAULT_COLS}
      defaultRow={DEFAULT_ROW}
      kpiBuilder={kpiBuilder}
      columnOptions={COLUMN_OPTIONS}
      accentColor="#06b6d4"
    />
  );
}
