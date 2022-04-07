
const sendTextMsg = require("../javascripts/sendMsgFunctions");
// Outputs: English, العربية

const locationPhase = (senderID) => {
    sendTextMsg(
        `  ارسل اللوكيشن لموقعك حتى نساعدك بمعرفة اقرب فرع لك 🇰🇼 😊`,
        senderID
      );

};

module.exports = locationPhase; 