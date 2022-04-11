const express = require("express");
const router = express.Router();
const bot = require("../javaScripts/bot");

router.post("/", function (req, res, next) {
  let message = req.body.Body;
  let sender_ID = req.body.From; // End-User Phone number
  let receiver_id = req.body.To; // store owner Phone number

  bot(sender_ID, receiver_id ,message);
});

module.exports = router;
