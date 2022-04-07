const sendTextMsg = require("../javascripts/sendMsgFunctions");
const productController = require("../../app/controllers/productController");

const productPhase = async (senderID, category_id) => {
  let message = `اختر احد هذه المنتجات: 
`;
  const array = await productController.getProducts(category_id);
  let resultArray = [];

  array.forEach((item, index) => {
    resultArray[index] = item.name_ar;
  });

  resultArray.forEach((item, index) => {
    message += `(${index + 1}) ${item}
`;
  });

  sendTextMsg(` ${message}`, senderID);
};

module.exports = productPhase;
