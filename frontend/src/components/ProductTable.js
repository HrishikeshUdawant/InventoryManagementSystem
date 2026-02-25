import React, { useState, useEffect } from "react";

const LOW_STOCK_LIMIT = 5;

export default function ProductTable() {
  // ✅ Load saved table from localStorage
  const savedData = JSON.parse(localStorage.getItem("productTable"));

  const [columns, setColumns] = useState(
    savedData?.columns || ["Product Name", "Price", "Quantity"]
  );

  const [rows, setRows] = useState(
    savedData?.rows || [{ "Product Name": "", Price: "", Quantity: "" }]
  );

  // ✅ Error State
  const [error, setError] = useState("");

  // ✅ Audit Logs State
  const [logs, setLogs] = useState([]);

  // ✅ Auto Save Table
  useEffect(() => {
    localStorage.setItem("productTable", JSON.stringify({ columns, rows }));
  }, [columns, rows]);

  // ✅ Add Log Helper
  const addLog = (message) => {
    const time = new Date().toLocaleTimeString();
    setLogs([{ time, message }, ...logs]);
  };

  // ✅ Validation Function
  const validateRow = (row) => {
    if (!row["Product Name"] || row["Product Name"].trim() === "") {
      return "Product Name is required!";
    }

    if (row["Price"] && Number(row["Price"]) <= 0) {
      return "Price must be greater than 0!";
    }

    if (row["Quantity"] && Number(row["Quantity"]) < 0) {
      return "Quantity cannot be negative!";
    }

    return null;
  };

  // ✅ Add Row
  const addRow = () => {
    let newRow = {};
    columns.forEach((col) => {
      newRow[col] = "";
    });

    setRows([...rows, newRow]);
    addLog("➕ New Row Added");
  };

  // ✅ Remove Row
  const removeRow = (index) => {
    let updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    addLog("🗑 Row Removed");
  };

  // ✅ Add Column
  const addColumn = () => {
    let colName = prompt("Enter New Column Name:");

    if (!colName) return;

    if (columns.includes(colName)) {
      alert("Column already exists!");
      return;
    }

    setColumns([...columns, colName]);

    let updatedRows = rows.map((row) => ({
      ...row,
      [colName]: "",
    }));

    setRows(updatedRows);
    addLog(`➕ Column Added: ${colName}`);
  };

  // ✅ Remove Column
  const removeColumn = (colName) => {
    if (window.confirm(`Remove column "${colName}"?`)) {
      let updatedColumns = columns.filter((c) => c !== colName);

      let updatedRows = rows.map((row) => {
        let newRow = { ...row };
        delete newRow[colName];
        return newRow;
      });

      setColumns(updatedColumns);
      setRows(updatedRows);

      addLog(`❌ Column Removed: ${colName}`);
    }
  };

  // ✅ Handle Cell Edit + Validation
  const handleChange = (rowIndex, colName, value) => {
    let updatedRows = [...rows];
    updatedRows[rowIndex][colName] = value;

    // Validate Row
    const errMsg = validateRow(updatedRows[rowIndex]);

    if (errMsg) {
      setError(errMsg);
    } else {
      setError("");
    }

    setRows(updatedRows);
    addLog(`✏ Updated ${colName} in Row ${rowIndex + 1}`);
  };

  // ✅ Download CSV
  const downloadCSV = () => {
    let csv = "";
    csv += columns.join(",") + "\n";

    rows.forEach((row) => {
      let values = columns.map((col) => row[col] || "");
      csv += values.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();

    addLog("⬇ CSV Downloaded");
  };

  // ✅ Upload CSV
  const uploadCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;

      const lines = text.split("\n").filter((line) => line.trim() !== "");
      if (lines.length === 0) return;

      const headers = lines[0].split(",").map((h) => h.trim());

      const newRows = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim());

        let rowObj = {};
        headers.forEach((header, index) => {
          rowObj[header] = values[index] || "";
        });

        return rowObj;
      });

      setColumns(headers);
      setRows(newRows);

      addLog("📂 CSV Uploaded Successfully");
    };

    reader.readAsText(file);
  };

  // ✅ Upload Excel File (.xls/.xlsx)
const uploadExcel = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);

    // Import XLSX Library
    const XLSX = require("xlsx");

    // Read Workbook
    const workbook = XLSX.read(data, { type: "array" });

    // Get First Sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert Sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    if (jsonData.length === 0) return;

    // Extract Columns
    const headers = Object.keys(jsonData[0]);

    // Update Table
    setColumns(headers);
    setRows(jsonData);

    addLog("📂 Excel File Uploaded Successfully");
  };

  reader.readAsArrayBuffer(file);
};

  // ✅ Clear Table
  const clearTable = () => {
    if (window.confirm("Clear full table?")) {
      localStorage.removeItem("productTable");
      setColumns(["Product Name", "Price", "Quantity"]);
      setRows([{ "Product Name": "", Price: "", Quantity: "" }]);

      addLog("❌ Table Cleared");
    }
  };

  // ✅ Reports & Analytics
  const totalProducts = rows.length;

  const totalStock = rows.reduce(
    (sum, row) => sum + (Number(row["Quantity"]) || 0),
    0
  );

  const totalValue = rows.reduce(
    (sum, row) =>
      sum +
      (Number(row["Price"]) || 0) * (Number(row["Quantity"]) || 0),
    0
  );

  return (
    <div>
      <h2>📦 Products Table (Step 2 Complete)</h2>

      {/* ✅ Analytics */}
      <div style={{ marginBottom: 15 }}>
        <h3>📊 Inventory Analytics</h3>
        <p>✅ Total Items: {totalProducts}</p>
        <p>📦 Total Stock Quantity: {totalStock}</p>
        <p>💰 Total Inventory Value: ₹{totalValue}</p>
      </div>

      {/* ✅ Error */}
      {error && (
        <p style={{ color: "red", fontWeight: "bold" }}>❌ {error}</p>
      )}

      {/* Buttons */}
      <div style={{ marginBottom: 15 }}>
        <button onClick={addRow} style={btnStyle}>
          ➕ Add Row
        </button>

        <button onClick={addColumn} style={btnStyle}>
          ➕ Add Column
        </button>

        <button onClick={downloadCSV} style={btnStyle}>
          ⬇ Download CSV
        </button>

        <label style={{ ...btnStyle, background: "green" }}>
          📂 Upload CSV
          <input
            type="file"
            accept=".csv"
            onChange={uploadCSV}
            style={{ display: "none" }}
          />
        </label>
        {/* Upload Excel */}
        <label style={{ ...btnStyle, background: "purple" }}>
          📊 Upload Excel
          <input
            type="file"
            accept=".xls,.xlsx"
            onChange={uploadExcel}
            style={{ display: "none" }}
          />
        </label>

        <button
          onClick={clearTable}
          style={{ ...btnStyle, background: "red" }}
        >
          ❌ Clear Table
        </button>
      </div>

      {/* Table */}
      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>
                {col}
                <button
                  onClick={() => removeColumn(col)}
                  style={smallBtn}
                >
                  ✖
                </button>
              </th>
            ))}
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  <input
                    type="text"
                    value={row[col]}
                    onChange={(e) =>
                      handleChange(rowIndex, col, e.target.value)
                    }
                    style={{
                      width: "90%",
                      border:
                        col === "Quantity" &&
                        Number(row[col]) < LOW_STOCK_LIMIT
                          ? "2px solid red"
                          : "1px solid gray",
                    }}
                  />

                  {/* Low Stock Alert */}
                  {col === "Quantity" &&
                    row[col] !== "" &&
                    Number(row[col]) < LOW_STOCK_LIMIT && (
                      <p style={{ color: "red", fontSize: "12px" }}>
                        ⚠ Low Stock!
                      </p>
                    )}
                </td>
              ))}

              <td>
                <button
                  onClick={() => removeRow(rowIndex)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  Delete Row
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Audit Logs */}
      <div style={{ marginTop: 20 }}>
        <h3>📜 Audit History (Last 5 Actions)</h3>
        <ul>
          {logs.slice(0, 5).map((log, i) => (
            <li key={i}>
              [{log.time}] {log.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* Styles */
const btnStyle = {
  marginRight: 10,
  padding: "8px 14px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const smallBtn = {
  marginLeft: 8,
  background: "black",
  color: "white",
  border: "none",
  cursor: "pointer",
  padding: "2px 6px",
  borderRadius: "50%",
};
