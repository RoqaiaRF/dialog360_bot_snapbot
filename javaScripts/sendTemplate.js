const config = require("../config");
const axios = require("axios");
require("dotenv").config();

const headers = {
  "D360-Api-Key": process.env.D360_API_KEY,
};
var axiosOptions = {
  to: "962799849386",
  type: "template",
  template: {
    namespace: "672268ac_173a_4b3b_8b4f_2d1d291d197e",
    language: {
      policy: "deterministic",
      code: "ar",
    },
    name: "news_onley_reservations_ar",
    components: [
      {
        type: "body",
        parameters: [
          {
            type: "text",
            text: "John",
          },
        ],
      },
    ],
  },
};

const sendTemplate = async (
  templateName,
  language,
  sender_ID,
  [...parameters]
) => {
  var mapped_parameters =  [
    {
      type: "text",
      text: " ",
    }
  ] ;
  if (language === "en") templateName += "_en";

  if (parameters) {
    mapped_parameters = parameters.map((x) => ({
      type: "text",
      text: x,
    }));
  }

  // التأكد ان الرقم صحيحا
  let sender = sender_ID.replace("whatsapp:+", "");

  axiosOptions.to = sender;
  axiosOptions.template.language.code = language;
  axiosOptions.name = templateName;
  axiosOptions.template.components.parameters = mapped_parameters;

  axios.post(config, axiosOptions, { headers });
};
module.exports = sendTemplate;
