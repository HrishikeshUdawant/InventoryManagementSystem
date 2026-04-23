const ASSET_KEY = "productAssets";

/* ================= GET ASSETS ================= */

export const getAssets = () =>
  JSON.parse(localStorage.getItem(ASSET_KEY)) || [];

/* ================= SAVE ================= */

const saveAssets = (assets) =>
  localStorage.setItem(ASSET_KEY, JSON.stringify(assets));

/* ================= ADD SERIAL ================= */

export const addAsset = (product, serial) => {
  const assets = getAssets();

  // prevent duplicate serial
  if (assets.find((a) => a.serial === serial)) {
    alert("Serial already exists!");
    return;
  }

  assets.push({
    product,
    serial,
    status: "available",
    assignedTo: null,
  });

  saveAssets(assets);
  syncQuantities();
};

/* ================= ASSIGN ================= */

export const assignAsset = (serial, person) => {
  const assets = getAssets().map((a) =>
    a.serial === serial
      ? { ...a, status: "assigned", assignedTo: person }
      : a
  );

  saveAssets(assets);
  syncQuantities();
};

/* ================= RETURN ================= */

export const returnAsset = (serial) => {
  const assets = getAssets().map((a) =>
    a.serial === serial
      ? { ...a, status: "available", assignedTo: null }
      : a
  );

  saveAssets(assets);
  syncQuantities();
};

/* ================= AUTO QUANTITY SYNC ================= */

const syncQuantities = () => {
  const assets = getAssets();

  const counts = {};

  assets.forEach((a) => {
    if (a.status === "available") {
      counts[a.product] = (counts[a.product] || 0) + 1;
    }
  });

  updateTable("productTable", counts);
  updateTable("softwareTable", counts);
};

const updateTable = (key, counts) => {
  const table = JSON.parse(localStorage.getItem(key));
  if (!table) return;

  const updatedRows = table.rows.map((row) => ({
    ...row,
    Quantity: counts[row["Product Name"]] || 0,
  }));

  localStorage.setItem(
    key,
    JSON.stringify({ ...table, rows: updatedRows })
  );
};