const sendTextMsg = require("../../javaScripts/sendMsgFunctions");
const db = require("../../database/connection");
const product = require("../models/Product")(db.sequelize, db.Sequelize);

exports.getProducts = async (id) => {
  let list = await product.findAll({where : {category_id: id}},{ attributes: ["name_ar", "category_id"] });
  return list;
  
};
