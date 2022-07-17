const db = require("../../../database/connection");

const Messages = require("../../models/Messages")(db.sequelize, db.Sequelize);

let result;

const storeNewMessage = async (
  conversation_id
  ,receiver,
  contentMessage,
  sender,
  
) => {
  // Store a new Message
  await Messages.create({
    message: contentMessage,
    conversation_id: conversation_id,
    sender_number: receiver,
  })
  .then(() => {
    result=  {status: 200, message: " message stored successfully"}
  })
  .catch((err) => {
    result = {status: 400, message: `Error storing message: ${err}` }
  });
  return result;
};

module.exports = storeNewMessage;
