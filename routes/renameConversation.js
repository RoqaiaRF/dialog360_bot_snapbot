
const express = require("express");
const router = express.Router();

const renameConversations = require("../app/controllers/helpSystem/renameConversationController")

router.post("/", async function  (req, res, next) {
    if (!req.body.conversation_id && req.body.newName  ) {
        return res.status(400).json({
          status: "Bad Request",
          message: "please send conversation_id ",
        });
      }
    else {
      const rename = await renameConversations(req.body.newName, req.body.conversation_id)
      if(rename){
        res.send( rename );
      } 
      else {
        return res.status(400).json({
          status: "Bad Request",
          message: "Conversation not found",
        });
      }
      }

});

module.exports = router;
