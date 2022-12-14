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
      pay_after_receiving: {
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
      tax: {
        type: Sequelize.DOUBLE,
      },
      is_reservation: {
        type: Sequelize.BOOLEAN,
      },
      is_order: {
        type: Sequelize.BOOLEAN,
      },
      pickup_Policy: {
        type: Sequelize.BOOLEAN,
      },
      policy_send_location:{
        type:Sequelize.BOOLEAN
      },
      is_closed_bot: {
        type: Sequelize.BOOLEAN,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    },
    { 
      timestamps: false,
    }
  );
  return Store;
};
