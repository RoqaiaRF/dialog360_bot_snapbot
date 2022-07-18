const express = require("express");
const router = express.Router();
const ConversationController = require("../app/controllers/helpSystem/conversationController");
const { findConversations, findMessages, storeMessage } = ConversationController;
router.get("/", findConversations);
router.get('/:id', findMessages)
router.put('/:id', storeMessage)
module.exports = router
