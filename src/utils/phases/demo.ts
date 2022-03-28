
const sendTextMedia = require('../../utils/functions/sendTextMedia.ts');


const demo = (message: string, sendeID: any) => {



    function send() {   sendTextMedia(`اختر اللغة المناسبة للطلب`, sendeID)  }


    switch (message.toString()) {
        case "العربية":
            sendTextMedia(` 🇰🇼 اخبرنا وين تسكن  حتى نساعدك بمعرفة اقرب فرع لك 😊`, sendeID);
            break;
        case "English":
            sendTextMedia(`English is not supported yet`, sendeID);
            break;
        case "kuwait":
            sendTextMedia(`أقرب فرع لك هو  صالون  pink 💅🏼 ومتاح لخدمتك الان`, sendeID);
            break;
        case "العودة للرئيسية":
            sendTextMedia(`Welcome ...
            please click on the right option
            
            حياك الله .. شرفتنا  .. 
            `,
                sendeID);
            sendTextMedia(`اختر اللغة المناسبة للطلب`,
                sendeID);
            break;




            case "ابدأ الطلب":
                sendTextMedia(`شنو الخدمه الي تبينها اليوم ؟
                1️⃣ أظافر
                2️⃣ شعر
                3️⃣ تركيب
                `, sendeID, "https://static.almalnews.com/uploads/2020/05/%D8%B5%D8%A7%D9%84%D9%88%D9%86%D8%A7%D8%AA-%D8%A7%D9%84%D8%AA%D8%AC%D9%85%D9%8A%D9%84-%D9%81%D9%8A-%D9%85%D8%B5%D8%B1.jpg");
                break;
            case "اختر فرع اخر":
            sendTextMedia(`العفو منك ليس عندنا فروع اخرى, اخبرنا بموقع اخر من فضلك`, sendeID);
            break;

            case "1":
            sendTextMedia(`خدمات التنظيف`, sendeID);
            sendTextMedia(`اعتني باظفركي  💅🏾 مع صالون pink `, sendeID,"https://cdn.salla.sa/F49bh46h7lvOo5jndLaW3Z6omxREGGGgpY94iZxa.jpeg");
            break;

            case "بدكير و منكير رويال":
            sendTextMedia(`
            شكرا لاختيارك صالون .pink.  تم استلام طلبك بنجاح..
            نسعد بخدمتك ونراك قريبا!
            المجموع: 27.83 دينار 
            الررجاء أستخدام الرابط للدفع. 
            https://client.exqu.co/orders/2-2942/pay
            `, sendeID);
            break;



            case "2":
            sendTextMedia(`خدمات الشعر المتوفره`, sendeID);
            sendTextMedia(`اصبغي شعركي 👩‍🦰 مع صالون pink `, sendeID,"https://www.horrah.com/wp-content/uploads/2021/02/%D8%A3%D9%84%D9%88%D8%A7%D9%86-%D8%B5%D8%A8%D8%BA%D8%A7%D8%AA-%D8%A7%D9%84%D8%B4%D8%B9%D8%B1-%D9%88%D8%A7%D8%B3%D9%85%D8%A7%D8%A6%D9%87%D8%A7-.jpg");
            break;

            case "حف":
            sendTextMedia(`سيت اتاحة هذه الخدمة قريبا`, sendeID);
            break;


            
        default:sendTextMedia(`Welcome ...
        please click on the right option
        
        حياك الله .. شرفتنا  .. 
        من فضلك لا تكتبلي كلام مش مفهوم لاني رح ارجعك لهذا الخيار 😄
        `,
    sendeID); setTimeout(send, 1000);

    }
}

module.exports = demo;
