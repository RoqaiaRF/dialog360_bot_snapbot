module.exports = (sequelize, Sequelize) => {
    const Feature = sequelize.define(
      "feature",
      {
        name_ar: {
          type: Sequelize.STRING,
        },
        name_en: {
          type: Sequelize.STRING,
        },
        product_id: {
          type: Sequelize.BIGINT,
        },
        price: {
          type: Sequelize.DOUBLE,
        },
        description_ar: {
          type: Sequelize.STRING,
        },
        description_en: {
          type: Sequelize.STRING,
        },
        image: {
          type: Sequelize.STRING,
        },
        duration: {
          type: Sequelize.INTEGER,
        },
        quantity: {
          type: Sequelize.INTEGER,
        },
        status: {
          type: Sequelize.BOOLEAN,
        },
        status_private: {
          type: Sequelize.BOOLEAN,
        }
      },
      {
        timestamps: false,
      }
    );
    return Feature;
  };
  