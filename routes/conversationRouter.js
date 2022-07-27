const express = require("express");
const router = express.Router();
const ConversationController = require("../app/controllers/helpSystem/conversationController");
const {
  findConversations,
  findMessages,
  storeMessage,
  setMessagesRead,
  endConversation,
} = ConversationController;
router.get("/", findConversations);
router.get("/:id", findMessages);
router.put("/:id", storeMessage);
router.post("/endConversation/:id", endConversation);
router.post("/:id/setIsRead", setMessagesRead);
module.exports = router;
