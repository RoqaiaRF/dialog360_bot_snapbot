const { v4: uuidv4 } = require("uuid");
const {
  setUserVars,
  getUserVars,
  delUserVars,
  deleteAllKeys,
  delAllUserVars,
  appendToArray,
  getAllListElements,
  publishToChannel,
  client,
} = require("../../../database/redis");
const sendMsg = require("../../phases");
const getCategories = require("../../../app/controllers/categoryController");
const storeController = require("../../../app/controllers/storeController");
const cartController = require("../../../app/controllers/cartController");
const location = require("../../../app/helpers/location");
const {
  getProducts,
  getQuantity,
  getOrphanProducts,
} = require("../../../app/controllers/productController");

const { StoreService } = require("../StoreService/StoreService");
const { ModeEnum } = require("../../ENUMS/EMode");
const { HelpPhasesEnum } = require("../../ENUMS/EHelpPhase");
const { HelpModeService, attributes } = require("./HelpMode");
const template = require("../.././sendTemplate");
const sendTextMsg = require("../../sendMsgFunctions");
const getConversation = require("../../../app/controllers/helpSystem/getConversationsController");

const {
  showFeatures,
  showPurchases,
  branches,
  products,
  subCategoriess,
  categories,
} = StoreService;
const setLanguage = (language, translation) => {
  attributes.language = language;
  attributes.translation = translation;
};
const processMessage = async ({
  receiver_id,
  receiver,
  sender,
  sender_id,
  message,
  phase,
  args,
}) => {
  setLanguage(args.language, args.translation);

  let mode = await getUserVars(receiver, sender, "mode");
  mode = mode ? mode : ModeEnum.bot;
  mode == ModeEnum.bot
    ? processBotMode({
        receiver_id,
        receiver,
        sender,
        sender_id,
        message,
        phase,
        args,
      })
    : processHelpMode({
        receiver_id,
        receiver,
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
  receiver,
}) => {
  const { username, storObj } = args;
  const { id } = storObj;

  if (message == "0")
    return logoutHelpMode({ sender_id, receiver_id, sender, receiver, args });

  HelpModeService.sendOneMessage({
    receiver_id,
    sender,
    username,
    contentMessage: message,
    store_id: id,
  });
  return;
};

const logoutHelpMode = async ({
  sender_id,
  receiver_id,
  receiver,
  sender,
  args,
}) => {
  const { storeAR_Name, storeEN_Name, username, storObj, translation } = args;
  const { id } = storObj;
  const conversation_id = await getConversation(receiver, sender);

  setUserVars(receiver, sender, "mode", ModeEnum.bot);
  sendMsg.customMessage(translation.help_logout, sender_id, receiver_id);
  resetSession({
    sender,
    sender_id,
    receiver_id,
    storeAR_Name,
    storeEN_Name,
    username,
    storObj,
  });

  client.publish(
    `stores`,
    JSON.stringify({
      data: {
        type: "online",
        sender_number: sender,
        userName: username,
        store_id: id,
        conversation_id,
        data: "offline",
      },
    }),
    (error, count) => {
      if (error) {
        throw new Error(error);
      }
    }
  );
};
const resetSession = async ({
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
  receiver,
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
  console.log("bot mode");
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
    // اذا كان هناك راسلة قديمة في الريديس احذفها حتى يرسل جديدة
    console.log("enter help system");
    delUserVars(receiver, sender, "msg");

    sendMsg.customMessage(
      translation.welcome_help_mode,
      sender_id,
      receiver_id
    );
    setUserVars(receiver, sender, "mode", ModeEnum.help);
    setUserVars(receiver, sender, "phase", HelpPhasesEnum.APPENDING);
  } else {
    switch (phase) {
      case "0":
      case null:
      case undefined:
        // رسالة الترحيب تحتوي على اسم المتجر بالعربي والانجليزي واختيار اللغة

        await setUserVars(receiver, sender, "phase", "1");
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
        switch (message) {
          case translation.Arabic:
            setUserVars(receiver, sender, "language", "ar");
            break;
          case "English":
            setUserVars(receiver, sender, "language", "en");
            break;
          default:
            sendMsg.errorMsg(sender_id, receiver_id);
            break;
        }
        const pickup_Policy = storObj.pickup_Policy;

        //  بنحكيله بدك نوصل لك لبيتك او بدك تيجي للمحل حسب اذا كان فيه باكاب او لا
        if (pickup_Policy) {
          console.log("pick up ");
          sendMsg.pickupPhase(sender_id, receiver_id);
          setUserVars(receiver, sender, "phase", "1.1");
        } else {
          console.log(receiver, "************");
          if (!storObj.policy_send_location) {
            console.log("incluudddeees");
            let fees = storObj.id == "26" ? 1 : 0;
            let { lat, lng } = storObj;

            const location2 = `{"lat":${lat},"lng":${lng} }`;
            // store location in redis
            setUserVars(receiver, sender, "location", `${location2}`);
            let [nearestBranch, cityName] = await Promise.all([
              storeController.getNearestBranch(sender, receiver, lat, lng),
              location.getCityName(lat, lng),
            ]);
            let branch = JSON.parse(
              await getUserVars(receiver, sender, "branch")
            );
            cart = cartController.newCart(
              sender,
              branch.id,
              lat,
              lng,
              storObj.tax,
              fees,
              receiver
            );
            if (!nearestBranch) {
              setUserVars(receiver, sender, "phase", "2");
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
            }
            break;
          }

          sendMsg.locationPhase(sender_id, receiver_id);
          setUserVars(receiver, sender, "phase", "2");
        }

        break;

      case "1.1":
        if (message == translation.home_delivery) {
          if (!storObj.policy_send_location) {
            console.log("incluudddeees");
            let fees = storObj.id == "26" ? 1 : 0;
            let { lat, lng } = storObj;

            const location2 = `{"lat":${lat},"lng":${lng} }`;
            // store location in redis
            setUserVars(receiver, sender, "location", `${location2}`);
            let [nearestBranch, cityName] = await Promise.all([
              storeController.getNearestBranch(sender, receiver, lat, lng),
              location.getCityName(lat, lng),
            ]);
            let branch = JSON.parse(
              await getUserVars(receiver, sender, "branch")
            );
            cart = cartController.newCart(
              sender,
              branch.id,
              lat,
              lng,
              storObj.tax,
              fees,
              receiver
            );
            if (!nearestBranch) {
              setUserVars(receiver, sender, "phase", "2");
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
            }
            break;
          } else {
            sendMsg.locationPhase(sender_id, receiver_id);
          }
          setUserVars(receiver, sender, "phase", "2");
          setUserVars(receiver, sender, "pickup_Policy", false);
        } else if (message == translation.Receipt_from_the_store) {
          setUserVars(receiver, sender, "pickup_Policy", true);

          //احضر الفروع كلها من الداتابيز
          const branchObj = JSON.parse(
            JSON.stringify(
              await storeController.getAllBranchs(receiver, sender)
            )
          );

          //------ عمل شرط  اذا لم يكن هناك فروع غير المتجر الرئيسي فخذه الى مرحلة -----

          if (branchObj.length <= 1) {
            // ارسال رسالة اهلا بك في متجر .. وابدأ الطلب
            sendMsg.nearestLocation(
              sender_id,
              branchObj[0],
              storObj,
              receiver_id
            );
            setUserVars(
              receiver,
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

            setUserVars(receiver, sender, "phase", "3.1");
          }
        } else {
          sendMsg.errorMsg(sender_id, receiver_id);
        }

        break;

      case "2":
        if (longitude == undefined || latitude == undefined) {
          sendMsg.errorMsg(sender_id, receiver_id);
        } else {
          const location2 = `{"lat":${latitude},"lng":${longitude} }`;
          // store location in redis
          setUserVars(receiver, sender, "location", `${location2}`);
          let [nearestBranch, cityName] = await Promise.all([
            storeController.getNearestBranch(
              sender,
              receiver,
              latitude,
              longitude
            ),
            location.getCityName(latitude, longitude),
          ]);
          const fees = await storeController.getFees(storObj.id, cityName);

          if (fees == -1) {
            // هذا يعني ان المدينة التي ارسلها اليوزر غير موجوده في قواعد البيانات لدينا
            setUserVars(receiver, sender, "phase", "2");
            sendMsg.customMessage(
              translation.out_cover_error_msg,
              sender_id,
              receiver_id
            );
            sendMsg.locationPhase(sender_id, receiver_id);
          } else {
            let branch = JSON.parse(
              await getUserVars(receiver, sender, "branch")
            );
            cart = cartController.newCart(
              sender,
              branch.id,
              latitude,
              longitude,
              storObj.tax,
              fees,
              receiver
            );
            if (!nearestBranch) {
              setUserVars(receiver, sender, "phase", "2");
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
              setUserVars(receiver, sender, "phase", "3");
            }
          }
        }
        break;

      case "2.1":
        if (longitude == undefined || latitude == undefined) {
          sendMsg.errorMsg(sender_id, receiver_id);
        } else {
          let [branch2_1Res, cityName] = await Promise.all([
            getUserVars(receiver, sender, "branch"),
            location.getCityName(latitude, longitude),
          ]);
          let branch2_1 = JSON.parse(branch2_1Res);
          const fees = await storeController.getFees(branch2_1.id, cityName);

          if (fees == -1) {
            // هذا يعني ان المدينة التي ارسلها اليوزر غير موجوده في قواعد البيانات لدينا
            setUserVars(receiver, sender, "phase", "2");
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
              receiver
            );
            setUserVars(receiver, sender, "phase", "3");
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

        const cityName3 = await location.getCityName(
          location3.lat,
          location3.lng
        );
        const fees3 = await storeController.getFees(branch3.id, cityName3);

        if (message == translation.Start_ordering) {
          const categoryObj = JSON.parse(
            JSON.stringify(await getCategories(receiver, sender, storObj.id, 1))
          );
          setUserVars(receiver, sender, "isorder", true);

          cart = cartController.newCart(
            sender,
            branch3.id,
            location3.lat,
            location3.lng,
            storObj.tax,
            fees3,
            receiver
          );

          setUserVars(receiver, sender, "phase", "4");
          sendMsg.categoryPhase(
            sender_id,
            "" + (await categories(categoryObj, language)),
            receiver_id
          );
        } else if (message === translation.Choose_another_branch) {
          delUserVars(receiver, sender, "branch"); // احذف الفرع الموجود
          delUserVars(receiver, sender, "cart"); // احذف السله الموجود

          //احضر الفروع كلها من الداتابيز
          const branchObj = JSON.parse(
            JSON.stringify(
              await storeController.getAllBranchs(receiver, sender)
            )
          );
          // ارسل رسالة تحتوي جميع الفروع الموجوده مع المتجر الرئيسي واعرضها لليوزر
          sendMsg.getAllBranchesPhase(
            sender_id,
            "" + (await branches(branchObj, language)),
            receiver_id
          );
          // اذهب للمرحلة رقم 3.1
          setUserVars(receiver, sender, "phase", "3.1");
        } else if (message == translation.Start_Booking) {
          const categoryObj = JSON.parse(
            JSON.stringify(await getCategories(receiver, sender, storObj.id, 0))
          );
          //خزن ان اليوزر اختار الحجز وليس الطلب
          setUserVars(receiver, sender, "isorder", false);
          //

          cart = cartController.newCart(
            sender,
            branch3.id,
            location3.lat,
            location3.lng,
            storObj.tax,
            fees3,
            receiver
          );

          setUserVars(receiver, sender, "phase", "4");
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
          await getUserVars(receiver, sender, "allbranches")
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
            receiver,
            sender,
            "branch",
            JSON.stringify(selectedBranch)
          );

          const fees = 0; // ستكون خدمة الباكاب وبالتالي لا يودجد توصيل

          let pickup_Policy = await getUserVars(
            receiver,
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
            await getUserVars(receiver, sender, "branch")
          );

          if (pickup_Policy === true) {
            //  ااذ يريد خدمة الباكاب فاجعل العنوان الجغرافي هو نفسه عنوان المتجر
            lat = branch3_1.lat;
            lng = branch3_1.lng;
          } else {
            const location3_1 = JSON.parse(
              await getUserVars(receiver, sender, "location")
            );
            lat = location3_1.lat;
            lng = branch3_1.lng;
          }
          const location3_1 = `{"lat":${lat},"lng":${lng} }`;
          // store location in redis
          setUserVars(receiver, sender, "location", `${location3_1}`);

          // املأ االسلة بالمعلومات الاساسية
          cart = cartController.newCart(
            sender,
            selectedBranch.id,
            lat,
            lng,
            storObj.tax,
            fees,
            receiver
          );
        }
        break;

      case "4": //عرض التصنيفات الفرعية
        if (isNaN(message) == true) {
          sendMsg.errorMsg(sender_id, receiver_id);
          return;
        }
        let indexCategory = message - 1;
        var categoryObj = JSON.parse(
          await getUserVars(receiver, sender, "cats")
        );
        var category = categoryObj[indexCategory];
        let length = categoryObj.length;

        if (message > length || message <= 0) {
          // send error msg
          sendMsg.errorMsg(sender_id, receiver_id);
        } else {
          let orphan_products = await getOrphanProducts({
            category_id: category.id,
            receiver_id,
            sender,
          });

          let subCategoriesCount = category.subCategories.length;
          // اذا كان هناك منتجات فرعيه
          if (subCategoriesCount > 0) {
            console.log("there is sub categories");
            setUserVars(receiver, sender, "phase", "5");
            sendMsg.subCategoryPhase(
              sender_id,
              await subCategoriess(
                category.subCategories.concat(orphan_products),
                language
              ),
              receiver_id
            );
            console.log("after message has been sent");
            setUserVars(
              receiver,
              sender,
              "subcategories",
              JSON.stringify(category.subCategories)
            );
          } else {
            console.log("there is no subcategories");
            setUserVars(receiver, sender, "phase", "6"); // اختيار المنتجات
            let productsObj = await getProducts(
              receiver_id,
              sender,
              category.id
            );

            console.log("*******************");
            console.log(productsObj);
            console.log("*******************");
            sendMsg.productPhase(
              sender_id,
              await products(productsObj, language),
              receiver_id
            );
          }
        }
        break;

      case "5": // التصنيفات الفرعية
        let [subCategoriesRes, categoryObj5Res, orphan_productsRes] =
          await Promise.all([
            getUserVars(receiver, sender, "subcategories"),
            getUserVars(receiver, sender, "cats"),
            getUserVars(receiver, sender, "orphan_products"),
          ]);
        if (!orphan_productsRes) orphan_productsRes = [];
        var orphan_productsRes5 = JSON.parse(orphan_productsRes);
        let subCategories = JSON.parse(subCategoriesRes);
        // احضر التصنيفات الرئيسية
        let categoryObj5 = JSON.parse(categoryObj5Res);

        let length5 = subCategories.length;

        if (isNaN(message) == true) {
          sendMsg.errorMsg(sender_id, receiver_id);
        }
        if (message == "00" || message == translation.go_home) {
          delUserVars(receiver, sender, "subcategories");
          setUserVars(receiver, sender, "phase", "4");
          sendMsg.categoryPhase(
            sender_id,
            "" + (await categories(categoryObj5, language)),
            receiver_id
          );
        } else if (message > length5 || message <= 0) {
          // send error msg
          if (message > orphan_productsRes.length)
            sendMsg.errorMsg(sender_id, receiver_id);
          else {
            let productIndex = message - 1;
            let product = orphan_productsRes5[productIndex - length5];
            let [branchRes] = await Promise.all([
              getUserVars(receiver, sender, "branch"),
            ]);
            let branch = JSON.parse(branchRes);

            setUserVars(receiver, sender, "phase", "7"); //

            product.qty = await getQuantity(branch.id, product.id);
            console.log(
              "orphan_productsRes ---------------------------------",
              orphan_productsRes
            );
            await setUserVars(
              receiver_id,
              sender,
              "products",
              orphan_productsRes
            );
            sendMsg.showProduct(sender_id, product, receiver_id);
            setUserVars(
              receiver,
              sender,
              "productDetails",
              JSON.stringify(product)
            );
          }
        } else {
          let categoryIndex = message - 1;
          let category = subCategories[categoryIndex];
          setUserVars(receiver, sender, "phase", "6"); // اختيار المنتجات
          const productsObj = await getProducts(receiver, sender, category.id);
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
        let [productObjRes, categoryObj2Res] = await Promise.all([
          getUserVars(receiver, sender, "products"),
          getUserVars(receiver, sender, "cats"),
        ]);
        let productObj = JSON.parse(productObjRes);
        let categoryObj2 = JSON.parse(categoryObj2Res);

        if (productObj === {}) {
          sendMsg.customMessage(
            translation.no_data_msg,
            sender_id,
            receiver_id
          );
          setUserVars(receiver, sender, "phase", "1");
        }

        let length2 = productObj.length;

        if (message == "00" || message == translation.go_home) {
          delUserVars(receiver, sender, "products");
          delUserVars(receiver, sender, "subcategories");
          setUserVars(receiver, sender, "phase", "4");
          sendMsg.categoryPhase(
            sender_id,
            "" + (await categories(categoryObj2, language)),
            receiver_id
          );
        } else if (message <= 0 || message > length2) {
          console.log("Error in message length 788");

          // send error msg
          sendMsg.errorMsg(sender_id, receiver_id);
        } else {
          let [branchRes, productObj6Res] = await Promise.all([
            getUserVars(receiver, sender, "branch"),
            getUserVars(receiver, sender, "products"),
          ]);
          let branch = JSON.parse(branchRes);
          let productObj6 = JSON.parse(productObj6Res); // اختيار المنتجات

          let productIndex6 = message - 1;
          let product6 = productObj6[productIndex6];

          /* product6.qty = await getQuantity(branch.id, product6.id); */
          product6.qty = product6.quantity;
          product6.uuid = await uuidv4();
          product6.allFeatures = product6.features;
          product6.features = [];
          if (product6.quantity < 1) {
            sendMsg.customMessage(
              `${translation.out_of_stock} `,
              sender_id,
              receiver_id
            );
            console.log(product6);
            const productsObj = await getProducts(
              receiver,
              sender,
              product6.category_id
            );
            sendMsg.productPhase(
              sender_id,
              await products(productsObj, language),
              receiver_id
            );
            return;
          }

          sendMsg.showProduct(sender_id, product6, receiver_id);
          setUserVars(
            receiver,
            sender,
            "productDetails",
            JSON.stringify(product6)
          );
          setUserVars(receiver, sender, "phase", "7");
        }
        break;

      case "7": // عرض الخدمة الواحدة او المنتج
        let [productObj7Res, categoryObj7Res] = await Promise.all([
          getUserVars(receiver, sender, "products"),
          getUserVars(receiver, sender, "cats"),
        ]);
        let productObj7 = JSON.parse(productObj7Res);
        let categoryObj7 = JSON.parse(categoryObj7Res);
        if (message === "00") {
          setUserVars(receiver, sender, "phase", "6");
          sendMsg.productPhase(
            sender_id,
            "" + (await products(productObj7, language)),
            receiver_id
          );
        } else if (message == translation.go_home) {
          delUserVars(receiver, sender, "products");
          delUserVars(receiver, sender, "subcategories");
          setUserVars(receiver, sender, "phase", "4");
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
            await getUserVars(receiver, sender, "isorder")
          );
          if (isorder7 === true) {
            setUserVars(receiver, sender, "phase", "8");
            await sendMsg.quantityProductPhase(sender_id, receiver_id);
          } else if (isorder7 === false) {
            setUserVars(receiver, sender, "quantity", "1");
            let productDetails_7 = JSON.parse(
              await getUserVars(receiver, sender, "productDetails")
            );
            let [newCart7Res, purchases7Res] = await Promise.all([
              getUserVars(receiver, sender, "cart"),
              showPurchases(receiver, sender, translation, language),
            ]);
            let newCart7 = JSON.parse(newCart7Res);
            const purchases7 = purchases7Res + "";
            if (productDetails_7?.allFeatures?.length > 0)
              sendProductFeatures({
                productDetails: productDetails_7,
                sender,
                sender_id,
                receiver,
                receiver_id,
                message: 1,
              });
            else {
              setUserVars(receiver, sender, "quantity", "1");
              let productDetails_7 = JSON.parse(
                await getUserVars(receiver, sender, "productDetails")
              );
              await cartController.addToCart(
                receiver,
                sender,
                productDetails_7
              );
              let [newCart7Res, purchases7Res] = await Promise.all([
                getUserVars(receiver, sender, "cart"),
                showPurchases(receiver, sender, translation, language),
              ]);
              let newCart7 = JSON.parse(newCart7Res);
              const purchases7 = purchases7Res + "";

              setUserVars(receiver, sender, "phase", "9");
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
          }
        } else {
          sendMsg.errorMsg(sender_id, receiver_id);
        }
        break;

      case "7.1": //اختيار المميزات / الخدمات الاضافيه
        const [productDetails_7_1Res, newCart7_1Res] = await Promise.all([
          getUserVars(receiver, sender, "productDetails"),
          getUserVars(receiver, sender, "cart"),
        ]);
        let productDetails_7_1 = JSON.parse(productDetails_7_1Res);
        const featuresCount = productDetails_7_1.allFeatures.length;

        if (isNaN(message) === true) {
          sendMsg.errorMsg(sender_id, receiver_id);
          return;
        } else if (message === "00") {
          sendMsg.showProduct(sender_id, productDetails_7_1, receiver_id);
          setUserVars(receiver, sender, "phase", "7");
        } else if (message < 0 || message > featuresCount) {
          sendMsg.errorMsg(sender_id, receiver_id);
        }
        // add selected feature to the cart list
        else {
          let features = JSON.parse(
            await getUserVars(receiver, sender, "features")
          );
          const featureIndex = message - 1;
          const selectedFeature = features[featureIndex];
          // add selected feature to the cart list
          let new_productDetails = await cartController.addFeatureToCart(
            receiver,
            sender,
            productDetails_7_1,
            selectedFeature
          );
          console.log(new_productDetails);
          setUserVars(
            receiver,
            sender,
            "productDetails",
             JSON.stringify(new_productDetails)
          );
          const [newCart7_1Res, purchases7_1] = await Promise.all([
            getUserVars(receiver, sender, "cart"),
            showPurchases(receiver, sender, translation, language),
          ]);
          const newCart7_1 = await JSON.parse(newCart7_1Res);

          //عرض السلة بعد اضافة الخدمات الاضافية
          sendProductFeatures({
            productDetails: productDetails_7_1,
            sender,
            sender_id,
            receiver,
            receiver_id,
            message: productDetails_7_1.qty,
          });
          setUserVars(receiver, sender, "phase", "8.1");
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
          await getUserVars(receiver, sender, "productDetails")
        );
        const quantity = productDetails.qty;
        if (parseInt(message) > parseInt(quantity) || parseInt(message) <= 0) {
          sendMsg.customMessage(
            `${translation.error_qty_msg} ${quantity}`,
            sender_id,
            receiver_id
          );
        } else {
          productDetails.qty = parseInt(message);
          if (productDetails.allFeatures.length > 0) {
            // اضافة الكمية التي اختارها المستخدم لمعلومات المنتج
            console.log("debug point ");
            sendProductFeatures({
              productDetails,
              sender,
              sender_id,
              receiver,
              receiver_id,
              message,
            });
          } else {
            await cartController.addToCart(receiver, sender, productDetails);
            const [newCart8Res, purchases8Res] = await Promise.all([
              getUserVars(receiver, sender, "cart"),
              showPurchases(receiver, sender, translation, language),
            ]);
            let newCart8 = JSON.parse(newCart8Res);
            const purchases8 = purchases8Res + "";

            setUserVars(receiver, sender, "phase", "9");
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
          let [language, productDetailsRes] = await Promise.all([
            getUserVars(receiver, sender, "language"),
            getUserVars(receiver, sender, "productDetails"),
          ]);
          if (language == undefined) language = "ar";

          let productDetails = JSON.parse(productDetailsRes);
          const features = showFeatures(
            productDetails.allFeatures,
            translation,
            language
          );
          const featuresCount7 = productDetails.allFeatures.length;
          if (featuresCount7 > 0) {
            sendMsg.featuresPhase(sender_id, features, receiver_id);
            setUserVars(receiver, sender, "phase", "7.1");
            setUserVars(
              receiver,
              sender,
              "features",
              JSON.stringify(productDetails.allFeatures)
            );
          } else {
            await sendMsg.customMessage(
              translation.no_features_found,
              sender_id,
              receiver_id
            );
            sendMsg.showProduct(sender_id, productDetails, receiver_id);

            setUserVars(receiver, sender, "phase", "7");
          }
        } else if (message == translation.no) {
          console.log("no features please");
          // show cart details
          let [productDetails8_1Res, quantity8_1Res] = await Promise.all([
            getUserVars(receiver, sender, "productDetails"),
            getUserVars(receiver, sender, "quantity"),
          ]);

          let productDetails8_1 = JSON.parse(productDetails8_1Res);
          const quantity8_1 = parseInt(quantity8_1Res);
          productDetails8_1.features = [];
          productDetails8_1.qty = quantity8_1;
          console.log(productDetails8_1);

          await cartController.addToCart(receiver, sender, productDetails8_1);
          let [newCart8_1Res, purchases8_1Res] = await Promise.all([
            getUserVars(receiver, sender, "cart"),
            showPurchases(receiver, sender, translation, language),
          ]);
          let newCart8_1 = JSON.parse(newCart8_1Res);

          const purchases8_1 = purchases8_1Res + "";

          setUserVars(receiver, sender, "phase", "9");
          console.log(newCart8_1);
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
        const [purchases9, categoryObj9Res] = await Promise.all([
          showPurchases(receiver, sender, translation, language),
          getUserVars(receiver, sender, "cats"),
        ]);

        let categoryObj9 = JSON.parse(categoryObj9Res);

        if (message === translation.payment) {
          // عرض السلة كاملة مع رابط للدفع
        } else if (message === translation.select_to_delete) {
          if (!purchases9) {
            await sendTextMsg(
              translation.no_items_to_remove,
              sender_id,
              receiver_id
            );

            template("cartdetails", language, sender_id, " "); // يمكنك اضافة اي string  بدل ":"

            return;
          }
          sendMsg.customMessage(
            `${translation.select_number_product_to_delete} 
${purchases9} `,
            sender_id,
            receiver_id
          );
          setUserVars(receiver, sender, "phase", "9.1");
        } else if (message === translation.add_products) {
          setUserVars(receiver, sender, "phase", "6");
          let productObj7 = JSON.parse(
            await getUserVars(receiver, sender, "products")
          );
          sendMsg.productPhase(
            sender_id,
            await products(productObj7, language),
            receiver_id
          );
        }

        // اذا ضغط عودة للرئيسية سيعود للتصنيفات الرئيسية
        else if (message == translation.go_home) {
          delUserVars(receiver, sender, "products");
          delUserVars(receiver, sender, "subcategories");
          setUserVars(receiver, sender, "phase", "4");
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
          await getUserVars(receiver, sender, "cart")
        );
        productCart = productCart.items;
        const length9_1 = productCart.length;

        if (isNaN(message) === true || message > length9_1 || message <= 0) {
          console.log("Error in message length 1151");

          // send error msg
          sendMsg.errorMsg(sender_id, receiver_id);
        } else {
          // Delete product from cart

          let productCartIndex = message - 1; // index of product in cart
          const deletedItem = productCart[productCartIndex];

          const result = await cartController.removeFromCart(
            receiver,
            sender,
            deletedItem,
            productCartIndex
          );

          if (result) {
            const [newCart9_1Res, purchases9_1] = await Promise.all([
              getUserVars(receiver, sender, "cart"),
              showPurchases(receiver, sender, translation, language),
              sendMsg.customMessage(
                translation.delete_success,
                sender_id,
                receiver_id
              ),
            ]);

            let newCart9_1 = JSON.parse(newCart9_1Res);
            sendMsg.showCart(
              sender_id,
              purchases9_1,
              newCart9_1.price,
              newCart9_1.tax,
              newCart9_1.total,
              newCart9_1.fees, // رسوم التوصيل
              receiver_id
            );
            setUserVars(receiver, sender, "phase", "9");
          } else {
            sendMsg.customMessage(
              translation.error_delete_from_cart,
              sender_id,
              receiver_id
            );
            setUserVars(receiver, sender, "phase", "9");
          }
        }

        break;
    }
  }
};

const sendProductFeatures = ({
  productDetails,
  receiver,
  sender,
  message,
  sender_id,
  receiver_id,
}) => {
  productDetails.qty = parseInt(message);

  setUserVars(receiver, sender, "quantity", JSON.stringify(parseInt(message)));

  sendMsg.addedDetails(sender_id, receiver_id);
  setUserVars(receiver, sender, "phase", "8.1");
};

const addFeature = async ({
  sender_id,
  receiver_id,
  sender,
  receiver,
  translation,
}) => {
  let [language, productDetailsRes] = await Promise.all([
    getUserVars(receiver, sender, "language"),
    getUserVars(receiver, sender, "productDetails"),
  ]);
  if (language == undefined) language = "ar";
  let productDetails = JSON.parse(productDetailsRes);
  const features = showFeatures(
    productDetails.allFeatures,
    translation,
    language
  );
  const featuresCount7 = productDetails.allFeatures.length;

  if (featuresCount7 > 0) {
    sendMsg.featuresPhase(sender_id, features, receiver_id);
    setUserVars(receiver, sender, "phase", "7.1");
    setUserVars(
      receiver,
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

    setUserVars(receiver, sender, "phase", "7");
  }
};

const chooseOrderReservation = async ({ receiverID, senderID }) => {
  const receiver = receiverID.replace("whatsapp:+", "");
  const sender = senderID.replace("whatsapp:+", "");

  let language = await getUserVars(receiver, sender, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  template("orders_reservation_together", language, senderID, storeName);
};

const BotService = {
  processMessage,
  logoutHelpMode,
};
module.exports = { BotService };
