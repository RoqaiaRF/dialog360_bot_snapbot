
const express = require("express");
const router = express.Router();

const renameConversations = require("../app/controllers/renameConversationController")

router.post("/", async function  (req, res, next) {
    if (!req.body.conversation_id && req.body.newName ) {
        return res.status(400).json({
          status: "Bad Request",
          message: "please send conversation_id ",
        });
      }
    else {
      const rename = await renameConversations(req.body.newName, req.body.conversation_id)
       res.send( rename );
      }

});

module.exports = router;
