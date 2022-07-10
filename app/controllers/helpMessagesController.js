const db = require("../../database/connection");

const Messages = require("../models/Messages")(db.sequelize, db.Sequelize);
const Conversations = require("../models/Conversations")(
  db.sequelize,
  db.Sequelize
);

// --- define relationships ---

Conversations.hasMany(Messages, {
  as: "messages",
  foreignKey: "conversation_id",
  targetKey: "id",
});

Messages.belongsTo(Conversations, {
  as: "conversations",
  foreignKey: "conversation_id",
  targetKey: "id",
});

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
    return res.id;
  } catch (error) {
    return false;
  }
};

const storeConversation = async (
  receiver,
  sender,
  contentMessage,
  userName
) => {
  let result;
  await isExistConversation(sender, receiver).then((isExist) => {
    if (isExist) {
      // store new message in existing conversation
      console.log(isExist, "Exist Conversation");
      result =  isExist; // conversation_id of existing conversation
    } else {
      // Create a new Conversation
      Conversations.create({
        name: userName,
        status: 1,
        number_store: sender,
        number_client: receiver,
      }).then(function (x) {
        result =  x.dataValues.id; // conversation_id of created conversation
      });
    }
  });

  return result;
};

const storeNewMessage = async (receiver, sender, contentMessage, userName) => {
  // خزن المحادثة او اجلبها
  const conversation_id = await storeConversation(
    sender,
    receiver,
    contentMessage,
    userName
  );
  console.log(conversation_id ,"conversation_id");

  // Store a new Message
  Messages.create({
    message: contentMessage,
    conversation_id: conversation_id,
    sender_number: receiver,
  });
};
module.exports = storeNewMessage;

/*
  عندما يتم وصول رسالة لصاحب المتجر
 يتم البحث عن المحادثات في جدول المحادثات اذا كانت موجوده لا يتم انشاء محادثه  جديده 
وييتم ارسال الرساله في تلك المحادثه 
اما اذا لم يكن هناك محادثه سابقه ينشئ محادثه جديده ومن ثم يخزن الرساله في جدوزل الرسائل 

-فنكشن يبحث عن المحادثه ان كانت موجوده او لا ويرجع  اذا كان نعم يرجع conversation_id
- يتم انشاء فنكشن يعمل محادثة جديدة ويخزنها 
- فنكشن يخزن رسالة تابعه لمحادثه معينه 
- وفنكشن رئيسي 

**/
