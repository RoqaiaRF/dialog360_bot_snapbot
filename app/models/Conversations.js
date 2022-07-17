const Messages = require("../models/Messages");
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
      createdAt: {
        field: "created_at",
        type: Sequelize.DATE,
      },
      updatedAt: {
        field: "updated_at",
        type: Sequelize.DATE,
      },
    },
    {
      timestamps: true,
    }
  );
  MessageModel = Messages(sequelize, Sequelize);
  Conversations.hasMany(MessageModel, {
    foreignKey: "conversation_id",
    targetKey: "id",
  });
  return Conversations;
};
