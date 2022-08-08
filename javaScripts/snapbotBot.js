const sendTextMsg = require("./sendMsgFunctions");
const sendMedia = require("./sendMedia");
const demo = require("./demoApp");
var snapbot_phone_number = "whatsapp:+96563336437";

const snapbotBot = async (message, sendeID, username) => {
  switch (message) {
    case "مزيد من خدماتنا ...": // نعرض له صورة ونعرض له رسالة فيها كل الخدمات
      await sendTextMsg("", sendeID, snapbot_phone_number);
      sendMedia(
        ` الخدمات التي نقدمها لك عن طريق الواتس 
        1️⃣ تحويل رقمك الواتس اب الخاص بمتجرك لموظف الي يستقبل ويتحكم بعدد كبير من الطلبات والحجوزات في آن واحد. 
        2️⃣ سهولة وسرعة استقبال الحجوزات والطلبات. 
        3️⃣ انشاء موقع خاص بك لعرض الطلبات والحجوزات التي تمت عن طريق الواتس اب. 
        4️⃣ عرض جميع المنتجات الخاصة بمتجرك عبر الواتس اب. 
        5️⃣ اتاحة خدمة الدفع عن طريق الواتس اب عن طريق ربطه بوابات الدفع الإلكتروني . 
        6️⃣  يمكن للزبائن الحصول على المساعدة وإرسال رسالة بالواتس اب  تصلك عن طريق الموقع الذي انشأناه لك والتواصل معهم.
        7️⃣ معرفة كمية الطلبات والحجوزات التي يتم استقبالها يوميا عن طريق الواتس اب.
        8️⃣ معرفة التحصيل المالي يوميا من الطلبات والحجوزات.     `,
      sendeID,
 
        "https://instagram.famm2-3.fna.fbcdn.net/v/t51.2885-15/291973315_548839256883034_5657934661789133877_n.jpg?stp=dst-jpg_e35&_nc_ht=instagram.famm2-3.fna.fbcdn.net&_nc_cat=110&_nc_ohc=amkYtqYq8R4AX8w7Hp4&tn=8IfN3AFMy5kYL-zw&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=Mjg3NDk4MzcxMjgzNzEwNTU1MA%3D%3D.2-ccb7-5&oh=00_AT_N1TETNNhGm07uznkhTuz5YO-O0TtbHCYIxrOH-EG8-g&oe=62F7B7A5&_nc_sid=30a2ef",
       
        snapbot_phone_number
      );

     

      break;

    case "جرب البوت":
        

        break;

    default:
     await sendTextMsg(
        ` أهلا بك ${username} في شركة سنابوت 😊 
         المتخصصة في ادارة نشاطك التجاري 🏙
          عبر الواتساب 📱 من خلال اتاحة نظام رد اَلي  🤖
          ولوحة تحكم لإدارة جميع  الطلبات والحجوزات مهما كان حجمها 🤩
          , وايضا التسويق وارسال عدد كبير من الرسائل
           لوصول اسهل لعملائك من داخل الواتساب فقط 😎.
        `,
        sendeID,
        snapbot_phone_number
      );
      sendTextMsg(
        ` لا تحتاج اي شي سوى الواتساب 😌`,
        sendeID,
        snapbot_phone_number
      );

      sendTextMsg(
        `جميع منتجاتك داخل الواتساب :)`,
        sendeID,
        snapbot_phone_number
      );

      sendMedia(
        "",
        sendeID,
        "https://instagram.famm2-3.fna.fbcdn.net/v/t51.2885-15/290634662_137713585285693_4169882400887429962_n.jpg?stp=dst-jpg_e35&_nc_ht=instagram.famm2-3.fna.fbcdn.net&_nc_cat=101&_nc_ohc=p0v6ltPu_tYAX92mGN7&tn=8IfN3AFMy5kYL-zw&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=Mjg3MDU3MTc5NDI2OTY1NDE4MA%3D%3D.2-ccb7-5&oh=00_AT8pLrdyyG_R-5quZyoDOX0LHhymuKmevxMeJOXSPqD1zQ&oe=62F7CB73&_nc_sid=30a2ef",
        snapbot_phone_number
      );

    // نرسل له رسالة الترحيب
  }
};

module.exports = snapbotBot;
