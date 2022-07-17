const twilio = require("twilio");

// this line is important to use environment variables
require("dotenv").config();

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(ACCOUNT_SID, AUTH_TOKEN, { lazyloading: false }); //lazyloading:  speed of sending /true or false

//Send text & emoji message to specific number
const sendTextMsg = async (message, sender_ID, receiver_ID) => {
  let result = receiver_ID.includes("whatsapp:+");
  let receiverID = receiver_ID;
  if (!result) {
    receiverID = "whatsapp:+" + receiver_ID;
  }

  let resultsender = sender_ID.includes("whatsapp:+");
  let senderID = sender_ID;
  if (!resultsender) {
    senderID = "whatsapp:+" + sender_ID;
  }
let res ;
  await client.messages
    .create({
      from: receiverID,
      to: senderID,
      body: message,
    })
    .then(() => {res = true})

    .catch((error) => {
      res = false
    });
    return res;
};

module.exports = sendTextMsg;
