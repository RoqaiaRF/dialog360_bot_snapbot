const {
  setUserVars,
  getUserVars,
  delUserVars,
  deleteAllKeys,
  delAllUserVars,
  appendToArray,
  getAllListElements,
} = require("../../../database/redis");
const sendMsg = require("../../phases");
const getCategories = require("../../../app/controllers/categoryController");
const storeController = require("../../../app/controllers/storeController");
const cartController = require("../../../app/controllers/cartController");
const location = require("../../../app/helpers/location");
const {
  getProducts,
  getQuantity,
} = require("../../../app/controllers/productController");
const template = require("../../../locales/templates");

const { StoreService } = require("../StoreService/StoreService");
const { ModeEnum } = require("../../ENUMS/EMode");
const { HelpPhasesEnum } = require("../../ENUMS/EHelpPhase");
const { HelpModeService, attributes } = require("./HelpMode");

const {
  showFeatures,
  showPurchases,
  branches,
  products,
  subCategoriess,
  categories,
} = StoreService;
const setLanguage = (language,translation)=>{
  attributes.language = language
  attributes.translation = translation
}
const processMessage = async ({
  receiver_id,
  sender,
  sender_id,
  message,
  phase,
  args,
}) => {
  console.log('message is being processed')
  setLanguage(args.language, args.translation)
  /* const mode = await getUserVars(receiver_id, sender, "mode");
  mode ? processHelpMode() : processBotMode(); */
  let mode = await getUserVars(receiver_id, sender, "mode");
  mode = mode ? mode : ModeEnum.bot;
  mode == ModeEnum.bot
    ? processBotMode({
        receiver_id,
        sender,
        sender_id,
        message,
        phase,
        args,
      })
    : processHelpMode({
        receiver_id,
        sender,
        sender_id,
        message,
        phase,
        args,
      });
};

const processHelpMode = async ({
  receiver_id,
  sender,
  sender_id,
  message,
  phase,
  args,
}) => {
  console.log("user has sent to help system");
  console.log(message);
  const isMessagePhaseChange = await handleHelpPhaseChange({
    sender,
    sender_id,
    receiver_id,
    message,
    args
  });
  if (isMessagePhaseChange) return;
  if (phase == HelpPhasesEnum.APPENDING)
    HelpModeService.appendMessage({ receiver_id, sender, sender_id, message });
  else if (phase == HelpPhasesEnum.OVER_WRITE) {
    HelpModeService.overWriteMessage({
      receiver_id,
      sender_id,
      sender,
      message,
    });
  }
};

const handleHelpPhaseChange = async ({
  sender,
  sender_id,
  receiver_id,
  message,
  args,
}) => {
  const { storeAR_Name, storeEN_Name, username, storObj, translation } = args;
  console.log("handle help phase");
  console.log("message is" + message);
  switch (message) {
    case "0":
      console.log("case 0");
      await setUserVars(receiver_id, sender, "mode", ModeEnum.bot);
      sendMsg.customMessage(
        translation.help_logout,
        sender_id,
        receiver_id
      );
      resetSession({
        sender,
        sender_id,
        receiver_id,
        storeAR_Name,
        storeEN_Name,
        username,
        storObj,
      });
      return true;
    case translation.send:
      HelpModeService.sendMessage({ receiver_id, sender, sender_id });
      resetSession({
        sender,
        sender_id,
        receiver_id,
        storeAR_Name,
        storeEN_Name,
        username,
        storObj,
      });
      return true;
    case translation['delete message']:
      await HelpModeService.changeToOverWritePhase({
        receiver_id,
        sender,
        sender_id,
      });
      return true;
    case translation['review message']:
      HelpModeService.displayUserMessage({
        receiver_id,
        sender,
        message,
        sender_id,
      });
      return true;
    default:
      console.log("default case");
      return false;
  }
};

const changeBotMode = (receiver_id, sender_id, mode) => {
  setUserVars(sender_id, receiver_id, "mode", mode);
  setUserVars();
};

const resetSession =async ({
  sender_id,
  storeEN_Name,
  storeAR_Name,
  username,
  storObj,
  receiver_id,
  sender,
}) => {
   delAllUserVars(receiver_id, sender);
   setUserVars(receiver_id, sender, "phase", "1");

  console.log('resetting ')
  sendMsg.welcomeLangPhase(
    sender_id,
    storeEN_Name,
    storeAR_Name,
    username,
    storObj,
    receiver_id
  );
};

const processBotMode = async ({
  receiver_id,
  sender,
  sender_id,
  message,
  phase,
  args,
}) => {
  const { translation, language, storObj, longitude, latitude, username } =
    args;
  const storeEN_Name = storObj.name_en; // اسم المتجر بالانجليزي
  const storeAR_Name = storObj.name_ar; // اسم المتجر في العربي
  let cityName, cart;

  if (message == "0" || message == translation.cancel) {

    //احذف هذه الاشياء من الريديس
     resetSession({
      sender,
      sender_id,
      receiver_id,
      storeAR_Name,
      storeEN_Name,
      username,
      storObj,
    });
    /*  */
  } else if (message == "JGHFds547fdglkj78") {
    //حذف كل شيء بالريديس
    sendMsg.customMessage(
      "تم حذف كل شيء في الريديس بنجاح انتظر شي 3 دقائق حتى تعود الخدمات لشكلها الصحيح",
      sender_id,
      receiver_id
    );

    deleteAllKeys();
  } else if (message == "*") {
    sendMsg.customMessage(
      translation.welcome_help_mode,
      sender_id,
      receiver_id
    );
    setUserVars(receiver_id, sender, "mode", ModeEnum.help);
    setUserVars(receiver_id, sender, "phase", HelpPhasesEnum.APPENDING);
  } else {
    switch (phase) {
      case "0":
      case null:
      case undefined:
        // رسالة الترحيب تحتوي على اسم المتجر بالعربي والانجليزي واختيار اللغة
        console.log('phase 0 or null or undefineed')
        await setUserVars(receiver_id, sender, "phase", "1");
        sendMsg.welcomeLangPhase(
          sender_id,
          storeEN_Name,
          storeAR_Name,
          username,
          storObj,
          receiver_id
        );
        //Store phase # 1 EX: (key, value) => ( whatsapp:+96563336437 , 1 )
        break;

      case "1":
        if (message === translation.Arabic) {
          console.log('case 1')
          setUserVars(receiver_id, sender, "language", "ar");
          const pickup_Policy = storObj.pickup_Policy;

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
        console.log('message1.1')
        if (message == translation.home_delivery) {
          sendMsg.locationPhase(sender_id, receiver_id);
          setUserVars(receiver_id, sender, "phase", "2");
          setUserVars(receiver_id, sender, "pickup_Policy", false);
        } else if (message == translation.Receipt_from_the_store) {
          setUserVars(receiver_id, sender, "pickup_Policy", true);

          //احضر الفروع كلها من الداتابيز
          const branchObj = JSON.parse(
            JSON.stringify(
              await storeController.getAllBranchs(receiver_id, sender)
            )
          );

          //------ عمل شرط  اذا لم يكن هناك فروع غير المتجر الرئيسي فخذه الى مرحلة -----

          if (branchObj.length <= 1) {
            // ارسال رسالة اهلا بك في متجر .. وابدأ الطلب
            sendMsg.nearestLocation(
              sender_id,
              branchObj[0],
              branchObj[0],
              receiver_id
            );
            setUserVars(receiver_id, sender, "phase", "3");
            setUserVars(
              receiver_id,
              sender,
              "branch",
              JSON.stringify(branchObj[0])
            );
          } else {
            sendMsg.getAllBranchesPhase(
              sender_id,
              "" + (await branches(branchObj, language)),
              receiver_id
            );

            setUserVars(receiver_id, sender, "phase", "3.1");
          }
        } else {
          sendMsg.errorMsg(sender_id, receiver_id);
        }

        break;

      case "2":
        console.log('phase2')
        if (longitude == undefined || latitude == undefined) {
          sendMsg.errorMsg(sender_id, receiver_id);
        } else {
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
            sendMsg.customMessage(
              translation.out_cover_error_msg,
              sender_id,
              receiver_id
            );
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
        let location3 = await getUserVars(receiver_id, sender, "location");

        if (location3 === undefined) {
          location3 = { lat: storObj.lat, lng: storObj.lng };
        } else {
          location3 = JSON.parse(location3);
        }

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

          setUserVars(receiver_id, sender, "phase", "4");
          sendMsg.categoryPhase(
            sender_id,
            "" + (await categories(categoryObj, language)),
            receiver_id
          );
        } else if (message === translation.Choose_another_branch) {
          delUserVars(receiver_id, sender, "branch"); // احذف الفرع الموجود
          delUserVars(receiver_id, sender, "cart"); // احذف السله الموجود

          //احضر الفروع كلها من الداتابيز
          const branchObj = JSON.parse(
            JSON.stringify(
              await storeController.getAllBranchs(receiver_id, sender)
            )
          );
          // ارسل رسالة تحتوي جميع الفروع الموجوده مع المتجر الرئيسي واعرضها لليوزر
          sendMsg.getAllBranchesPhase(
            sender_id,
            "" + (await branches(branchObj, language)),
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

          setUserVars(receiver_id, sender, "phase", "4");
          sendMsg.categoryPhase(
            sender_id,
            "" + (await categories(categoryObj, language)),
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

          let pickup_Policy = await getUserVars(
            receiver_id,
            sender,
            "pickup_Policy"
          );
          if (pickup_Policy == undefined) {
            pickup_Policy = false;
          } else {
            pickup_Policy = JSON.parse(pickup_Policy);
          }
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
          // اذا كان هناك منتجات فرعيه
          if (subCategoriesCount > 0) {
            setUserVars(receiver_id, sender, "phase", "5");
            sendMsg.subCategoryPhase(
              sender_id,
              await subCategoriess(category.subCategories, language),
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
              await products(productsObj, language),
              receiver_id
            );
          }
        }
        break;

      case "5": // التصنيفات الفرعية
        let subCategories = JSON.parse(
          await getUserVars(receiver_id, sender, "subcategories")
        );
        // احضر التصنيفات الرئيسية
        let categoryObj5 = JSON.parse(
          await getUserVars(receiver_id, sender, "cats")
        );

        let length5 = subCategories.length;

        if (isNaN(message) == true) {
          sendMsg.errorMsg(sender_id, receiver_id);
        }
        if (message == "00" || message == translation.go_home) {
          delUserVars(receiver_id, sender, "subcategories");
          setUserVars(receiver_id, sender, "phase", "4");
          sendMsg.categoryPhase(
            sender_id,
            "" + (await categories(categoryObj5, language)),
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
            await products(productsObj, language),
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

        if (message == "00" || message == translation.go_home) {
          delUserVars(receiver_id, sender, "products");
          delUserVars(receiver_id, sender, "subcategories");
          setUserVars(receiver_id, sender, "phase", "4");
          sendMsg.categoryPhase(
            sender_id,
            "" + (await categories(categoryObj2, language)),
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
        let categoryObj7 = JSON.parse(
          await getUserVars(receiver_id, sender, "cats")
        );
        if (message === "00") {
          setUserVars(receiver_id, sender, "phase", "6");
          sendMsg.productPhase(
            sender_id,
            await products(productObj7, language),
            receiver_id
          );
        } else if (message == translation.go_home) {
          delUserVars(receiver_id, sender, "products");
          delUserVars(receiver_id, sender, "subcategories");
          setUserVars(receiver_id, sender, "phase", "4");
          sendMsg.categoryPhase(
            sender_id,
            "" + (await categories(categoryObj7, language)),
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
            const purchases7 =
              (await showPurchases(
                receiver_id,
                sender,
                translation,
                language
              )) + "";

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
          const purchases7_1 = await showPurchases(
            receiver_id,
            sender,
            translation,
            language
          );

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
            const purchases8 =
              (await showPurchases(
                receiver_id,
                sender,
                translation,
                language
              )) + "";

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
        if (message == translation.yes) {
          // show features

          let language = await getUserVars(receiver_id, sender, "language");
          if (language == undefined) language = "ar";

          let productDetails = JSON.parse(
            await getUserVars(receiver_id, sender, "productDetails")
          );
          const features =  showFeatures(
            productDetails.features,
            translation,
            language
          );
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
        } else if (message == translation.no) {
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

          const purchases8_1 =
            (await showPurchases(receiver_id, sender, translation, language)) +
            "";

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
        const purchases9 = await showPurchases(
          receiver_id,
          sender,
          translation,
          language
        );
        let categoryObj9 = JSON.parse(
          await getUserVars(receiver_id, sender, "cats")
        );

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
            await products(productObj7, language),
            receiver_id
          );
        }

        // اذا ضغط عودة للرئيسية سيعود للتصنيفات الرئيسية
        else if (message == translation.go_home) {
          delUserVars(receiver_id, sender, "products");
          delUserVars(receiver_id, sender, "subcategories");
          setUserVars(receiver_id, sender, "phase", "4");
          sendMsg.categoryPhase(
            sender_id,
            "" + (await categories(categoryObj9, language)),
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
            const purchases9_1 = await showPurchases(
              receiver_id,
              sender,
              translation,
              language
            );

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

const switchToHelpMode = () => {};

const switchToBotMode = () => {};

const BotService = {
  processMessage,
};
module.exports = { BotService };
