const db = require("../../../database/connection");

const Messages = require("../../models/Messages")(db.sequelize, db.Sequelize);


const storeNewMessage = async (
  conversation_id
  ,receiver,
  contentMessage,
  userName,
  sender,
  
) => {
  // Store a new Message
  Messages.create({
    message: contentMessage,
    conversation_id: conversation_id,
    sender_number: receiver,
  });
};

module.exports = storeNewMessage;
