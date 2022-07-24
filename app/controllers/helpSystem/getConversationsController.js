
const db = require("../../../database/connection");

const Messages = require("../../models/Messages")
(db.sequelize, db.Sequelize);

const Conversations = require("../../models/Conversations")(
  db.sequelize,
  db.Sequelize
);

  // // --- define relationships ---

  //  Conversations.hasMany(Messages, {
  //   as: "messages",
  //   foreignKey: "conversation_id",
  //   targetKey: "id",
  // }); 


const getConversation = async ( number_store, number_client) => {
    let IdOfConversation = await Conversations.findOne(
        {
          where: {
            number_store: number_store,
            number_client: number_client,
          },
        },
        {
          attributes: [
            "id",
           
          ],
        }
      );
    return IdOfConversation?.dataValues?.id ;


};

module.exports = getConversation; 