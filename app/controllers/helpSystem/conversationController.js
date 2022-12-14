const db = require("../../../database/connection");
const { getUserVars } = require("../../../database/redis");
const { ModeEnum } = require("../../../javaScripts/ENUMS/EMode");
const sendMsg = require("../../../javaScripts/phases");
const {
  BotEventEmitter,
} = require("../../../javaScripts/services/BotService/BotEventListener");
const { Sequelize, sequelize } = db;
const Conversations = require("../../models/Conversations")(
  sequelize,
  Sequelize
);
const Messages = require("../../models/Messages")(db.sequelize, db.Sequelize);

const findConversations = async (req, res) => {
  const { store } = req;
  const { page = 1 } = req.query;
  const { per_page = 12 } = req.query;
  const { type = 0} = req.query
  const { phone } = store;
  const offset = (page - 1) * per_page;
  const limit = per_page;
  const [unread_conversations, unread_messages, data] = await Promise.all([
    Conversations.count({
      where: { number_store: phone, type },
      include: { model: Messages, where: { is_read: 0 }, attributes: [] },
      distinct: true,
      raw: true,
    }),
    Conversations.count({
      where: { number_store: phone, type },
      include: { model: Messages, where: { is_read: 0 }, attributes: [] },
      order: [[Messages, "createdAt", "DESC"]],
      limit,
      offset,
      subQuery: false,
      group: ["conversations.id"],
    }).then((res) => res.reduce((a, v) => ({ ...a, [v.id]: v.count }), {})),
    Conversations.findAll({
      where: { number_store: phone, type },
      include: {
        model: Messages,
        limit: 30,
        offset: 0,
        order: [["createdAt", "DESC"]],
      },
      order: [["updatedAt", "DESC"]],
      subQuery: false,
    }),
  ]);
  const onlineChatsPromises = [];
  data.map((elm) =>
    onlineChatsPromises.push(
      (async () => {
        const mode = await getUserVars(
          phone.trim(),
          elm.dataValues.number_client.trim(),
          "mode"
        );
        return { id: elm.dataValues.id, online: mode == "1" };
      })()
    )
  );
  const onlineChatsResponse = await Promise.all(onlineChatsPromises);
  const onlineChats = onlineChatsResponse.reduce(
    (a, v) => ({ ...a, [v.id]: v.online }),
    {}
  );
  if (data.length == 0) return res.status(204).json({ msg: "success", data });
  return res.status(200).json({
    msg: "success",
    data: data.map((conv) => ({
      ...conv.dataValues,
      online: onlineChats[conv.dataValues.id],
      unread_messages: unread_messages[conv.dataValues.id] || 0,
      lastMessage: conv.dataValues.messages[0],
    })),
    unread_conversations,
  });
};

const setMessagesRead = async (req, res) => {
  const { id } = req.params;
  const { store } = req;
  const { phone } = store;
  try {
    const store_conversations = await Conversations.findAll({
      where: { id, number_store: phone },
    });

    if (store_conversations.length == 0)
      return res.status(403).json({ msg: "you are not authorized " });

    await Messages.update(
      { is_read: true },
      {
        where: { conversation_id: id },
      }
    );
  } catch (err) {
    return res.status(500).json({ msg: "unexpected error in server" });
  }
  return res.status(204).json({ msg: "updated successfully" });
};

const findMessages = async (req, res) => {
  const { store } = req;
  const { page = 1 } = req.query;
  const { per_page = 30 } = req.query;
  const { id } = req.params;
  const { phone } = store;
  const offset = (page - 1) * per_page;
  const limit = per_page;

  

  const [conversation, count] = await Promise.all([
    Conversations.findOne({
      where: {
        id,
        number_store: phone,
      },
      include: {
        model: Messages,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      },

      order: [["createdAt", "DESC"]],
    }),
    Messages.count({ where: { conversation_id: id } }),
  ]);
  const mode = await getUserVars(
    phone.trim(),
    conversation.dataValues.number_client.trim(),
    "mode"
  );
  const last_page = Math.ceil(count / per_page);
  if (!conversation)
    return res.status(404).json({ msg: "not found", err: "not found" });
  const data = {
    ...conversation.dataValues,
    last_page,
    current_page: page,
    per_page,
  };
  return res.status(200).json({ msg: "success", data:{...conversation.dataValues,online:mode==ModeEnum.help} });
};

const storeMessage = async (req, res) => {
  const { id } = req.params;
  const { store } = req;
  const { phone } = store;
  const { message } = req.body;
  console.log();
  if (!message)
    return res.status(400).json({
      msg: "bad request",
      err: { message: "you should provide message" },
    });

  const conversation = await Conversations.findOne({
    where: { id, number_store: phone },
    attributes: ["id", "number_client"],
  });
  if (!conversation)
    return res.status(404).json({ msg: "not found", err: "not found" });

  await Messages.create({
    message,
    conversation_id: id,
    sender_number: phone,
    is_read: true,
  });
  const query = sequelize
    .getQueryInterface()
    .queryGenerator.updateQuery(
      "conversations",
      { updated_at: sequelize.literal("CURRENT_TIMESTAMP") },
      { id },
      { returning: false }
    );
  sequelize.query(query);
  sendMsg.customMessage(
    message,
    `whatsapp:+${conversation.dataValues.number_client}`,
    `whatsapp:+${phone}`
  );
  return res.status(200).json({ msg: "success" });
};

const endConversation = async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  const { store } = req;
  const { phone } = store;
  const storObj = store.dataValues;

  const conversation = await Conversations.findOne({
    where: { id, number_store: phone },
    attributes: ["id", "number_client"],
  });
  if (conversation == null)
    return res.status(403).json({ msg: "unauthorized" });
  const sender = conversation.dataValues.number_client;
  BotEventEmitter.emit("logout_help_mode", {
    storObj,
    sender,
    username,
    conversation_id: id,
  });
  return res.status(202).json({ msg: "success" });
};

module.exports = {
  findConversations,
  findMessages,
  storeMessage,
  setMessagesRead,
  endConversation,
};
