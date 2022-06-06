const db = require("../../database/connection");
const Products = require("../models/Products")(db.sequelize, db.Sequelize);
const Quantity = require("../models/Quantity")(db.sequelize, db.Sequelize);
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

const getProducts = async (receiver_id, sender, category_id) => {
  const products_list = await redis.getUserVars(
    receiver_id,
    sender,
    "products"
  );
  if (products_list) {

    return JSON.parse(products_list);
  } else {
    try {
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
      await redis.setUserVars(
        receiver_id,
        sender,
        "products",
        JSON.stringify(list)
      );

      
      return list;
    } catch (error) {

      return {};
    }
  }
};

const getQuantity = async (store_id, product_id) => {
  try {
    const res = await Quantity.findOne(
      {
        where: {
          store_id,
          product_id,
        },
      },
      {
        attributes: ["quantity"],
      }
    );
    return res.quantity;
  } catch (error) {

    return null;
  }
};
module.exports = { getProducts, getQuantity };
