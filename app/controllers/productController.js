const db = require("../../database/connection");
const Products = require("../models/Products")(db.sequelize, db.Sequelize);
const Quantity = require("../models/Quantity")(db.sequelize, db.Sequelize);
const redis = require("../../database/redis");
const Category = require("../models/Category")(db.sequelize, db.Sequelize);

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
Products.belongsTo(Category, {
  foreignKey: "category_id",
  targetKey: "id",
});
Products.hasOne(Quantity, {
  as: "productQuantity",
  foreignKey: "product_id",
  sourceKey: "id",
});
// function get Products & features

const getOrphanProducts = async ({ category_id, receiver_id, sender }) => {
  const products_redis = await redis.getUserVars(
    receiver_id,
    sender,
    "products"
  );
  if (products_redis) return JSON.parse(products_redis);
  let proudcts_list = await Products.findAll({
    where: {
      "$category.parent_id$": null,
      category_id,
    },
    include: [
      {
        model: Category,
      },
      {
        model: Products,
        as: "features",
        include: {
          model: Products,
          as: "parent",
        },
      },
    ],
  });
  products_list = proudcts_list.map((prdct) =>
    prdct.quantity > 1
      ? prdct
      : {
          ...prdct,
          name_ar: `${prdct.name_ar} (هذا المنتج غير متوفر حاليًا)`,
          name_en: `${prdct.name_en} (this product is out of stock)`,
        }
  );
  await redis.setUserVars(
    receiver_id,
    sender,
    "orphan_products",
    JSON.stringify(proudcts_list)
  );
  return proudcts_list.map((elm) => elm.dataValues);
};

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
          include: [
            {
              model: Products,
              as: "features",
              include: {
                model: Products,
                as: "parent",
              },
            },
            {
              model: Quantity,
              as: "productQuantity",
            },
          ],
        },
        { attributes: ["name_ar", "name_en", "category_id"] }
      );
      list = list.map((prdct) =>
        prdct.productQuantity.quantity > 0
          ? {
              ...prdct.dataValues,
              quantity: prdct.dataValues.productQuantity.dataValues.quantity,
            }
          : {
              ...prdct.dataValues,
              name_ar: `${prdct.dataValues.name_ar} (*هذا المنتج غير متوافر حاليًا*)`,
              name_en: `${prdct.dataValues.name_en} (*this product is out of stock*)`,
            }
      );
      await redis.setUserVars(
        receiver_id,
        sender,
        "products",
        JSON.stringify(list)
      );

      return list;
    } catch (error) {
      console.log(error)
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
module.exports = { getProducts, getOrphanProducts, getQuantity };
