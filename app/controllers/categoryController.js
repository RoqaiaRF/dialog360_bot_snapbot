const db = require("../../database/connection");
const Category = require("../models/Category")(db.sequelize, db.Sequelize);
const redis = require("../../database/redis");
// define relationships

// Category has Many Products
/* Category.hasMany(Product, {
  foreignKey: "category_id",
});
Product.belongsTo(Category, {
  foreignKey: "category_id",
}); */

// Category has Many subCategories
Category.hasMany(Category, {
  as: "subCategories",
  foreignKey: "parent_id",
  targetKey: "id",
});

Category.belongsTo(Category, {
  as: "parent",
  foreignKey: "parent_id",
  targetKey: "id",
});

// function get categories & subCategories

const getCategories = async (receiver_id,sender, store_id, type) => {
  const cats = await redis.getUserVars(receiver_id,sender, "cats");
  if (cats) {
    console.log("from cache");
    return JSON.parse(cats);
  } else {
    let list = await Category.findAll(
      {
        where: {
          store_id: store_id,
          type: type,
          parent_id: null,
          deleted_at: null

        },
        include: {
          model: Category,
          as: "subCategories",
          include: {
            model: Category,
            as: "parent",
          },
        },
        /*         include: [
          {
            model: Category,
            as: "subCategories",
           include: {
              model: Product,
            }, 
          },
          {
            model: Product,
          },
        ], */
      },
      { attributes: ["name_ar", "name_en", "store_id"] }
    );
    await redis.setUserVars(receiver_id,sender, "cats", JSON.stringify(list));
    console.log("from db");
    return list;
  }
};

module.exports = getCategories;
