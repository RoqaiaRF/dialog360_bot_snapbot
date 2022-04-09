module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define(
    "product",
    {
      name_ar: {
        type: Sequelize.STRING,
      },
      category_id: {
        type: Sequelize.INTEGER,
      },
    },
    {
      timestamps: false,
    }
  );
  return Product;
};
