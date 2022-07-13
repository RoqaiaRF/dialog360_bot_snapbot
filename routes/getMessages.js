const express = require("express");
const router = express.Router();

const getMessages = require("../app/controllers/getMessagesController")

router.post("/", async function  (req, res, next) {
    if (!req.body.conversation_id ) {
        return res.status(400).json({
          status: "Bad Request",
          message: "please send conversation_id ",
        });
      }
    else {
      const messages = await getMessages(req.body.conversation_id)
       res.send( messages );
      }

});

module.exports = router;
