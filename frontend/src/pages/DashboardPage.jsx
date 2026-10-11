import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  LinearProgress,
  Divider,
  Avatar,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import { ColorModeContext } from "../theme/ThemeContext";

/* ================================================================
   HELPERS — read live data from localStorage
================================================================ */

const readProducts = () => {
  const d = JSON.parse(localStorage.getItem("productTable"));
  return d?.rows?.filter((r) => r["Product Name"]) || [];
};

const readSoftware = () => {
  const d = JSON.parse(localStorage.getItem("softwareTable"));
  return d?.rows?.filter((r) => r["Software Name"]) || [];
};

const readAssets = () =>
  JSON.parse(localStorage.getItem("productAssets")) || [];

const readMovements = () =>
  JSON.parse(localStorage.getItem("stockMovements")) || [];

const LOW_STOCK_LIMIT = 5;

/* ================================================================
   ANIMATED COUNTER
================================================================ */

function AnimatedNumber({ target, prefix = "", suffix = "" }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (target === 0) { setDisplay(0); return; }
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setDisplay(target); clearInterval(timer); }
      else setDisplay(start);
    }, 18);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {prefix}
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/* ================================================================
   KPI CARD
================================================================ */

function KpiCard({ title, value, subtitle, icon, gradient, prefix = "", suffix = "" }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        background: gradient,
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        minHeight: 140,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
        },
      }}
    >
      {/* Background decorative circle */}
      <Box
        sx={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -30,
          right: 30,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
        }}
      />

      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", fontSize: 11 }}>
          {title}
        </Typography>
        <Box sx={{ fontSize: 26 }}>{icon}</Box>
      </Box>

      <Box>
        <Typography variant="h3" fontWeight={800} sx={{ lineHeight: 1.1, mb: 0.5 }}>
          <AnimatedNumber target={value} prefix={prefix} suffix={suffix} />
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          {subtitle}
        </Typography>
      </Box>
    </Paper>
  );
}

/* ================================================================
   ACTION BADGE
================================================================ */

function ActionBadge({ action }) {
  const cfg = {
    ASSIGNED: { bg: "#fef3c7", color: "#92400e", label: "🔼 Assigned" },
    RETURNED: { bg: "#d1fae5", color: "#065f46", label: "🔽 Returned" },
    ADDED:    { bg: "#dbeafe", color: "#1e40af", label: "✅ Added" },
  };
  const c = cfg[action] || { bg: "#f3f4f6", color: "#374151", label: action };
  return (
    <Chip
      label={c.label}
      size="small"
      sx={{ background: c.bg, color: c.color, fontWeight: 700, fontSize: 11 }}
    />
  );
}

/* ================================================================
   DASHBOARD PAGE
================================================================ */

export default function DashboardPage() {
  const { mode } = useContext(ColorModeContext);
  const isDark = mode === "dark";

  /* Live data */
  const [products, setProducts] = useState([]);
  const [software, setSoftware] = useState([]);
  const [assets, setAssets] = useState([]);
  const [movements, setMovements] = useState([]);

  const load = () => {
    setProducts(readProducts());
    setSoftware(readSoftware());
    setAssets(readAssets());
    setMovements(readMovements());
  };

  useEffect(() => {
    load();
    // Refresh when any localStorage key changes (e.g. after assignment)
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  /* ---- KPI calculations ---- */
  const totalProductSKUs = products.length;
  const totalStock = products.reduce((s, p) => s + (Number(p.Quantity) || 0), 0);
  const totalValue = products.reduce(
    (s, p) => s + (Number(p.Price) || 0) * (Number(p.Quantity) || 0),
    0
  );
  const lowStockItems = products.filter((p) => Number(p.Quantity) < LOW_STOCK_LIMIT && p["Product Name"]);
  const assignedAssets = assets.filter((a) => a.status === "assigned");
  const availableAssets = assets.filter((a) => a.status === "available");
  const totalSoftwareLicenses = software.reduce((s, sw) => s + (Number(sw.Quantity) || 0), 0);

  /* ---- Bar chart: top products by quantity ---- */
  const barData = [...products]
    .sort((a, b) => (Number(b.Quantity) || 0) - (Number(a.Quantity) || 0))
    .slice(0, 6)
    .map((p) => ({ name: p["Product Name"] || "—", qty: Number(p.Quantity) || 0 }));

  /* ---- Area chart: movement activity over last 10 events ---- */
  const areaData = movements
    .slice(0, 10)
    .reverse()
    .map((m, i) => ({
      idx: i + 1,
      assigned: m.action === "ASSIGNED" ? 1 : 0,
      returned: m.action === "RETURNED" ? 1 : 0,
    }))
    .reduce((acc, cur, i) => {
      const prev = acc[i - 1] || { assigned: 0, returned: 0 };
      acc.push({
        ...cur,
        assigned: prev.assigned + cur.assigned,
        returned: prev.returned + cur.returned,
      });
      return acc;
    }, []);

  /* ---- Stock utilisation per product ---- */
  const stockSummary = {};
  assets.forEach((a) => {
    if (!stockSummary[a.product]) stockSummary[a.product] = { total: 0, assigned: 0 };
    stockSummary[a.product].total += 1;
    if (a.status === "assigned") stockSummary[a.product].assigned += 1;
  });
  const utilisationData = Object.entries(stockSummary)
    .map(([product, c]) => ({
      product,
      pct: c.total > 0 ? Math.round((c.assigned / c.total) * 100) : 0,
      assigned: c.assigned,
      total: c.total,
    }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);

  /* ---- card styles ---- */
  const sectionCard = {
    p: 3,
    borderRadius: 4,
    elevation: 0,
    sx: {
      border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
      boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(0,0,0,0.06)",
    },
  };

  /* ================================================================ */
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, width: "100%" }}>

      {/* ---- Header ---- */}
      <Box mb={4} display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: -0.5 }}>
            Inventory Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Live overview — data synced from all modules
          </Typography>
        </Box>
        <Chip
          label={`🕐 ${new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}`}
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      {/* ================================================================
          ROW 1 — KPI CARDS
      ================================================================ */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Total SKUs"
            value={totalProductSKUs}
            subtitle="Unique products in system"
            icon="📦"
            gradient="linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Stock On Hand"
            value={totalStock}
            subtitle="Available units across all products"
            icon="🏭"
            gradient="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Inventory Value"
            value={Math.round(totalValue)}
            subtitle="Total stock valuation"
            icon="💰"
            prefix="₹"
            gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Low Stock Alerts"
            value={lowStockItems.length}
            subtitle={`Products below ${LOW_STOCK_LIMIT} units`}
            icon="⚠️"
            gradient={
              lowStockItems.length > 0
                ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                : "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"
            }
          />
        </Grid>
      </Grid>

      {/* ================================================================
          ROW 2 — ASSET MINI-STATS + ACTIVITY TREND
      ================================================================ */}
      <Grid container spacing={3} mb={4}>

        {/* Asset mini-stats */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: "100%", ...sectionCard.sx }}>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              🖥️ Asset Tracker
            </Typography>

            <Box display="flex" justifyContent="space-between" mb={2}>
              {[
                { label: "Total Registered", val: assets.length, color: "#6366f1" },
                { label: "Available", val: availableAssets.length, color: "#10b981" },
                { label: "Assigned Out", val: assignedAssets.length, color: "#f59e0b" },
              ].map((s) => (
                <Box key={s.label} textAlign="center">
                  <Typography variant="h4" fontWeight={800} sx={{ color: s.color }}>
                    {s.val}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {s.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1.5}>
              UTILISATION BY PRODUCT
            </Typography>

            {utilisationData.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No assets registered yet. Go to Stock Movement → Register New Asset to get started.
              </Typography>
            ) : (
              utilisationData.map((u) => (
                <Box key={u.product} mb={1.5}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 160 }}>
                      {u.product}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {u.assigned}/{u.total} ({u.pct}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={u.pct}
                    sx={{
                      height: 6,
                      borderRadius: 4,
                      bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 4,
                        bgcolor: u.pct >= 80 ? "#ef4444" : u.pct >= 50 ? "#f59e0b" : "#10b981",
                      },
                    }}
                  />
                </Box>
              ))
            )}

            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="text.secondary">
              🔵 Software Licenses in system: <strong>{totalSoftwareLicenses}</strong>
            </Typography>
          </Paper>
        </Grid>

        {/* Activity Area Chart */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: "100%", ...sectionCard.sx }}>
            <Typography variant="subtitle1" fontWeight={700} mb={0.5}>
              📈 Movement Activity Trend
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Cumulative assignments & returns from recent history
            </Typography>

            {areaData.length < 2 ? (
              <Box display="flex" alignItems="center" justifyContent="center" height={220} flexDirection="column" gap={1}>
                <Typography fontSize={40}>📊</Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Not enough movement data yet.<br />
                  Assign some assets to see the trend chart.
                </Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gAssigned" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gReturned" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} />
                  <XAxis dataKey="idx" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                      background: isDark ? "#1e1e1e" : "#fff",
                      color: isDark ? "#fff" : "#1a1a1a",
                    }}
                  />
                  <Area type="monotone" dataKey="assigned" stroke="#f59e0b" strokeWidth={2} fill="url(#gAssigned)" name="Assigned" />
                  <Area type="monotone" dataKey="returned" stroke="#10b981" strokeWidth={2} fill="url(#gReturned)" name="Returned" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* ================================================================
          ROW 3 — STOCK BAR CHART + RECENT MOVEMENTS + LOW STOCK
      ================================================================ */}
      <Grid container spacing={3}>

        {/* Bar chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, ...sectionCard.sx }}>
            <Typography variant="subtitle1" fontWeight={700} mb={0.5}>
              📦 Stock by Product (Top 6)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Current available quantities
            </Typography>

            {barData.length === 0 ? (
              <Box display="flex" alignItems="center" justifyContent="center" height={220} flexDirection="column" gap={1}>
                <Typography fontSize={40}>📭</Typography>
                <Typography variant="body2" color="text.secondary">
                  No products in system yet.
                </Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                      background: isDark ? "#1e1e1e" : "#fff",
                    }}
                  />
                  <Bar dataKey="qty" name="Quantity" radius={[6, 6, 0, 0]} fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* Low Stock Alerts */}
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: "100%", ...sectionCard.sx }}>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              ⚠️ Low Stock Alerts
            </Typography>

            {lowStockItems.length === 0 ? (
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={4} gap={1}>
                <Typography fontSize={32}>✅</Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  All stocks healthy!
                </Typography>
              </Box>
            ) : (
              <Box display="flex" flexDirection="column" gap={1.5}>
                {lowStockItems.slice(0, 6).map((p, i) => (
                  <Box
                    key={i}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: isDark ? "rgba(239,68,68,0.1)" : "#fff5f5",
                      border: "1px solid rgba(239,68,68,0.2)",
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: Number(p.Quantity) === 0 ? "#ef4444" : "#f59e0b",
                        }}
                      />
                      <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 100 }}>
                        {p["Product Name"]}
                      </Typography>
                    </Box>
                    <Chip
                      label={Number(p.Quantity) === 0 ? "Out" : p.Quantity}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: 11,
                        background: Number(p.Quantity) === 0 ? "#ef4444" : "#f59e0b",
                        color: "#fff",
                      }}
                    />
                  </Box>
                ))}
                {lowStockItems.length > 6 && (
                  <Typography variant="caption" color="text.secondary" textAlign="center">
                    +{lowStockItems.length - 6} more items…
                  </Typography>
                )}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recent Movement History */}
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: "100%", ...sectionCard.sx }}>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              🕒 Recent Movements
            </Typography>

            {movements.length === 0 ? (
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={4} gap={1}>
                <Typography fontSize={32}>📋</Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  No movements yet.
                </Typography>
              </Box>
            ) : (
              <Box display="flex" flexDirection="column" gap={2}>
                {movements.slice(0, 5).map((m, i) => (
                  <Box key={i} display="flex" gap={1.5} alignItems="flex-start">
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: 14,
                        bgcolor:
                          m.action === "ASSIGNED"
                            ? "#fef3c7"
                            : m.action === "RETURNED"
                            ? "#d1fae5"
                            : "#dbeafe",
                      }}
                    >
                      {m.action === "ASSIGNED" ? "🔼" : m.action === "RETURNED" ? "🔽" : "✅"}
                    </Avatar>
                    <Box flex={1} minWidth={0}>
                      <Box display="flex" alignItems="center" gap={0.5} flexWrap="wrap">
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {m.product || m.serial}
                        </Typography>
                        <ActionBadge action={m.action} />
                      </Box>
                      {m.person && (
                        <Typography variant="caption" color="text.secondary">
                          → {m.person}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" display="block">
                        {m.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
}
