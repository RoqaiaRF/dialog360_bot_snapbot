const config = require("../config");
const axios = require("axios");
require("dotenv").config();

const axiosOptions = {
  recipient_type: "individual",
  to: "wa_id",
  type: "image",
  image: {
    link: "image-id",
    caption: "اضغط على الصورة لتكبيرها",
  },
};

const headers = {
  "D360-Api-Key": process.env.D360_API_KEY,
};

const sendMedia = async (message, sender_ID, mediaUrl) => {
  // التأكد ان الرقم صحيحا
  let sender = sender_ID.replace("whatsapp:+", "");

  axiosOptions.to = sender;
  axiosOptions.image.link = mediaUrl;
  axiosOptions.image.caption = message;

  axios.post(config, axiosOptions, { headers });
};
module.exports = sendMedia;
