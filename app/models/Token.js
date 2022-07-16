module.exports = (sequelize, Sequelize) => {
    const Token = sequelize.define(
      "token",
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
    return Token;
  };
  