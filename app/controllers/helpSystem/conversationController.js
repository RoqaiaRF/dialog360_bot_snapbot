const db = require("../../../database/connection");

const Messages = require("../../models/Messages")(db.sequelize, db.Sequelize);

const Conversations = require("../../models/Conversations")(
  db.sequelize,
  db.Sequelize
);

const findConversations = async ({ phone, page = 1, per_page = 12 }) => {
  const offset = (page - 1) * per_page;
  const limit = per_page;
  const data = await Conversations.findAll({
    where: { phone },
    limit,
    offset,
    include: [
      {
        model: Messages,
        limit: 12,
        offset: 0,
      },
    ],
  });
  if (data.length == 0) return res.status(204).json({ msg: "success", data });
  return res.status(200).json({ msg: "success", data });
};

const findMessages = async ({
  phone,
  conversation_id,
  page = 1,
  per_page = 12,
}) => {
  const offset = (page - 1) * per_page;
  const limit = per_page;
  const data = await Messages.findAll({
    where: { conversation_id },
    limit,
    offset,
  });
  if (data.length == 0) return res.status(204).json({ msg: "success", data });
  return res.status(200).json({ msg: "success", data });
};

module.exports = {
  findConversations,
  findMessages
}