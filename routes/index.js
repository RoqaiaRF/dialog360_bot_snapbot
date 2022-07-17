const express = require("express");
const router = express.Router();
const ConversationRouter = require('./conversationRouter')
const {authorizeToken} = require('../middlewares/authorization')

const bot = require("../javaScripts/bot");

router.post("/", function (req, res, next) {
  if (!req.body) {
    return res.status(400).json({
      status: "Bad Request",
      message: "req body cannot be empty!",
    });
  }

  let message = req.body.Body; // text message sent
  let sender_ID = req.body.From; // End-User Phone number
  let receiver_id = req.body.To; // store owner Phone number
  let longitude = req.body.Longitude;
  let latitude = req.body.Latitude;
  let username = req.body.ProfileName;

  console.log("Receiver INDEX_ROUTER :  " + receiver_id);
  console.log("sender INDEX_ROUTER :  " + sender_ID);
  bot(sender_ID, receiver_id, message, longitude, latitude, username);

});

router.use('/conversation', authorizeToken, ConversationRouter)
module.exports = router;
