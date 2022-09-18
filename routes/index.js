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
 // console.log(req.body)
  let message = req.body.messages[0].text.body; // text message sent
  let sender_ID = req.body.messages[0].from; // End-User Phone number
  let receiver_id = "201281705838"; // store owner Phone number
  let longitude = req.body.Longitude;
  let latitude = req.body.Latitude;
  let username = req.body.ProfileName;
  console.log("Receiver INDEX_ROUTER :  " , receiver_id);
  console.log("sender INDEX_ROUTER :  " , sender_ID);
  console.log("message :  " , message);


  bot(sender_ID, receiver_id, message, longitude, latitude, username);
});

router.use("/conversation", authorizeToken, ConversationRouter);
router.post("/authorize/:id", authorizeToken, checkAuthentication);
module.exports = router;


/* req.body at Dialog 360 :

{
  contacts: [ { profile: [Object], wa_id: '962799849386' } ],
  messages: [
    {
      from: '962799849386',
      id: 'ABEGlieZhJOGAgo-sFz22dR7ApfZ',
      text: [Object],
      timestamp: '1663267221',
      type: 'text'
    }
  ]
}



*/