import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Legend,
  ResponsiveContainer,
} from "recharts";

const LOW_STOCK_LIMIT = 5;

export default function ReportsPage() {
  const [products, setProducts] = useState([]);

  // ✅ Load Products from localStorage
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("productTable"));

    if (savedData?.rows) {
      setProducts(savedData.rows);
    }
  }, []);

  // ✅ Analytics Calculations
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, p) => sum + (Number(p.Quantity) || 0),
    0
  );

  const totalValue = products.reduce(
    (sum, p) =>
      sum +
      (Number(p.Price) || 0) * (Number(p.Quantity) || 0),
    0
  );

  const lowStockItems = products.filter(
    (p) => Number(p.Quantity) < LOW_STOCK_LIMIT
  );

  // ✅ Chart Data
  const barData = products.map((p) => ({
    name: p["Product Name"],
    qty: Number(p.Quantity) || 0,
  }));

  const pieData = products.map((p) => ({
    name: p["Product Name"],
    value:
      (Number(p.Price) || 0) * (Number(p.Quantity) || 0),
  }));

  // ✅ Insights
  const highestValueProduct =
    pieData.length > 0
      ? pieData.reduce((max, item) =>
          item.value > max.value ? item : max
        )
      : null;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📊 PowerBI Style Inventory Reports
      </Typography>

      {/* ✅ KPI Cards */}
      <Grid container spacing={3} sx={{ marginBottom: 3 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Total Products</Typography>
              <Typography variant="h4" fontWeight="bold">
                {totalProducts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Total Stock</Typography>
              <Typography variant="h4" fontWeight="bold">
                {totalStock}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Inventory Value</Typography>
              <Typography variant="h4" fontWeight="bold">
                ₹{totalValue}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Low Stock Alerts</Typography>
              <Typography variant="h4" fontWeight="bold" color="red">
                {lowStockItems.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ✅ Charts Section */}
      <Grid container spacing={3}>
        {/* Bar Chart */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📦 Stock Quantity per Product
              </Typography>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="qty" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💰 Inventory Value Share
              </Typography>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ✅ Low Stock Table */}
      <Card sx={{ marginTop: 4, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            ⚠ Low Stock Items Report
          </Typography>

          {lowStockItems.length === 0 ? (
            <Typography>No low stock products 🎉</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {lowStockItems.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item["Product Name"]}</TableCell>
                    <TableCell>{item.Quantity}</TableCell>
                    <TableCell style={{ color: "red" }}>
                      Critical
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ✅ Smart Insights */}
      <Card sx={{ marginTop: 4, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🤖 Smart Insights
          </Typography>

          {highestValueProduct ? (
            <Typography>
              🔥 Highest inventory value product is{" "}
              <b>{highestValueProduct.name}</b> worth ₹
              {highestValueProduct.value}.
            </Typography>
          ) : (
            <Typography>No data available yet.</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
