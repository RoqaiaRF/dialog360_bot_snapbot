const db = require("../../../database/connection");

const Messages = require("../../models/Messages")(db.sequelize, db.Sequelize);
const Conversations = require("../../models/Conversations")(
  db.sequelize,
  db.Sequelize
);

// --- define relationships ---

Conversations.hasMany(Messages, {
  as: "messages",
  foreignKey: "conversation_id",
  targetKey: "id",
});

// اعادة تسمية المحادثة الواحدة

const renameConversations = async (newName, conversation_id) => {
  const [updatedRows] = await Conversations.update(
    { name: newName },
    { where: { id: conversation_id } }
  )
    .then((updatedRows) => {
      return ` Conversation  successfully updated, rows: ${updatedRows}`;
    })
    .catch((error) => {
      return undefined;
    });
};

module.exports = renameConversations;
