module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define(
    "category",
    {
      name_ar: {
        type: Sequelize.STRING,
      },
      name_en: {
        type: Sequelize.STRING,
      },
      store_id: {
        type: Sequelize.BIGINT,
      },
      parent_id: {
        type: Sequelize.BIGINT,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    },
    {
      timestamps: false,
    }
  );
  return Category;
};
