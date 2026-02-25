import React, { useContext } from "react";
import { ColorModeContext } from "../theme/ThemeContext";
import { motion } from "framer-motion";
import { Box } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function ThemeSwitch() {
  const { mode, toggleColorMode } = useContext(ColorModeContext);

  return (
    <Box
      onClick={toggleColorMode}
      sx={{
        width: 70,
        height: 32,
        borderRadius: "50px",
        display: "flex",
        alignItems: "center",
        backgroundColor: mode === "light" ? "#e2e8f0" : "#2c2c2c",
        padding: "4px",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {/* sliding circle */}
      <motion.div
        initial={false}
        animate={{ x: mode === "light" ? 0 : 36 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          backgroundColor: mode === "light" ? "#ffffff" : "#3a3a3a", 
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
        }}
      >
        {mode === "light" ? (
          <LightModeIcon sx={{ fontSize: 18, color: "#fbc02d" }} />
        ) : (
          <DarkModeIcon sx={{ fontSize: 18, color: "white" }} />
        )}
      </motion.div>
    </Box>
  );
}
