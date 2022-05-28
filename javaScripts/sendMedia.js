const twilio = require("twilio");

// this line is important to use environment variables
require("dotenv").config();

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(ACCOUNT_SID, AUTH_TOKEN, { lazyloading: false }); //lazyloading:  speed of sending /true or false

//Send text & media message to specific number

const sendMedia = async (message, senderID, mediaUrl, receiver_ID) => {
  let result = receiver_ID.includes("whatsapp:+");
  let receiverID = receiver_ID;
  if (!result) {
    receiverID = "whatsapp:+" + receiver_ID;
  }
  await client.messages
    .create({
      from: receiverID,
      to: senderID,
      body: message,
      mediaUrl: mediaUrl,
    })
    .then((message) => {
      console.log(message.body);
    })

    .catch((error) => {
      console.log(`Error at sending message: ${error}`);
    });
};

module.exports = sendMedia;
