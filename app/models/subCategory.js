module.exports = (sequelize, Sequelize) => {
    const SubCategory = sequelize.define("subCategory", {
      name_ar: {
        type: Sequelize.STRING
      }
    });
    return SubCategory;
  };