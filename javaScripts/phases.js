const sendTextMsg = require("./sendMsgFunctions");
const categoryController = require("../app/controllers/categoryController");
const productController = require("../app/controllers/productController");

// Expected Outputs: English, العربية
//^ Phase #1 welcome and choose Language
/*----------------------------------------*/
const welcomeLangPhase = (senderID, storeEN_Name, storeAR_Name) => {
  sendTextMsg(
    `Welcome at ${storeEN_Name}... 
                please click on the right option
                
                حياك الله في ${storeAR_Name }.. شرفتنا  .. 
                من فضلك لا تكتب شيئا مفهوم لاني رح ارجعك لهذا الخيار 😄
           للحصول على المساعدة اارسل *
                `,
    senderID
  );
  sendTextMsg(`اختر اللغة المناسبة للطلب`, senderID);
};

/*----------------------------------------*/
//  Expected Outputs: user Location contain langitude and latitude
//^ Phase #2 request user location

const locationPhase = (senderID) => {
  sendTextMsg(
    `  ارسل اللوكيشن لموقعك حتى نساعدك بمعرفة اقرب فرع لك 🇰🇼 😊`,
    senderID
  );
};

/*----------------------------------------*/
//  Expected Outputs: the category number: 1, 2 ,3,...
//^ Phase #3 send main category and request to choose the right category by sending category_index

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

/*----------------------------------------*/
//  Expected Outputs: the product number: 1, 2 ,3,...
//^ Phase #3 send products and request to choose the right product by sending product_index of it's category

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

const errorMsg = () => {
  sendTextMsg(`خطأ في الارسال
  wrong message`, senderID);
};

module.exports = {
  welcomeLangPhase,
  locationPhase,
  categoryPhase,
  productPhase,
  errorMsg
};
