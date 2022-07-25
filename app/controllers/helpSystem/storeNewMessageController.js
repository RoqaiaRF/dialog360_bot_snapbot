const db = require("../../../database/connection");
const Conversations = require("../../models/Conversations")(
  db.sequelize,
  db.Sequelize
);

const Messages = require("../../models/Messages")(db.sequelize, db.Sequelize);

const storeNewMessage = async (
  conversation_id,
  receiver,
  contentMessage,
  userName,
  sender
) => {
  let result;
  // Store a new Message
  console.log(contentMessage);
  const new_message =  await Messages.create({
    message: contentMessage,
    conversation_id: conversation_id,
    sender_number: sender,
    is_read:0
  })
  console.log(new_message)
  const query = db.sequelize
    .getQueryInterface()
    .queryGenerator.updateQuery(
      "conversations",
      { updated_at: db.sequelize.literal("CURRENT_TIMESTAMP") },
      { id: conversation_id },
      { returning: false }
    );
  db.sequelize.query(query).then((res) => console.log("updaaaaaateedddddd"));
  return new_message.dataValues;
};

module.exports = storeNewMessage;
