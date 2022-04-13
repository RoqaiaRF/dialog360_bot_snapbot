module.exports = (sequelize, Sequelize) => {
  const Region = sequelize.define(
    "region",
    {
      name_ar: {
        type: Sequelize.STRING,
      },
      name_en: {
        type: Sequelize.STRING,
      },
      lat: {
        type: Sequelize.DOUBLE,
      },
      lng: {
        type: Sequelize.DOUBLE,
      },
      store_id: {
        type: Sequelize.BIGINT,
      },
      city_id: {
        type: Sequelize.INTEGER,
      },
    },
    {
      timestamps: false,
    }
  );
  return Region;
};
