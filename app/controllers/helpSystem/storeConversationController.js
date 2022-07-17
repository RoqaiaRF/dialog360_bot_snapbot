const db = require("../../../database/connection");
const Conversations = require("../../models/Conversations")(
  db.sequelize,
  db.Sequelize
);


// Search Conversation if it exists
const isExistConversation = async (number_store, number_client) => {
  try {
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
  userName
) => {
  let result;
  await isExistConversation(sender, receiver)
    .then((isExist) => {
      if (isExist) {
        result = isExist; // conversation_id of existing conversation
      } else {
        // Create a new Conversation
        Conversations.upsert({
          name: userName,
          status: 1,
          number_store: sender,
          number_client: receiver,
        }).then(function (x) {
          console.log(x);
          result = x.dataValues.id; // conversation_id of created conversation
        })
        .catch(function (error) {
          console.log("failed store conversation : ", error);
        });
      }
    })
    .catch(function (error) {
      console.log("store or recover a conversation failed: ", error);
    });

  return result;
};

module.exports = storeConversation;
