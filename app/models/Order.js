module.exports = (sequelize, Sequelize) => {
    const order = sequelize.define("order", {
      name_ar: {
        type: Sequelize.STRING
      }
    });
    return order;
  };