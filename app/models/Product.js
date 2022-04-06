module.exports = (sequelize, Sequelize) => {
  const product = sequelize.define(
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
  return product;
};