import React, { useState, useContext } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Typography,
  Button,
} from "@mui/material";

/* Icons */
import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import ComputerIcon from "@mui/icons-material/Computer";

/* Components */
import ThemeSwitch from "../components/ThemeSwitch";

/* Theme Context */
import { ColorModeContext } from "../theme/ThemeContext";

/* ✅ Clerk */
import { useClerk, UserButton } from "@clerk/clerk-react";

export default function Sidebar({ selected, setSelected }) {
  const [open, setOpen] = useState(true);

  const { mode } = useContext(ColorModeContext);

  // ✅ Clerk logout
  const { signOut } = useClerk();

  /* Sidebar Menu Items */
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Products", icon: <Inventory2Icon /> },
    { text: "Software", icon: <ComputerIcon /> },
    { text: "Categories", icon: <CategoryIcon /> },
    { text: "Suppliers", icon: <LocalShippingIcon /> },
    { text: "Stock Movement", icon: <SwapHorizIcon /> },
    { text: "Reports", icon: <AssessmentIcon /> },
    { text: "Settings", icon: <SettingsIcon /> },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? 240 : 70,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? 240 : 70,
            boxSizing: "border-box",
            transition: "width 0.3s ease",
            backgroundColor: mode === "light" ? "#ffffff" : "#1e1e1e",
            borderRight: "1px solid rgba(0,0,0,0.1)",
          },
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent={open ? "space-between" : "center"}
          sx={{ px: 2, py: 2 }}
        >
          {open && (
            <Typography variant="h6" fontWeight={700}>
              Inventory
            </Typography>
          )}

          <IconButton onClick={() => setOpen(!open)}>
            <MenuIcon />
          </IconButton>
        </Box>

        {/* ✅ Clerk User Avatar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <UserButton afterSignOutUrl="/" />
        </Box>

        {/* Menu Items */}
        <List>
          {menuItems.map((item, index) => (
            <ListItemButton
              key={index}
              selected={selected === item.text}
              onClick={() => setSelected(item.text)}
              sx={{
                borderRadius: 2,
                mx: 1,
                mb: 1,
                "&.Mui-selected": {
                  backgroundColor:
                    mode === "light"
                      ? "rgba(25,118,210,0.15)"
                      : "rgba(255,255,255,0.15)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: open ? "40px" : "0" }}>
                {item.icon}
              </ListItemIcon>

              {open && <ListItemText primary={item.text} />}
            </ListItemButton>
          ))}
        </List>

        {/* Theme Switch */}
        <Box
          sx={{
            position: "absolute",
            bottom: 70,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ThemeSwitch />
        </Box>

        {/* ✅ Clerk Logout Button */}
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => signOut()}
            variant="contained"
            color="error"
            sx={{ width: open ? "80%" : "60px" }}
          >
            {open ? "Logout" : "⎋"}
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}