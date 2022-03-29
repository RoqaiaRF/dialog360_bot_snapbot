const db = require("../../database/connection");
const Store = require('../models/Store')(db.sequelize, db.Sequelize);

/**
 * function get All Branchs for store
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getAll = async (req, res) => {
   const stores = await Store.findAll({ attributes: ['name_ar']})
   return stores
  };