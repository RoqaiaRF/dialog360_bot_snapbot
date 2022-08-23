const db = require("../../../database/connection");
const Conversations = require("../../models/Conversations")(
  db.sequelize,
  db.Sequelize
);

// Search Conversation if it exists
const isExistConversation = async (number_store, number_client) => {
  try {
    console.log("exists conversation number", number_store);
    const res = await Conversations.findOne(
      {
        where: {
          number_store: number_store,
          number_client: number_client,
        },
      },
      {
        attributes: ["id"],
      }
    );
    console.log("it exists");
    return res.id; // conversation_id
  } catch (error) {
    return false;
  }
};

// get or store Conversation
const storeConversation = async (
  receiver,
  sender,
  contentMessage,
  userName,
  type=0
) => {
  let result;
  result = await isExistConversation(receiver, sender, type);
  if (!result) {
    const new_conv = await Conversations.upsert({
      name: userName,
      status: 1,
      number_store: receiver,
      number_client: sender,
      type
    });
    result = new_conv[0].dataValues.id;
  }
  console.log("the resulkt issss", result);
  return result;
};

module.exports = storeConversation;
