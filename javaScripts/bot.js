const sendMsg = require("./phases");
const getCategories = require("../app/controllers/categoryController");
const storeController = require("../app/controllers/storeController");
const cartController = require("../app/controllers/cartController");
const location = require("../app/helpers/location");
const {
  getProducts,
  getQuantity,
} = require("../app/controllers/productController");
const {
  setUserVars,
  getUserVars,
  delUserVars,
  deleteAllKeys,
} = require("../database/redis");

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
};
// get and show the purchases

const showPurchases = async () => {
  let msg = "", addedFeatures = "", quantity= "";
  const _showCart = JSON.parse(await getUserVars(sender, "cart"));
  let purchasesObj = _showCart.items;
  const isOrder = JSON.parse( await getUserVars(sender,"isorder"));


  purchasesObj.forEach((element, index) => {
    if (element.features.length != 0)
      addedFeatures = `الخدمات الاضافية: ${showFeatures(element.features)} 
      `;
    else addedFeatures = "";

    if (isOrder === true)
      quantity = `عدد:  ${
        element.qty
      } `
    else 
      quantity= "";
   
    msg += ` *${index + 1}* . ${element.name_ar},  ${quantity} المدة:  ${element.duration} دقيقه
      ${addedFeatures}
   `;
  });

  return msg;
};

/*
const showFeaturesAlone = async ( ) => {

  let msg = "";
   const _showCart =   JSON.parse(await getUserVars(sender, "cart"));
   let purchasesObj = _showCart.items;

   
   purchasesObj.forEach((element, index) => {

         msg += ` *${index + 1}* . ${element.name_ar},  عدد:  ${element.qty}
     الخدمات الاضافية: ${showFeatures(element.features)} 
    `;
 
   });
 
   return msg;
 };
 */

//get and show features
const showFeatures = (featuresObj) => {
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
  username,
  locales
) => {
  // EX: Input: "whatsapp:+96512345678" ,Output: "12345678"

  receiver_id = receiver_id.replace("whatsapp:+", "");
  sender = sender_id.replace("whatsapp:+", "");
// get store details 
  const storObj = JSON.parse(
    JSON.stringify(await storeController.storeDetails(sender, receiver_id))
  );
  let cart, cityName;

  const storeEN_Name = storObj.name_en; // اسم المتجر بالانجليزي
  const storeAR_Name = storObj.name_ar; // اسم المتجر في العربي

  console.log(storObj);
  let phase = await getUserVars(sender, "phase");
  console.log(`phase: ${phase}`);
  let language = await getUserVars(sender, "language");

  if (message == "0" || message == "العودة للرئيسية") {
    //احذف هذه الاشياء من الريديس
    delUserVars(sender, "branch");
    delUserVars(sender, "cats");
    delUserVars(sender, "cart");
    delUserVars(sender, "subcategories");
    delUserVars(sender, "products");
    delUserVars(sender, "language");
    delUserVars(sender, "allbranches");
    delUserVars(sender, "productDetails");
    delUserVars(sender, "quantity");
    delUserVars(sender, "features");
    delUserVars(sender, "pickup_Policy");
    delUserVars(sender, "location");
    delUserVars(sender, "isorder");

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
  } else if (message == "JGHFds547fdgl;kj78") {
    //حذف كل شيء بالريديس
    sendMsg.customMessage(
      "تم حذف كل شيء في الريديس بنجاح انتظر شي 3 دقائق حتى تعود الخدمات لشكلها الصحيح",
      sender_id
    );

    deleteAllKeys();
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
          storObj,
          locales
        );
        //Store phase # 1 EX: (key, value) => ( whatsapp:+96563336437 , 1 )
        setUserVars(sender, "phase", "1");
        break;

      case "1":
        if (message === "العربية") {
          setUserVars(sender, "language", "ar");
          const pickup_Policy = storObj.pickup_Policy;

          console.log("pickup_Policy-----------------", pickup_Policy);
          //  بنحكيله بدك نوصل لك لبيتك او بدك تيجي للمحل حسب اذا كان فيه باكاب او لا
          if (pickup_Policy) {
            sendMsg.pickupPhase(sender_id);
            setUserVars(sender, "phase", "1.1");
          } else {
            sendMsg.locationPhase(sender_id);
            setUserVars(sender, "phase", "2");
          }
        } else if (message === "English") {
          setUserVars(sender, "language", "en");
          englishBot(sender_id, receiver_id, message, longitude, latitude);
          break;
        } else {
          //Send ERROR message : If the message sent is wrong
          sendMsg.errorMsg(sender_id);
        }
        break;

      case "1.1":
        if (message == "توصيل لبيتي") {
          sendMsg.locationPhase(sender_id);
          setUserVars(sender, "phase", "2");
          setUserVars(sender, "pickup_Policy", false);
        } else if (message == "استلام من المتجر") {
          setUserVars(sender, "pickup_Policy", true);

          //احضر الفروع كلها من الداتابيز
          const branchObj = JSON.parse(
            JSON.stringify(await storeController.getAllBranchs(receiver_id))
          );
          sendMsg.getAllBranchesPhase(sender_id, "" + branches(branchObj));
          setUserVars(sender, "phase", "3.1");
        } else {
          sendMsg.errorMsg(sender_id);
        }

        break;

      case "2":
        if (longitude == undefined || latitude == undefined) {
          sendMsg.errorMsg(sender_id);
        } else {
          console.log("sender:", sender);
          console.log("longitude: ", longitude);
          console.log("latitude: ", latitude);
          const location2 = `{"lat":${latitude},"lng":${longitude} }`;
          // store location in redis
          setUserVars(sender, "location", `${location2}`);

          const nearestBranch = await storeController.getNearestBranch(
            sender,
            receiver_id,
            latitude,
            longitude
          );

          cityName = await location.getCityName(latitude, longitude);
          console.log("  258 latitude, longitude: ", latitude, longitude);
          const fees = await storeController.getFees(storObj.id, cityName);

          if (fees == -1) {
            // هذا يعني ان المدينة التي ارسلها اليوزر غير موجوده في قواعد البيانات لدينا
            setUserVars(sender, "phase", "2");
            sendMsg.customMessage(
              "عذرا لا نقدم خدمات ضمن موقعك الجغرافي",
              sender_id
            );
            sendMsg.locationPhase(sender_id);
          } else {
            console.log("  270 latitude, longitude: ", latitude, longitude);
            let branch = JSON.parse(await getUserVars(sender, "branch"));
            cart = cartController.newCart(
              sender,
              branch.id,
              latitude,
              longitude,
              storObj.tax,
              fees
            );
            if (!nearestBranch) {
              setUserVars(sender, "phase", "2");
              sendMsg.customMessage(
                "عذرا لا نقدم خدمات ضمن موقعك الجغرافي",
                sender_id
              );
              sendMsg.locationPhase(sender_id);
            } else {
              sendMsg.nearestLocation(
                sender_id,
                nearestBranch.name_ar,
                storObj
              );
              setUserVars(sender, "phase", "3");
            }
          }
        }
        break;

      case "2.1":
        let branch2_1 = JSON.parse(await getUserVars(sender, "branch"));
        if (longitude == undefined || latitude == undefined) {
          sendMsg.errorMsg(sender_id);
        } else {
          console.log("  296 latitude, longitude: ", latitude, longitude);
          cityName = await location.getCityName(latitude, longitude);
          const fees = await storeController.getFees(branch2_1.id, cityName);

          if (fees == -1) {
            // هذا يعني ان المدينة التي ارسلها اليوزر غير موجوده في قواعد البيانات لدينا
            setUserVars(sender, "phase", "2");
            sendMsg.customMessage(
              "عذرا لا نقدم خدمات ضمن موقعك الجغرافي",
              sender_id
            );
            sendMsg.locationPhase(sender_id);
          } else {
            console.log("  309 latitude, longitude: ", latitude, longitude);
            cart = cartController.newCart(
              sender,
              branch2_1.id,
              latitude,
              longitude,
              storObj.tax,
              fees
            );
            setUserVars(sender, "phase", "3");
            sendMsg.nearestLocation(sender_id, selectedBranch.name_ar, storObj);
          }
        }
        break;

      case "3":
        if (message == "ابدأ الطلب") {
          const categoryObj = JSON.parse(
            JSON.stringify(await getCategories(sender, storObj.id, 1))
          );
          setUserVars(sender, "isorder", true);
          let cart3 = JSON.parse(await getUserVars(sender, "cart"));
          cart3.isOrder = true;
          setUserVars(sender, "cart", JSON.stringify(cart3));

          setUserVars(sender, "phase", "4");
          sendMsg.categoryPhase(sender_id, "" + categories(categoryObj));
        } else if (message === "اختر فرع اخر") {
          delUserVars(sender, "branch"); // احذف الفرع الموجود
          delUserVars(sender, "cart"); // احذف السله الموجود

          //احضر الفروع كلها من الداتابيز
          const branchObj = JSON.parse(
            JSON.stringify(await storeController.getAllBranchs(receiver_id))
          );
          sendMsg.getAllBranchesPhase(sender_id, "" + branches(branchObj));

          setUserVars(sender, "phase", "3.1");
        } else if (message == "ابدأ الحجز") {
          const categoryObj = JSON.parse(
            JSON.stringify(await getCategories(sender, storObj.id, 0))
          );
          setUserVars(sender, "isorder", false);
          let cart3r = JSON.parse(await getUserVars(sender, "cart"));
          cart3r.isOrder = false;
          setUserVars(sender, "cart", JSON.stringify(cart3r));

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

        if (message > branchesObj.length || message <= 0) {
          // send error msg
          sendMsg.errorMsg(sender_id);
        } else {
          //TODO: wait for approve Convert this message to template with 3 buttons:  ابدأ الطلب, ابدأ الحجز , العودة للرئيسية
          sendMsg.nearestLocation(sender_id, selectedBranch.name_ar, storObj);

          //تخزين الفرع المختار مكان المتجر
          setUserVars(sender, "branch", JSON.stringify(selectedBranch));
          const fees = 0; // ستكون خدمة الباكاب وبالتالي لا يودجد توصيل
          const pickup_Policy = JSON.parse(
            await getUserVars(sender, "pickup_Policy")
          );
          let lat, lng;
          let branch3_1 = JSON.parse(await getUserVars(sender, "branch"));

          if (pickup_Policy === true) {
            //  ااذ يريد خدمة الباكاب فاجعل العنوان هو نفسه عنوان المتجر
            lat = branch3_1.lat;
            lng = branch3_1.lng;
          } else {
            const location3_1 = JSON.parse(
              await getUserVars(sender, "location")
            );
            lat = location3_1.lat;
            lng = branch3_1.lng;
          }

          console.log(" -----selectedBranch-------------- ", branch3_1);
          cart = cartController.newCart(
            sender,
            selectedBranch.id,
            lat,
            lng,
            storObj.tax,
            fees
          );

          setUserVars(sender, "phase", "3");
        }
        break;

      case "4": //عرض التصنيفات الفرعية
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

        if (isNaN(message) == true) {
          sendMsg.errorMsg(sender_id);
        }
        if (message == "00") {
          delUserVars(sender, "subcategories");
          setUserVars(sender, "phase", "4");
          sendMsg.categoryPhase(sender_id, "" + categories(categoryObj5));
        } else if (message > length5 || message <= 0) {
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
        console.log("productObj: ", productObj);
        if (productObj === {}) {
          sendMsg.customMessage("لا يوجد بيانات  لعرضها!", sender_id);
          setUserVars(sender, "phase", "1");
        }

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
        } else {
          let branch = JSON.parse(await getUserVars(sender, "branch"));
          let productObj6 = JSON.parse(await getUserVars(sender, "products"));
          setUserVars(sender, "phase", "7"); // اختيار المنتجات
          let productIndex6 = message - 1;
          let product6 = productObj6[productIndex6];

          product6.qty = await getQuantity(branch.id, product6.id);
          sendMsg.showProduct(sender_id, product6);
          setUserVars(sender, "productDetails", JSON.stringify(product6));
        }
        break;

      case "7": // عرض الخدمة الواحدة او المنتج
        let productObj7 = JSON.parse(await getUserVars(sender, "products"));
        if (message === "00") {
          setUserVars(sender, "phase", "6");
          sendMsg.productPhase(sender_id, products(productObj7));
        }
        //لا تتم الاضافة للسلة بعد , يجب تحديد الكمية وبعدها يضيف للسلة
        // ااذا كانت السياسه حجز فسيضيف للسله عادي
        else if (message == "اضافة للسلة") {
          const isorder7 = JSON.parse(await getUserVars(sender, "isorder"));
          if (isorder7 === true) {
            setUserVars(sender, "phase", "8");
            await sendMsg.quantityProductPhase(sender_id);
          } else if (isorder7 === false) {
            setUserVars(sender, "quantity", "1");
            let productDetails_7 = JSON.parse(
              await getUserVars(sender, "productDetails")
            );

            await cartController.addToCart(sender, productDetails_7);
            let newCart7 = JSON.parse(await getUserVars(sender, "cart"));
            const purchases7 = (await showPurchases()) + "";

            setUserVars(sender, "phase", "9");
            sendMsg.showCart(
              sender_id,
              purchases7,
              newCart7.price,
              newCart7.tax,
              newCart7.total,
              newCart7.fees // رسوم التوصيل
            );
          }
        } else {
          sendMsg.errorMsg(sender_id);
        }
        break;

      case "7.1": //اختيار المميزات / الخدمات الاضافيه
        let productDetails_7_1 = JSON.parse(
          await getUserVars(sender, "productDetails")
        );
        const featuresCount = productDetails_7_1.features.length;

        const newCart7_1 = JSON.parse(await getUserVars(sender, "cart"));

        if (isNaN(message) === true) {
          sendMsg.errorMsg(sender_id);
          return;
        } else if (message === "00") {
          sendMsg.showProduct(sender_id, productDetails_7_1);
          setUserVars(sender, "phase", "7");
        } else if (message < 0 || message > featuresCount) {
          sendMsg.errorMsg(sender_id);
        }
        // add selected feature to the cart list
        else {
          let features = JSON.parse(await getUserVars(sender, "features"));
          const featureIndex = message - 1;
          const selectedFeature = features[featureIndex];
          // add selected feature to the cart list
          await cartController.addFeatureToCart(
            sender,
            productDetails_7_1,
            selectedFeature
          );

          const newCart7_1 = await JSON.parse(
            await getUserVars(sender, "cart")
          );

          //عرض السلة بعد اضافة الخدمات الاضافية
          const purchases7_1 = await showPurchases();

          sendMsg.showCart(
            sender_id,
            purchases7_1,
            newCart7_1.price,
            newCart7_1.tax,
            newCart7_1.total,
            newCart7_1.fees // رسوم التوصيل
          );
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
        let productDetails = JSON.parse(
          await getUserVars(sender, "productDetails")
        );
        const quantity = productDetails.qty;
        if (parseInt(message) > parseInt(quantity) || parseInt(message) <= 0) {
          sendMsg.customMessage(
            `الكمية خاطئة! ادخل كمية اقل من ${quantity}`,
            sender_id
          );
        } else {
          if (productDetails.features.length > 0) {
            // اضافة الكمية التي اختارها المستخدم لمعلومات المنتج
            productDetails.qty = parseInt(message);
            // productDetails.features = [];
            setUserVars(sender, "quantity", JSON.stringify(parseInt(message)));
            // await cartController.addToCart(sender, productDetails);

            sendMsg.addedDetails(sender_id);
            setUserVars(sender, "phase", "8.1");
          } else {
            productDetails.qty = parseInt(message);
            await cartController.addToCart(sender, productDetails);

            let newCart8 = JSON.parse(await getUserVars(sender, "cart"));
            const purchases8 = (await showPurchases()) + "";

            setUserVars(sender, "phase", "9");
            sendMsg.showCart(
              sender_id,
              purchases8,
              newCart8.price,
              newCart8.tax,
              newCart8.total,
              newCart8.fees // رسوم التوصيل
            );
          }
        }
        break;
      //TODO: اضافة مرحلة لاضافة المزيد من الخدمات الاضافيه

      case "8.1":
        if (message === "نعم") {
          // show features

          let productDetails = JSON.parse(
            await getUserVars(sender, "productDetails")
          );
          const features = showFeatures(productDetails.features);
          const featuresCount7 = productDetails.features.length;

          if (featuresCount7 > 0) {
            sendMsg.featuresPhase(sender_id, features);
            setUserVars(sender, "phase", "7.1");
            setUserVars(
              sender,
              "features",
              JSON.stringify(productDetails.features)
            );
          } else {
            await sendMsg.customMessage("لا يوجد خدمات اضافية", sender_id);
            sendMsg.showProduct(sender_id, productDetails);

            setUserVars(sender, "phase", "7");
          }
        } else if (message === "لا") {
          // show cart details
          let productDetails8_1 = JSON.parse(
            await getUserVars(sender, "productDetails")
          );
          const quantity8_1 = parseInt(await getUserVars(sender, "quantity"));

          productDetails8_1.features = [];
          productDetails8_1.qty = quantity8_1;

          await cartController.addToCart(sender, productDetails8_1);

          let newCart8_1 = JSON.parse(await getUserVars(sender, "cart"));

          const purchases8_1 = (await showPurchases()) + "";

          setUserVars(sender, "phase", "9");
          sendMsg.showCart(
            sender_id,
            purchases8_1,
            newCart8_1.price,
            newCart8_1.tax,
            newCart8_1.total,
            newCart8_1.fees // رسوم التوصيل
          );
        } else {
          sendMsg.errorMsg(sender_id);
        }
        break;
      case "9": // cart
        const purchases9 = await showPurchases();

        if (message === "الدفع") {
          //TODO: عرض السلة كاملة مع رابط للدفع
        } else if (message === "حدد المنتج لحذفه") {
          sendMsg.customMessage(
            `حدد رقم المنتج لحذفه: 
${purchases9} `,
            sender_id
          );
          setUserVars(sender, "phase", "9.1");
        } else if (message === "اضافة منتجات") {
          setUserVars(sender, "phase", "6");
          let productObj7 = JSON.parse(await getUserVars(sender, "products"));
          sendMsg.productPhase(sender_id, products(productObj7));
        } else {
          sendMsg.errorMsg(sender_id);
        }

        break;

      case "9.1":
        let productCart = JSON.parse(await getUserVars(sender, "cart"));
        productCart = productCart.items;
        const length9_1 = productCart.length;

        if (isNaN(message) === true || message > length9_1 || message <= 0) {
          // send error msg
          sendMsg.errorMsg(sender_id);
        } else {
          // Delete product from cart

          let productCartIndex = message - 1; // index of product in cart
          const deletedItem = productCart[productCartIndex];

          const result = await cartController.removeFromCart(
            sender,
            deletedItem,
            productCartIndex
          );

          if (result) {
            sendMsg.customMessage("تم الحذف بنجاح! ", sender_id);

            let newCart9_1 = JSON.parse(await getUserVars(sender, "cart"));
            const purchases9_1 = await showPurchases();

            sendMsg.showCart(
              sender_id,
              purchases9_1,
              newCart9_1.price,
              newCart9_1.tax,
              newCart9_1.total,
              newCart9_1.fees // رسوم التوصيل
            );
            setUserVars(sender, "phase", "9");
          } else {
            sendMsg.customMessage("خطأ في عملية الحذف من السلة", sender_id);
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
