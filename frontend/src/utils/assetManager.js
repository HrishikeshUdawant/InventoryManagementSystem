// assetManager.js

const ASSET_KEY = "productAssets";
const MOVEMENT_KEY = "stockMovements";

// Get assets
export const getAssets = () =>
  JSON.parse(localStorage.getItem(ASSET_KEY)) || [];

// Save assets
const saveAssets = (assets) =>
  localStorage.setItem(ASSET_KEY, JSON.stringify(assets));

// Get movements
export const getMovements = () =>
  JSON.parse(localStorage.getItem(MOVEMENT_KEY)) || [];

const saveMovements = (data) =>
  localStorage.setItem(MOVEMENT_KEY, JSON.stringify(data));


// ✅ Add new asset (serial number)
export const addAsset = (product, serial) => {
  const assets = getAssets();

  assets.push({
    product,
    serial,
    status: "available",
    assignedTo: null,
  });

  saveAssets(assets);

  syncProductQuantities(); // ⭐ NEW
};


// ✅ Assign asset
export const assignAsset = (serial, person) => {
  let assets = getAssets();

  assets = assets.map((a) =>
    a.serial === serial
      ? { ...a, status: "assigned", assignedTo: person }
      : a
  );

  saveAssets(assets);

  logMovement(serial, "ASSIGNED", person);

  syncProductQuantities(); // ⭐ NEW
};

// ✅ Return asset
export const returnAsset = (serial) => {
  let assets = getAssets();

  assets = assets.map((a) =>
    a.serial === serial
      ? { ...a, status: "available", assignedTo: null }
      : a
  );

  saveAssets(assets);

  logMovement(serial, "RETURNED");

  syncProductQuantities(); // ⭐ NEW
};

// ✅ Movement History
const logMovement = (serial, action, person = "") => {
  const logs = getMovements();

  logs.unshift({
    serial,
    action,
    person,
    time: new Date().toLocaleString(),
  });

  saveMovements(logs);
};

// ✅ Sync quantities with Product Table
export const syncProductQuantities = () => {
  const assets = getAssets();

  // count available assets per product
  const counts = {};

  assets.forEach((a) => {
    if (a.status === "available") {
      counts[a.product] = (counts[a.product] || 0) + 1;
    }
  });

  // Update Products Table
  const productData = JSON.parse(
    localStorage.getItem("productTable")
  );

  if (!productData) return;

  const updatedRows = productData.rows.map((row) => {
    const productName = row["Product Name"];

    return {
      ...row,
      Quantity: counts[productName] || 0,
    };
  });

  localStorage.setItem(
    "productTable",
    JSON.stringify({
      ...productData,
      rows: updatedRows,
    })
  );

  // Update Software Table (if exists)
  const softwareData = JSON.parse(
    localStorage.getItem("softwareTable")
  );

  if (softwareData) {
    const updatedSoftwareRows = softwareData.rows.map((row) => {
      const productName = row["Product Name"];

      return {
        ...row,
        Quantity: counts[productName] || 0,
      };
    });

    localStorage.setItem(
      "softwareTable",
      JSON.stringify({
        ...softwareData,
        rows: updatedSoftwareRows,
      })
    );
  }
};