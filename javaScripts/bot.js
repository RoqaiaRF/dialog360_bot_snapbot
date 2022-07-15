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
  delAllUserVars,
} = require("../database/redis");
const { ModeEnum } = require("./ENUMS/EMode");
const { BotService } = require("./services/BotService/BotService");

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

   receiver_id = receiver_id.replace("whatsapp:+", "");

  let sender = sender_id.replace("whatsapp:+", "");
  //TODO : Replace "JSON.parse(JSON.stringify(object))" with "StructuredClone(object)" when available


  let [phase, language, store] = await Promise.all([
    getUserVars(receiver_id, sender, "phase"),
    getUserVars(receiver_id, sender, "language"),
    storeController.storeDetails(sender, receiver),
  ]);
  const storObj = JSON.parse(JSON.stringify(store));
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  BotService.processMessage({
    receiver_id,
    sender,
    sender_id,
    message,
    phase,
    args: { storObj, language, translation, longitude, latitude, username },
  });
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
