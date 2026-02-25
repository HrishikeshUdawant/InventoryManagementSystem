import React from "react";
import { Box, Paper, Typography } from "@mui/material";

export default function CategoriesPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Product Categories
      </Typography>

      <Typography mb={2}>
        Categories help organise inventory into logical groups, improve filtering,
        reporting, and stock analysis. They also help forecasting demand 
        and understanding sales trends within product groups.
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Common Inventory Categories</Typography>

        <Typography>• Mobile Phones & Accessories</Typography>
        <Typography>• Laptops & Desktops</Typography>
        <Typography>• Televisions & Displays</Typography>
        <Typography>• Audio Equipment</Typography>
        <Typography>• Networking & Routers</Typography>
        <Typography>• Home Appliances</Typography>
        <Typography>• Camera & Photography</Typography>
      </Paper>
    </Box>
  );
}
