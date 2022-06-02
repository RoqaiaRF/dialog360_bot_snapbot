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

const categories = async (categoriesObj, receiver_id, sender) => {
  let msg = "";
  let category = "";
  let language = await getUserVars(receiver_id, sender, "language");
  console.log("**********language*******", language);
  console.log("**********receiver_id*******", receiver_id);
  console.log("**********sender*******", sender);
  if (language == undefined) language = "ar";
  categoriesObj.forEach((element, index) => {
    if (language == "en") {
      category = element.name_en;
    } else {
      category = element.name_ar;
    }
    console.log("************category*************", category);
    msg += `( *${index + 1}* ) ${category}
 `;
  });

  return msg;
};

const subCategoriess = async (subCategoriesObj, receiver_id, sender) => {
  let msg = "";
  let sub_category;
  let language = await getUserVars(receiver_id, sender, "language");
  if (language == undefined) language = "ar";
  subCategoriesObj.forEach((element, index) => {
    if (language == "en") {
      sub_category = element.name_en;
    } else {
      sub_category = element.name_ar;
    }
    msg += `( *${index + 1}* ) ${sub_category}
 `;
  });
  return msg;
};

const products = async (productsObj, receiver_id, sender) => {
  let msg = "";
  let product;
  let language = await getUserVars(receiver_id, sender, "language");
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
const branches = async (branchesObj, receiver_id, sender) => {
  let msg = "";
  let branch;
  let language = await getUserVars(receiver_id, sender, "language");
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

const showPurchases = async (receiver_id, sender) => {
  let purchase;
  let language = await getUserVars(receiver_id, sender, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  let msg = "",
    addedFeatures = "",
    quantity = "";
  const _showCart = JSON.parse(await getUserVars(receiver_id, sender, "cart"));
  let purchasesObj = _showCart.items;
  const isOrder = JSON.parse(await getUserVars(receiver_id, sender, "isorder"));

  purchasesObj.forEach((element, index) => {
    if (element.features.length != 0)
      addedFeatures = `${translation.features}: ${showFeatures(
        element.features
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
    msg += ` *${index + 1}* . ${purchase},  ${quantity} ${
      translation.Duration
    }  ${element.duration} ${translation.minute}
      ${addedFeatures}
   `;
  });

  return msg;
};

//get and show features
const showFeatures = async (featuresObj) => {
  let feature;
  let language = await getUserVars(receiver_id, sender, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  let msg = "";

  featuresObj.forEach((element, index) => {
    if (language == "en") {
      feature = element.name_en;
    } else {
      feature = element.name_ar;
    }
    msg += `( *${index + 1}* ) ${feature},  ${translation.price}  ${
      element.price
    }
 `;
  });
  return msg;
};

// receiver_id: رقم صاحب المتجر / رقم البوت
// sender_id: رقم المرسل / الزبون
let cart;

const bot = async (
  sender_id,
  receiver_id,
  message,
  longitude,
  latitude,
  username
) => {
  // EX: Input: "whatsapp:+96512345678" ,Output: "12345678"

  receiver_id = receiver_id.replace("whatsapp:+", "");
  sender = sender_id.replace("whatsapp:+", "");
  //TODO : Replace "JSON.parse(JSON.stringify(object))" with "StructuredClone(object)" when available

  // get store details
  const storObj = JSON.parse(
    JSON.stringify(await storeController.storeDetails(sender, receiver_id))
  );

  let cityName;

  const storeEN_Name = storObj.name_en; // اسم المتجر بالانجليزي
  const storeAR_Name = storObj.name_ar; // اسم المتجر في العربي

  console.log(storObj);
  let phase = await getUserVars(receiver_id, sender, "phase");
  console.log(`phase: ${phase}`);
  let language = await getUserVars(receiver_id, sender, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);

  if (message == "0" || message == translation.go_home) {
    //احذف هذه الاشياء من الريديس
    delUserVars(receiver_id, sender, "branch");
    delUserVars(receiver_id, sender, "cats");
    delUserVars(receiver_id, sender, "cart");
    delUserVars(receiver_id, sender, "subcategories");
    delUserVars(receiver_id, sender, "products");
    delUserVars(receiver_id, sender, "language");
    delUserVars(receiver_id, sender, "allbranches");
    delUserVars(receiver_id, sender, "productDetails");
    delUserVars(receiver_id, sender, "quantity");
    delUserVars(receiver_id, sender, "features");
    delUserVars(receiver_id, sender, "pickup_Policy");
    delUserVars(receiver_id, sender, "location");
    delUserVars(receiver_id, sender, "isorder");

    sendMsg.welcomeLangPhase(
      sender_id,
      storeEN_Name,
      storeAR_Name,
      username,
      storObj,
      receiver_id
    );
    setUserVars(receiver_id, sender, "phase", "1");
  } else if (message == "*") {
    //TODO: المستخدم بحاجة للمساعدة قم بارسال اشعار للداشبورد
  } else if (message == "JGHFds547fdglkj78") {
    //حذف كل شيء بالريديس
    sendMsg.customMessage(
      "تم حذف كل شيء في الريديس بنجاح انتظر شي 3 دقائق حتى تعود الخدمات لشكلها الصحيح",
      sender_id,
      receiver_id
    );

    deleteAllKeys();
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
          receiver_id
        );
        //Store phase # 1 EX: (key, value) => ( whatsapp:+96563336437 , 1 )
        setUserVars(receiver_id, sender, "phase", "1");
        break;

      case "1":
        if (message === translation.Arabic) {
          setUserVars(receiver_id, sender, "language", "ar");
          const pickup_Policy = storObj.pickup_Policy;

          console.log("pickup_Policy-----------------", pickup_Policy);
          //  بنحكيله بدك نوصل لك لبيتك او بدك تيجي للمحل حسب اذا كان فيه باكاب او لا
          if (pickup_Policy) {
            sendMsg.pickupPhase(sender_id, receiver_id);
            setUserVars(receiver_id, sender, "phase", "1.1");
          } else {
            sendMsg.locationPhase(sender_id, receiver_id);
            setUserVars(receiver_id, sender, "phase", "2");
          }
        } else if (message === "English") {
          setUserVars(receiver_id, sender, "language", "en");
          const pickup_Policy = storObj.pickup_Policy;

          //  بنحكيله بدك نوصل لك لبيتك او بدك تيجي للمحل حسب اذا كان فيه باكاب او لا
          if (pickup_Policy) {
            sendMsg.pickupPhase(sender_id, receiver_id);
            setUserVars(receiver_id, sender, "phase", "1.1");
          } else {
            sendMsg.locationPhase(sender_id, receiver_id);
            setUserVars(receiver_id, sender, "phase", "2");
          }
        } else {
          //Send ERROR message : If the message sent is wrong
          sendMsg.errorMsg(sender_id, receiver_id);
        }
        break;

      case "1.1":
        if (message == translation.home_delivery) {
          sendMsg.locationPhase(sender_id, receiver_id);
          setUserVars(receiver_id, sender, "phase", "2");
          setUserVars(receiver_id, sender, "pickup_Policy", false);
        } else if (message == translation.Receipt_from_the_store) {
          setUserVars(receiver_id, sender, "pickup_Policy", true);

          //احضر الفروع كلها من الداتابيز
          const branchObj = JSON.parse(
            JSON.stringify(await storeController.getAllBranchs(receiver_id))
          );
          sendMsg.getAllBranchesPhase(
            sender_id,
            "" + (await branches(branchObj, receiver_id, sender)),
            receiver_id
          );
          setUserVars(receiver_id, sender, "phase", "3.1");
        } else {
          sendMsg.errorMsg(sender_id, receiver_id);
        }

        break;

      case "2":
        if (longitude == undefined || latitude == undefined) {
          sendMsg.errorMsg(sender_id, receiver_id);
        } else {
          console.log("sender:", sender);
          console.log("longitude: ", longitude);
          console.log("latitude: ", latitude);
          const location2 = `{"lat":${latitude},"lng":${longitude} }`;
          // store location in redis
          setUserVars(receiver_id, sender, "location", `${location2}`);

          const nearestBranch = await storeController.getNearestBranch(
            sender,
            receiver_id,
            latitude,
            longitude
          );

          cityName = await location.getCityName(latitude, longitude);
          const fees = await storeController.getFees(storObj.id, cityName);

          if (fees == -1) {
            // هذا يعني ان المدينة التي ارسلها اليوزر غير موجوده في قواعد البيانات لدينا
            setUserVars(receiver_id, sender, "phase", "2");
            sendMsg.customMessage(translation.out_cover_error_msg, sender_id);
            sendMsg.locationPhase(sender_id, receiver_id);
          } else {
            let branch = JSON.parse(
              await getUserVars(receiver_id, sender, "branch")
            );
            cart = cartController.newCart(
              sender,
              branch.id,
              latitude,
              longitude,
              storObj.tax,
              fees,
              receiver_id
            );
            if (!nearestBranch) {
              setUserVars(receiver_id, sender, "phase", "2");
              sendMsg.customMessage(
                translation.out_cover_error_msg,
                sender_id,
                receiver_id
              );
              sendMsg.locationPhase(sender_id, receiver_id);
            } else {
              sendMsg.nearestLocation(
                sender_id,
                nearestBranch,
                storObj,
                receiver_id
              );
              setUserVars(receiver_id, sender, "phase", "3");
            }
          }
        }
        break;

      case "2.1":
        let branch2_1 = JSON.parse(
          await getUserVars(receiver_id, sender, "branch")
        );
        if (longitude == undefined || latitude == undefined) {
          sendMsg.errorMsg(sender_id, receiver_id);
        } else {
          cityName = await location.getCityName(latitude, longitude);
          const fees = await storeController.getFees(branch2_1.id, cityName);

          if (fees == -1) {
            // هذا يعني ان المدينة التي ارسلها اليوزر غير موجوده في قواعد البيانات لدينا
            setUserVars(receiver_id, sender, "phase", "2");
            sendMsg.customMessage(
              translation.out_cover_error_msg,
              sender_id,
              receiver_id
            );
            sendMsg.locationPhase(sender_id, receiver_id);
          } else {
            cart = cartController.newCart(
              sender,
              branch2_1.id,
              latitude,
              longitude,
              storObj.tax,
              fees,
              receiver_id
            );
            setUserVars(receiver_id, sender, "phase", "3");
            sendMsg.nearestLocation(
              sender_id,
              selectedBranch,
              storObj,
              receiver_id
            );
          }
        }
        break;

      /* Phase 3:
        ستم تخيير اليوزر بين احد ثلاثة خيارات وهم : بدء الطلب او بدء الحجز او اختيار فرع اخر
        تظهر ازرار بدءالطلب او الحجز او كلاهما حسب سياسة المتجر في الحجز والطلب
        */
      case "3":
        const location3 = JSON.parse(
          await getUserVars(receiver_id, sender, "location")
        );
        let branch3 = JSON.parse(
          await getUserVars(receiver_id, sender, "branch")
        );

        const cityName3 = await location.getCityName(
          location3.lat,
          location3.lng
        );
        const fees3 = await storeController.getFees(branch3.id, cityName3);

        if (message == translation.Start_ordering) {
          const categoryObj = JSON.parse(
            JSON.stringify(
              await getCategories(receiver_id, sender, storObj.id, 1)
            )
          );
          setUserVars(receiver_id, sender, "isorder", true);

          cart = cartController.newCart(
            sender,
            branch3.id,
            location3.lat,
            location3.lng,
            storObj.tax,
            fees3,
            receiver_id
          );
          console.log("************** Cart  Order *************", cart);

          setUserVars(receiver_id, sender, "phase", "4");
          sendMsg.categoryPhase(
            sender_id,
            "" + (await categories(categoryObj, receiver_id, sender)),
            receiver_id
          );
        } else if (message === translation.Choose_another_branch) {
          delUserVars(receiver_id, sender, "branch"); // احذف الفرع الموجود
          delUserVars(receiver_id, sender, "cart"); // احذف السله الموجود

          //احضر الفروع كلها من الداتابيز
          const branchObj = JSON.parse(
            JSON.stringify(await storeController.getAllBranchs(receiver_id))
          );
          // ارسل رسالة تحتوي جميع الفروع الموجوده مع المتجر الرئيسي واعرضها لليوزر
          sendMsg.getAllBranchesPhase(
            sender_id,
            "" + (await branches(branchObj, receiver_id, sender)),
            receiver_id
          );
          // اذهب للمرحلة رقم 3.1
          setUserVars(receiver_id, sender, "phase", "3.1");
        } else if (message == translation.Start_Booking) {
          const categoryObj = JSON.parse(
            JSON.stringify(
              await getCategories(receiver_id, sender, storObj.id, 0)
            )
          );
          //خزن ان اليوزر اختار الحجز وليس الطلب
          setUserVars(receiver_id, sender, "isorder", false);
          //

          cart = cartController.newCart(
            sender,
            branch3.id,
            location3.lat,
            location3.lng,
            storObj.tax,
            fees3,
            receiver_id
          );
          console.log("************** Cart reserevation *************", cart);
          setUserVars(receiver_id, sender, "phase", "4");
          sendMsg.categoryPhase(
            sender_id,
            "" + (await categories(categoryObj, receiver_id, sender)),
            receiver_id
          );
        } else {
          // error message
          sendMsg.errorMsg(sender_id, receiver_id);
        }
        break;

      case "3.1":
        // اذا ادخل المستخدم شيء غير الارقام ارسل رسالة خطأ
        if (isNaN(message) == true) {
          sendMsg.errorMsg(sender_id, receiver_id);
          return;
        }
        let indexBranches = message - 1;
        let branchesObj = JSON.parse(
          await getUserVars(receiver_id, sender, "allbranches")
        );
        let selectedBranch = branchesObj[indexBranches];

        if (message > branchesObj.length || message <= 0) {
          // send error msg
          sendMsg.errorMsg(sender_id);
        } else {
          sendMsg.nearestLocation(
            sender_id,
            selectedBranch,
            storObj,
            receiver_id
          );

          //تخزين الفرع المختار مكان المتجر
          setUserVars(
            receiver_id,
            sender,
            "branch",
            JSON.stringify(selectedBranch)
          );

          const fees = 0; // ستكون خدمة الباكاب وبالتالي لا يودجد توصيل
          const pickup_Policy = await getUserVars(receiver_id, sender, "pickup_Policy");
          let lat, lng;
          let branch3_1 = JSON.parse(
            await getUserVars(receiver_id, sender, "branch")
          );

          if (pickup_Policy === true) {
            //  ااذ يريد خدمة الباكاب فاجعل العنوان الجغرافي هو نفسه عنوان المتجر
            lat = branch3_1.lat;
            lng = branch3_1.lng;
          } else {
            const location3_1 = JSON.parse(
              await getUserVars(receiver_id, sender, "location")
            );
            lat = location3_1.lat;
            lng = branch3_1.lng;
          }
          const location3_1 = `{"lat":${lat},"lng":${lng} }`;
          // store location in redis
          setUserVars(receiver_id, sender, "location", `${location3_1}`);

          console.log(" -----selectedBranch-------------- ", branch3_1);
          // املأ االسلة بالمعلومات الاساسية
          cart = cartController.newCart(
            sender,
            selectedBranch.id,
            lat,
            lng,
            storObj.tax,
            fees,
            receiver_id
          );

          setUserVars(receiver_id, sender, "phase", "3");
        }
        break;

      case "4": //عرض التصنيفات الفرعية
        if (isNaN(message) == true) {
          sendMsg.errorMsg(sender_id, receiver_id);
          return;
        }
        let indexCategory = message - 1;
        let categoryObj = JSON.parse(
          await getUserVars(receiver_id, sender, "cats")
        );
        let category = categoryObj[indexCategory];
        let length = categoryObj.length;

        if (message > length || message <= 0) {
          // send error msg
          sendMsg.errorMsg(sender_id, receiver_id);
        } else {
          let subCategoriesCount = category.subCategories.length;

          if (subCategoriesCount > 0) {
            setUserVars(receiver_id, sender, "phase", "5");
            sendMsg.subCategoryPhase(
              sender_id,
              await subCategoriess(category.subCategories, receiver_id, sender),
              receiver_id
            );
            setUserVars(
              receiver_id,
              sender,
              "subcategories",
              JSON.stringify(category.subCategories)
            );
          } else {
            setUserVars(receiver_id, sender, "phase", "6"); // اختيار المنتجات
            const productsObj = await getProducts(
              receiver_id,
              sender,
              category.id
            );
            sendMsg.productPhase(
              sender_id,
              await products(productsObj, receiver_id, sender),
              receiver_id
            );
          }
        }
        break;

      case "5": // التصنيفات الفرعية
        let subCategories = JSON.parse(
          await getUserVars(receiver_id, sender, "subcategories")
        );
        let categoryObj5 = JSON.parse(
          await getUserVars(receiver_id, sender, "cats")
        );
        let length5 = subCategories.length;

        if (isNaN(message) == true) {
          sendMsg.errorMsg(sender_id, receiver_id);
        }
        if (message == "00") {
          delUserVars(receiver_id, sender, "subcategories");
          setUserVars(receiver_id, sender, "phase", "4");
          sendMsg.categoryPhase(
            sender_id,
            "" + (await categories(categoryObj5, receiver_id, sender)),
            receiver_id
          );
        } else if (message > length5 || message <= 0) {
          // send error msg
          sendMsg.errorMsg(sender_id, receiver_id);
        } else {
          let categoryIndex = message - 1;
          let category = subCategories[categoryIndex];
          setUserVars(receiver_id, sender, "phase", "6"); // اختيار المنتجات
          const productsObj = await getProducts(
            receiver_id,
            sender,
            category.id
          );
          sendMsg.productPhase(
            sender_id,
            await products(productsObj, receiver_id, sender),
            receiver_id
          );
        }
        break;

      case "6": //  المنتجات
        if (isNaN(message) === true) {
          // send error msg
          sendMsg.errorMsg(sender_id, receiver_id);
          return;
        }
        let productObj = JSON.parse(
          await getUserVars(receiver_id, sender, "products")
        );
        console.log("productObj: ", productObj);
        if (productObj === {}) {
          sendMsg.customMessage(
            translation.no_data_msg,
            sender_id,
            receiver_id
          );
          setUserVars(receiver_id, sender, "phase", "1");
        }

        let length2 = productObj.length;
        let categoryObj2 = JSON.parse(
          await getUserVars(receiver_id, sender, "cats")
        );

        if (message == "00") {
          delUserVars(receiver_id, sender, "products");
          delUserVars(receiver_id, sender, "subcategories");
          setUserVars(receiver_id, sender, "phase", "4");
          sendMsg.categoryPhase(
            sender_id,
            "" + (await categories(categoryObj2, receiver_id, sender)),
            receiver_id
          );
        } else if (message <= 0 || message > length2) {
          // send error msg
          sendMsg.errorMsg(sender_id, receiver_id);
        } else {
          let branch = JSON.parse(
            await getUserVars(receiver_id, sender, "branch")
          );
          let productObj6 = JSON.parse(
            await getUserVars(receiver_id, sender, "products")
          );
          setUserVars(receiver_id, sender, "phase", "7"); // اختيار المنتجات
          let productIndex6 = message - 1;
          let product6 = productObj6[productIndex6];

          product6.qty = await getQuantity(branch.id, product6.id);
          sendMsg.showProduct(sender_id, product6, receiver_id);
          setUserVars(
            receiver_id,
            sender,
            "productDetails",
            JSON.stringify(product6)
          );
        }
        break;

      case "7": // عرض الخدمة الواحدة او المنتج
        let productObj7 = JSON.parse(
          await getUserVars(receiver_id, sender, "products")
        );
        if (message === "00") {
          setUserVars(receiver_id, sender, "phase", "6");
          sendMsg.productPhase(
            sender_id,
            await products(productObj7, receiver_id, sender),
            receiver_id
          );
        }
        //لا تتم الاضافة للسلة بعد , يجب تحديد الكمية وبعدها يضيف للسلة
        // ااذا كانت السياسه حجز فسيضيف للسله عادي
        else if (message == translation.add_to_cart) {
          const isorder7 = JSON.parse(
            await getUserVars(receiver_id, sender, "isorder")
          );
          if (isorder7 === true) {
            setUserVars(receiver_id, sender, "phase", "8");
            await sendMsg.quantityProductPhase(sender_id, receiver_id);
          } else if (isorder7 === false) {
            setUserVars(receiver_id, sender, "quantity", "1");
            let productDetails_7 = JSON.parse(
              await getUserVars(receiver_id, sender, "productDetails")
            );

            await cartController.addToCart(
              receiver_id,
              sender,
              productDetails_7
            );
            let newCart7 = JSON.parse(
              await getUserVars(receiver_id, sender, "cart")
            );
            const purchases7 = (await showPurchases(receiver_id, sender)) + "";

            setUserVars(receiver_id, sender, "phase", "9");
            sendMsg.showCart(
              sender_id,
              purchases7,
              newCart7.price,
              newCart7.tax,
              newCart7.total,
              newCart7.fees, // رسوم التوصيل
              receiver_id
            );
          }
        } else {
          sendMsg.errorMsg(sender_id, receiver_id);
        }
        break;

      case "7.1": //اختيار المميزات / الخدمات الاضافيه
        let productDetails_7_1 = JSON.parse(
          await getUserVars(receiver_id, sender, "productDetails")
        );
        const featuresCount = productDetails_7_1.features.length;

        const newCart7_1 = JSON.parse(
          await getUserVars(receiver_id, sender, "cart")
        );

        if (isNaN(message) === true) {
          sendMsg.errorMsg(sender_id, receiver_id);
          return;
        } else if (message === "00") {
          sendMsg.showProduct(sender_id, productDetails_7_1, receiver_id);
          setUserVars(receiver_id, sender, "phase", "7");
        } else if (message < 0 || message > featuresCount) {
          sendMsg.errorMsg(sender_id, receiver_id);
        }
        // add selected feature to the cart list
        else {
          let features = JSON.parse(
            await getUserVars(receiver_id, sender, "features")
          );
          const featureIndex = message - 1;
          const selectedFeature = features[featureIndex];
          // add selected feature to the cart list
          await cartController.addFeatureToCart(
            receiver_id,
            sender,
            productDetails_7_1,
            selectedFeature
          );

          const newCart7_1 = await JSON.parse(
            await getUserVars(receiver_id, sender, "cart")
          );

          //عرض السلة بعد اضافة الخدمات الاضافية
          const purchases7_1 = await showPurchases(receiver_id, sender);

          sendMsg.showCart(
            sender_id,
            purchases7_1,
            newCart7_1.price,
            newCart7_1.tax,
            newCart7_1.total,
            newCart7_1.fees, // رسوم التوصيل
            receiver_id
          );
          setUserVars(receiver_id, sender, "phase", "9");
        }
        break;

      case "8":
        if (isNaN(message) === true) {
          // send error msg
          sendMsg.errorMsg(sender_id, receiver_id);
          return;
        }

        // Check the maximum quantity of this product
        let productDetails = JSON.parse(
          await getUserVars(receiver_id, sender, "productDetails")
        );
        const quantity = productDetails.qty;
        if (parseInt(message) > parseInt(quantity) || parseInt(message) <= 0) {
          sendMsg.customMessage(
            `${translation.error_qty_msg} ${quantity}`,
            sender_id,
            receiver_id
          );
        } else {
          if (productDetails.features.length > 0) {
            // اضافة الكمية التي اختارها المستخدم لمعلومات المنتج
            productDetails.qty = parseInt(message);
            // productDetails.features = [];
            setUserVars(
              receiver_id,
              sender,
              "quantity",
              JSON.stringify(parseInt(message))
            );
            // await cartController.addToCart(sender, productDetails);

            sendMsg.addedDetails(sender_id, receiver_id);
            setUserVars(receiver_id, sender, "phase", "8.1");
          } else {
            productDetails.qty = parseInt(message);
            await cartController.addToCart(receiver_id, sender, productDetails);

            let newCart8 = JSON.parse(
              await getUserVars(receiver_id, sender, "cart")
            );
            const purchases8 = (await showPurchases(receiver_id, sender)) + "";

            setUserVars(receiver_id, sender, "phase", "9");
            sendMsg.showCart(
              sender_id,
              purchases8,
              newCart8.price,
              newCart8.tax,
              newCart8.total,
              newCart8.fees, // رسوم التوصيل
              receiver_id
            );
          }
        }
        break;
      //TODO: اضافة مرحلة لاضافة المزيد من الخدمات الاضافيه

      case "8.1":
        if (message === translation.yes) {
          // show features

          let productDetails = JSON.parse(
            await getUserVars(receiver_id, sender, "productDetails")
          );
          const features = showFeatures(productDetails.features);
          const featuresCount7 = productDetails.features.length;

          if (featuresCount7 > 0) {
            sendMsg.featuresPhase(sender_id, features, receiver_id);
            setUserVars(receiver_id, sender, "phase", "7.1");
            setUserVars(
              receiver_id,
              sender,
              "features",
              JSON.stringify(productDetails.features)
            );
          } else {
            await sendMsg.customMessage(
              translation.no_features_found,
              sender_id,
              receiver_id
            );
            sendMsg.showProduct(sender_id, productDetails, receiver_id);

            setUserVars(receiver_id, sender, "phase", "7");
          }
        } else if (message === translation.no) {
          // show cart details
          let productDetails8_1 = JSON.parse(
            await getUserVars(receiver_id, sender, "productDetails")
          );
          const quantity8_1 = parseInt(
            await getUserVars(receiver_id, sender, "quantity")
          );

          productDetails8_1.features = [];
          productDetails8_1.qty = quantity8_1;

          await cartController.addToCart(
            receiver_id,
            sender,
            productDetails8_1
          );

          let newCart8_1 = JSON.parse(
            await getUserVars(receiver_id, sender, "cart")
          );

          const purchases8_1 = (await showPurchases(receiver_id, sender)) + "";

          setUserVars(receiver_id, sender, "phase", "9");
          sendMsg.showCart(
            sender_id,
            purchases8_1,
            newCart8_1.price,
            newCart8_1.tax,
            newCart8_1.total,
            newCart8_1.fees, // رسوم التوصيل
            receiver_id
          );
        } else {
          sendMsg.errorMsg(sender_id, receiver_id);
        }
        break;
      case "9": // cart
        const purchases9 = await showPurchases(receiver_id, sender);

        if (message === translation.payment) {
          // عرض السلة كاملة مع رابط للدفع
        } else if (message === translation.select_to_delete) {
          sendMsg.customMessage(
            `${translation.select_number_product_to_delete} 
${purchases9} `,
            sender_id,
            receiver_id
          );
          setUserVars(receiver_id, sender, "phase", "9.1");
        } else if (message === translation.add_products) {
          setUserVars(receiver_id, sender, "phase", "6");
          let productObj7 = JSON.parse(
            await getUserVars(receiver_id, sender, "products")
          );
          sendMsg.productPhase(
            sender_id,
            await products(productObj7, receiver_id, sender),
            receiver_id
          );
        } else {
          sendMsg.errorMsg(sender_id, receiver_id);
        }

        break;

      case "9.1":
        let productCart = JSON.parse(
          await getUserVars(receiver_id, sender, "cart")
        );
        productCart = productCart.items;
        const length9_1 = productCart.length;

        if (isNaN(message) === true || message > length9_1 || message <= 0) {
          // send error msg
          sendMsg.errorMsg(sender_id, receiver_id);
        } else {
          // Delete product from cart

          let productCartIndex = message - 1; // index of product in cart
          const deletedItem = productCart[productCartIndex];

          const result = await cartController.removeFromCart(
            receiver_id,
            sender,
            deletedItem,
            productCartIndex
          );

          if (result) {
            await sendMsg.customMessage(
              translation.delete_success,
              sender_id,
              receiver_id
            );

            let newCart9_1 = JSON.parse(
              await getUserVars(receiver_id, sender, "cart")
            );
            const purchases9_1 = await showPurchases(receiver_id, sender);

            sendMsg.showCart(
              sender_id,
              purchases9_1,
              newCart9_1.price,
              newCart9_1.tax,
              newCart9_1.total,
              newCart9_1.fees, // رسوم التوصيل
              receiver_id
            );
            setUserVars(receiver_id, sender, "phase", "9");
          } else {
            sendMsg.customMessage(
              translation.error_delete_from_cart,
              sender_id,
              receiver_id
            );
            setUserVars(receiver_id, sender, "phase", "9");
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
