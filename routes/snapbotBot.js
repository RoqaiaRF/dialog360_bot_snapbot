var express = require("express");
var router = express.Router();

const snapbotBot = require("../javaScripts/snapbotBot");

router.post("/", (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      status: "Bad Request",
      message: "req body cannot be empty!",
    });
  } else {
    
    let message = req.body.Body;
    let Sender_ID = req.body.From;
    let username = req.body.ProfileName;

    snapbotBot(message, Sender_ID, username);

    return res.status(200).json({
      status: "success",
      message: req.body,
    });
  }
});

module.exports = router;
