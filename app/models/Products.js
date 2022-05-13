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
      parent_id: {
        type: Sequelize.BIGINT,
      },
    },
    {
      timestamps: false,
    }
  );
  return Product;
};
