module.exports = (sequelize, Sequelize) => {
  const category = sequelize.define(
    "category",
    {
      name_ar: {
        type: Sequelize.STRING,
      },
      store_id: {
        type: Sequelize.BIGINT,
      },
    },
    {
      timestamps: false,
    }
  );
  return category;
};