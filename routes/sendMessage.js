// ارسال رسالة واتساب وتخزينها :)

const express = require("express");
const router = express.Router();

const sendTextMsg = require ("../javaScripts/sendMsgFunctions")
const storeNewMessage = require("../app/controllers/helpSystem/storeNewMessageController")

router.post("/", async function  (req, res, next) {
    if (!req.body.store_number ) {
        return res.status(400).json({
          status: "Bad Request",
          message: "please send correct store_number lik: 96563336437",
        });
      }
      else if (!req.body.client_number){
        return res.status(400).json({
            status: "Bad Request",
            message: `please send correct client_number like: "96563336437"`,
          });
      }
      else if (!req.body.message){
        return res.status(400).json({
            status: "Bad Request",
            message: `please send a message in string format`,
          });
      }
      else if (!req.body.conversation_id){
        return res.status(400).json({
            status: "Bad Request",
            message: `please send a conversation_id`,
          });
      }
    else {
        const result =  req.body
        
        // send message to whatssapp 
        sendTextMsg(result.message, result.store_number, result.client_number);

        // store message in database
        storeNewMessage(result.message, result.store_number, result.client)

      }

});

module.exports = router;
