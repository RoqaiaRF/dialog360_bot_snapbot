
const sendMsg = require("./englishPhases");
const getCategories = require("../app/controllers/categoryController");
const storeController = require("../app/controllers/storeController");
const getProducts = require("../app/controllers/productController");
const {
  setUserVars,
  getUserVars,
  delUserVars,
} = require("../database/redis");

//Print Categories

const englishBot= async (
    sender_id,
    receiver_id,
    message,
    longitude,
    latitude,
    username)=>{

const categories = (categoriesObj) => {
  let msg = "";
  categoriesObj.forEach((element, index) => {
    msg += `(*${index + 1}*) ${element.name_en}
 `;
  });
  return msg;
};

const subCategoriess = (subCategoriesObj) => {
  let msg = "";
  subCategoriesObj.forEach((element, index) => {
    msg += `(*${index + 1}*) ${element.name_en}
 `;
  });
  return msg;
};

const products = (productsObj) => {
  let msg = "";
  productsObj.forEach((element, index) => {
    msg += `(*${index + 1}*) ${element.name_en}
 `;
  });
  return msg;
};


receiver_id = receiver_id.replace("whatsapp:+141", "");
sender = sender_id.replace("whatsapp:+962", "");
//TODO: UNCOMMENT THIS
receiver_id = receiver_id.replace("whatsapp:+965", "");
// sender = sender_id.replace("whatsapp:+965", "");

console.log(receiver_id);
const storObj = JSON.parse(
  JSON.stringify(await storeController.storeDetails(sender, receiver_id))
);
console.log(storObj);
console.log(sender, receiver_id);

const storeEN_Name = storObj.name_en; // اسم المتجر بالانجليزي

const store_id = storObj.id; // we need it to get the categories
const parent_id = storObj.parent_id;

// console.log(`store_id: ${store_id}`);
console.log(storObj);
let phase = await getUserVars(sender, "phase");
console.log(`phase: ${phase}`);
let language = await getUserVars(sender, "language")

if (message == "0" || message == "العودة للرئيسية") {
  delUserVars(sender, "branch");
  delUserVars(sender, "cats");
  delUserVars(sender, "subcategories");
  delUserVars(sender, "products");

  sendMsg.welcomeLangPhase(sender_id, storeEN_Name, storeAR_Name, username);
  setUserVars(sender, "phase", "1");
} else if (message == "*") {
  //TODO: المستخدم بحاجة للمساعدة قم بارسال اشعار للداشبورد
}

    switch (phase) {
        case "0":
        case null:
        case undefined:
          // رسالة الترحيب تحتوي على اسم المتجر بالعربي والانجليزي واختيار اللغة
          sendMsg.welcomeLangPhase(
            sender_id,
            storeEN_Name,
            storeAR_Name,
            username
          );
  
          //Store phase # 1 EX: (key, value) => ( whatsapp:+96563336437 , 1 )
          setUserVars(sender, "phase", "1");
          break;
  
        case "1":
          if (message === "العربية") {
            setUserVars(sender, "language", "ar");
            //  arabicBot(sender_id, message,  longitude, latitude);
            
            bot(sender_id,
              receiver_id,
              message,
              longitude,
              latitude)
              return;
          } else if (message === "English") {
            setUserVars(sender, "language", "en");
            sendMsg.locationPhase(sender_id);
            setUserVars(sender, "phase", "2");
          } else {
            //Send ERROR message : If the message sent is wrong
            sendMsg.errorMsg(sender_id);
          }
          break;
  
        case "2":
          if (longitude == undefined || latitude == undefined) {
            sendMsg.errorMsg(sender_id);
            console.log(longitude);
          } else {
            const nearestBranch = await storeController.getNearestBranch(
              sender,
              receiver_id,
              latitude,
              longitude
            );
            if (!nearestBranch) {
              setUserVars(sender, "phase", "2");
              sendMsg.customMessage(
                "Sorry, we do not offer services within your location",
                sender_id
              );
              sendMsg.locationPhase(sender_id);
            } else {
              sendMsg.nearestLocation(sender_id, nearestBranch.name_en);
              setUserVars(sender, "phase", "3");
            }
          }
          break;
        case "3":
          // const branch = JSON.parse(await getUserVars(sender, "branch"));
          // if (branch.parent == null) {
          //   store_id = branch.id;
          // } else {
          //   store_id = branch.parent_id;
          // }
          if (message == "ابدأ الطلب") {
            const categoryObj = JSON.parse(
              JSON.stringify(await getCategories(sender, store_id))
            );
            setUserVars(sender, "phase", "4");
            sendMsg.categoryPhase(sender_id, "" + categories(categoryObj));
          } else if (message === "اختر فرع اخر") {
            delUserVars(sender, "branch"); // احذف الفرع الموجود
            sendMsg.locationPhase(sender_id);
            setUserVars(sender, "phase", "2");
          } else {
            sendMsg.errorMsg(sender_id);
          }
          break;
  
        case "4":
          if (isNaN(message) == true) {
            sendMsg.errorMsg(sender_id);
            return;
          }
          let indexCategory = message - 1;
          let categoryObj = JSON.parse(await getUserVars(sender, "cats"));
          let category = categoryObj[indexCategory];
          let length = categoryObj.length;
  
          if (message > length || message <= 0) {
            // send error msg
            sendMsg.errorMsg(sender_id);
          } else {
            let subCategoriesCount = category.subCategories.length;
  
            if (subCategoriesCount > 0) {
              console.log("*********v*************", category);
              setUserVars(sender, "phase", "5");
              sendMsg.subCategoryPhase(
                sender_id,
                subCategoriess(category.subCategories)
              );
              setUserVars(
                sender,
                "subcategories",
                JSON.stringify(category.subCategories)
              );
            } else {
              setUserVars(sender, "phase", "6"); // اختيار المنتجات
              const productsObj = await getProducts(sender, category.id);
              sendMsg.productPhase(sender_id, products(productsObj));
            }
          }
          break;
  
        case "5": // التصنيفات الفرعية
          let subCategories = JSON.parse(
            await getUserVars(sender, "subcategories")
          );
          let categoryObj5 = JSON.parse(await getUserVars(sender, "cats"));
          let length5 = subCategories.length;
  
          if (message === "00") {
            delUserVars(sender, "subcategories");
  
            sendMsg.categoryPhase(sender_id, "" + categories(categoryObj5));
          } else if (
            isNaN(message) === true ||
            message > length5 ||
            message <= 0
          ) {
            // send error msg
            sendMsg.errorMsg(sender_id);
          } else {
            let categoryIndex = message - 1;
            let category = subCategories[categoryIndex];
            setUserVars(sender, "phase", "6"); // اختيار المنتجات
            const productsObj = await getProducts(sender, category.id);
            sendMsg.productPhase(sender_id, products(productsObj));
          }
          break;
  
        case "6": //  المنتجات
          if (isNaN(message) === true) {
            // send error msg
            sendMsg.errorMsg(sender_id);
            return;
          }
  
          let productObj = JSON.parse(await getUserVars(sender, "products"));
  
          let length2 = productObj.length;
          let categoryObj2 = JSON.parse(await getUserVars(sender, "cats"));
  
          if (message == "00") {
            delUserVars(sender, "products");
            delUserVars(sender, "subcategories");
            setUserVars(sender, "phase", "4");
            sendMsg.categoryPhase(sender_id, "" + categories(categoryObj2));
          } else if (message <= 0 || message > length2) {
            // send error msg
            sendMsg.errorMsg(sender_id);
            console.log("lenght ", length2);
          } else {
            let productObj6 = JSON.parse(await getUserVars(sender, "products"));
            setUserVars(sender, "phase", "7"); // اختيار المنتجات
            let productIndex6 = message - 1;
            let product6 = productObj6[productIndex6];
            sendMsg.showProduct(sender_id, product6);
          }
          break;
  
        case 7: // عرض الخدمة الواحدة او المنتج
          if (isNaN(message) === true) {
            // send error msg
            sendMsg.errorMsg(sender_id);
            return;
          }
          let productObj7 = JSON.parse(await getUserVars(sender, "products"));
          let length7 = productObj7.length;
  
          if (message == "00") {
            delUserVars(sender, "subcategories");
            delUserVars(sender, "products");
            setUserVars(sender, "phase", "6");
            sendMsg.productPhase(sender_id, products(productsObj7));
          } else if (message <= 0 || message > length7) {
            // send error msg
            sendMsg.errorMsg(sender_id);
          } else {
            //عرض المنتج الواحد
            let productIndex = message - 1;
            let product = productObj7[productIndex];
            sendMsg.showProduct(sender_id, product);
          }
      }
} 

module.exports = englishBot;