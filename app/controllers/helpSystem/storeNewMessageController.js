const db = require("../../../database/connection");

const Messages = require("../../models/Messages")(db.sequelize, db.Sequelize);


const storeNewMessage = async (
  conversation_id
  ,receiver,
  contentMessage,
  userName,
  sender,
  
) => {
  let result;
  // Store a new Message
  console.log(contentMessage)
  await Messages.create({
    message: contentMessage,
    conversation_id: conversation_id,
    sender_number: receiver,
  })
  .then(() => {
    result= {
      status: 200,
      message: "message created successfully"
    }
  })
  .catch(err => {
    result = {
      status: 400,
      message: "Error creating message: " + err
    }
  });
  return result;
};

module.exports = storeNewMessage;
