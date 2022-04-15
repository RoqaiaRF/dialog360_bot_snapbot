const sendTextMsg = require("./sendMsgFunctions");
const categoryController = require("../app/controllers/categoryController");
const productController = require("../app/controllers/productController");

// Expected Outputs: English, العربية
//^ Phase #1 welcome and choose Language
/*----------------------------------------*/
const welcomeLangPhase = (senderID, storeEN_Name, storeAR_Name, username) => {
  sendTextMsg(
    `Welcome ${username} at ${storeEN_Name}... 
                please click on the right option
                
                حياك الله في   ${storeAR_Name }..  ${username}شرفتنا يا    .. 
                😄
           للحصول على المساعدة اارسل *
           دائما للعودة للرئيسية اضغط 0 
                `,
    senderID
  );
  sendTextMsg(`اختر اللغة المناسبة للطلب`, senderID);
};

/*----------------------------------------*/
//  Expected Outputs: user Location contain langitude and latitude
//^ Phase #2 request user location


const locationPhaseAR = (senderID) => {
  sendTextMsg(
    `  ارسل اللوكيشن لموقعك حتى نساعدك بمعرفة اقرب فرع لك 🇰🇼 😊`,
    senderID
  );
}


const locationPhaseEN = (senderID) => {
  sendTextMsg(
    `  Please send your location To find the nearest branch to you🇰🇼 😊`,
    senderID
  );
}

const nearestLocation = (senderID, storeName) => {
  sendTextMsg(
    `أقرب فرع لك هو ${storeName} ومتاح لخدمتك الان`,
    senderID
  );
}
/*----------------------------------------*/
//  Expected Outputs: the category number: 1, 2 ,3,...
//^ Phase #3 send main category and request to choose the right category by sending category_index

const categoryPhase = async (senderID, categories) => {
  let message = `اختر احد هذه التصنيفات: 
`;
//   const array = await categoryController.getCategories();
//   let resultArray = [];

//   array.forEach((item, index) => {
//     resultArray[index] = item.name_ar;
//   });

//   resultArray.forEach((item, index) => {
//     message += `(${index + 1}) ${item}
// `;
//   });

  //console.log(message);

  sendTextMsg(` ${message} ${categories}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  للعودة للرئيسية اضغط 0`, senderID);
};

/*----------------------------------------*/
//  Expected Outputs: the product number: 1, 2 ,3,...
//^ Phase #3 send products and request to choose the right product by sending product_index of it's category

const productPhase = async (senderID, products) => {
  let message = `اختر احد هذه المنتجات: 
`;
sendTextMsg(` ${message} ${products}
ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
للعودة للمرحلة السابقة اضغط 00
للعودة للرئيسية اضغط 0`, senderID);

}
const subCategoryPhase = async(senderID, subCategory) =>{
  let message = `اختر احد التصنيفات الفرعيه الاتيه:   
  `;
  sendTextMsg(` ${message} ${subCategory}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  للعودة للمرحلة السابقة اضغط 00
  للعودة للرئيسية اضغط 0`, senderID);

}

const errorMsg = (senderID) => {
  sendTextMsg(`خطأ في الارسال
  wrong message`, senderID);
};

const customMessage = (message, senderID) => {
  sendTextMsg( message, senderID);
}

module.exports = {
  welcomeLangPhase,
  locationPhaseEN,
  locationPhaseAR,
  categoryPhase,
  productPhase,
  errorMsg,
  nearestLocation,
  customMessage,
  subCategoryPhase
};
