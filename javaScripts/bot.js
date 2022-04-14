const redis = require("ioredis");
const client = redis.createClient();
const sendMsg = require("./phases");
const getCategories = require("../app/controllers/categoryController");
const storeController = require("../app/controllers/storeController");



let expiration_time = 7200; // مدة صلاحية انتهاء المفاتيح في ريديس تساوي ساعتان

//Print Categories

const categories = (categoriesObj) => {
  let msg = "";
  categoriesObj.forEach((element, index) => {
   
    msg += `(*${(index + 1)}*) ${element.name_ar}
 `; 
  }) 
  return msg
}

// get all branches to this store

// const getAllBranches = (sender, store_id, storObj) => {
//   //if there is no branches to this store return the store
//   if (
//     (storObj.parent_id === null && storObj.branches === null) ||
//     storObj.branches === undefined
//   ) {
   
//     sendMsg.nearestLocation(sender, storObj.name_ar);
//   } else {
//     console.log("storObj.branches: ");
//     console.log(storObj.branches);
//   }
// };

//set data to the redis session
const setUserVars = async (sender, variable, value) => {
  await client.setex(`${sender}:${variable}`, expiration_time, value);
};

//get the stored data from the redis session
const getUserVars = async (sender, variable) => {
  const myKeyValue = await client.get(`${sender}:${variable}`);
  return myKeyValue;
};

//delete the stored data from the redis session
const delUserVars = async (sender, variable) => {

  await client.del(`${sender}:${variable}`);
 
};
// delete all data from all databases in redis
const deleteAllKeys = async () => {
  await client.flushall();
};

//TODO: English bot
//const englishBot = (sender, message,  longitude, latitude) => {};

const arabicBot = (sender_id, message, longitude, latitude) => {};

// receiver_id: رقم صاحب المتجر / رقم البوت *-----------* sender_id: رقم المرسل / الزبون

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
  // receiver_id = receiver_id.replace("whatsapp:+965",'');
  console.log(receiver_id);
  const storObj = JSON.parse(JSON.stringify(await storeController.storeDetails(receiver_id)));
  const storeEN_Name = storObj.name_en; // اسم المتجر بالانجليزي
  const storeAR_Name = storObj.name_ar; // اسم المتجر في العربي
  //const store_id = storObj.id; // we need it to get the categories
  const parent_id = storObj.parent_id;

 // console.log(`store_id: ${store_id}`);
  console.log(storObj);
  let phase = await getUserVars(sender, "phase");
  console.log(`phase: ${phase}`);

  if (message == "0" || message == "العودة للرئيسية") {
    delUserVars(sender_id, "branch" )
    sendMsg.welcomeLangPhase(sender_id, storeEN_Name, storeAR_Name, username);
    setUserVars(sender, "phase", "1");
  } else if (message == "*") {
    //TODO: المستخدم بحاجة للمساعدة قم بارسال اشعار للداشبورد
  } else {
    switch (phase) {
      case "0":
      case null:
      case undefined:
        //*DONE *** رسالة الترحيب تحتوي على اسم المتجر بالعربي والانجليزي واختيار اللغة
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
          sendMsg.locationPhaseAR(sender_id);
          setUserVars(sender, "phase", "2");
        } else if (message === "English") {
          setUserVars(sender, "language", "en");
          //  englishBot(sender_id, message,  longitude, latitude);
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
        const nearestBranch = await storeController.getNearestBranch( sender, receiver_id , latitude, longitude)
          //getAllBranches(sender_id, store_id, storObj);
          if (!nearestBranch ) { 
           sendMsg.customMessage("عذرا لا نقدم خدمات ضمن موقعك الجغرافي", sender_id);
           setUserVars(sender, "phase", "2");
           sendMsg.locationPhaseAR(sender_id);
          
          }
          else { 
            sendMsg.nearestLocation(sender_id, nearestBranch.name_ar);
            setUserVars(sender, "phase", "3");
           
          }
    
        
        }
        break;
      case "3":
        const branch = JSON.parse(await getUserVars(sender, "branch"))
        let store_id
        if(branch.parent == null){
          store_id = branch.id
        }else{
          store_id = branch.parent_id
        }
        if (message == "ابدأ الطلب") {
          const categoryObj = JSON.parse(
            JSON.stringify(await getCategories(sender, store_id))
          );
          sendMsg.categoryPhase(sender_id, "" + categories(categoryObj));
          setUserVars(sender, "phase", "4");
        } else if (message === "اختر فرع اخر") {
          sendMsg.locationPhaseAR(sender_id);
          setUserVars(sender, "phase", "2");
        } else {
          sendMsg.errorMsg(sender_id);
        }
        break;
      case "4":
        
      // أعطيك اللوجيك الان ثم سنعمله
      /**
       * عليه ان يتأكد من مدخلات المستخدم 
       * اذا كانت شخابيط تعاد له رسالة خطأ
       * إن اختار رقما غير الارقام الموجودة تظهر له رسالة الخطأ
       * نتعرف على الارقام الصحيحة اعتمادا على طول مصفوفة التصنيفات 
       * يعني اذا كان الرقم المكتوب اكبر تماما من طول عناصر المصفوفة يظهر الخطأ
       * وان كتب رقما أقل من طول المصفوفة او يساويه
       * نطرح منه الرقم 1
       * ثم نستخرج به معرّف التصنيف الذي سنمرره في دالة لعرض المنتجات
       * استأذنك الان ساذهب :)
       * 
       ** :)  حسنا سأنتظرك 
       */

    }
  }
};
module.exports = bot;

/** Phase numbering
 * phase 1 : welcome & language
 * phase 2 : location
 *           get the nearest branch
 * phase 3 : main categories
 * phase 4 : 
 */
