module.exports = (sequelize, Sequelize) => {
    const Messages = sequelize.define(
      "messages",
      {
        message: {
          type: Sequelize.STRING,
        },
        sender_number: {
          type: Sequelize.STRING,
        },
        conversation_id: {
          type: Sequelize.BIGINT,
        },
        read_at: {
          type: Sequelize.DATE,
        },
      },
      {
        timestamps: false,
      }
    );
    return Messages;
  };