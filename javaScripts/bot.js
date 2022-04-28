const sendMsg = require("./phases");
const getCategories = require("../app/controllers/categoryController");
const storeController = require("../app/controllers/storeController");
const cartController = require("../app/controllers/cartController");
const getProducts = require("../app/controllers/productController");
const {
  setUserVars,
  getUserVars,
  delUserVars,
  deleteAllKeys,
} = require("../database/redis");
const englishBot = require("../javaScripts/englishBot");
let expiration_time = 7200; // مدة صلاحية انتهاء المفاتيح في ريديس تساوي ساعتان
//Print Categories

const categories = (categoriesObj) => {
  let msg = "";
  categoriesObj.forEach((element, index) => {
    msg += `( *${index + 1}* ) ${element.name_ar}
 `;
  });
  return msg;
};

const subCategoriess = (subCategoriesObj) => {
  let msg = "";
  subCategoriesObj.forEach((element, index) => {
    msg += `( *${index + 1}* ) ${element.name_ar}
 `;
  });
  return msg;
};

const products = (productsObj) => {
  let msg = "";
  productsObj.forEach((element, index) => {
    msg += `( *${index + 1}* ) ${element.name_ar}
 `;
  });
  return msg;
};

// get all branches to this store
const branches = (branchesObj) => {
  let msg = "";
  branchesObj.forEach((element, index) => {
    msg += `( *${index + 1}* ) ${element.name_ar}
 `;
  });
  return msg;
}

// get and show the purchases
const showPurchases =(purchasesObj) => {
  let msg = "";
  let featuresMsg = "";
  if ( purchasesObj.features){featuresMsg= `  :الخدمات الاضافية:` }
   purchasesObj.forEach((element, index) => {
    msg += ` *${index + 1}* . ${element.name_ar},  عدد:  ${element.quantity}
    ${featuresMsg} ${element.features}
 `;
  });
  return msg;
};

//get and show features
const showFeatures =(featuresObj) => {
  let msg = "";
  featuresObj.forEach((element, index) => {
    msg += `( *${index + 1}* ) ${element.name_ar},  السعر:  ${element.price}
 `;
  });
  return msg;
};

// receiver_id: رقم صاحب المتجر / رقم البوت
// sender_id: رقم المرسل / الزبون

const bot = async (
  sender_id,
  receiver_id,
  message,
  longitude,
  latitude,
  username
) => {
  // EX: Input: "whatsapp:+96512345678" ,Output: "12345678"
  receiver_id = receiver_id.replace("whatsapp:+141", "");
  sender = sender_id.replace("whatsapp:+962", "");
  //TODO: UNCOMMENT THIS
  //receiver_id = receiver_id.replace("whatsapp:+965", "");
  // sender = sender_id.replace("whatsapp:+965", "");

  console.log(receiver_id);
  const storObj = JSON.parse(
    JSON.stringify(await storeController.storeDetails(sender, receiver_id)) //هذه خليها سيندر وليس سندر اي دي لانه احنا مش مخزنين كود الدولة لهيك لازم نحذفه
  );
  let cart ;
  console.log(storObj);
  console.log(sender, receiver_id);

  const storeEN_Name = storObj.name_en; // اسم المتجر بالانجليزي
  const storeAR_Name = storObj.name_ar; // اسم المتجر في العربي

 
  console.log(storObj);
  let phase = await getUserVars(sender, "phase");
  console.log(`phase: ${phase}`);
  let language = await getUserVars(sender, "language");

  if (message == "0" || message == "العودة للرئيسية") {
    delUserVars(sender, "branch");
    delUserVars(sender, "cats");
    delUserVars(sender, "subcategories");
    delUserVars(sender, "products");
    delUserVars(sender, "language");
    delUserVars(sender, "allbranches");
    delUserVars(sender, "productDetails");


    sendMsg.welcomeLangPhase(
      sender_id,
      storeEN_Name,
      storeAR_Name,
      username,
      storObj
    );
    setUserVars(sender, "phase", "1");
  } else if (message == "*") {
    //TODO: المستخدم بحاجة للمساعدة قم بارسال اشعار للداشبورد
  } else if (language == "en") {
    englishBot(sender_id, receiver_id, message, longitude, latitude);
  } else {
    switch (phase) {
      case "0":
      case null:
      case undefined:
        // رسالة الترحيب تحتوي على اسم المتجر بالعربي والانجليزي واختيار اللغة
        sendMsg.welcomeLangPhase(
          sender_id,
          storeEN_Name,
          storeAR_Name,
          username,
          storObj
        );

        //Store phase # 1 EX: (key, value) => ( whatsapp:+96563336437 , 1 )
        setUserVars(sender, "phase", "1");
        break;

      case "1":
        if (message === "العربية") {
          setUserVars(sender, "language", "ar");
          sendMsg.locationPhase(sender_id);
          setUserVars(sender, "phase", "2");
        } else if (message === "English") {
          setUserVars(sender, "language", "en");
          englishBot(sender_id, receiver_id, message, longitude, latitude);
          break;
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
          //TODO: تمرمير رسوم التوصيل الخاصة بالمتجر 
          cart = cartController.newCart(sender, storObj.tax, 0 ); // TODO add real tax

          if (!nearestBranch) {
            setUserVars(sender, "phase", "2");
            sendMsg.customMessage(
              "عذرا لا نقدم خدمات ضمن موقعك الجغرافي",
              sender_id
            );
            sendMsg.locationPhase(sender_id);
          } else {
            sendMsg.nearestLocation(sender_id, nearestBranch.name_ar, storObj);
            setUserVars(sender, "phase", "3");
          }
        }
        break;
      case "3":
        if (message == "ابدأ الطلب") {
          const categoryObj = JSON.parse(
            JSON.stringify(await getCategories(sender, storObj.id, 1))
          );
          setUserVars(sender, "phase", "4");
          sendMsg.categoryPhase(sender_id, "" + categories(categoryObj));
        } else if (message === "اختر فرع اخر") {
          delUserVars(sender, "branch"); // احذف الفرع الموجود

          //احضر الفروع كلها من الداتابيز
          const branchObj = JSON.parse(
            JSON.stringify(await storeController.getAllBranchs(receiver_id))
          );
          sendMsg.getAllBranchesPhase(sender_id, "" + branches(branchObj));
          console.log(branches(branchObj));
          setUserVars(sender, "phase", "3.1");
        } else if (message == "ابدأ الحجز") {
          const categoryObj = JSON.parse(
            JSON.stringify(await getCategories(sender, storObj.id, 0))
          );
          setUserVars(sender, "phase", "4");
          sendMsg.categoryPhase(sender_id, "" + categories(categoryObj));
        } else {
          sendMsg.errorMsg(sender_id);
        }
        break;

      case "3.1":
        if (isNaN(message) == true) {
          sendMsg.errorMsg(sender_id);
          return;
        }
        let indexBranches = message - 1;
        let branchesObj = JSON.parse(await getUserVars(sender, "allbranches"));
        let selectedBranch = branchesObj[indexBranches];
        console.log("branchesList:", selectedBranch);

        if (message > branchesObj.length || message <= 0) {
          // send error msg
          sendMsg.errorMsg(sender_id);
        } else {
          //TODO: Convert this message to template with 3 buttons:  ابدأ الطلب, ابدأ الحجز , العودة للرئيسية
          sendMsg.customMessage(
            `اهلا بك في  ${selectedBranch.name_ar}`,
            sender_id
          );
          //تخزين الفرع المختار مكان المتجر
          setUserVars(sender, "branch", JSON.stringify(selectedBranch));
          cart = cartController.newCart(sender, storObj.tax); 
          setUserVars(sender, "phase", "3");
        }
        break;

      case "4"://عرض التصنيفات الفرعية 
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
            console.log("********* Category *************", category);
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
        let length5;

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
          setUserVars(sender, "productDetails", JSON.stringify(product6));
          console.log("################################", product6);
        }
        break;

      case "7": // عرض الخدمة الواحدة او المنتج
        let productObj7 = JSON.parse(await getUserVars(sender, "products"));
        if (message === "00") {
          setUserVars(sender, "phase", "6");
          sendMsg.productPhase(sender_id, products(productObj7));
        }
        //لا تتم الاضافة للسلة بعد , يجب تحديد الكمية وبعدها يضيف للسلة
        else if (message == "اضافة للسلة") {
          setUserVars(sender, "phase", "8");
          sendMsg.quantityProductPhase(sender_id);
          console.log("اضف للسلة يا بني !");
        }
      
         else {
          sendMsg.errorMsg(sender_id);
        }
        break;

        case "7.1": //اختيار المميزات / الخدمات الاضافيه
        let productDetails_7_1 = JSON.parse( await getUserVars(sender, "productDetails"));
        const featuresCount = productDetails_7_1.features.length;
        const newCart7_1 =  JSON.parse( await getUserVars(sender, "cart"));

        if (isNaN(message) === true) {
            sendMsg.errorMsg(sender_id);
            return;
          }
          else if (message === "00") {
            sendMsg.showProduct(sender_id, (productDetails_7_1) );
            setUserVars(sender, "phase", "7");
        
          }
          else if (message < 0 || message > featuresCount) {
             sendMsg.errorMsg(sender_id);
            }      
            // add selected feature to the cart list
          else{
            
           let features = JSON.parse( await getUserVars(sender, "features"));
           const featureIndex = message - 1;
           const selectedFeature = features[featureIndex];
          // add selected feature to the cart list 
          await cartController.addFeatureToCart(sender, productDetails_7_1,selectedFeature);

          //عرض السلة بعد اضافة الخدمات الاضافية
           const purchases7_1 = showPurchases(newCart7_1.items) + "";

           sendMsg.showCart(sender_id, purchases7_1 ,newCart7_1.price, newCart7_1.tax, newCart7_1.total);
            setUserVars(sender, "phase", "9"); 
            
          } 
            break;

      case "8":
        if (isNaN(message) === true) {
          // send error msg
          sendMsg.errorMsg(sender_id);
          return;
        }
        
        // Check the maximum quantity of this product
        let productDetails = JSON.parse( await getUserVars(sender, "productDetails"));
        const quantity = productDetails.quantity;
        if (parseInt(message) > parseInt(quantity) || parseInt(message) <= 0) {
          sendMsg.customMessage(`الكمية خاطئة! ادخل كمية اقل من ${quantity}`,sender_id);
        } else {
          if (productDetails.features.length > 0){
            console.log("productDetails.features.length ",productDetails.features.length)

          // اضافة الكمية التي اختارها المستخدم لمعلومات المنتج
          productDetails.quantity = parseInt(message);
          productDetails.features = [];

         await cartController.addToCart(sender, productDetails);
          sendMsg.customMessage("هل تريد خدمات اضافية ؟ --- اختر نعم او لا", sender_id)
          setUserVars(sender, "phase", "8.1"); 
          }
          else{

          let newCart8 = JSON.parse( await getUserVars(sender, "cart"));
          console.log("**********newCart8_1", newCart8);

          const purchases8 = showPurchases(newCart8.items) + ""

          setUserVars(sender, "phase", "9");
          sendMsg.showCart(sender_id, purchases8 , newCart8.price, newCart8.tax, newCart8.total);
     
          } 

        } 

        break;
      case "8.1":
        if(message === "نعم"){// show features

          let productDetails = JSON.parse( await getUserVars(sender, "productDetails"));
          const features = showFeatures(productDetails.features);
          const featuresCount7 = productDetails.features.length;

          if (featuresCount7 > 0 ){
            sendMsg.featuresPhase(sender_id, features)
            setUserVars(sender, "phase", "7.1");
            setUserVars(
              sender,
              "features",
              JSON.stringify(productDetails.features)
            ); 
          }else {

            await sendMsg.customMessage("لا يوجد خدمات اضافية",sender_id);
            sendMsg.showProduct(sender_id, (productDetails) );
            console.log(JSON.stringify("productDetails",productDetails));
            setUserVars(sender, "phase", "7");
          }
        }
        else if(message === "لا"){ // show cart details

          let newCart8_1 = JSON.parse( await getUserVars(sender, "cart"));
          console.log("**********newCart8_1", newCart8_1);
          const purchases8_1 = showPurchases(newCart8_1.items) + ""
          setUserVars(sender, "phase", "9");
          sendMsg.showCart(sender_id, purchases8_1 , newCart8_1.price, newCart8_1.tax, newCart8_1.total);
     
        }
        else{ 
          sendMsg.errorMsg(sender_id);

        }
          break
      case "9": // cart
        let newCart9 = JSON.parse( await getUserVars(sender, "cart"));
        const purchases9 = showPurchases(newCart9.items) + "";

        if (message === "الدفع"){
          //TODO: عرض السلة كاملة مع رابط للدفع
        }
        else if (message === "حدد المنتج لحذفه"){
          sendMsg.customMessage( `حدد رقم المنتج لحذفه: 
${purchases9} `,sender_id)
          setUserVars(sender, "phase", "9.1"); 
        }
        else if (message === "اضافة منتجات"){
          setUserVars(sender, "phase", "6");
          let productObj7 = JSON.parse(await getUserVars(sender, "products"));
          sendMsg.productPhase(sender_id, products(productObj7)); 
        }
        else { 
          sendMsg.errorMsg(sender_id);

        }
        
      break;

      case "9.1":

        let productCart = JSON.parse(
          await getUserVars(sender, "cart")
        );
        productCart = productCart.items
        const length9_1 = productCart.length;
          console.log("---------product Cart---------",productCart)
        if (
          isNaN(message) === true ||
          message > length9_1 ||
          message <= 0
        ) {
          // send error msg
          sendMsg.errorMsg(sender_id); 
        } else  {
          // Delete product from cart

          let productCartIndex = message - 1; // index of product in cart
          const deletedItem = productCart[productCartIndex];

          const result = await cartController.removeFromCart(sender, deletedItem)
          console.log("--------deletedItem_ID ---------: ",deletedItem)
          console.log("--------productCart ---------: ",productCart)
          console.log("--------productCartIndex ---------: ",productCartIndex)

          if (result) { 
            
            let newCart9_1 =  JSON.parse( await getUserVars(sender, "cart"));
         
            const purchases9_1 = showPurchases(newCart9_1.items) + "";

            sendMsg.showCart(sender_id, purchases9_1 ,newCart9_1.price, newCart9_1.tax, newCart9_1.total);
            setUserVars(sender, "phase", "9"); 

          }
          else {            
            sendMsg.customMessage("خطأ في عملية الحذف من السلة",sender_id)
            setUserVars(sender, "phase", "9"); 

        }
        }

        break;
      
    }
  }
};
module.exports = bot;

//TODO: Add Documentation for this module
/** Phase numbering
 * phase 1 : welcome & language
 * phase 2 : location
 *           get the nearest branch
 * phase 3 : main categories
 * phase 4 :
 */
