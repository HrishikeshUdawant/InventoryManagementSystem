import React from "react";
import { Box, Paper, Typography } from "@mui/material";

export default function StockMovementPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Stock Movements (In & Out)
      </Typography>

      <Typography mb={2}>
        Stock movement logs every quantity increase (Stock In) or decrease (Stock Out).
        This ensures accuracy in inventory counts and helps identify shrinkage,
        internal transfers, damaged goods and sales movement.
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6">Recent Movements</Typography>

        <Typography>• <b>Stock In</b>: +200 Dell Inspiron (Purchase Order #PO-5521)</Typography>
        <Typography>• <b>Stock Out</b>: -12 Sony Headphones (Sales Order #SO-2198)</Typography>
        <Typography>• <b>Transfer</b>: -20 Samsung Tablets to Warehouse B</Typography>
        <Typography>• <b>Adjustment</b>: -3 Damaged HP Monitors</Typography>

        <Typography variant="h6" mt={3}>Movement Summary</Typography>
        <Typography>• Total Stock In This Week: 1,240 Units</Typography>
        <Typography>• Total Stock Out This Week: 860 Units</Typography>
        <Typography>• Net Change: +380 Units</Typography>
      </Paper>
    </Box>
  );
}
