const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// ✅ MySQL Database Connection Pool
// Secret key for JWT
const JWT_SECRET = "SuperSecretKey1243"; // Change as needed

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ success: false, message: "Access denied. No token provided." });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid token" });
  }
};

// Example: Protect the Employee API
app.get("/api/employee", authenticateToken, async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM emp_table");
    res.status(200).json({ success: true, empData: results });
  } catch (error) {
    console.error("❌ Database Query Error:", error);
    res.status(500).json({ success: false, message: "Database query failed", error });
  }
});
// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
