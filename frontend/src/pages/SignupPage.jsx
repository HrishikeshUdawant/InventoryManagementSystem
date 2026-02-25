import React, { useContext, useState } from "react";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import { AuthContext } from "../auth/AuthContext";

export default function SignupPage({ switchToLogin }) {
  const { signup } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(form);
    switchToLogin();
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
          Create Account
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField 
            label="Full Name" 
            fullWidth 
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <TextField 
            label="Email" 
            fullWidth 
            margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <TextField 
            label="Password" 
            type="password"
            fullWidth 
            margin="normal"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Sign Up
          </Button>
        </form>

        <Typography textAlign="center" mt={2}>
          Already have an account?{" "}
          <span 
            style={{ color: "#1976d2", cursor: "pointer" }}
            onClick={switchToLogin}
          >
            Login
          </span>
        </Typography>
      </Paper>
    </Box>
  );
}
