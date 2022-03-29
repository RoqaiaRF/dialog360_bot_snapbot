module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
      title: {
        type: Sequelize.STRING
      }
    });
    return Product;
  };