const db = require("../../database/connection");
const Products = require("../models/Products")(db.sequelize, db.Sequelize);
const redis = require("../../database/redis");
// Products has Many features
Products.hasMany(Products, {
  as: "features",
  foreignKey: "parent_id",
  targetKey: "id",
});

Products.belongsTo(Products, {
  as: "parent",
  foreignKey: "parent_id",
  targetKey: "id",
});

// function get Products & features
 
const getProducts = async (sender, category_id) => {
  const products_list = await redis.getUserVars(sender, "products");
  if (products_list) {
    console.log("from cache");
    return JSON.parse(products_list);
  } else {
    let list = await Products.findAll(
      {
        where: {
          category_id: category_id,
          parent_id: null,

        },
        include: {
          model: Products,
          as: "features",
          include: {
            model: Products,
            as: "parent",
          },
        },
       
      },
      { attributes: ["name_ar", "name_en", "category_id"] }
    );
    await redis.setUserVars(sender, "products", JSON.stringify(list));
    console.log("from db");
    return list;
  }
};

module.exports = getProducts;
 