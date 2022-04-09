
const sendTextMsg = require("../javascripts/sendMsgFunctions");

const locationPhase = (senderID) => {
    sendTextMsg(
        `  ارسل اللوكيشن لموقعك حتى نساعدك بمعرفة اقرب فرع لك 🇰🇼 😊`,
        senderID
      );

};

module.exports = locationPhase; 