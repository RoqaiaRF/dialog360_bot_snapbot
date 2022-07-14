const db = require("../../../database/connection");

const Messages = require("../../models/Messages")(db.sequelize, db.Sequelize);


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
