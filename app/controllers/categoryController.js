const sendTextMsg = require("../../javaScripts/sendMsgFunctions");
const db = require("../../database/connection");
const Category = require("../models/Category")(db.sequelize, db.Sequelize);
const Product = require("../models/Product")(db.sequelize, db.Sequelize);

// define relationships

// Category has Many Products
Category.hasMany(Product, {
  foreignKey: "category_id",
});
Product.belongsTo(Category, {
  foreignKey: "category_id",
});

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

const getCategories = async (store_id) => {
  let list = await Category.findAll(
    {
      where: {
        store_id: store_id,
      },
      include: [
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
      ],
    },
    { attributes: ["name_ar", "name_en", "store_id"] }
  );
 

  console.log("================================")
  console.log(list)
  console.log("================================")
  return list;
};

module.exports = getCategories;