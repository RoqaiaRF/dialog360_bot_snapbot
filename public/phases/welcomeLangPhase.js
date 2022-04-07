
const sendTextMsg = require("../javascripts/sendMsgFunctions");
// Outputs: English, العربية

const welcomeLangPhase = (senderID) => {
  sendTextMsg(
    `Welcome ... 
                please click on the right option
                
                حياك الله .. شرفتنا  .. 
                من فضلك لا تكتب شيئا مفهوم لاني رح ارجعك لهذا الخيار 😄
           للحصول على المساعدة اارسل *
                `,
    senderID
  );
  sendTextMsg(`اختر اللغة المناسبة للطلب`, senderID);
};

module.exports = welcomeLangPhase; 