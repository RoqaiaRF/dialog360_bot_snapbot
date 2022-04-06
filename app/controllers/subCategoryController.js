
const sendTextMsg = require("../../public/javascripts/sendMsgFunctions");

const subCategory = () => {
  sendTextMsg(`
اختر احد التصنيفات الرئيسية التالية: 
${subCat}
`,
    sendeID
  );
};

module.exports = subCategory;