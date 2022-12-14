const {
  setUserVars,
  getUserVars,
  delUserVars,
  deleteAllKeys,
  delAllUserVars,
} = require("../../../database/redis");
const categories = async (categoriesObj, language) => {
  let msg = "";
  let category = "";

  if (language == undefined) language = "ar";
  categoriesObj.forEach((element, index) => {
    if (language == "en") {
      category = element.name_en;
    } else {
      category = element.name_ar;
    }

    msg += `( *${index + 1}* ) ${category}
   `;
  });

  return msg;
};

const subCategoriess = async (subCategoriesObj, language) => {
  let msg = "";
  let sub_category;
  if (language == undefined) language = "ar";
  subCategoriesObj.forEach((element, index) => {
    if (language == "en") {
      sub_category = element.name_en;
    } else {
      sub_category = element.name_ar;
    }
    msg += `( *${index + 1}* ) ${sub_category}
   `;
   console.log(sub_category)
  });
  return msg;
};

const products = async (productsObj, language) => {
  console.log("language storeService 45: ", language);
  let msg = "";
  let product;
  if (language == undefined) language = "ar";
  productsObj.forEach((element, index) => {
    if (language == "en") {
      product = element.name_en;
    } else {
      product = element.name_ar;
    }
    msg += `( *${index + 1}* ) ${product}
   `;
  });
  return msg;
};

// get all branches to this store
const branches = async (branchesObj, language) => {
  let msg = "";
  let branch;
  if (language == undefined) language = "ar";
  branchesObj.forEach((element, index) => {
    if (language == "en") {
      branch = element.name_en;
    } else {
      branch = element.name_ar;
    }
    msg += `( *${index + 1}* ) ${branch}
   `;
  });
  return msg;
};
// get and show the purchases

const showPurchases = async (receiver_id, sender, translation, language) => {
  let purchase;
  if (language == undefined) language = "ar";

  let msg = "",
    addedFeatures = "",
    quantity = "";
  const [_showCartRes, isOrderRes] = await Promise.all([
    getUserVars(receiver_id, sender, "cart"),
    getUserVars(receiver_id, sender, "isorder"),
  ]);
  const _showCart = JSON.parse(_showCartRes);
  const isOrder = JSON.parse(isOrderRes);
  let purchasesObj = _showCart.items;

  purchasesObj.forEach((element, index) => {
    if (element.features.length != 0)
      addedFeatures = `${translation.features}: ${showFeatures(
        element.features,
        translation,
        language
      )} 
        `;
    else addedFeatures = "";

    if (isOrder === true) quantity = `${translation.number}  ${element.qty} `;
    else quantity = "";
    if (language == "en") {
      purchase = element.name_en;
    } else {
      purchase = element.name_ar;
    }
    let qty;
    if(isOrder === true){
      qty = element.qty;
    }else{
      qty = 1;
    }
    msg += ` *${index + 1}* . ${purchase},  ${quantity},  ${
      translation.price
    }  ${(element.price * qty).toFixed(2)} ${translation.the_currency}
        ${addedFeatures}
     `;
  });

  return msg;
};

//get and show features
const showFeatures = (featuresObj, translation, language) => {
  let feature;

  let msg = "";

  featuresObj.forEach((element, index) => {
    if (language == "en") {
      feature = element.name_en;
    } else {
      feature = element.name_ar;
    }

    msg += `( *${index + 1}* ) ${feature},  ${translation.price}  ${
      element.price
    } ${translation.the_currency}
   `;
  });
  return msg;
};

const StoreService = {
  showFeatures,
  showPurchases,
  branches,
  products,
  subCategoriess,
  categories,
};

module.exports = {
  StoreService,
};
