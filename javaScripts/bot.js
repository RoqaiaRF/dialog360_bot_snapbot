const redis = require("ioredis");
const client = redis.createClient();
const sendMsg = require("./phases");
const categoryController = require("../app/controllers/categoryController");
const storeController = require("../app/controllers/storeController");

let expiration_time = 7200; // مدة الانتهاء تساوي ساعتان

//set data to the redis session
const setUserVars = async (receiver_id, variable, value) => {
  await client.setex(`${receiver_id}:${variable}`, expiration_time, value);
};

//get the stored data from the redis session
const getUserVars = async (receiver_id, variable) => {
  const myKeyValue = await client.get(`${receiver_id}:${variable}`);
  return myKeyValue;
};

const deleteAllKeys = async () => {
  await client.flushall();
};
//TODO: English bot
//const englishBot = (sender_id, message,  longitude, latitude) => {};

const arabicBot = (sender_id, message,  longitude, latitude) => {


  //   const categories = JSON.parse(await getUserVars(sender_id, "categories"));
  //   sendMsg(sender_id, responses.categories(categories));
  //   setUserVars(sender_id, "phase", "2");
  // `  `
};

// receiver_id: رقم صاحب المتجر / رقم البوت *-----------* sender_id: رقم المرسل / الزبون

const bot = async (sender_id, receiver_id, message, longitude, latitude) => {
  // EX: Input: "whatsapp:+96512345678" ,Output: "12345678"
  receiver_id = receiver_id.replace("whatsapp:+141", "");
  // receiver_id = receiver_id.replace("whatsapp:+965",'');

  const storObj = JSON.parse(
    JSON.stringify(await storeController(receiver_id))
  );
  const storeEN_Name = storObj.name_en; // اسم المتجر بالانجليزي
  const storeAR_Name = storObj.name_ar; // اسم المتجر في العربي
  const storeID = storObj.id; // we need it to get the categories

  console.log(`storeID: ${storeID}`);
  let phase = await getUserVars(sender_id, "phase");
  console.log(`phase: ${phase}`);

  if (message == "0") {
    deleteAllKeys();
    setUserVars(sender_id, "phase", "1");
    sendMsg.welcomeLangPhase(sender_id, storeEN_Name, storeAR_Name);
}
  switch (phase) {
    case "0":
    case null:
    case undefined:
      
      //*DONE *** رسالة الترحيب تحتوي على اسم المتجر بالعربي والانجليزي واختيار اللغة
      sendMsg.welcomeLangPhase(sender_id, storeEN_Name, storeAR_Name);

      deleteAllKeys(); // delete all keys

      //Store phase # 1 EX: (key, value) => ( whatsapp:+96563336437 , 1 )
      setUserVars(sender_id, "phase", "1");
      break;

    case "1":
      if (message === "العربية") {
        setUserVars(sender_id, "language", "ar");
      //  arabicBot(sender_id, message,  longitude, latitude);
      sendMsg.locationPhaseAR(sender_id);
      setUserVars(sender_id, "phase", "2");

      } 
      else if (message === "English") {
        setUserVars(sender_id, "language", "en");
      //  englishBot(sender_id, message,  longitude, latitude);
      }

      else {
        //Send ERROR message : If the message sent is wrong
        sendMsg.errorMsg(sender_id);
      }
      break;

      case "2": 
      if (longitude == undefined || latitude == undefined) {
        sendMsg.errorMsg(sender_id);
        console.log(longitude)
      }
      else { 
        console.log("we will find if there is branches or not then find the nearest branch")
      }

  }
};
module.exports = bot;


/** Phase numbering
 * phase 1 : welcome & language
 * phase 2 : location
 * phase 3 : main categories
 */