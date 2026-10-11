import React, { useState, useEffect } from "react";
import {
  getAssets,
  getMovements,
  addAsset,
  assignAsset,
  returnAsset,
} from "../utils/assetManager";

/* ============================================================
   STOCK MOVEMENT PAGE
   - Register a new serial number (adds 1 to available stock)
   - Assign an available serial to a person (reduces stock by 1)
   - Return an assigned serial (increases stock by 1)
   - Full movement history log
============================================================ */

export default function StockMovementPage() {
  /* -------- state -------- */
  const [assets, setAssets] = useState([]);
  const [movements, setMovements] = useState([]);

  // "Register new serial" panel
  const [regProduct, setRegProduct] = useState("");
  const [regSerial, setRegSerial] = useState("");

  // "Assign asset" panel
  const [assignProduct, setAssignProduct] = useState("");
  const [assignSerial, setAssignSerial] = useState("");
  const [assignPerson, setAssignPerson] = useState("");

  // filter for history
  const [filterType, setFilterType] = useState("ALL");

  /* -------- refresh both assets and movement log -------- */
  const refresh = () => {
    setAssets(getAssets());
    setMovements(getMovements());
  };

  useEffect(() => {
    refresh();
  }, []);

  /* -------- derived lists -------- */
  const availableAssets = assets.filter((a) => a.status === "available");
  const assignedAssets = assets.filter((a) => a.status === "assigned");

  // unique product names from ALL assets
  const allProducts = [...new Set(assets.map((a) => a.product))].filter(Boolean);

  // serials available for the chosen product
  const filteredAvailableSerials = availableAssets.filter(
    (a) => a.assignProduct === "" || a.product === assignProduct
  );

  // serials that belong to the selected assign-product and are available
  const serialsForProduct = availableAssets.filter(
    (a) => a.product === assignProduct
  );

  // stock summary per product
  const stockSummary = {};
  assets.forEach((a) => {
    if (!stockSummary[a.product]) {
      stockSummary[a.product] = { available: 0, assigned: 0 };
    }
    if (a.status === "available") stockSummary[a.product].available += 1;
    else stockSummary[a.product].assigned += 1;
  });

  /* -------- filtered movement history -------- */
  const filteredMovements =
    filterType === "ALL"
      ? movements
      : movements.filter((m) => m.action === filterType);

  /* -------- handlers -------- */
  const handleRegister = () => {
    if (!regProduct.trim() || !regSerial.trim()) {
      alert("Please fill in both Product and Serial Number!");
      return;
    }
    addAsset(regProduct.trim(), regSerial.trim());
    setRegProduct("");
    setRegSerial("");
    refresh();
  };

  const handleAssign = () => {
    if (!assignSerial || !assignPerson.trim()) {
      alert("Please select a serial and enter the person's name!");
      return;
    }
    assignAsset(assignSerial, assignPerson.trim());
    setAssignPerson("");
    setAssignSerial("");
    setAssignProduct("");
    refresh();
  };

  const handleReturn = (serial) => {
    returnAsset(serial);
    refresh();
  };

  /* ======================================================= */
  return (
    <div style={pageStyle}>
      <h2 style={pageTitle}>📦 Stock Movement — Asset Tracker</h2>

      {/* ===== STOCK SUMMARY ===== */}
      {allProducts.length > 0 && (
        <section style={card}>
          <h3 style={sectionTitle}>📊 Live Stock Summary</h3>
          <table style={tableStyle}>
            <thead>
              <tr style={theadRow}>
                <th style={th}>Product</th>
                <th style={th}>Available ✅</th>
                <th style={th}>Assigned 👤</th>
                <th style={th}>Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stockSummary).map(([product, counts], i) => (
                <tr key={i} style={i % 2 === 0 ? evenRow : oddRow}>
                  <td style={td}>{product}</td>
                  <td style={{ ...td, color: "#22c55e", fontWeight: 600 }}>
                    {counts.available}
                  </td>
                  <td style={{ ...td, color: "#f59e0b", fontWeight: 600 }}>
                    {counts.assigned}
                  </td>
                  <td style={td}>{counts.available + counts.assigned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* ===== PANELS GRID ===== */}
      <div style={panelsGrid}>

        {/* --- Register New Serial --- */}
        <section style={card}>
          <h3 style={sectionTitle}>➕ Register New Asset</h3>
          <p style={helpText}>
            Adding a serial number here <strong>increases</strong> available
            stock by 1.
          </p>

          <label style={labelStyle}>Product Name</label>
          <input
            style={inputStyle}
            placeholder="e.g. Laptop, Monitor…"
            value={regProduct}
            onChange={(e) => setRegProduct(e.target.value)}
          />

          <label style={labelStyle}>Serial Number</label>
          <input
            style={inputStyle}
            placeholder="e.g. SN-2024-001"
            value={regSerial}
            onChange={(e) => setRegSerial(e.target.value)}
          />

          <button style={primaryBtn} onClick={handleRegister}>
            ✅ Register Asset
          </button>
        </section>

        {/* --- Assign Asset --- */}
        <section style={card}>
          <h3 style={sectionTitle}>🔄 Assign Asset to Person</h3>
          <p style={helpText}>
            Assigning an asset <strong>reduces</strong> available stock by 1.
          </p>

          <label style={labelStyle}>Select Product</label>
          <select
            style={inputStyle}
            value={assignProduct}
            onChange={(e) => {
              setAssignProduct(e.target.value);
              setAssignSerial(""); // reset serial when product changes
            }}
          >
            <option value="">— Select Product —</option>
            {allProducts.map((p, i) => (
              <option key={i} value={p}>
                {p}
              </option>
            ))}
          </select>

          <label style={labelStyle}>Select Serial (Available Only)</label>
          <select
            style={inputStyle}
            value={assignSerial}
            onChange={(e) => setAssignSerial(e.target.value)}
            disabled={!assignProduct}
          >
            <option value="">— Select Serial —</option>
            {serialsForProduct.map((a) => (
              <option key={a.serial} value={a.serial}>
                {a.serial}
              </option>
            ))}
          </select>

          {assignProduct && serialsForProduct.length === 0 && (
            <p style={{ color: "#ef4444", fontSize: 13 }}>
              ⚠ No available units for this product.
            </p>
          )}

          <label style={labelStyle}>Assign To (Employee Name)</label>
          <input
            style={inputStyle}
            placeholder="e.g. Ravi Kumar"
            value={assignPerson}
            onChange={(e) => setAssignPerson(e.target.value)}
          />

          <button style={primaryBtn} onClick={handleAssign}>
            🚀 Assign Asset
          </button>
        </section>
      </div>

      {/* ===== ASSIGNED ASSETS TABLE ===== */}
      <section style={card}>
        <h3 style={sectionTitle}>👤 Currently Assigned Assets</h3>
        {assignedAssets.length === 0 ? (
          <p style={helpText}>No assets currently assigned.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr style={theadRow}>
                <th style={th}>Product</th>
                <th style={th}>Serial No.</th>
                <th style={th}>Assigned To</th>
                <th style={th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignedAssets.map((a, i) => (
                <tr key={i} style={i % 2 === 0 ? evenRow : oddRow}>
                  <td style={td}>{a.product}</td>
                  <td style={td}>{a.serial}</td>
                  <td style={td}>{a.assignedTo}</td>
                  <td style={td}>
                    <button
                      style={returnBtn}
                      onClick={() => handleReturn(a.serial)}
                    >
                      ↩ Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* ===== MOVEMENT HISTORY ===== */}
      <section style={card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h3 style={{ ...sectionTitle, marginBottom: 0 }}>📜 Movement History</h3>
          <div>
            {["ALL", "ASSIGNED", "RETURNED"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                style={{
                  ...filterBtn,
                  background: filterType === f ? "#6366f1" : "#e5e7eb",
                  color: filterType === f ? "#fff" : "#374151",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredMovements.length === 0 ? (
          <p style={helpText}>No movements recorded yet.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr style={theadRow}>
                <th style={th}>Time</th>
                <th style={th}>Serial No.</th>
                <th style={th}>Action</th>
                <th style={th}>Person</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovements.map((m, i) => (
                <tr key={i} style={i % 2 === 0 ? evenRow : oddRow}>
                  <td style={{ ...td, fontSize: 12, color: "#6b7280" }}>{m.time}</td>
                  <td style={td}>{m.serial}</td>
                  <td style={td}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 700,
                        background:
                          m.action === "ASSIGNED" ? "#fef9c3" : "#dcfce7",
                        color:
                          m.action === "ASSIGNED" ? "#92400e" : "#166534",
                      }}
                    >
                      {m.action === "ASSIGNED" ? "🔼 ASSIGNED" : "🔽 RETURNED"}
                    </span>
                  </td>
                  <td style={td}>{m.person || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

/* ============================================================
   STYLES
============================================================ */

const pageStyle = {
  padding: "24px",
  fontFamily: "'Segoe UI', sans-serif",
  maxWidth: 1100,
};

const pageTitle = {
  fontSize: 24,
  fontWeight: 700,
  marginBottom: 24,
};

const card = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(0,0,0,0.09)",
  borderRadius: 12,
  padding: "20px 24px",
  marginBottom: 24,
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
};

const sectionTitle = {
  fontSize: 17,
  fontWeight: 700,
  marginBottom: 14,
};

const helpText = {
  fontSize: 13,
  color: "#6b7280",
  marginBottom: 12,
};

const panelsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 20,
  marginBottom: 24,
};

const labelStyle = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 4,
  marginTop: 12,
  color: "#374151",
};

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 14,
  boxSizing: "border-box",
  outline: "none",
};

const primaryBtn = {
  marginTop: 16,
  width: "100%",
  padding: "10px 0",
  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};

const returnBtn = {
  padding: "5px 14px",
  background: "#f59e0b",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 13,
};

const filterBtn = {
  marginLeft: 6,
  padding: "5px 12px",
  border: "none",
  borderRadius: 20,
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 600,
  transition: "all 0.2s",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 14,
};

const theadRow = {
  background: "rgba(99,102,241,0.08)",
};

const th = {
  padding: "10px 14px",
  textAlign: "left",
  fontWeight: 700,
  fontSize: 13,
  color: "#4f46e5",
  borderBottom: "2px solid rgba(99,102,241,0.2)",
};

const td = {
  padding: "10px 14px",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
};

const evenRow = { background: "transparent" };
const oddRow = { background: "rgba(0,0,0,0.02)" };