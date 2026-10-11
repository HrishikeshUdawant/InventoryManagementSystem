import React from "react";
import SmartTable from "../components/SmartTable";

const DEFAULT_COLS = ["Category Name", "Description", "Parent Category", "Product Count", "Status"];
const DEFAULT_ROW  = { "Category Name": "", Description: "", "Parent Category": "", "Product Count": "", Status: "Active" };

const COLUMN_OPTIONS = {
  "Category Name": ["Electronics", "Furniture", "Office Supplies", "Networking", "Software", "Hardware", "Accessories"],
  "Status": ["Active", "Inactive", "Discontinued"],
};

const kpiBuilder = (rows) => {
  const validRows = rows.filter((r) => r["Category Name"]);
  const totalProducts = validRows.reduce((s, r) => s + (Number(r["Product Count"]) || 0), 0);
  const active = validRows.filter((r) => (r.Status || "").toLowerCase() === "active").length;

  return [
    { label: "Total Categories",  value: validRows.length,                       color: "#f59e0b" },
    { label: "Products Covered",  value: totalProducts.toLocaleString("en-IN"),  color: "#06b6d4" },
    { label: "Active",            value: active,                                  color: "#10b981" },
    { label: "Inactive",          value: validRows.length - active,               color: "#6b7280" },
  ];
};

export default function CategoriesPage() {
  return (
    <SmartTable
      storageKey="categoriesTable"
      title="Categories"
      icon="🏷️"
      defaultCols={DEFAULT_COLS}
      defaultRow={DEFAULT_ROW}
      kpiBuilder={kpiBuilder}
      columnOptions={COLUMN_OPTIONS}
      accentColor="#f59e0b"
    />
  );
}
