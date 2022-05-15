const sendTextMsg = require("./sendMsgFunctions");
const sendMedia = require("./sendMedia");

// Expected Outputs: English, العربية
//^ Phase #1 welcome and choose Language
/*----------------------------------------*/
const welcomeLangPhase = (senderID, storeEN_Name, storeAR_Name, username) => {
  sendTextMsg(
    `Welcome ${username} at ${storeEN_Name}... 
                please click on the right option
                
                حياك الله في   ${storeAR_Name}..  ${username}شرفتنا يا    .. 
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
    `  Please send your location To find the nearest branch to you🇰🇼 😊`,
    senderID
  );
};
//^ Phase #2.1 display the nearest branch
const nearestLocation = (senderID, storeName) => {
  sendTextMsg(
    `the nearest branch to you is ${storeName} It is now available to serve you`,
    senderID
  );
};

//^ Phase #2.2 Choose one of these branches

const getAllBranchesPhase = async (senderID, branches) => {
  let message = `Choose one of these branches: 
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
  let message = `Choose one of these categories: 
`;
  sendTextMsg(
    ` ${message} ${categories}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  To return to the main send 0`,
    senderID
  );
};

/*----------------------------------------*/
//  Expected Outputs: the product number: 1, 2 ,3,...
//^ Phase #3 send products and request to choose the right product by sending product_index of it's category

const productPhase = async (senderID, products) => {
  let message = `Choose one of these products: 
`;
  sendTextMsg(
    ` ${message} ${products}
ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
To return to the previous phase, send 00
To return to the main send 0`,
    senderID
  );
};
const subCategoryPhase = async (senderID, subCategory) => {
  let message = `Choose one of the following subcategories:   
  `;
  sendTextMsg(
    ` ${message} ${subCategory}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  To return to the previous phase, send 00
  To return to the main send 0`,
    senderID
  );
};

const featuresPhase = async (senderID, features) => {
  let message = `Choose one of the following additional services:   
  `;
  sendTextMsg(
    ` ${message} ${features}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  To return to the previous phase, send 00
  To return to the main send 0`,
    senderID
  );
};

const showProduct = (senderID, product) => {
  let message = `
  Product Name: ${product.name_en}
  Description: ${product.description_en}
  Price: ${product.price}
  `;

  sendMedia(
    ` ${message}
  ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  add to cart 1
  To return to the previous phase, send 00
  To return to the main send 0`,
    senderID,
    "https://stores-logos.fra1.digitaloceanspaces.com/products/" + product.image
  );
};

const errorMsg = (senderID) => {
  sendTextMsg(`wrong message`, senderID);
};

const customMessage = (message, senderID) => {
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
  getAllBranchesPhase
};
