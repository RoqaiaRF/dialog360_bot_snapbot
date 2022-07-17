const express = require("express");
const router = express.Router();
const ConversationController = require("../app/controllers/helpSystem/conversationController");
const { findConversations, findMessages } = ConversationController;
router.get("/", findConversations);
router.get('/:id', findMessages)

module.exports = router
