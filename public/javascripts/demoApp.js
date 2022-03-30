const sendTextMsg = require("./sendMsgFunctions");
const sendMedia = require("./sensMedia");

const demo = (message, sendeID) => {
  function send() {
    sendTextMsg(`اختر اللغة المناسبة للطلب`, sendeID);
  }

  // if (Latitude != undefined || Longitude != undefined) {
  //   message = "kuwait";
  // }

  switch (message.toString()) {
    case "العربية":
      sendTextMsg(`أهلا بك في خدمة سنابوت , اختر مطعم او صالون`, sendeID);
      break;


    case "مطعم سنابوت":
      sendTextMsg(
        `  ارسل اللوكيشن لموقعك حتى نساعدك بمعرفة اقرب فرع لك 🇰🇼 😊`,
        sendeID
      );
      break;

    case "English":
      sendTextMsg(`English is not supported yet`, sendeID);
      break;
    case "kuwait":
      sendTextMsg(`أقرب فرع لك هو مطعم سنابوت 🍽️ ومتاح لخدمتك الان`, sendeID);
      break;
    case "العودة للرئيسية":
    case "4":
      sendTextMsg(
        `Welcome ...
            please click on the right option
            
            حياك الله .. شرفتنا  .. 
            `,
        sendeID
      );
      sendTextMsg(`اختر اللغة المناسبة للطلب`, sendeID);
      break;

    case "ابدأ الطلب":
      sendTextMsg(`اختر الصنف المناسب لطفا`, sendeID);
      break;
    case "اختر فرع اخر":
      sendTextMsg(`لا يوجد فروع اخرى , أرسل اللوكيشن من فضلك`, sendeID);
      break;

    case "مقبلات":
      sendTextMsg(`اختر المقبلات المناسبة من فضلك`, sendeID);
      sendMedia(
        `مقبلات حسب الطلب ولذيذه`,
        sendeID,
        "https://yawmiyati.com/assets/media/%D9%85%D8%B7%D8%A8%D8%AE%D9%8A-%D9%8A%D9%88%D9%85%D9%8A%D8%A7%D8%AA%D9%8A/%D9%85%D9%82%D8%A8%D9%84%D8%A7%D8%AA_1/%D9%85%D9%82%D8%A8%D9%84%D8%A7%D8%AA_%D9%84%D9%84%D8%B9%D8%B2%D9%88%D9%85%D8%A7%D8%AA_%D8%B3%D9%87%D9%84%D8%A9_%D8%A7%D9%84%D8%AA%D8%AD%D8%B6%D9%8A%D8%B1.jpg"
      );
      break;

    case "بطاطا مقلية":
      sendTextMsg(
        `
            شكرا لاختيارك مطعم سنابوت. تم استلام طلبك بطاطا مقلية بنجاح..
            نسعد بخدمتك ونراك قريبا!
            المجموع: 3.6 دينار 
            الررجاء أستخدام الرابط للدفع. 
            https://client.exqu.co/orders/2-2942/pay
            `,
        sendeID
      );
      break;

    case "حلقات البصل":
      sendTextMsg(
        `
            شكرا لاختيارك مطعم سنابوت. تم استلام طلبك حلقات البصل بنجاح..
            نسعد بخدمتك ونراك قريبا!
            المجموع: 1.6 دينار 
            الررجاء أستخدام الرابط للدفع. 
            https://client.exqu.co/orders/2-2942/pay
            `,
        sendeID
      );
      break;

    case "كرات الجبن":
      sendTextMsg(
        `
            شكرا لاختيارك مطعم سنابوت. تم استلام طلبك كرات الجبن بنجاح..
            نسعد بخدمتك ونراك قريبا!
            المجموع: 4.4 دينار 
            الررجاء أستخدام الرابط للدفع. 
            https://client.exqu.co/orders/2-2942/pay
            `,
        sendeID
      );
      break;

    case "برغر":
      sendTextMsg(`اختر المنتج المناسب من فضلك`, sendeID);
      sendMedia(
        `ألذ البرغر عندنا`,
        sendeID,
        "https://img.youm7.com/large/201702260428572857.jpg"
      );
      break;

    case "برغر لحم":
      sendTextMsg(
        `
                شكرا لاختيارك مطعم سنابوت. تم استلام طلبك برغر لحم بنجاح..
                نسعد بخدمتك ونراك قريبا!
                المجموع: 14.84 دينار 
                الررجاء أستخدام الرابط للدفع. 
                https://client.exqu.co/orders/2-2942/pay
                `,
        sendeID
      );
      break;

    case "كباب":
      sendTextMsg(
        `
                شكرا لاختيارك مطعم سنابوت. تم استلام طلبك كباب بنجاح..
                نسعد بخدمتك ونراك قريبا!
                المجموع: 11.61 دينار 
                الررجاء أستخدام الرابط للدفع. 
                https://client.exqu.co/orders/2-2942/pay
                `,
        sendeID
      );
      break;

    case "شاورما":
      sendTextMsg(
        `
                شكرا لاختيارك مطعم سنابوت. تم استلام طلبك شاورما بنجاح..
                نسعد بخدمتك ونراك قريبا!
                المجموع: 6.85 دينار 
                الررجاء أستخدام الرابط للدفع. 
                https://client.exqu.co/orders/2-2942/pay
                `,
        sendeID
      );
      break;

    case "مشروبات":
      sendTextMsg(`سيتم اتاحة هذه الخدمة قريبا`, sendeID);
      break;

    //saloon pink

    case "صالون pink":
      sendTextMsg(`صالون  pink 💅🏼 `, sendeID);
      sendTextMsg(`شنو الخدمه الي تبينها عنا ؟`, sendeID);
      break;

    case "تنظيف":
      sendTextMsg(`خدمات التنظيف`, sendeID);
      sendMedia(
        `اعتني باظفركي  💅🏾 مع صالون pink `,
        sendeID,
        "https://cdn.salla.sa/F49bh46h7lvOo5jndLaW3Z6omxREGGGgpY94iZxa.jpeg"
      );
      break;

    case "بدكير و منكير رويال":
      sendTextMsg(
        `
                    شكرا لاختيارك صالون .pink.  تم استلام طلبك بدكير و منكير رويال بنجاح..
                    نسعد بخدمتك ونراك قريبا!
                    المجموع: 27.83 دينار 
                    الررجاء أستخدام الرابط للدفع. 
                    https://client.exqu.co/orders/2-2942/pay
                    `,
        sendeID
      );
      break;

    case "أظافر":
      sendTextMsg(`خدمات الشعر المتوفره`, sendeID);
      sendMedia(
        `اصبغي شعركي 👩‍🦰 مع صالون pink `,
        sendeID,
        "https://www.horrah.com/wp-content/uploads/2021/02/%D8%A3%D9%84%D9%88%D8%A7%D9%86-%D8%B5%D8%A8%D8%BA%D8%A7%D8%AA-%D8%A7%D9%84%D8%B4%D8%B9%D8%B1-%D9%88%D8%A7%D8%B3%D9%85%D8%A7%D8%A6%D9%87%D8%A7-.jpg"
      );
      break;

    case "3":
      sendTextMsg(`سيتم اتاحة هذه الخدمة قريبا`, sendeID);
      break;

    case "حف":
      sendTextMsg(`سيتم اتاحة هذه الخدمة قريبا`, sendeID);
      break;

    case "صبغ لون بني":
      sendTextMsg(`سيتم اتاحة هذه الخدمة قريبا`, sendeID);
      break;

    case "صبغ لون احمر":
      sendTextMsg(`سيتم اتاحة هذه الخدمة قريبا`, sendeID);
      break;

    case "بدكير ومنكير عادي":
      sendTextMsg(`سيتم اتاحة هذه الخدمة قريبا`, sendeID);
      break;

    case "بدكير ومنكير لاڤندر":
      sendTextMsg(`سيتم اتاحة هذه الخدمة قريبا`, sendeID);
      break;

    case "صبغ لون اشقر":
      sendTextMsg(
        `
                        شكرا لاختيارك صالون .pink.  تم استلام طلبك لحجز خدمة صبغ لون شعر اشقر بنجاح..
                        نسعد بخدمتك ونراك قريبا!
                        المجموع: 20 دينار 
                        الررجاء أستخدام الرابط للدفع. 
                        https://client.exqu.co/orders/2-2942/pay
                        `,
        sendeID
      );
      break;

    default:
      sendTextMsg(
        `Welcome ...
                please click on the right option
                
                حياك الله .. شرفتنا  .. 
                من فضلك لا تكتبلي كلام مش مفهوم لاني رح ارجعك لهذا الخيار 😄
                `,
        sendeID
      );
      setTimeout(send, 1000);
  }
};

module.exports = demo;
