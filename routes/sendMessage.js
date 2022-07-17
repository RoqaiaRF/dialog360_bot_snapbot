// ارسال رسالة واتساب وتخزينها :)

const express = require("express");
const router = express.Router();

const sendTextMsg = require("../javaScripts/sendMsgFunctions");
const storeNewMessage = require("../app/controllers/helpSystem/storeNewMessageController");

router.post("/", async function (req, res, next) {
  if (!req.body.store_number) {
    return res.status(400).json({
      status: "Bad Request",
      message: "please send correct store_number lik: 96563336437",
    });
  } else if (!req.body.client_number) {
    return res.status(400).json({
      status: "Bad Request",
      message: `please send correct client_number like: "96563336437"`,
    });
  } else if (!req.body.message) {
    return res.status(400).json({
      status: "Bad Request",
      message: `please send a message in string format`,
    });
  } else if (!req.body.conversation_id) {
    return res.status(400).json({
      status: "Bad Request",
      message: `please send a conversation_id`,
    });
  } else {

    // send message to whatssapp
    const result_sendTextMsg =  await sendTextMsg(req.body.message, req.body.client_number, req.body.store_number);

    // store message in database
    const result_storeNewMessage = await
      storeNewMessage(
        req.body.conversation_id,
        req.body.client_number,
        req.body.message,
        req.body.store_number
      )
    if(result_sendTextMsg){ 
      res.status(result_storeNewMessage.status).json({
        status: result_storeNewMessage.status,
        message : result_storeNewMessage.message
      });
    } 
    else {
      return res.status(400).json({
        status: "Bad Request",
        message: `Error at sending message, Please check store phone number first of all`,
      });
    }
    console.log(result_sendTextMsg)
  }
});

module.exports = router;
