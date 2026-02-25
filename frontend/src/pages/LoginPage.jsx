import React, { useContext, useState } from "react";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import { AuthContext } from "../auth/AuthContext";

export default function LoginPage({ switchToSignup }) {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
  e.preventDefault();
  const ok = await login(form.email, form.password);
  if (!ok) alert("Invalid credentials!");
};

  return (
    <Box 
      height="100vh" 
      display="flex" 
      justifyContent="center" 
      alignItems="center"
      sx={{ background: "#f5f6fa" }}
    >
      <Paper sx={{ p: 4, width: 350, borderRadius: 3 }} elevation={3}>
        <Typography variant="h5" textAlign="center" fontWeight={600} mb={2}>
          Sign In
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField 
            label="Email" 
            fullWidth 
            margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <TextField 
            type="password"
            label="Password" 
            fullWidth 
            margin="normal"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>

        <Typography textAlign="center" mt={2}>
          Don’t have an account?{" "}
          <span 
            style={{ color: "#1976d2", cursor: "pointer" }}
            onClick={switchToSignup}
          >
            Sign Up
          </span>
        </Typography>
      </Paper>
    </Box>
  );
}
