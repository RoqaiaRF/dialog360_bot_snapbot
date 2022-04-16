module.exports = (sequelize, Sequelize) => {
  const order = sequelize.define("order", {
    name_ar: {
      type: Sequelize.STRING,
    },
    name_en: { 
      type: Sequelize.STRING,
    },
  });
  return order;
};
 