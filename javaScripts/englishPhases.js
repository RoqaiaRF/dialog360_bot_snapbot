const sendTextMsg = require("./sendMsgFunctions");
const sendMedia = require("./sendMedia");

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
 // sendTextMsg(`اختر اللغة المناسبة للطلب`, senderID);
 sendTextMsg(`يمكنك شراء حزمة انترنت وايضا نقوم بخدماتاخرى`, senderID);
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
  sendTextMsg(` ${message} ${categories}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  للعودة للرئيسية ارسل 0`, senderID);
};

/*----------------------------------------*/
//  Expected Outputs: the product number: 1, 2 ,3,...
//^ Phase #3 send products and request to choose the right product by sending product_index of it's category

const productPhase = async (senderID, products) => {
  let message = `اختر احد هذه المنتجات: 
`;
sendTextMsg(` ${message} ${products}
ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
للعودة للمرحلة السابقة ارسل 00
للعودة للرئيسية ارسل 0`, senderID);

}
const subCategoryPhase = async(senderID, subCategory) =>{
  let message = `اختر احد التصنيفات الفرعيه الاتيه:   
  `;
  sendTextMsg(` ${message} ${subCategory}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  للعودة للمرحلة السابقة ارسل 00
  للعودة للرئيسية ارسل 0`, senderID);

}

const featuresPhase = async(senderID, features) =>{
  let message = `اختر احد الخدمات الاضافية الاتيه:   
  `;
  sendTextMsg(` ${message} ${features}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  للعودة للمرحلة السابقة ارسل 00
  للعودة للرئيسية ارسل 0`, senderID);

}

const showProduct = (senderID, product) => {
  let message = `
  اسم المنتج: ${product.name_ar}
  الوصف: ${product.description_ar}
  السعر: ${product.price}
  `;
  // sendTextMsg(` ${message}
  // ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  // للاضافة للسلة ارسل 1
  // للعودة للمرحلة السابقة ارسل 00
  // للعودة للرئيسية ارسل 0`, senderID);
  sendMedia(` ${message}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  للاضافة للسلة ارسل 1
  للعودة للمرحلة السابقة ارسل 00
  للعودة للرئيسية ارسل 0`,senderID, "https://stores-logos.fra1.digitaloceanspaces.com/products/"+product.image);
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
  subCategoryPhase,
  featuresPhase,
  showProduct
}
