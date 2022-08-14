const express = require("express");
const router = express.Router();
const ConversationRouter = require("./conversationRouter");
const getWorkTime = require("../app/controllers/workTimeController")
const bot = require("../javaScripts/bot");
const {
  authorizeToken,
  checkAuthentication,
} = require("../middlewares/authorization");

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


// Just TESTING
router.get("/", function (req, res, next) {
  getWorkTime()
});


router.use("/conversation", authorizeToken, ConversationRouter);
router.post("/authorize/:id", authorizeToken, checkAuthentication);
module.exports = router;
