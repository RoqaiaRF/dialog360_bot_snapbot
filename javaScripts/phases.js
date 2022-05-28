const sendTextMsg = require("./sendMsgFunctions");
const sendMedia = require("./sendMedia");
const isReservation_Pay = require("../app/controllers/isReservation_OrdersController");
const Redis = require("ioredis");
require("dotenv").config(); // env مكتبة جلب المتغيرات من ال

const { getUserVars } = require("../database/redis");

// Expected Outputs: English, العربية
//^ Phase #1 welcome and choose Language
/*----------------------------------------*/
const welcomeLangPhase = async (
  senderID,
  storeEN_Name,
  storeAR_Name,
  username,
  store_obj,
  receiverID
) => {
  const store_phone = `whatsapp:+${store_obj.phone}`;
  await sendTextMsg(
    `Welcome ${username} at ${storeEN_Name}...  please click on the right option
                
                حياك الله في   ${storeAR_Name}.. شرفتنا يا ${username}    .. 
                😄
           للحصول على المساعدة ارسل *
           دائما للعودة للرئيسية اضغط 0 
                `,
    senderID,
    store_phone
  );

  sendTextMsg(`اختر اللغة المناسبة للطلب`, senderID, store_phone);
};
//^Phase #1.1
// Expected Outputs: "توصيل لبيتي", "استلام من المتجر"
const pickupPhase = async (senderID, receiverID) => {
  await sendTextMsg(
    `ما طريقة استلام المنتج التي تفضلها ؟`,
    senderID,
    receiverID
  );
  sendTextMsg(`🚙 🏪`, senderID, receiverID);
};

/*----------------------------------------*/
//  Expected Outputs: user Location contain langitude and latitude
//^ Phase #2 request user location

const locationPhase = async (senderID, receiverID) => {
  sendTextMsg(
    `  ارسل اللوكيشن لموقعك حتى نساعدك بمعرفة اقرب فرع لك 🇰🇼 😊`,
    senderID,
    receiverID
  );
};

const nearestLocation = async (senderID, storeName, storObj, receiverID) => {
  const _isReservation_Pay = isReservation_Pay(storObj);
  console.log(
    ` ............_isReservation_Pay.................... ${_isReservation_Pay}`
  );

  if (_isReservation_Pay === "onlyOrders") {
    sendTextMsg(
      `أقرب فرع لك هو ${storeName} ومتاح لخدمتك الان`,
      senderID,
      receiverID
    );
  } else if (_isReservation_Pay === "onlyReservation") {
    sendTextMsg(
      `أقرب فرع لك هو  ${storeName} وهو متاح لخدمتك الان`,
      senderID,
      receiverID
    );
  } else if (_isReservation_Pay === "Orders_Reservation_together") {
    sendTextMsg(
      ` أقرب فرع لك ${storeName} ومتاح لخدمتك الان`,
      senderID,
      receiverID
    );
  } else if (_isReservation_Pay === "error") {
    sendTextMsg(
      `نعتذر عن هذا الخطأ , يرجى التحدث مع خددمة العملاء`,
      senderID,
      receiverID
    );
  }
};

/*----------------------------------------*/
//^ Phase #2.1 Choose one of these branches

const getAllBranchesPhase = async (senderID, branches, receiverID) => {
  let message = `اختر احد هذه الفروع التالية: 
`;
  sendTextMsg(
    ` ${message} ${branches}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  للعودة للرئيسية ارسل 0`,
    senderID,
    receiverID
  );
};

/*----------------------------------------*/
//  Expected Outputs: the category number: 1, 2 ,3,...
//^ Phase #3 send main category and request to choose the right category by sending category_index

const categoryPhase = async (senderID, categories, receiverID) => {
  let message = `اختر احد هذه التصنيفات: 
`;
  sendTextMsg(
    ` ${message} ${categories}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  للعودة للرئيسية ارسل 0`,
    senderID,
    receiverID
  );
};

/*----------------------------------------*/
//  Expected Outputs: the product number: 1, 2 ,3,...
//^ Phase #3 send products and request to choose the right product by sending product_index of it's category

const productPhase = async (senderID, products, receiverID) => {
  let message = `اختر احد هذه المنتجات: 
`;
  sendTextMsg(
    ` ${message} ${products}
ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
للعودة للمرحلة السابقة ارسل 00
للعودة للرئيسية ارسل 0`,
    senderID,
    receiverID
  );
};
const subCategoryPhase = async (senderID, subCategory, receiverID) => {
  let message = `اختر احد التصنيفات الفرعيه الاتيه:   
  `;
  sendTextMsg(
    ` ${message} ${subCategory}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  للعودة للمرحلة السابقة ارسل 00
  للعودة للرئيسية ارسل 0`,
    senderID,
    receiverID
  );
};

const addedDetails = async (senderID, receiverID) => {
  sendTextMsg("هل تريد خدمات اضافية ؟", senderID, receiverID);
};

const featuresPhase = async (senderID, features, receiverID) => {
  let message = `اختر أحد المميزات/ الخدمات الاضافية لاضافتها للسلة :   
  `;
  sendTextMsg(
    ` ${message} ${features}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  للعودة للمرحلة السابقة ارسل 00
  للعودة للرئيسية ارسل 0`,
    senderID,
    receiverID
  );
};

const showProduct = async (senderID, product, receiverID) => {
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
        product.image,
      receiverID
    );
  } else {
    sendTextMsg(
      ` ${message}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  للعودة للمرحلة السابقة ارسل 00
  للعودة للرئيسية ارسل 0`,
      senderID,
      receiverID
    );
  }
  sendTextMsg(`تفاصيل المنتج ${product.name_ar}`, senderID, receiverID);
};
const quantityProductPhase = async (senderID, receiverID) => {
  sendTextMsg(
    `أدخل الكمية المناسبة بالارقام الانجليزية 1, 2, ...`,
    senderID,
    receiverID
  );
};

const showCart = async (
  senderID,
  purchases,
  price,
  tax,
  total,
  fees,
  receiverID
) => {
  let paymentLink = "";

  const sender = senderID.replace("whatsapp:+", "");
  const isOrder = JSON.parse(await getUserVars(receiverID, sender, "isorder"));

  if (isOrder === true) {
    paymentLink = `http://payment.snapbot.app/${receiverID}/orders/${sender}`;
  } else if (isOrder === false) {
    paymentLink = `http://payment.snapbot.app/${receiverID}/reservations/${sender}`;
  } else {
    paymentLink = "خطأ في تأكيد الطلبية , اتصل بخدمة العملاء!";
  }
  const msg = `
${purchases}

المجموع دون ضريبة : ${price.toFixed(2)} دينار 
الضريبة : ${tax} دينار
رسوم التوصيل ${fees} دينار
المجموع الكلي: ${total.toFixed(2)} دينار
🤗

الررجاء أستخدام الرابط لتأكيد الطلب. 
${paymentLink}`;

  await sendTextMsg(`تفاصيل السلة :`, senderID, receiverID);
  sendTextMsg(`${msg}`, senderID, receiverID);
};

const errorMsg = async (senderID, receiverID) => {
  sendTextMsg(`خطأ في الارسال`, senderID, receiverID);
};

const customMessage = async (message, senderID, receiverID) => {
  sendTextMsg(message, senderID, receiverID);
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
  addedDetails,
};
