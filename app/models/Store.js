module.exports = (sequelize, Sequelize) => {
  const Store = sequelize.define(
    "store",
    {
      name_ar: {
        type: Sequelize.STRING,
      },

      lat: {
        type: Sequelize.DOUBLE,
      },
      lng: {
        type: Sequelize.DOUBLE,
      },
      parent_id: {
        type: Sequelize.BIGINT,
      },
      phone: {
        type: Sequelize.INTEGER,
      },

      type: {
        type: Sequelize.BIGINT,
      },

      name_en: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: false,
    }
  );
  return Store;
};
