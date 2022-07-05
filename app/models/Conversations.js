module.exports = (sequelize, Sequelize) => {
    const Conversations = sequelize.define(
      "conversations",
      {
        name: {
          type: Sequelize.STRING,
        },
        status: {
          type: Sequelize.BOOLEAN,
        },
        number_store: {
          type: Sequelize.STRING,
        },
        number_client: {
          type: Sequelize.STRING,
        },
        created_at: {
          type: Sequelize.DATE,
        },
      },
      {
        timestamps: false,
      }
    );
    return Conversations;
  };