const Sequelize = require("sequelize");
require("dotenv").config();

const DB_DATABASE = process.env.DB_DATABASE;
const DB_USERNAMES = process.env.DB_USERNAMES;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DIALECT = process.env.DIALECT;

const sequelize = new Sequelize(DB_DATABASE, DB_USERNAMES, DB_PASSWORD, {
    host: "localhost",
    dialect: DIALECT,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
module.exports = db;