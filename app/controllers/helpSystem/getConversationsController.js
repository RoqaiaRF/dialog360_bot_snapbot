
const db = require("../../../database/connection");

const Messages = require("../../models/Messages")
(db.sequelize, db.Sequelize);

const Conversations = require("../../models/Conversations")(
  db.sequelize,
  db.Sequelize
);

  // --- define relationships ---

  /* Conversations.hasMany(Messages, {
    as: "messages",
    foreignKey: "conversation_id",
    targetKey: "id",
  }); */

// احضار جميع المحادثات حسب رقم هاتف للمتجر 

const getConversations = async ( number_store) => {
    let listOfConversations = await Conversations.findAll(
        {
          where: {
            number_store: number_store,
          },
        },
        {
          attributes: [
            "name",
            "status",
            "number_store",
            "number_client",
            "created_at",
            "updated_at",
         
          ],
        }
      );
    return listOfConversations;


};

module.exports = getConversations; 