const storeConversation = require("../helpSystem/storeConversationController");
const storeNewMessage = require("../helpSystem/storeNewMessageController");

const helpSystemController = async (
  receiver,
  sender,
  contentMessage,
  userName
) => {
  // خزن المحادثة او اجلبها
  const conversation_id = await storeConversation(
    sender,
    receiver,
    contentMessage,
    userName
  );
  console.log(conversation_id, "conversation_id");
  // Store New Message
  storeNewMessage(conversation_id, receiver, contentMessage, sender);
};
module.exports = helpSystemController;

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
