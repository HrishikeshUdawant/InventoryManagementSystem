import React from "react";
import SmartTable from "../components/SmartTable";

const DEFAULT_COLS = ["Software Name", "Version", "License Key", "Assigned To", "Expiry Date", "Quantity"];
const DEFAULT_ROW  = { "Software Name": "", Version: "", "License Key": "", "Assigned To": "", "Expiry Date": "", Quantity: "" };

const COLUMN_OPTIONS = {
  "Software Name": ["Windows 11 Pro", "Microsoft Office 365", "Adobe Creative Cloud", "Visual Studio Code", "AutoCAD", "JetBrains IntelliJ IDE"],
};

const kpiBuilder = (rows) => {
  const validRows = rows.filter((r) => r["Software Name"]);
  const totalLicenses = validRows.reduce((s, r) => s + (Number(r.Quantity) || 0), 0);
  const assigned = validRows.filter((r) => r["Assigned To"] && r["Assigned To"].trim() !== "").length;

  return [
    { label: "Software Titles",    value: validRows.length,                    color: "#8b5cf6" },
    { label: "Total Licenses",     value: totalLicenses.toLocaleString("en-IN"), color: "#06b6d4" },
    { label: "Currently Assigned", value: assigned,                             color: "#f59e0b" },
    { label: "Unassigned",         value: validRows.length - assigned,           color: "#10b981" },
  ];
};

export default function SoftwarePage() {
  return (
    <SmartTable
      storageKey="softwareTable"
      title="Software"
      icon="💻"
      defaultCols={DEFAULT_COLS}
      defaultRow={DEFAULT_ROW}
      kpiBuilder={kpiBuilder}
      lowStockCol="Quantity"
      columnOptions={COLUMN_OPTIONS}
      accentColor="#8b5cf6"
    />
  );
}
