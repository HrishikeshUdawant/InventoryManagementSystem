import React from "react";
import SmartTable from "../components/SmartTable";

const DEFAULT_COLS = ["Product Name", "Brand", "Category", "Price", "Quantity", "Supplier"];
const DEFAULT_ROW  = { "Product Name": "", Brand: "", Category: "", Price: "", Quantity: "", Supplier: "" };

const COLUMN_OPTIONS = {
  "Product Name": ["Laptop", "Desktop PC", "Mobile Phone", "Tablet", "Monitor", "Keyboard", "Mouse", "Printer", "Headphones"],
  "Category": ["Electronics", "Hardware", "Accessories", "Networking", "Peripherals"],
};

const kpiBuilder = (rows) => {
  const validRows = rows.filter((r) => r["Product Name"]);
  const totalStock = validRows.reduce((s, r) => s + (Number(r.Quantity) || 0), 0);
  const totalValue = validRows.reduce(
    (s, r) => s + (Number(r.Price) || 0) * (Number(r.Quantity) || 0),
    0
  );
  const lowStock = validRows.filter((r) => Number(r.Quantity) < 5 && r.Quantity !== "").length;

  return [
    { label: "Total SKUs",      value: validRows.length,                       color: "#6366f1" },
    { label: "Units in Stock",  value: totalStock.toLocaleString("en-IN"),     color: "#06b6d4" },
    { label: "Inventory Value", value: `₹${totalValue.toLocaleString("en-IN")}`, color: "#10b981" },
    { label: "Low Stock",       value: lowStock,                                color: lowStock > 0 ? "#ef4444" : "#6b7280" },
  ];
};

export default function ProductsPage() {
  return (
    <SmartTable
      storageKey="productTable"
      title="Products"
      icon="📦"
      defaultCols={DEFAULT_COLS}
      defaultRow={DEFAULT_ROW}
      kpiBuilder={kpiBuilder}
      lowStockCol="Quantity"
      columnOptions={COLUMN_OPTIONS}
      accentColor="#6366f1"
    />
  );
}
