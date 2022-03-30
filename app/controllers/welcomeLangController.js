
const sendTextMsg = require("../../public/javascripts/sendMsgFunctions");
// Outputs: English, العربية

const welcomeLangMsg = () => {
  sendTextMsg(
    `Welcome ...
                please click on the right option
                
                حياك الله .. شرفتنا  .. 
                من فضلك لا تكتبلي كلام مش مفهوم لاني رح ارجعك لهذا الخيار 😄
                `,
    sendeID
  );
  setTimeout(sendTextMsg(`اختر اللغة المناسبة للطلب`, sendeID), 1000);
};

module.exports = welcomeLangMsg;