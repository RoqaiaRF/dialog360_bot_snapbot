const storeController = require("../app/controllers/storeController");

// Check if there is another branches in the store or not
const checkBranches = async (senderID, receiverID) => {
  console.log(senderID, receiverID, "senderID, receiverID +++++++++++++++")
  //احضر الفروع كلها من الداتابيز

  let allbranches = []
   JSON.stringify(await storeController.getAllBranchs(receiverID, senderID))
  

  if (allbranches == undefined) {
    allbranches = []; // اعتبر انه لا يوجد فروع اخرى ولا تظهر زر " اختر فرع اخر"
  } else {
    allbranches = JSON.parse(allbranches);
  }
  console.log(allbranches.length , " allbranches.length +++++++++++")

  // لا يوجد هناك فروع اخرى
  if (allbranches.length <= 1) {
    return false;
  } else {
    return true;
  }

};
const template = (key, language, value1, sender, receiverID) => {

  const senderID = sender.replace("whatsapp:+", "");

  const isExistenceBranches = checkBranches(senderID, receiverID);
  //  Arabic Templates ***
  if (language === "en") key += "_en";

  switch (key) {
    case "product_details":
      return `تفاصيل المنتج${" " + value1}`;

    case "cartdetails":
      return `تفاصيل السلة ${value1}`;

    case "added_details":
      return `هل تريد خدمات اضافية ؟`;

    case "orders_reservation_together":
      if (isExistenceBranches) {
        return `اهلا  بك في ${value1} و هو متاح لخدمتك الان`;
      } else {
        return `اهلا وسهلا بك في ${value1} و هو متاح لخدمتك الان`;
      }

    case "onley_ordering":
      if (isExistenceBranches) {
        return ` اهلا وسهلا بك في ${value1}  `;
      } else {
        return `اهلا وسهلا بك في ${value1} و متاح لخدمتك الان`;
      }

    case "onleyreservation":
      if (isExistenceBranches) {
        return `اهلا وسهلا في ${value1} `;
      } else {
        return `اهلا وسهلا بك في ${value1} و هو الان متاح لخدمتك `;
      }

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
      if (isExistenceBranches) {
        return `Welcome to ${value1}  it is  available to serve you`;
      } else {
        return `Welcome to ${value1} and it is available to serve you now`;
      }

    case "onley_ordering_en":
      if (isExistenceBranches) {
        return `Welcome to ${value1}`;
      } else {
        return `Welcome to ${value1} and available to serve you now`;
      }

    case "onleyreservation_en":
      if (isExistenceBranches) {
        return `welcome at ${value1}`;
      } else {
        return `Welcome to ${value1} and it is now available to serve you`;
      }

    case "pickup_en":
      return `What is your preferred way of receiving ${value1}?`;

    default:
      return "خطأ في التمبلت اتصل بخدمة العملاء wrong answer please call customer service ";
  }
};

module.exports = template;
