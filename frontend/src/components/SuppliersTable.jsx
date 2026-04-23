import React, { useState, useEffect, useRef } from "react";

const LOW_STOCK_LIMIT = 5;

/* ================= PRODUCT OPTIONS ================= */

const PRODUCT_OPTIONS_KEY = "SuppliersTable";

const getProductOptions = () =>
  JSON.parse(localStorage.getItem(PRODUCT_OPTIONS_KEY)) || [
    "Laptop",
    "Mobile",
    "Monitor",
    "Keyboard",
  ];

/* ⭐ Detect Product-like Columns Automatically */

const isProductColumn = (col) => {
  const name = col.toLowerCase();

  return (
    name.includes("product") ||
    name.includes("item") ||
    name.includes("device") ||
    name.includes("software") ||
    name.includes("asset") ||
    name.includes("name")
  );
};

export default function ProductTable() {

  const savedData = JSON.parse(localStorage.getItem("productTable"));

  const [columns, setColumns] = useState(
    savedData?.columns || ["Product Name", "Price", "Quantity"]
  );

  const [rows, setRows] = useState(
    savedData?.rows || [{ "Product Name": "", Price: "", Quantity: "" }]
  );

  const [productOptions] = useState(getProductOptions());
  const [error, setError] = useState("");
  const [logs, setLogs] = useState([]);

  const fileInputRef = useRef(null);

  /* ================= AUTO SAVE ================= */

  useEffect(() => {
    localStorage.setItem("productTable", JSON.stringify({ columns, rows }));
  }, [columns, rows]);

  /* ================= LOG ================= */

  const addLog = (message) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [{ time, message }, ...prev]);
  };

  /* ================= VALIDATION ================= */

  const validateRow = (row) => {
    if (!row["Product Name"]) return null;

    if (row.Price && Number(row.Price) <= 0)
      return "Price must be greater than 0!";

    if (row.Quantity && Number(row.Quantity) < 0)
      return "Quantity cannot be negative!";

    return null;
  };

  /* ================= ADD ROW ================= */

  const addRow = () => {
    let newRow = {};
    columns.forEach((c) => (newRow[c] = ""));
    setRows([newRow, ...rows]);

    addLog("➕ Row Added");
  };

  /* ================= REMOVE ROW ================= */

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
    addLog("🗑 Row Removed");
  };

  /* ================= ADD COLUMN ================= */

  const addColumn = () => {
    let colName = prompt("Enter New Column Name:");
    if (!colName) return;

    let position = prompt(`Insert column position (1-${columns.length + 1})`);

    position = Number(position) - 1;

    if (isNaN(position) || position < 0)
      position = columns.length;

    const newColumns = [...columns];
    newColumns.splice(position, 0, colName);

    const updatedRows = rows.map((r) => ({
      ...r,
      [colName]: "",
    }));

    setColumns(newColumns);
    setRows(updatedRows);

    addLog(`➕ Column Added: ${colName}`);
  };

  /* ================= REMOVE COLUMN ================= */

  const removeColumn = (colName) => {

    if (!window.confirm(`Remove ${colName}?`)) return;

    const updatedColumns = columns.filter((c) => c !== colName);

    const updatedRows = rows.map((row) => {
      const r = { ...row };
      delete r[colName];
      return r;
    });

    setColumns(updatedColumns);
    setRows(updatedRows);
  };

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (rowIndex, colName, value) => {

    const updatedRows = [...rows];
    updatedRows[rowIndex][colName] = value;

    const err = validateRow(updatedRows[rowIndex]);
    setError(err || "");

    setRows(updatedRows);
  };

  /* ================= CSV UPLOAD ================= */

  const handleCSVUpload = (event) => {

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {

      const text = e.target.result;

      const lines = text.split("\n").filter((l) => l.trim() !== "");

      const headers = lines[0].split(",");

      const newRows = lines.slice(1).map((line) => {

        const values = line.split(",");

        let row = {};

        headers.forEach((h, i) => {
          row[h.trim()] = values[i] ? values[i].trim() : "";
        });

        return row;
      });

      setColumns(headers);
      setRows(newRows);

      addLog("📂 CSV Uploaded");
    };

    reader.readAsText(file);
  };

  /* ================= DELETE CSV ================= */

  const deleteCSV = () => {

    if (!window.confirm("Delete CSV data?")) return;

    setColumns(["Product Name", "Price", "Quantity"]);
    setRows([{ "Product Name": "", Price: "", Quantity: "" }]);

    localStorage.removeItem("productTable");

    addLog("🗑 CSV Data Deleted");
  };

  /* ================= ANALYTICS ================= */

  const totalProducts = rows.length;

  const totalStock = rows.reduce(
    (s, r) => s + (Number(r.Quantity) || 0),
    0
  );

  const totalValue = rows.reduce(
    (s, r) => s + (Number(r.Price) || 0) * (Number(r.Quantity) || 0),
    0
  );

  /* ================= UI ================= */

  return (
    <div>

      <h2>📦 Products Table</h2>

      <h3>📊 Inventory Analytics</h3>

      <p>Total Items: {totalProducts}</p>
      <p>Total Stock: {totalStock}</p>
      <p>Total Value: ₹{totalValue}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: 15 }}>

        <button onClick={addRow} style={btnStyle}>➕ Add Row</button>

        <button onClick={addColumn} style={btnStyle}>➕ Add Column</button>

        <button
          onClick={() => fileInputRef.current.click()}
          style={btnStyle}
        >
          📂 Upload CSV
        </button>

        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleCSVUpload}
          style={{ display: "none" }}
        />

        <button
          onClick={deleteCSV}
          style={{ ...btnStyle, background: "red" }}
        >
          🗑 Delete CSV
        </button>

      </div>

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

                  {isProductColumn(col) ? (

                    <select
                      value={row[col]}
                      onChange={(e) =>
                        handleChange(rowIndex, col, e.target.value)
                      }
                      style={{ width: "95%" }}
                    >

                      <option value="">Select</option>

                      {productOptions.map((p, i) => (
                        <option key={i} value={p}>
                          {p}
                        </option>
                      ))}

                    </select>

                  ) : (

                    <input
                      type="text"
                      value={row[col]}
                      onChange={(e) =>
                        handleChange(rowIndex, col, e.target.value)
                      }
                      style={{
                        width: "90%",
                        border:
                          col.toLowerCase().includes("quantity") &&
                          Number(row[col]) < LOW_STOCK_LIMIT
                            ? "2px solid red"
                            : "1px solid gray",
                      }}
                    />

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
                  }}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <h3>📜 Audit History</h3>

      <ul>
        {logs.slice(0, 5).map((l, i) => (
          <li key={i}>
            [{l.time}] {l.message}
          </li>
        ))}
      </ul>

    </div>
  );
}

/* ================= STYLES ================= */

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