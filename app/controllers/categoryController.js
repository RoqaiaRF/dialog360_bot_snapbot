const db = require("../../database/connection");
const Redis = require("ioredis");
const Category = require("../models/Category")(db.sequelize, db.Sequelize);
const Product = require("../models/Products")(db.sequelize, db.Sequelize);

const redis = require("../../database/redis");
require("dotenv").config();

const REDIS_URL = process.env.REDIS_URL;
const client = new Redis(REDIS_URL);

// Category has Many subCategories
Category.hasMany(Category, {
  as: "subCategories",
  foreignKey: "parent_id",
  targetKey: "id",
});


// Category has Many Products
Category.hasMany(Product, {
  as: "products",
  foreignKey: "category_id",
  targetKey: "id",
});

Category.belongsTo(Category, {
  as: "parent",
  foreignKey: "parent_id",
  targetKey: "id",
});

// function get categories & subCategories

const getCategories = async (receiver_id, sender, store_id, type) => {
  let cats = await client.get(`${receiver_id}:${sender}:cats`);

  if (cats) {

    return JSON.parse(cats);
  } else {
    let list = await Category.findAll(
      {
        where: {
          store_id: store_id,
          type: type,
          parent_id: null,
          deleted_at: null,
        },
        include: 
        [ {
          model: Category,
          as: "subCategories",
          include: {
            model: Category,
            as: "parent",
          },
        },
        {
          model: Product,
          as: "products",
        }
      ]

// [ عارضتبن]
// { حاضنتين}


      },
      { attributes: ["name_ar", "name_en", "store_id"] }
    );

    await redis.setUserVars(receiver_id, sender, "cats", JSON.stringify(list));
    await redis.setUserVars(receiver_id, sender, "subcats", JSON.stringify(list.subCategories));
    await redis.setUserVars(receiver_id, sender, "cats", JSON.stringify(list));


    return list;
  }
};




module.exports = getCategories;
