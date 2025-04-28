// /models/userModel.js
const pool = require('../config/db');

exports.createUser = async (username, email, hashedPassword) => {
  const [result] = await pool.query(
    `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
    [username, email, hashedPassword]
  );
  return result;
};

exports.getUserByEmail = async (email) => {
  const [users] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
  return users[0];
};
