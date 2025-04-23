// src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { AppDataSource } = require("./config/ormconfig");
const authRoutes = require("./routes/auth.routes");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to DB
AppDataSource.initialize()
  .then(() => {
    console.log("✅ TypeORM connected to MySQL");
  })
  .catch((err) => {
    console.error("❌ TypeORM connection error:", err);
  });

// Routes
app.use("/api/auth", authRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
