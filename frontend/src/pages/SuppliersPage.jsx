import React from "react";
import { Box, Paper, Typography } from "@mui/material";

export default function SuppliersPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Suppliers / Vendors
      </Typography>

      <Typography mb={2}>
        Suppliers provide stock to the organisation. Maintaining supplier information
        helps streamline purchase orders, delivery timelines, and stock availability.
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Active Suppliers</Typography>

        <Typography><b>TechMart Distributors</b> — Laptops, Desktops, Monitors</Typography>
        <Typography><b>GadgetHub Pvt Ltd</b> — Mobile Phones, Audio Devices</Typography>
        <Typography><b>ElectroWorld Imports</b> — Home Appliances, Smart TVs</Typography>
        <Typography><b>Alpha Components</b> — Computer Peripherals</Typography>

        <Typography variant="h6" mt={3}>Supplier Metrics</Typography>
        <Typography>• Average Delivery Time: 3.4 Days</Typography>
        <Typography>• Total Active Suppliers: 18</Typography>
        <Typography>• Most Reliable Supplier: TechMart Distributors</Typography>
      </Paper>
    </Box>
  );
}
