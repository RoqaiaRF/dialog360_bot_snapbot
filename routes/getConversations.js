const express = require("express");
const router = express.Router();

const getConversations = require("../app/controllers/helpSystem/getConversationsController")

router.get("/", async function  (req, res, next) {
    if (!req.body.store_number ) {
        return res.status(400).json({
          status: "Bad Request",
          message: "req body cannot be empty!",
        });
      }
    else {
      const conversations = await getConversations(req.body.store_number)
       res.send( conversations );
      }

});

module.exports = router;
