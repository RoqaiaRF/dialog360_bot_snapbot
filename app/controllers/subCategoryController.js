
const sendTextMsg = require("../../public/javascripts/sendMsgFunctions");

const subCategory = () => {
  sendTextMsg(`
اختر احد التصنيفات الفرعيه التالية: 
${subCat}
`,
    senderID
  );
};

module.exports = subCategory;