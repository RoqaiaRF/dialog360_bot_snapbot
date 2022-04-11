const redis = require("ioredis");
const client = redis.createClient();
const sendMsg = require("./phases");
const categoryController = require("../app/controllers/categoryController");
const storeController = require("../app/controllers/storeController");

let expiration_time = 7200; // مدة الانتهاء تساوي ساعتان

//set data to the redis session
const setUserVars = async (receiver_id, variable, value) => {
  await client.setEX(`${receiver_id}:${variable}`, expiration_time, value);
};

//get the stored data from the redis session
const getUserVars = async (receiver_id, variable) => {
  const myKeyValue = await client.get(`${receiver_id}:${variable}`);
  return myKeyValue;
};

const englishBot = () => {};

const arabicBot = () => {

    

      //   const categories = JSON.parse(await getUserVars(sender_id, "categories"));
      //   sendMsg(sender_id, responses.categories(categories));
      //   setUserVars(sender_id, "phase", "2");
      // `  `                 
};

// receiver_id: رقم صاحب المتجر / رقم البوت *-----------* sender_id: رقم المرسل / الزبون

const bot = async (sender_id, receiver_id, message) => {
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
  //*DONE *** رسالة الترحيب تحتوي على اسم المتجر بالعربي والانجليزي واختيار اللغة
  sendMsg.welcomeLangPhase(sender_id, storeEN_Name, storeAR_Name);

  let Phase = await getUserVars(sender_id, "phase");

  switch (Phase) {
    case "0":
    case null:
    case undefined:
      //Send ERROR message : If the message sent is wrong
      sendMsg.errorMsg(sender_id);

      
      //Store phase # 1 EX: (key, value) => ( whatsapp:+96563336437 , 1 )
      setUserVars(sender_id, "phase", "1");

      break;

    case "1":
      if (message === "العربية") {
        setUserVars( sender_id,"language", "ar")
        arabicBot(sender_id)
      }
      
      else if (message === "English") {
        setUserVars( sender_id,"language", "ar")
        englishBot();
      }
      
      else {
        sendMsg.errorMsg(sender_id);
      }
      console.log("phase 1");
      break;
      
    case "2":
      if (message == "0") {
        sendMsg(sender_id, responses.welcomeMsg());
        setUserVars(sender_id, "phase", "1");
      }
      console.log("phase 2");
      break;
    case "3":
      console.log("phase 3");
      break;
    case "4":
      console.log("phase 4");
      break;
    case "5":
      console.log("phase 5");
      break;
    case "6":
      console.log("phase 6");
      break;
    case "7":
      console.log("phase 7");
      break;
    case "8":
      console.log("phase 8");
      break;
    default:
      break;
  }
};

module.exports = bot;
