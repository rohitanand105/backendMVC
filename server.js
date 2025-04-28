// server.js (updated)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/api/employee', require('./src/routes/employeeRoutes'));
app.use('/api/mnpr', require('./src/routes/mnprRoutes'));
app.use('/api/auth', require('./src/routes/authRoutes'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
