//  conversation_id جلب جميع الرسائل التابعة لمحادثة معينه , على حسب ال  

const db = require("../../../database/connection");

const Messages = require("../../models/Messages")
(db.sequelize, db.Sequelize);

const Conversations = require("../../models/Conversations")(
  db.sequelize,
  db.Sequelize
);


const getMessages = async ( conversation_id ) =>{

  let listOfMessages = await Messages.findAll(
        {
          where: {
            conversation_id: conversation_id,
          },
        },
        {
          attributes: [
            "message",
            "sender_number",
            "conversation_id",
            "read_at",
            "created_at",
            "updated_at",
         
          ],
        }
      );
    return listOfMessages;


}

module.exports = getMessages;