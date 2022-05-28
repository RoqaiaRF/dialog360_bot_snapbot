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
  let language = await getUserVars(receiverID, senderID, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  await sendTextMsg(
    `${translation.preferred_receiving_method}`,
    senderID,
    receiverID
  );
  sendTextMsg(`🚙 🏪`, senderID, receiverID);
};

/*----------------------------------------*/
//  Expected Outputs: user Location contain langitude and latitude
//^ Phase #2 request user location

const locationPhase = async (senderID, receiverID) => {
  let language = await getUserVars(receiverID, senderID, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  sendTextMsg(`  ${translation.submit_your_location}`, senderID, receiverID);
};

const nearestLocation = async (senderID, storeName, storObj, receiverID) => {
  let language = await getUserVars(receiverID, senderID, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  const _isReservation_Pay = isReservation_Pay(storObj);
  console.log(
    ` ............_isReservation_Pay.................... ${_isReservation_Pay}`
  );

  if (_isReservation_Pay === "onlyOrders") {
    sendTextMsg(
      `${storeName} ${translation.nearest_branch}`,
      senderID,
      receiverID
    );
  } else if (_isReservation_Pay === "onlyReservation") {
    sendTextMsg(
      `${storeName} ${translation.nearest_branch}`,
      senderID,
      receiverID
    );
  } else if (_isReservation_Pay === "Orders_Reservation_together") {
    sendTextMsg(
      `${storeName} ${translation.nearest_branch}`,
      senderID,
      receiverID
    );
  } else if (_isReservation_Pay === "error") {
    sendTextMsg(`${translation.reservation_error_msg}`, senderID, receiverID);
  }
};

/*----------------------------------------*/
//^ Phase #2.1 Choose one of these branches

const getAllBranchesPhase = async (senderID, branches, receiverID) => {
  let language = await getUserVars(receiverID, senderID, "language");
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
  let language = await getUserVars(receiverID, senderID, "language");
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
  let language = await getUserVars(receiverID, senderID, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  let message = ` ${translation.Choose_products}
`;
  sendTextMsg(
    ` ${message} ${products}
ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
${translation.return_to_the_previous_stage}
${translation.To_return_to_the_main}`,
    senderID,
    receiverID
  );
};
const subCategoryPhase = async (senderID, subCategory, receiverID) => {
  let language = await getUserVars(receiverID, senderID, "language");
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
  let language = await getUserVars(receiverID, senderID, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  sendTextMsg(translation.features_question, senderID, receiverID);
};

const featuresPhase = async (senderID, features, receiverID) => {
  let language = await getUserVars(receiverID, senderID, "language");
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
  let language = await getUserVars(receiverID, senderID, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  let message = `
  ${translation.product_name} ${product.name_ar}
  ${translation.the_description} ${product.description_ar}
  ${translation.price} ${product.price} ${translation.the_currency}
  ${translation.Duration} ${product.duration} ${translation.minute}

  `;

  if (product.image != null || product.image != undefined) {
    sendMedia(
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
    sendTextMsg(
      ` ${message}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  ${translation.return_to_the_previous_stage}
  ${translation.To_return_to_the_main}`,
      senderID,
      receiverID
    );
  }
  sendTextMsg(
    `${translation.product_description_title} ${product.name_ar}`,
    senderID,
    receiverID
  );
};
const quantityProductPhase = async (senderID, receiverID) => {
  let language = await getUserVars(receiverID, senderID, "language");
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
  let language = await getUserVars(receiverID, senderID, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  let paymentLink = "";

  const sender = senderID.replace("whatsapp:+", "");
  const isOrder = JSON.parse(await getUserVars(receiverID, sender, "isorder"));

  if (isOrder === true) {
    paymentLink = `http://payment.snapbot.app/${receiverID}/orders/${sender}`;
  } else if (isOrder === false) {
    paymentLink = `http://payment.snapbot.app/${receiverID}/reservations/${sender}`;
  } else {
    paymentLink = translation.error_approved_payment;
  }
  const msg = `
${purchases}

${translation.sum_without_tax} ${price.toFixed(2)} ${translation.the_currency} 
${translation.Tax} ${tax} ${translation.the_currency}
${translation.Delivery_Charge} ${fees} ${translation.the_currency}
${translation.total_summation} ${total.toFixed(2)} ${translation.the_currency}
🤗

${translation.link_approved_order} 
${paymentLink}`;

  await sendTextMsg(`${translation.Cart_details}`, senderID, receiverID);
  sendTextMsg(`${msg}`, senderID, receiverID);
};

const errorMsg = async (senderID, receiverID) => {
  let language = await getUserVars(receiverID, senderID, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  sendTextMsg(translation.error_in_sending, senderID, receiverID);
};

const customMessage = async (message, senderID, receiverID) => {
  let language = await getUserVars(receiverID, senderID, "language");
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
