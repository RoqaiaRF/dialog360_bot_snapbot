const db = require("../../database/connection");
const product = require("../models/Product")(db.sequelize, db.Sequelize);
const redis = require("../../database/redis");

const getProducts = async (sender, id) => {
  const products_list = await redis.getUserVars(sender, "products");
  if(products_list){
    return JSON.parse(products_list)
  }else{
  let list = await product.findAll(
    {
      where : {
        category_id: id
      }
    },
    { attributes: ["name_ar", "category_id"] });
    await redis.setUserVars(
      sender,
      "products",
      JSON.stringify(list)
    );
  return list;
  }
};

module.exports = getProducts;