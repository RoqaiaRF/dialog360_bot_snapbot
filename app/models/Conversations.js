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
      },
      {
        timestamps: false,
      }
    );
    return Conversations;
  };