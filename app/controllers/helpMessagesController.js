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
const isExistConversation = (number_store, number_client) => {
  return Conversations.count({
    where: { number_store: number_store, number_client: number_client },
  }).then((count) => {
    if (count > 0) {
      return true;
    }
    return false;
  });
};

const storeConversation = (receiver, sender, contentMessage, userName) => {
  isExistConversation(sender, receiver).then((isExist) => {
    if (isExist) {
      // store new message in existing conversation
      //console.log("Exist Conversation");
    } else {
      // Create a new Conversation
      Conversations.create({
        name: userName,
        status: 1,
        number_store: sender,
        number_client: receiver,
      });

      //console.log("Not Exist Conversation");
    }
  });
};

const main = () => {};
module.exports = storeConversation;

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
