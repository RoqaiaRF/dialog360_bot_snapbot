const template = (key, language, value1) => {
  //  Arabic Templates ***
  if (language === "en") key+="_en";

  switch (key) {
    case "product_details":
      return `تفاصيل المنتج${value1}`;

    case "cartdetails":
      return `تفاصيل السلة ${value1}`;

    case "added_details":
      return `هل تريد خدمات اضافية ؟`;

    case "orders_reservation_together":
      return ` أقرب فرع لك ${value1} ومتاح لخدمتك الان`;

    case "onley_ordering":
        return `أقرب فرع لك هو ${value1} ومتاح لخدمتك الان`

    case "onleyreservation":
      return `أقرب فرع لك هو  ${value1} وهو متاح لخدمتك الان`;

    case "pickup":
      return `ما طريقة استلام ${value1} التي تفضلها ؟`;

    //  English Template ***

    case "product_details_en":
      return `Product details${value1}`;

    case "cartdetails_en":
      return `Cart details ${value1}`;

    case "added_details_en":
      return `Do you want additional services?`;

    case "orders_reservation_together_en":
      return `Your nearest branch ${value1} is available to serve you now`;

    case "onley_ordering_en":
        return `The nearest branch to you is ${value1} and available to serve you now`

    case "onleyreservation_en":
        return `The nearest branch to you is ${value1} and it is available to serve you now`
        
    case "pickup_en":
      return `What is your preferred way of receiving ${value1}?`;

    default:
      return "خطأ في التمبلت اتصل بخدمة العملاء wrong answer please call customer service ";
  }
};

module.exports = template;