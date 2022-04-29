module.exports = (sequelize, Sequelize) => {
  const Quantity = sequelize.define(
    "quantity",
    {
      store_id: {
        type: Sequelize.BIGINT,
      },
      product_id: {
        type: Sequelize.BIGINT,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
    },
    {
      timestamps: false,
    }
  );
  return Quantity;
};
