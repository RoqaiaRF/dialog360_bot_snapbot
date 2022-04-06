const sendTextMsg = require("../javascripts/sendMsgFunctions");
const categoryController = require("../../app/controllers/categoryController");

const categoryPhase = async (sendeID) => {
  let message = `اختر احد هذه التصنيفات: 
`;
  const array = await categoryController.getCategories();
  let resultArray = [];

  array.forEach((item, index) => {
    resultArray[index] = item.name_ar;
  });

  resultArray.forEach((item, index) => {
    message += `(${index + 1}) ${item}
`;
  });

  console.log(message);

  sendTextMsg(` ${message}`, sendeID);
};

module.exports = categoryPhase;
