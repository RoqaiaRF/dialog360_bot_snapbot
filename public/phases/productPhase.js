const sendTextMsg = require("../javascripts/sendMsgFunctions");
const productController = require("../../app/controllers/productController");

const productPhase = async (sendeID) => {
  let message = `اختر احد هذه التصنيفات: 
`;
  const array = await productController.getProducts();
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

module.exports = productPhase;
