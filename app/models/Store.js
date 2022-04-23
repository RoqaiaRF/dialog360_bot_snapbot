module.exports = (sequelize, Sequelize) => {
  const Store = sequelize.define(
    "store",
    {
      name_ar: {
        type: Sequelize.STRING,
      },
      name_en: {
        type: Sequelize.STRING,
      },

      description_ar: {
        type: Sequelize.STRING,
      },
      description_en: {
        type: Sequelize.STRING,
      },
      logo: {
        type: Sequelize.STRING,
      },

      pay_when_receiving: {
        type: Sequelize.BOOLEAN,
      },
      reservations_policy: {
        type: Sequelize.BOOLEAN,
      },
      pay_after_receiving:{
        type: Sequelize.BOOLEAN,
      },
      is_store: {
        type: Sequelize.BOOLEAN,
      },
      states: {
        type: Sequelize.STRING,
      },

      zoom: {
        type: Sequelize.DOUBLE,
      },



      distance: {
        type: Sequelize.DOUBLE,
      },
      user_id: {
        type: Sequelize.BIGINT,
      },
      country_id: {
        type: Sequelize.BIGINT,
      },
      city_id: {
        type: Sequelize.BIGINT,
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

      type_id: {
        type: Sequelize.BIGINT,
      },

     
    },
    {
      timestamps: false,
    }
  );
  return Store;
};
