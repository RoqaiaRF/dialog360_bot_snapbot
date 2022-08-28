const sendTextMsg = require("./sendMsgFunctions");
const sendMedia = require("./sendMedia");
const demo = require("./demoApp");
var snapbot_phone_number = "whatsapp:+201144002242";

const snapbotBot = async (message, sendeID, username) => {
  switch (message) {
    case "العربية":
      const text_welcome = `سناب بوت الشركة الرائدة في مجال التكنولوجيا 🤗`;
      await sendTextMsg(
        `اهلا وسهلا بكم في  ${text_welcome}`,
        sendeID,
        snapbot_phone_number
      );
      sendMedia(
        "",
        sendeID,
        "https://stores-logos.fra1.digitaloceanspaces.com/sanpbot-img/snap1.jpeg",
        snapbot_phone_number
      );

      break;

      case "English":
        await sendTextMsg(
          "Welcome at snapbot .",
          sendeID,
          snapbot_phone_number
        );
        sendMedia(
          "",
          sendeID,
          "https://stores-logos.fra1.digitaloceanspaces.com/sanpbot-img/snap1.jpeg",
          snapbot_phone_number
        );
  
        break;

    case "من نحن":
      await sendTextMsg(
        "التعرف أكثر علينا 🤗",
        sendeID,
        snapbot_phone_number
      ); // نعرض له صورة ونعرض له رسالة فيها كل الخدمات
      sendMedia(
        `نحن شركة رائدة في مجال التكنولوجيا ونستخدم تقنيات توفر على العميل الوقت والمجهود في استقبال طلبات الزبائن والتواصل معهم عبر الواتس اب 📲
        `,
        sendeID,
        "https://stores-logos.fra1.digitaloceanspaces.com/sanpbot-img/snap2.jpeg",
        snapbot_phone_number
      );
      break;

      case  "about us"     : // نعرض له صورة ونعرض له رسالة فيها كل الخدمات
      await sendTextMsg(
        "getting to know us better 🤗",
        sendeID,
        snapbot_phone_number
      );

      sendMedia(
        "It is a solution for faster sales service and direct communication with the customer.",
        sendeID,
        "https://stores-logos.fra1.digitaloceanspaces.com/sanpbot-img/snap2.jpeg",
        snapbot_phone_number
      );
      break;

      case "خدماتنا":
        await sendTextMsg(`
   الخدمات التي نقدمها لك عن طريق الواتس اب
1️⃣  تحويل رقمك الواتس اب الخاص بمتجرك لموظف آلي يستقبل ويتحكم بعدد كبير من الطلبات والحجوزات في آن واحد. 
2️⃣  سهولة وسرعة استقبال الحجوزات والطلبات. 
3️⃣  إنشاء موقع خاص بك لعرض الطلبات والحجوزات التي تمت عن طريق الواتس اب. 
4️⃣  عرض جميع المنتجات الخاصة بـ متجرك عبر الواتس اب. 
5️⃣  إتاحة خدمة الدفع عن طريق الواتس اب عن طريق ربطه بوابات الدفع الإلكتروني . 
6️⃣  يمكن للزبائن الحصول على المساعدة وإرسال رسالة بالواتس اب  تصلك عن طريق الموقع الذي أنشأناه لك والتواصل معهم.
7️⃣  معرفة كمية الطلبات والحجوزات التي يتم استقبالها يوميا عن طريق الواتس اب.
8️⃣  معرفة التحصيل المالي يوميا من الطلبات والحجوزات التي تصلك عبر الواتس اب  .
9️⃣  الربط مع شركات التوصيل المختلفة
        `,
          sendeID,
          snapbot_phone_number
        );
        break;


        case "شركات تثق بنا":
          await sendTextMsg(`
          ثري بيز متخصصة بإنتاج العسل
          2️⃣ روت كوفي بار
          3️⃣ مطعم طبخ الفريج 
          4️⃣ تناميرا مساج 
          5️⃣ SunGard Express 
          6️⃣ نانو فور لايف الكويت  
          7️⃣ اولد تاون كافيه
          
          `,
            sendeID,
            snapbot_phone_number
          );
          break;

    default:
      await sendTextMsg(
        `مع سنابوت بتستقبل الطلبات والحجوزات بكل سهولة
        With Snabot,  receive orders and reservations with ease
        😎 `,
        sendeID,
        snapbot_phone_number
      );

      await sendTextMsg(
        `اختر اللغة المناسبة للطلب من فضلك
        Choose the language ,please`,
        sendeID,
        snapbot_phone_number
      );

  }
};

module.exports = snapbotBot;
