const db = require("../../../database/connection");
const Conversations = require("../../models/Conversations")(
  db.sequelize,
  db.Sequelize
);
const Messages = require("../../models/Messages")(db.sequelize, db.Sequelize);

const findConversations = async (req, res) => {
  const { store } = req;
  const { page = 1 } = req.query;
  const { per_page = 12 } = req.query;
  const { phone } = store;
  const offset = (page - 1) * per_page;
  const limit = per_page;
  const data = await Conversations.findAll({
    where: { number_store: phone },
    include: {
      model: Messages,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    },
    order: [['createdAt', 'DESC']],
  });
  if (data.length == 0) return res.status(204).json({ msg: "success", data });
  return res.status(200).json({
    msg: "success",
    data: data.map((conv) => ({
      ...conv.dataValues,
      lastMessage: conv.dataValues.messages[0],
    })),
  });
};

const findMessages = async (req, res) => {
  const { store } = req;
  const { page=1 } = req.query;
  const { per_page=30} = req.query;
  const { id } = req.params;
  const { phone } = store;
  const offset = (page - 1) * per_page;
  const limit = per_page;

  const[conversation, count] = await Promise.all([Conversations.findOne({
    where: {
      id,
      number_store: phone,
    },
    include: {
      model: Messages,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    },

    order: [['createdAt', 'DESC']],
  }),
  Messages.count({where:{conversation_id:id}})]
  )
  const last_page = Math.ceil(count/per_page);
  if (!conversation)
    return res.status(404).json({ msg: "not found", err: "not found" });
  const data = {...conversation.dataValues,last_page, current_page:page, per_page }
    return res.status(200).json({ msg: "success", data });
};

const storeMessage = async (req, res) => {
  const { id } = req.params;
  const { store } = req;
  const { phone } = store;
  const { message } = req.body;
  
  if (!message)
    return res
      .status(400)
      .json({
        msg: "bad request",
        err: { message: "you should provide message" },
      });

  const conversation = await Conversations.findOne({
    where: { id, number_store: phone },
    attributes: ["id"],
  });
  if (!conversation)
    return res.status(404).json({ msg: "not found", err: "not found" });

  await Messages.create({
    message,
    conversation_id: id,
    sender_number: phone,
  });
  return res.status(200).json({ msg: "success" });
};

module.exports = {
  findConversations,
  findMessages,
  storeMessage,
};
