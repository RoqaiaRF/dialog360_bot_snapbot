const express = require("express");
const router = express.Router();

const ConversationController = require("../app/controllers/helpSystem/conversationController");

router.get("/", async function (req, res, next) {
  const { page } = req.params;
  const { per_page } = req.params;
  const { store } = req;
  const { phone } = store;
  const conversations = await ConversationController.findConversations({ phone, page, per_page });
  res.send(conversations);
});

module.exports = router;
