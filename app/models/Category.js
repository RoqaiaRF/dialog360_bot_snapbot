module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("category", {
      name_ar: {
        type: Sequelize.STRING
      }
    });
    return Category;
  };