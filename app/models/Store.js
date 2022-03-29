module.exports = (sequelize, Sequelize) => {
    const Store = sequelize.define("store", {
      name_ar: {
        type: Sequelize.STRING
      }
    });
    return Store;
  };