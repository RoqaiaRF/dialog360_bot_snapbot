
const Redis = require("ioredis");

const REDIS_URL = process.env.REDIS_URL;
const client = new Redis( REDIS_URL);

// Check if there is another branches in the store or not
const checkBranches = async (senderID, receiverID) =>{
  const allbranches =  await client.get(`${receiverID}:${senderID}:allbranches`);

    if(allbranches == undefined ){
      allbranches = []; // اعتبر انه لا يوجد فروع اخرى ولا تظهر زر " اختر فرع اخر"
    }else{
      allbranches = JSON.parse(allbranches);
    }

}

const template = async (key, language, value1, senderID, receiverID) => {

  //  Arabic Templates ***
  if (language === "en") key+="_en";

  switch (key) {
    case "product_details":
      return `تفاصيل المنتج${" "+value1}`;

    case "cartdetails":
      return `تفاصيل السلة ${value1}`;

    case "added_details":
      return `هل تريد خدمات اضافية ؟`;

    case "orders_reservation_together":
   //  TODO: let check_branches = await checkBranches(senderID, receiverID)
      return `اهلا وسهلا بك في ${value1} و هو متاح لخدمتك الان`;

    case "onley_ordering":
        return `اهلا وسهلا بك في ${value1} و متاح لخدمتك الان`

    case "onleyreservation":
      return `اهلا وسهلا بك في ${value1} و هو الان متاح لخدمتك `;

    case "pickup":
      return `ما طريقة استلام المنتج التي تفضلها ؟`;

    //  English Template ***

    case "product_details_en":
      return `Product details${value1}`;

    case "cartdetails_en":
      return `Cart details ${value1}`;

    case "added_details_en":
      return `Do you want additional services?`;

    case "orders_reservation_together_en":
      return `Welcome to ${value1} and it is available to serve you now`;

    case "onley_ordering_en":
        return `Welcome to ${value1} and available to serve you now`

    case "onleyreservation_en":
        return `Welcome to ${value1} and it is now available to serve you`
        
    case "pickup_en":
      return `What is your preferred way of receiving ${value1}?`;

    default:
      return "خطأ في التمبلت اتصل بخدمة العملاء wrong answer please call customer service ";
  }
};

module.exports = template;
