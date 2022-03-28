
//const sendTextMedia = require('../../utils/functions/sendTextMedia');

import sendTextMedia, {sendMedia} from "../../utils/functions/sendTextMedia";

const demo = (message: string, sendeID: any,  Latitude: string, Longitude: string) => {
  


    function send() {   sendTextMedia(`اختر اللغة المناسبة للطلب`, sendeID,)  }

    if (Latitude != undefined|| Longitude != undefined) {
        message= "kuwait"
    }


    switch (message.toString()) {
        case "العربية":
            sendTextMedia(`  ارسل اللوكيشن لموقعك حتى نساعدك بمعرفة اقرب فرع لك 🇰🇼 😊`, sendeID);
            break;
        case "English":
            sendTextMedia(`English is not supported yet`, sendeID);
            break;
        case "kuwait":
            sendTextMedia(`أقرب فرع لك هو  صالون  pink 💅🏼 ومتاح لخدمتك الان`, sendeID);
            break;
        case "العودة للرئيسية": case "4":
            sendTextMedia(`Welcome ...
            please click on the right option
            
            حياك الله .. شرفتنا  .. 
            `,
                sendeID);
            sendTextMedia(`اختر اللغة المناسبة للطلب`,
                sendeID);
            break;

            case "ابدأ الطلب":
                sendTextMedia(`شنو الخدمه الي تبينها عنا ؟`, sendeID);
                break;
            case "اختر فرع اخر":
            sendTextMedia(`اختر نوع القهوة التي تريدها من فضلك`, sendeID);
            sendMedia("اهلا وسهلا بك في قهوة rooot ",sendeID,`https://ae01.alicdn.com/kf/Hfd7cff32b29147df89f85c3744b2c841z/-.jpg`);
            break;

            case "تنظيف":
            sendTextMedia(`خدمات التنظيف`, sendeID);
            sendMedia(`اعتني باظفركي  💅🏾 مع صالون pink `, sendeID,"https://cdn.salla.sa/F49bh46h7lvOo5jndLaW3Z6omxREGGGgpY94iZxa.jpeg");
            break;

            case "بدكير و منكير رويال":
            sendTextMedia(`
            شكرا لاختيارك صالون .pink.  تم استلام طلبك بدكير و منكير رويال بنجاح..
            نسعد بخدمتك ونراك قريبا!
            المجموع: 27.83 دينار 
            الررجاء أستخدام الرابط للدفع. 
            https://client.exqu.co/orders/2-2942/pay
            `, sendeID);
            break;

            case "أظافر":
            sendTextMedia(`خدمات الشعر المتوفره`, sendeID);
            sendMedia(`اصبغي شعركي 👩‍🦰 مع صالون pink `, sendeID,"https://www.horrah.com/wp-content/uploads/2021/02/%D8%A3%D9%84%D9%88%D8%A7%D9%86-%D8%B5%D8%A8%D8%BA%D8%A7%D8%AA-%D8%A7%D9%84%D8%B4%D8%B9%D8%B1-%D9%88%D8%A7%D8%B3%D9%85%D8%A7%D8%A6%D9%87%D8%A7-.jpg");
            break;

            
            case "3":
            sendTextMedia(`سيتم اتاحة هذه الخدمة قريبا`, sendeID);
            break;

            case "حف":
            sendTextMedia(`سيتم اتاحة هذه الخدمة قريبا`, sendeID);
            break;

            case "صبغ لون بني":
                sendTextMedia(`سيتم اتاحة هذه الخدمة قريبا`, sendeID);
                break;

                
            case "صبغ لون احمر":
                sendTextMedia(`سيتم اتاحة هذه الخدمة قريبا`, sendeID);
                break;

            case "بدكير ومنكير عادي":
            sendTextMedia(`سيتم اتاحة هذه الخدمة قريبا`, sendeID);
            break;

            case "بدكير ومنكير لاڤندر":
                sendTextMedia(`سيتم اتاحة هذه الخدمة قريبا`, sendeID);
                break;

            case "صبغ لون اشقر":
                sendTextMedia(`
                شكرا لاختيارك صالون .pink.  تم استلام طلبك لحجز خدمة صبغ لون شعر اشقر بنجاح..
                نسعد بخدمتك ونراك قريبا!
                المجموع: 20 دينار 
                الررجاء أستخدام الرابط للدفع. 
                https://client.exqu.co/orders/2-2942/pay
                `, sendeID);
                break;




                //root cofee 

                case "قهوة عربية":
                    sendTextMedia(`
                    شكرا لاختيارك مقهى .root.  تم استلام طلبك قهوة عربية بنجاح..
                    نسعد بخدمتك ونراك قريبا!
                    المجموع: 2.60 دينار 
                    الررجاء أستخدام الرابط للدفع. 
                    https://client.exqu.co/orders/2-2942/pay
                    `, sendeID);
                    break;

                case "قهوة حلوة":
                    sendTextMedia(`
                    شكرا لاختيارك مقهى .root.  تم استلام طلبك قهوة حلوة بنجاح..
                    نسعد بخدمتك ونراك قريبا!
                    المجموع: 2.5 دينار 
                    الررجاء أستخدام الرابط للدفع. 
                    https://client.exqu.co/orders/2-2942/pay
                    `, sendeID);
                    break;     
                case "قهوة سعودية":
                    sendTextMedia(`
                    شكرا لاختيارك مقهى .root.  تم استلام طلبك قهوة سعودية بنجاح..
                    نسعد بخدمتك ونراك قريبا!
                    المجموع: 2.86 دينار 
                    الررجاء أستخدام الرابط للدفع. 
                    https://client.exqu.co/orders/2-2942/pay
                    `, sendeID);
                    break;
                    
        default:sendTextMedia(`Welcome ...
        please click on the right option
        
        حياك الله .. شرفتنا  .. 
        من فضلك لا تكتبلي كلام مش مفهوم لاني رح ارجعك لهذا الخيار 😄
        `,
    sendeID); setTimeout(send, 1000);

    }
}

export default demo;
