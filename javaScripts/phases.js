const sendTextMsg = require("./sendMsgFunctions");
const sendMedia = require("./sendMedia");
const isReservation_Pay = require("../app/controllers/isReservation_OrdersController");
const Redis = require("ioredis");
const client = new Redis( 
  //"rediss://default:AVNS_JjFT4eRfCGRaYIy@db-redis-fra1-80366-do-user-9392750-0.b.db.ondigitalocean.com:25061"
);


// Expected Outputs: English, العربية
//^ Phase #1 welcome and choose Language
/*----------------------------------------*/
const welcomeLangPhase = async (
  senderID,
  storeEN_Name,
  storeAR_Name,
  username
) => {
  await sendTextMsg(
    `Welcome ${username} at ${storeEN_Name}...  please click on the right option
                
                حياك الله في   ${storeAR_Name}..  ${username} شرفتنا يا    .. 
                😄
           للحصول على المساعدة ارسل *
           دائما للعودة للرئيسية اضغط 0 
                `,
    senderID
  );
  sendTextMsg(`اختر اللغة المناسبة للطلب`, senderID);
};
//^Phase #1.1
// Expected Outputs: "توصيل لبيتي", "استلام من المتجر"
const pickupPhase = async(senderID) => {
await  sendTextMsg(`ما طريقة استلام المنتج التي تفضلها ؟`, senderID);
  sendTextMsg(`🚙 🏪`, senderID);

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

const nearestLocation = (senderID, storeName, storObj) => {
  const _isReservation_Pay = isReservation_Pay(storObj);
  console.log(
    ` ............_isReservation_Pay.................... ${_isReservation_Pay}`
  );

  if (_isReservation_Pay === "onlyOrders") {
    sendTextMsg(`أقرب فرع لك هو ${storeName} ومتاح لخدمتك الان`, senderID);
  }


  else if (_isReservation_Pay === "onlyReservation") {
    sendTextMsg(`أقرب فرع لك هو  ${storeName} وهو متاح لخدمتك الان`, senderID);
  }

  else if (_isReservation_Pay === "Orders_Reservation_together") {
    sendTextMsg(` أقرب فرع لك ${storeName} ومتاح لخدمتك الان`, senderID);
  } else if (_isReservation_Pay === "error") {
    sendTextMsg(`نعتذر عن هذا الخطأ , يرجى التحدث مع خددمة العملاء`, senderID);
  }
};

/*----------------------------------------*/
//^ Phase #2.1 Choose one of these branches

const getAllBranchesPhase = async (senderID, branches) => {
  let message = `اختر احد هذه الفروع التالية: 
`;
  sendTextMsg(
    ` ${message} ${branches}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  للعودة للرئيسية ارسل 0`,
    senderID
  );
};

/*----------------------------------------*/
//  Expected Outputs: the category number: 1, 2 ,3,...
//^ Phase #3 send main category and request to choose the right category by sending category_index

const categoryPhase = async (senderID, categories) => {
  let message = `اختر احد هذه التصنيفات: 
`;
  sendTextMsg(
    ` ${message} ${categories}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  للعودة للرئيسية ارسل 0`,
    senderID
  );
};

/*----------------------------------------*/
//  Expected Outputs: the product number: 1, 2 ,3,...
//^ Phase #3 send products and request to choose the right product by sending product_index of it's category

const productPhase = async (senderID, products) => {
  let message = `اختر احد هذه المنتجات: 
`;
  sendTextMsg(
    ` ${message} ${products}
ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
للعودة للمرحلة السابقة ارسل 00
للعودة للرئيسية ارسل 0`,
    senderID
  );
};
const subCategoryPhase = async (senderID, subCategory) => {
  let message = `اختر احد التصنيفات الفرعيه الاتيه:   
  `;
  sendTextMsg(
    ` ${message} ${subCategory}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  للعودة للمرحلة السابقة ارسل 00
  للعودة للرئيسية ارسل 0`,
    senderID
  );
};

const addedDetails = (senderID)=>{
  sendTextMsg(
"هل تريد خدمات اضافية ؟",
senderID
);
}


const featuresPhase = async (senderID, features) => {
  let message = `اختر أحد المميزات/ الخدمات الاضافية لاضافتها للسلة :   
  `;
  sendTextMsg(
    ` ${message} ${features}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  للعودة للمرحلة السابقة ارسل 00
  للعودة للرئيسية ارسل 0`,
    senderID
  );
};

const showProduct = (senderID, product) => {
  let message = `
  اسم المنتج: ${product.name_ar}
  الوصف: ${product.description_ar}
  السعر: ${product.price} دينار
  المدة: ${product.duration} دقيقة

  `;

  if (product.image != null || product.image != undefined) {  
    sendMedia(
      ` ${message}
  ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  للعودة للمرحلة السابقة ارسل 00
  للعودة للرئيسية ارسل 0`,
      senderID,
      "https://stores-logos.fra1.digitaloceanspaces.com/products/" +
        product.image
    );
  }
  else { 
    sendTextMsg(
      ` ${message}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  للعودة للمرحلة السابقة ارسل 00
  للعودة للرئيسية ارسل 0`,
      senderID
    );
  }  
  sendTextMsg(`تفاصيل المنتج ${product.name_ar}`, senderID );

};
const quantityProductPhase = async (senderID) => {
  sendTextMsg(`أدخل الكمية المناسبة بالارقام الانجليزية 1, 2, ...`, senderID);
};

const showCart = async(senderID, purchases, price, tax, total, fees) => {
  let paymentLink = '';

    
  const sender = senderID.replace("whatsapp:+", "");
  const isOrder = JSON.parse( await client.get(`${sender}:isorder`));

  if (isOrder === true){
     paymentLink = `http://payment.snapbot.app/orders?sender=${sender}`;
  }
  else if (isOrder === false){
    paymentLink = `http://payment.snapbot.app/reservations?sender=${sender}`;

  }
  else { 
    paymentLink= "خطأ في تأكيد الطلبية , اتصل بخدمة العملاء!"
  }
const msg = `
${purchases}

المجموع دون ضريبة : ${price.toFixed(2)} دينار 
الضريبة : ${tax} دينار
رسوم التوصيل ${fees} دينار
المجموع الكلي: ${total.toFixed(2)} دينار
🤗

الررجاء أستخدام الرابط لتأكيد الطلب. 
${paymentLink}`

  await sendTextMsg(
    `تفاصيل السلة :`,
    senderID
  );
  sendTextMsg(
    `${msg}`,
    senderID
  );
};

const errorMsg = (senderID) => {
  sendTextMsg(`خطأ في الارسال`, senderID);
};

const customMessage = async (message, senderID) => {
  sendTextMsg(message, senderID);
};

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
  showCart,
  pickupPhase,
  addedDetails
};
