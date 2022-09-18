const config = require("../config");
const axios = require("axios");
require("dotenv").config();

const axiosOptions = 
{
  preview_url: false,
  to: "whatsapp-id",
  text: {
      body: "message"
   }
};
 
const headers = {
  "D360-Api-Key": process.env.D360_API_KEY,
};

const sendTextMsg = async (message, sender_ID) => {

  // التأكد ان الرقم صحيحا 
  let sender = sender_ID.replace("whatsapp:+", "");

 
    axiosOptions.to =sender;
    axiosOptions.text.body = message;

    axios.post(config, axiosOptions, { headers })
  }
module.exports = sendTextMsg;