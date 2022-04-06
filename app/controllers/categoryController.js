
const sendTextMsg = require("../../public/javascripts/sendMsgFunctions");

const subCategory = () => {
  sendTextMsg(`
اختر احد التصنيفات الرئيسية التالية: 
${mainCat}
`,
    sendeID
  );
};

module.exports = subCategory;