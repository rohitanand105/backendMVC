const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost", // Change if using a remote server
  user: process.env.DB_USER || "root", // Your MySQL username
  password: process.env.DB_PASSWORD || "your_mysql_password", // Your MySQL password
  database: process.env.DB_NAME || "ats", // Your database name
  waitForConnections: true,
  connectionLimit: 10, // Adjust based on load
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL Connection Error:", err);
  } else {
    console.log("✅ MySQL Connected Successfully");
    connection.release();
  }
});

module.exports = pool;
