const db = require("../../../database/connection");
const Conversations = require("../../models/Conversations")(
  db.sequelize,
  db.Sequelize
);

// Search Conversation if it exists
const isExistConversation = async (number_store, number_client, type) => {
  try {
    console.log("exists conversation number", number_store);
    const res = await Conversations.findOne(
      {
        where: {
          number_store: number_store,
          number_client: number_client,
          type
        },
      },
      {
        attributes: ["id"],
      }
    );
    console.log("it exists");
    console.log(res)
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
  console.log('//////////////////////')
  console.log(type)
  result = await isExistConversation(receiver, sender, type);
  console.log(result)
  if (!result) { 
    console.log('result is null ')
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
