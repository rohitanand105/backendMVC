const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { createConnection } = require('typeorm');

// Entities
const User = require('./src/entities/User');
const Account = require('./src/entities/Account');

// Routes
const authRoutes = require('./src/routes/authRoutes');
const employeeRoutes = require('./src/routes/employeeRoutes');
const mnprRoutes = require('./src/routes/mnprRoutes');
const userRoutes = require('./src/routes/userRoutes');
const accountRoutes = require('./src/routes/accountRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Connect to DB
createConnection({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'your_db_name',
  synchronize: false,
  logging: false,
  entities: [User, Account]
}).then(() => {
  console.log('✅ Connected to MySQL database');

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/employee', employeeRoutes);
  app.use('/api/mnpr', mnprRoutes);
  app.use("/api", userRoutes);
  app.use('/api/accounts', accountRoutes);


  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
}).catch((error) => {
  console.error('❌ Error connecting to the database:', error);
});
