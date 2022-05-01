const sendTextMsg = require("./sendMsgFunctions");
const sendMedia = require("./sendMedia");
const isReservation_Pay = require("../app/controllers/isReservation_PayController")
// Expected Outputs: English, العربية
//^ Phase #1 welcome and choose Language
/*----------------------------------------*/
const welcomeLangPhase = async(senderID, storeEN_Name, storeAR_Name, username) => {
  
  await sendTextMsg(
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


const locationPhase = (senderID) => {
  sendTextMsg(
    `  ارسل اللوكيشن لموقعك حتى نساعدك بمعرفة اقرب فرع لك 🇰🇼 😊`,
    senderID
  );
}

const nearestLocation = (senderID, storeName, storObj) => {
  
  const _isReservation_Pay = isReservation_Pay(storObj);
  if (_isReservation_Pay === "onlyPay" ) {   sendTextMsg(
    `أقرب فرع لك هو ${storeName} ومتاح لخدمتك الان`,
    senderID
  );}
  //TODO: عمل تيمبليت لها فيه الجدز فقط

  else if  (_isReservation_Pay === "onlyReservation" ) {  sendTextMsg(
    `أقرب فرع لك هو ${storeName} ومتاح لخدمتك الان`,
    senderID
  );} 
  //TODO:  عمل تيمبليت له فيه الحجز والطلب
  else if  (_isReservation_Pay === "Pay_Reservation_together" ) {   sendTextMsg(
    `أقرب فرع لك هو ${storeName} ومتاح لخدمتك الان`,
    senderID
  );} 
}


/*----------------------------------------*/
//^ Phase #2.1 Choose one of these branches

const getAllBranchesPhase = async (senderID, branches) => {
  let message = `اختر احد هذه الفروع التالية: 
`;
  sendTextMsg(` ${message} ${branches}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  للعودة للرئيسية ارسل 0`, senderID);
};



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
  let message = `اختر أحد المميزات/ الخدمات الاضافية لاضافتها للسلة :   
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

  sendMedia(` ${message}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  للاضافة للسلة ارسل 1
  للعودة للمرحلة السابقة ارسل 00
  للعودة للرئيسية ارسل 0`,senderID, "https://stores-logos.fra1.digitaloceanspaces.com/products/"+product.image);
}  
const quantityProductPhase = async (senderID)=>{
  sendTextMsg(`أدخل الكمية المناسبة بالارقام الانجليزية 1, 2, ...`, senderID);

}

const showCart =  (senderID, purchases, price, tax, total , fees) => {
   const sender = senderID.replace("whatsapp:+962", "");

  const paymentLink = "https://e23f-154-242-188-137.ngrok.io/payment"
  const countryCode =  "+962";

   sendTextMsg(`تفاصيل السلة: 
  ${purchases}

المجموع دون ضريبة : ${price} دينار 
الضريبة : ${tax} دينار
رسوم التوصيل ${fees} دينار
المجموع الكلي: ${total} دينار


الررجاء أستخدام الرابط للدفع. 
${paymentLink}?code=${countryCode}&sender=${sender}

   حدد المنتج لحذفه
   أضافة منتجات`, senderID);
};

const errorMsg = (senderID) => {
  sendTextMsg(`خطأ في الارسال`, senderID);
};

const customMessage = async (message, senderID) => {
   sendTextMsg( message, senderID);
}


module.exports = {
  welcomeLangPhase,
  locationPhase,
  categoryPhase,
  productPhase,
  errorMsg,
  nearestLocation,
  customMessage,
  subCategoryPhase,
  featuresPhase,
  showProduct, 
  getAllBranchesPhase,
  quantityProductPhase,
  showCart
}
