const Sequelize = require("sequelize");
const sequelize = new Sequelize('defaultdb', 'doadmin', 'cnhtm0qcEPKumXV4', {
    host: 'db-mysql-nyc3-69101-do-user-9392750-0.b.db.ondigitalocean.com',
    dialect: 'mysql',
    port: 25060,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
module.exports = db;