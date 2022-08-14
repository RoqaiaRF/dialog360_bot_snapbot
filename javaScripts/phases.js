const sendTextMsg = require("./sendMsgFunctions");
const sendMedia = require("./sendMedia");
const isReservation_Pay = require("../app/controllers/isReservation_OrdersController");
const Redis = require("ioredis");
const template = require("../locales/templates");
require("dotenv").config(); // env مكتبة جلب المتغيرات من ال
const { StoreService } = require("./services/StoreService/StoreService");

const { categories } = StoreService;
const { getUserVars, setUserVars } = require("../database/redis");
const storeController = require("../app/controllers/storeController");
const location = require("../app/helpers/location");
const getCategories = require("../app/controllers/categoryController");
const cartController = require("../app/controllers/cartController");

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
  const msg = `Welcome ${username} at ${storeEN_Name}...  please click on the right option
                
  حياك الله في   ${storeAR_Name}.. شرفتنا يا ${username}    .. 
  😄
للحصول على المساعدة ارسل *
دائما للعودة للرئيسية اضغط 0 

If you need any help, send *
At any time to go main send 0

  `;

  const tanamara_msg = `Welcome ${username} at ${storeEN_Name}...  please click on the right option
                
  حياك الله في   ${storeAR_Name}.. شرفتنا يا ${username}
  ملاحظة: لا يوجد خدمة فى منطقة ام الهيمان وصباح الاحمد
  والشاليهات
  `
  await sendTextMsg(store_obj.phone=='96597623959'?tanamara_msg:msg,
    senderID,
    store_phone
  );

  sendTextMsg(`اختر اللغة المناسبة للطلب من فضلك
  Choose the language ,please`, senderID, store_phone);
};
//^Phase #1.1
// Expected Outputs: "توصيل لبيتي", "استلام من المتجر"
const pickupPhase = async (senderID, receiverID) => {
  const receiver = receiverID.replace("whatsapp:+", "");
  const sender = senderID.replace("whatsapp:+", "");

  let language = await getUserVars(receiver, sender, "language");
  if (language == undefined) language = "ar";

  await sendTextMsg(
    template("pickup", language, " ", senderID, receiverID),
    senderID,
    receiverID
  );
  sendTextMsg(`🚙 🏪`, senderID, receiverID);
};

/*----------------------------------------*/
//  Expected Outputs: user Location contain langitude and latitude
//^ Phase #2 request user location

const locationPhase = async (senderID, receiverID) => {
  const receiver = receiverID.replace("whatsapp:+", "");
  const sender = senderID.replace("whatsapp:+", "");
  let language = await getUserVars(receiver, sender, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  sendMedia(
    `  ${translation.submit_your_location}`,
    senderID,
    "https://www.mybasis.com/wp-content/uploads/2020/05/location-sharing.jpg",
    receiverID
  );
};

const nearestLocation = async (senderID, branchObj, storObj, receiverID) => {
  const receiver = receiverID.replace("whatsapp:+", "");
  const sender = senderID.replace("whatsapp:+", "");

  let language = await getUserVars(receiver, sender, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  const _isReservation_Pay = isReservation_Pay(storObj);
  console.log(branchObj);
  let storeName = branchObj.name_ar;
  if (language === "en") {
    storeName = branchObj.name_en;
  }
  if (["onlyOrders", "onlyReservation"].includes(_isReservation_Pay)) {
    startOrder({
      sender,
      receiver,
      storObj,
      language,
      receiverID,
      senderID,
      type: _isReservation_Pay,
    });
    setUserVars(receiver, sender, "phase", "4");
    console.log("after end");
  } else if (_isReservation_Pay === "Orders_Reservation_together") {
    sendTextMsg(
      template(
        "orders_reservation_together",
        language,
        storeName,
        senderID,
        receiverID
      ),
      senderID,
      receiverID
    );
    setUserVars(receiver, sender, "phase", "3");
  } else if (_isReservation_Pay === "error") {
    sendTextMsg(`${translation.reservation_error_msg}`, senderID, receiverID);
  }
};

const startOrder = async ({
  receiver,
  sender,
  receiverID,
  senderID,
  storObj,
  language,
  type,
}) => {
  let [location3, branch3Res] = await Promise.all([
    getUserVars(receiver, sender, "location"),
    getUserVars(receiver, sender, "branch"),
  ]);
  let branch3 = JSON.parse(branch3Res);
  if (location3 === undefined) {
    location3 = { lat: storObj.lat, lng: storObj.lng };
  } else {
    location3 = JSON.parse(location3);
  }
  console.log(storObj);

  const cityName3 = await location.getCityName(location3.lat, location3.lng);
  const fees3 = await storeController.getFees(branch3.id, cityName3);

  const categoryObj = JSON.parse(
    JSON.stringify(
      await getCategories(
        receiver,
        sender,
        storObj.id,
        type == "onlyOrders" ? 1 : 0
      )
    )
  );
  setUserVars(receiver, sender, "isorder",type=='onlyOrders'? true:false);

  cart = cartController.newCart(
    sender,
    branch3.id,
    location3.lat,
    location3.lng,
    storObj.tax,
    fees3,
    receiver
  );
  console.log(categoryObj);
  categoryPhase(
    senderID,
    "" + (await categories(categoryObj, language)),
    receiverID
  );
};

/*----------------------------------------*/
//^ Phase #2.1 Choose one of these branches

const getAllBranchesPhase = async (senderID, branches, receiverID) => {
  const receiver = receiverID.replace("whatsapp:+", "");
  const sender = senderID.replace("whatsapp:+", "");

  let language = await getUserVars(receiver, sender, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  let message = `${translation.Choose_a_branchs} 
`;
  sendTextMsg(
    ` ${message} ${branches}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  ${translation.To_return_to_the_main}`,
    senderID,
    receiverID
  );
};

/*----------------------------------------*/
//  Expected Outputs: the category number: 1, 2 ,3,...
//^ Phase #3 send main category and request to choose the right category by sending category_index

const categoryPhase = async (senderID, categories, receiverID) => {
  const receiver = receiverID.replace("whatsapp:+", "");
  const sender = senderID.replace("whatsapp:+", "");
  console.log(categories);
  console.log("categoreieeeeeeeeeeeeeees");
  let language = await getUserVars(receiver, sender, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  let message = `${translation.Choose_categories} 
`;
  sendTextMsg(
    ` ${message} ${categories}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  ${translation.To_return_to_the_main}`,
    senderID,
    receiverID
  );
};

/*----------------------------------------*/
//  Expected Outputs: the product number: 1, 2 ,3,...
//^ Phase #3 send products and request to choose the right product by sending product_index of it's category

const productPhase = async (senderID, products, receiverID) => {
  const receiver = receiverID.replace("whatsapp:+", "");
  const sender = senderID.replace("whatsapp:+", "");
  console.log(products)
  let language = await getUserVars(receiver, sender, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  let message = ` ${translation.Choose_products}
`;
  sendTextMsg(
    ` ${message} ${products}
ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
${translation.return_to_the_main_Catigories}
${translation.To_return_to_the_main}`,
    senderID,
    receiverID
  );
};
const subCategoryPhase = async (senderID, subCategory, receiverID) => {
  const receiver = receiverID.replace("whatsapp:+", "");
  const sender = senderID.replace("whatsapp:+", "");

  let language = await getUserVars(receiver, sender, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  let message = `${translation.Choose_features}   
  `;
  sendTextMsg(
    ` ${message} ${subCategory}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  ${translation.return_to_the_previous_stage}
  ${translation.To_return_to_the_main}`,
    senderID,
    receiverID
  );
};

const addedDetails = async (senderID, receiverID) => {
  const receiver = receiverID.replace("whatsapp:+", "");
  const sender = senderID.replace("whatsapp:+", "");

  let language = await getUserVars(receiver, sender, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  sendTextMsg(
    template("added_details", language, senderID, receiverID),
    senderID,
    receiverID
  );
};

const featuresPhase = async (senderID, features, receiverID) => {
  const receiver = receiverID.replace("whatsapp:+", "");
  const sender = senderID.replace("whatsapp:+", "");

  let language = await getUserVars(receiver, sender, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  let message = `${translation.choose_feature_to_add_to_cart}   
  `;
  sendTextMsg(
    ` ${message} ${features}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  ${translation.return_to_the_previous_stage}
  ${translation.To_return_to_the_main}`,
    senderID,
    receiverID
  );
};

const showProduct = async (senderID, product, receiverID) => {
  const receiver = receiverID.replace("whatsapp:+", "");
  const sender = senderID.replace("whatsapp:+", "");

  let language = await getUserVars(receiver, sender, "language");
  if (language == undefined) language = "ar";

  let product_name = product.name_ar;
  let product_description = product.description_ar;
  if (language === "en") {
    product_name = product.name_en;
    product_description = product.description_en;
  }
  const translation = require(`../locales/${language}`);
  let message = `
  ${translation.product_name} ${product_name}
  ${translation.the_description} ${product_description}
  ${translation.price} ${product.price} ${translation.the_currency}
  `;
  message+= product.duration?`${translation.Duration} ${product.duration} ${translation.minute}`:''
  if (product.image != null || product.image != undefined) {
    await sendMedia(
      ` ${message}
  ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  ${translation.return_to_the_previous_stage}
  ${translation.To_return_to_the_main}`,
      senderID,
      "https://stores-logos.fra1.digitaloceanspaces.com/products/" +
        product.image,
      receiverID
    );
  } else {
    await sendTextMsg(
      ` ${message}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  ${translation.return_to_the_previous_stage}
  ${translation.To_return_to_the_main}`,
      senderID,
      receiverID
    );
  }
  sendTextMsg(
    template("product_details", language, "👇", senderID, receiverID),
    senderID,
    receiverID
  );
};
const quantityProductPhase = async (senderID, receiverID) => {
  const receiver = receiverID.replace("whatsapp:+", "");
  const sender = senderID.replace("whatsapp:+", "");

  let language = await getUserVars(receiver, sender, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  sendTextMsg(`${translation.choose_qty}`, senderID, receiverID);
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
  const receiver = receiverID.replace("whatsapp:+", "");
  const sender = senderID.replace("whatsapp:+", "");

  let language = await getUserVars(receiver, sender, "language");
  if (language == undefined) language = "ar";
  const translation = require(`../locales/${language}`);

  if (!purchases) {
    await sendTextMsg(translation.empty_cart, senderID, receiverID);
    sendTextMsg(
      template("cartdetails", language, " ", senderID, receiverID), // يمكنك اضافة اي string  بدل ":"
      senderID,
      receiverID
    );
    return;
  }
  let paymentLink = "";

  const isOrder = JSON.parse(await getUserVars(receiver, sender, "isorder"));

  if (isOrder === true) {
    paymentLink = `http://pay.snapbot.app/${receiver}/orders/${sender}`;
  } else if (isOrder === false) {
    paymentLink = `http://pay.snapbot.app/${receiver}/reservations/${sender}`;
  } else {
    paymentLink = translation.error_approved_payment;
  }
  let sum_without_tax = "",
    _tax = "";
  if (tax != 0) {
    sum_without_tax = ` 
    ${translation.sum_without_tax} ${price.toFixed(2)} ${
      translation.the_currency
    }
    `;
    _tax = `${translation.Tax} ${tax.toFixed(2)} ${translation.the_currency}
    `;
  }

  const msg = `
${purchases}
${sum_without_tax} ${_tax}
${translation.Delivery_Charge} ${fees} ${translation.the_currency}
${translation.total_summation} ${total.toFixed(2)} ${translation.the_currency}
🤗

${translation.link_approved_order} 
${paymentLink}`;

  await sendTextMsg(`${msg}`, senderID, receiverID);
  sendTextMsg(
    template("cartdetails", language, " ", senderID, receiverID), // يمكنك اضافة اي string  بدل ":"
    senderID,
    receiverID
  );
};

const errorMsg = async (senderID, receiverID) => {
  const receiver = receiverID.replace("whatsapp:+", "");
  const sender = senderID.replace("whatsapp:+", "");

  let language = await getUserVars(receiver, sender, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  sendTextMsg(translation.error_in_sending, senderID, receiverID);
};

const customMessage = async (message, senderID, receiverID) => {
  const receiver = receiverID.replace("whatsapp:+", "");
  const sender = senderID.replace("whatsapp:+", "");
  console.log(senderID, receiverID);
  let language = await getUserVars(receiver, sender, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
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
