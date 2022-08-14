const sendMsg = require("./phases");
const getCategories = require("../app/controllers/categoryController");
const storeController = require("../app/controllers/storeController");
const cartController = require("../app/controllers/cartController");
const workTimeController = require("../app/controllers/workTimeController");

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
const { Sequelize, sequelize } = require("../database/connection");
const EndUsers = require("../app/models/EndUsers")(sequelize, Sequelize);

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

  let receiver = receiver_id.replace("whatsapp:+", "");
  let sender = sender_id.replace("whatsapp:+", "");
  //TODO : Replace "JSON.parse(JSON.stringify(object))" with "StructuredClone(object)" when available

  // get store details
  const storObj = JSON.parse(
    JSON.stringify(await storeController.storeDetails(sender, receiver))
  );
  

  let phase = await getUserVars(receiver_id, sender, "phase");
  let language = await getUserVars(receiver_id, sender, "language");
  if (language == undefined) language = "ar";

  const translation = require(`../locales/${language}`);
  

  // فحص مواقيت العمل
const isWithinWorkingHoursDays = await workTimeController(receiver, sender, storObj);
console.log("isWithinWorkingHoursDays: " + isWithinWorkingHoursDays);

switch (isWithinWorkingHoursDays) {

  case 1 :
    setUserVars(receiver, sender, "mode", ModeEnum.help);
    sendMsg.customMessage(translation.isWithinWorkingHoursDays_0, sender_id, receiver_id);
    break;

  case 2 :
     sendMsg.customMessage(translation.isWithinWorkingHoursDays_1, sender_id, receiver_id);
    break;
}
  EndUsers.create({
    phone: receiver,
    full_name: username,
    store_id: storObj.id,
  }).catch(()=>{});
  BotService.processMessage({
    receiver_id,
    receiver,
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
