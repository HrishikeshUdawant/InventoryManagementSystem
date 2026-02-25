import React from "react";
import { Box, Paper, Typography } from "@mui/material";

export default function SettingsPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={600} mb={3}>
        System Settings
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6">User Preferences</Typography>
        <Typography>• Theme mode (Light / Dark)</Typography>
        <Typography>• Notification Settings</Typography>

        <Typography variant="h6" mt={3}>Inventory Settings</Typography>
        <Typography>• Default Reorder Level</Typography>
        <Typography>• Stock Valuation Method (FIFO / LIFO / AVG)</Typography>
        <Typography>• Auto Stock Adjustment Rules</Typography>

        <Typography variant="h6" mt={3}>System Administration</Typography>
        <Typography>• Data Backup / Restore</Typography>
        <Typography>• Manage User Roles & Permissions</Typography>
        <Typography>• Audit Logs</Typography>
      </Paper>
    </Box>
  );
}
