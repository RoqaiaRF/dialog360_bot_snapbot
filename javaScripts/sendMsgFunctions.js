const twilio = require("twilio");

// this line is important to use environment variables
require("dotenv").config();

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(ACCOUNT_SID, AUTH_TOKEN, { lazyloading: false }); //lazyloading:  speed of sending /true or false

//Send text & emoji message to specific number
const sendTextMsg = async (message,senderID,receiver_ID) => {
  let result = receiver_ID.includes("whatsapp:+");
  let receiverID =receiver_ID
  if (!result) {
    receiverID = "whatsapp:+"+ receiver_ID
  }

console.log("receiverID",receiverID)
  await client.messages
    .create({
      from: receiverID,
      to: senderID,
      body: message,
    })
    .then((message) => {
    })

    .catch((error) => {
      console.log(`Error at sending message: ${error}`);
    });
};

module.exports = sendTextMsg;
