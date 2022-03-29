module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("order", {
      name_ar: {
        type: Sequelize.STRING
      }
    });
    return Order;
  };