import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={600} mb={4}>
        Inventory Dashboard
      </Typography>

      <Grid container spacing={3}>

        {/* KPI Cards */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Total SKUs</Typography>
            <Typography variant="h3" fontWeight={700}>348</Typography>
            <Typography color="gray">Unique product codes in system</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Stock On Hand</Typography>
            <Typography variant="h3" fontWeight={700}>12,480</Typography>
            <Typography color="gray">Units currently in warehouse</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Stock Value</Typography>
            <Typography variant="h3" fontWeight={700}>₹ 42.8L</Typography>
            <Typography color="gray">Total inventory valuation</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Low Stock Items</Typography>
            <Typography variant="h3" fontWeight={700}>14</Typography>
            <Typography color="gray">SKUs below reorder level</Typography>
          </Paper>
        </Grid>

        {/* Low Stock Table */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Low Stock Alerts</Typography>

            <Typography>• HP Pavilion 15 – Available: 4 (Reorder at 10)</Typography>
            <Typography>• Samsung 32” LED – Available: 2 (Reorder at 5)</Typography>
            <Typography>• Logitech MX Keyboard – Available: 3 (Reorder at 8)</Typography>
            <Typography>• Apple Airpods Pro – Available: 1 (Reorder at 6)</Typography>
          </Paper>
        </Grid>

        {/* Recent Stock Movements */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Recent Stock Movements</Typography>

            <Typography>• Stock In: +120 Samsung M34 (Supplier: GadgetHub Pvt Ltd)</Typography>
            <Typography>• Stock Out: -15 HP Laptops (Issued to Sales Order #SO-3321)</Typography>
            <Typography>• Stock In: +40 Lenovo ThinkPads (Supplier: TechMart Distributors)</Typography>
            <Typography>• Stock Out: -6 Sony Cameras (Transferred to Branch Warehouse)</Typography>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
}
