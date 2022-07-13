const db = require("../../database/connection");

const Messages = require("../models/Messages")(db.sequelize, db.Sequelize);
const Conversations = require("../models/Conversations")(
  db.sequelize,
  db.Sequelize
);

Messages.belongsTo(Conversations, {
  as: "conversations",
  foreignKey: "conversation_id",
  targetKey: "id",
});

const storeNewMessage = async (
  receiver,
  sender,
  contentMessage,
  userName,
  conversation_id
) => {
  // Store a new Message
  Messages.create({
    message: contentMessage,
    conversation_id: conversation_id,
    sender_number: receiver,
  });
};

module.exports = storeNewMessage;
