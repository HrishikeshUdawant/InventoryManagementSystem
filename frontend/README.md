# 📦 Inventory Management System

A full-featured, company-grade Inventory Management System built with **React** (frontend) + **Node.js / Express / MongoDB** (backend), with **Clerk** authentication.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Material UI (MUI) |
| Auth | Clerk (Google SSO / Email) |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Charts | Recharts |
| State | React `useState` / `localStorage` |

---

## 📂 Project Structure

```
InventoryManagementSystem/
├── backend/
│   ├── config/          # DB connection
│   ├── models/          # Mongoose schemas (Product, User)
│   ├── routes/          # Express routes (products, auth)
│   └── server.js        # Entry point
└── frontend/
    └── src/
        ├── components/  # Reusable table components
        ├── layout/      # Sidebar navigation
        ├── pages/        # One file per page
        ├── theme/        # MUI theme + dark mode context
        └── utils/        # Asset management logic
```

---

## 🖥️ Pages & Features

### 📊 Dashboard
- KPI summary cards: Total SKUs, Stock On Hand, Stock Value, Low Stock Items
- Low Stock Alerts panel
- Recent Stock Movements panel

### 📦 Products
- Dynamic editable table (stored in `localStorage["productTable"]`)
- Add/remove rows & columns on the fly
- CSV upload & delete
- Low-stock row highlighting (< 5 units = red border)
- **Auto-updated quantities** when assets are assigned/returned in Stock Movement
- Audit history log (per session)

### 💻 Software
- Separate editable table for software licenses (stored in `localStorage["softwareTable"]`)
- Default columns: Software Name, Version, License, Quantity
- Independent of Products — no data collision

### 🏷️ Categories
- Separate editable table (stored in `localStorage["categoriesTable"]`)
- Default columns: Category Name, Description, Product Count
- Independent of Products and Software

### 🚚 Suppliers
- Editable supplier table (stored in `localStorage["suppliersTable"]`)

### 🔄 Stock Movement ← *Fixed & Enhanced*
This is the core tracking feature. Here's the full workflow:

#### How it Works
1. **Register a new asset** — Enter a product name + serial number → stored as `status: "available"` → quantity in Products table **increases by 1**
2. **Assign an asset** — Select product → select an available serial → enter the recipient's name → serial marked `status: "assigned"` → quantity in Products table **decreases by 1** (this is the quantity reduction you wanted!)
3. **Return an asset** — Click Return on any assigned asset → serial reverts to `status: "available"` → quantity **increases by 1**

#### Features
- 📊 **Live Stock Summary table** — shows available vs assigned count per product at a glance
- ➕ **Register New Asset panel** — add serial numbers (with duplicate-serial prevention)
- 🔄 **Assign Asset panel** — product-filtered serial dropdown (only shows available serials)
- 👤 **Currently Assigned Assets table** — shows all checked-out assets with one-click Return
- 📜 **Movement History log** — timestamped ADDED / ASSIGNED / RETURNED entries, filterable by type
- 🔒 **Duplicate serial protection** — cannot register the same serial number twice

#### Data Flow (Technical)
```
Stock Movement Page
       │
       ▼
 assetManager.js (utils/)
  - addAsset()      → saves to localStorage["productAssets"] + logs ADDED
  - assignAsset()   → saves + logs ASSIGNED → syncProductQuantities()
  - returnAsset()   → saves + logs RETURNED → syncProductQuantities()
       │
       ▼
 syncProductQuantities()
  - Reads all assets, counts status="available" per product
  - Writes updated Quantity back into:
      localStorage["productTable"]   → Products page
      localStorage["softwareTable"]  → Software page
      localStorage["categoriesTable"]→ Categories page
       │
       ▼
 ProductTable (window "storage" event listener)
  - Detects the localStorage write
  - Re-reads data → updates React state → re-renders with new quantities ✅
```

### 📈 Reports
- KPI cards (Total Products, Total Stock, Inventory Value, Low Stock Alerts)
- Bar chart: Stock quantity per product
- Pie chart: Inventory value distribution
- Low Stock Items table
- Smart Insights: highest-value product

### ⚙️ Settings
- App preferences

---

## ⚙️ Setup & Run

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)
- A Clerk account (for auth)

### Frontend

```bash
cd frontend
npm install
# Create .env with:
# REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_...
npm start
```

Runs on: http://localhost:3000

### Backend

```bash
cd backend
npm install
# Create .env with:
# MONGO_URI=mongodb://...
node server.js
```

Runs on: http://localhost:5000

---

## 🐛 Bugs Fixed (April 2025)

| # | Bug | Root Cause | Fix |
|---|-----|-----------|-----|
| 1 | Stock quantity not reducing when asset assigned | `StockMovementPage` imported from `assetService.js` (old, incomplete file) instead of `assetManager.js` | Re-pointed import to `assetManager.js` which correctly calls `syncProductQuantities()` |
| 2 | Movement history log never shown | `StockMovementPage` had no UI for `getMovements()` | Added full movement history table with ASSIGNED/RETURNED/ALL filter |
| 3 | Products table quantity not updating live | `ProductTable` reads localStorage only at mount; `syncProductQuantities` writes new values but React state was stale | Added `window.addEventListener("storage", ...)` to re-sync ProductTable state when localStorage changes |
| 4 | Software table overwriting Products data | `SoftwareTable.jsx` read/wrote to `"productTable"` key instead of `"softwareTable"` | Fixed localStorage key to `"softwareTable"`, added proper default columns |
| 5 | Categories table overwriting Products data | Same bug as #4 — used `"productTable"` key | Fixed to use `"categoriesTable"` key with Category-specific default columns |
| 6 | No way to register new serial numbers | UI only supported assign/return, but had no "add new serial" form | Added "Register New Asset" panel with duplicate prevention |
| 7 | Duplicate serials allowed in old code | `assetManager.addAsset()` had no uniqueness check | Added guard that alerts and returns `false` on duplicate serial |

---

## 📧 Contact

- **Email:** hrishiudawant7@gmail.com