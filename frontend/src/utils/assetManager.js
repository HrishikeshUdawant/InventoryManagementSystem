// assetManager.js — single source of truth for asset + movement logic

const ASSET_KEY = "productAssets";
const MOVEMENT_KEY = "stockMovements";

/* ==================== ASSETS ==================== */

export const getAssets = () =>
  JSON.parse(localStorage.getItem(ASSET_KEY)) || [];

const saveAssets = (assets) =>
  localStorage.setItem(ASSET_KEY, JSON.stringify(assets));

/* ==================== MOVEMENTS ==================== */

export const getMovements = () =>
  JSON.parse(localStorage.getItem(MOVEMENT_KEY)) || [];

const saveMovements = (data) =>
  localStorage.setItem(MOVEMENT_KEY, JSON.stringify(data));

/* ==================== LOG A MOVEMENT ==================== */

const logMovement = (serial, action, person = "") => {
  const asset = getAssets().find((a) => a.serial === serial);
  const logs = getMovements();

  logs.unshift({
    serial,
    product: asset ? asset.product : "Unknown",
    action, // "ASSIGNED" | "RETURNED" | "ADDED"
    person,
    time: new Date().toLocaleString(),
  });

  saveMovements(logs);
};

/* ==================== ADD NEW SERIAL ==================== */
// Increases "available" count for that product by 1.

export const addAsset = (product, serial) => {
  const assets = getAssets();

  // Prevent duplicate serials
  if (assets.find((a) => a.serial === serial)) {
    alert(`Serial "${serial}" already exists in the system!`);
    return false; // signals failure to caller
  }

  assets.push({
    product,
    serial,
    status: "available",
    assignedTo: null,
  });

  saveAssets(assets);
  logMovement(serial, "ADDED");
  syncProductQuantities(); // update Product/Software table quantities
  return true;
};

/* ==================== ASSIGN ASSET ==================== */
// Marks the serial as "assigned" → reduces available count by 1.

export const assignAsset = (serial, person) => {
  const assets = getAssets().map((a) =>
    a.serial === serial
      ? { ...a, status: "assigned", assignedTo: person }
      : a
  );

  saveAssets(assets);
  logMovement(serial, "ASSIGNED", person);
  syncProductQuantities();
};

/* ==================== RETURN ASSET ==================== */
// Marks the serial as "available" again → increases available count by 1.

export const returnAsset = (serial) => {
  const assets = getAssets().map((a) =>
    a.serial === serial
      ? { ...a, status: "available", assignedTo: null }
      : a
  );

  saveAssets(assets);
  logMovement(serial, "RETURNED");
  syncProductQuantities();
};

/* ==================== SYNC QUANTITIES ==================== */
// After any assign/return/add, recalculate "available" counts and write
// them back into productTable and softwareTable in localStorage so the
// Products page and Reports page stay up to date.

export const syncProductQuantities = () => {
  const assets = getAssets();

  // Count how many serials are "available" per product
  const counts = {};
  assets.forEach((a) => {
    if (a.status === "available") {
      counts[a.product] = (counts[a.product] || 0) + 1;
    }
  });

  // Helper: update a table stored under a given localStorage key
  const updateTable = (storageKey) => {
    const tableData = JSON.parse(localStorage.getItem(storageKey));
    if (!tableData?.rows) return;

    const updatedRows = tableData.rows.map((row) => {
      const productName =
        row["Product Name"] || row["Software Name"] || row["Item Name"] || "";
      const newQty = counts[productName];

      // Only overwrite Quantity if we actually track this product via assets
      if (newQty !== undefined) {
        return { ...row, Quantity: String(newQty) };
      }
      return row;
    });

    localStorage.setItem(
      storageKey,
      JSON.stringify({ ...tableData, rows: updatedRows })
    );
  };

  updateTable("productTable");
  updateTable("softwareTable");
  updateTable("categoriesTable");
};