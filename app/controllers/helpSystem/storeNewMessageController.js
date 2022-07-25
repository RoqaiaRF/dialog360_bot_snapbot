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
  await Messages.create({
    message: contentMessage,
    conversation_id: conversation_id,
    sender_number: sender,
    is_read: false,
  })
    .then(async () => {
      result = {
        status: 200,
        message: "message created successfully",
      };
    })
    .catch((err) => {
      result = {
        status: 400,
        message: "Error creating message: " + err,
      };
    });
  const query = db.sequelize
    .getQueryInterface()
    .queryGenerator.updateQuery(
      "conversations",
      { updated_at: db.sequelize.literal("CURRENT_TIMESTAMP") },
      { id: conversation_id },
      { returning: false }
    );
  db.sequelize.query(query).then((res) => console.log("updaaaaaateedddddd"));
  return result;
};

module.exports = storeNewMessage;
