const Sequelize = require("sequelize");
require("dotenv").config();

const DB_DATABASE = process.env.DB_DATABASE;
const DB_USERNAMES = process.env.DB_USERNAMES;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;

const sequelize = new Sequelize(DB_DATABASE, DB_USERNAMES, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  port: DB_PORT,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
module.exports = db;
