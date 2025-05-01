// src/config/ormconfig.js
const { DataSource } = require("typeorm");
const User = require("../entities/User");

const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "Rohit@1998",
  database: "ats",
  synchronize: false,
  logging: false,
  entities: [User],
});

module.exports = { AppDataSource };
