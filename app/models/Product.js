module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define(
    "product",
    {
      name_ar: {
        type: Sequelize.STRING,
      },
      name_en: {
        type: Sequelize.STRING,
      },
      type_product: {
        type: Sequelize.BOOLEAN,
      },
      category_id: {
        type: Sequelize.BIGINT,
      },
      price: {
        type: Sequelize.DOUBLE,
      },
      description_ar: {
        type: Sequelize.STRING,
      },
      description_en: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      duration: {
        type: Sequelize.INTEGER,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.BOOLEAN,
      },
    },
    {
      timestamps: false,
    }
  );
  return Product;
};
