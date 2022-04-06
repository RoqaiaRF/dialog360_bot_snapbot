const sendTextMsg = require("../../public/javascripts/sendMsgFunctions");
const db = require("../../database/connection");
const category = require("../models/Category")(db.sequelize, db.Sequelize);

exports.getCategories = async () => {
  let list = await category.findAll({ attributes: ["name_ar", "store_id"] });
  return list;
};
