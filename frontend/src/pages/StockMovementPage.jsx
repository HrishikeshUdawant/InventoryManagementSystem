import React, { useState, useEffect } from "react";
import {
  getAssets,
  assignAsset,
  returnAsset,
} from "../utils/assetService";

export default function StockMovementPage() {
  const [assets, setAssets] = useState([]);
  const [product, setProduct] = useState("");
  const [serial, setSerial] = useState("");
  const [person, setPerson] = useState("");

  const refresh = () => setAssets(getAssets());

  useEffect(() => {
    refresh();
  }, []);

  const availableAssets = assets.filter(
    (a) => a.status === "available"
  );

  const assignedAssets = assets.filter(
    (a) => a.status === "assigned"
  );

  const products = [
    ...new Set(assets.map((a) => a.product)),
  ];

  const filteredSerials = availableAssets.filter(
    (a) => a.product === product
  );

  const handleAssign = () => {
    if (!serial || !person) return;
    assignAsset(serial, person);
    setPerson("");
    setSerial("");
    refresh();
  };

  return (
    <div>
      <h2>📦 Stock Movement — Asset Assignment</h2>

      {/* ASSIGN PANEL */}
      <h3>Assign Asset</h3>

      <select
        value={product}
        onChange={(e) => setProduct(e.target.value)}
      >
        <option value="">Select Product</option>
        {products.map((p, i) => (
          <option key={i}>{p}</option>
        ))}
      </select>

      <select
        value={serial}
        onChange={(e) => setSerial(e.target.value)}
      >
        <option value="">Select Serial</option>
        {filteredSerials.map((a) => (
          <option key={a.serial}>{a.serial}</option>
        ))}
      </select>

      <input
        placeholder="Assign To"
        value={person}
        onChange={(e) => setPerson(e.target.value)}
      />

      <button onClick={handleAssign}>Assign</button>

      <hr />

      {/* ASSIGNED LIST */}
      <h3>Assigned Assets</h3>

      {assignedAssets.map((a, i) => (
        <div key={i}>
          {a.product} — {a.serial} — {a.assignedTo}
          <button
            onClick={() => {
              returnAsset(a.serial);
              refresh();
            }}
            style={{ marginLeft: 10 }}
          >
            Return
          </button>
        </div>
      ))}
    </div>
  );
}