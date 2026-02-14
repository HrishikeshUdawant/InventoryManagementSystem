// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const productRoutes = require("./routes/productRoutes");

// const app = express();
// connectDB();
// app.use(cors());
// app.use(express.json());

// app.use("/api/products", productRoutes);

// app.listen(5000, () => console.log("Server running 5000"));


import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

app.listen(5000, () => console.log("Server running 5000"));
