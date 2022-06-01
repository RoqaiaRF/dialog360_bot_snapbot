const template = (key, language, value1) => {
  //  Arabic Templates ***
  if (language === "ar") {

  switch (key) {
    case "product_details":
      let newValue= " "+ value1 +" "
      return `تفاصيل المنتج${newValue}`;

    case "cartdetails":
      return `تفاصيل السلة ${value1}`;

    case "added_details":
      return `هل تريد خدمات اضافية ؟`;

    case "orders_reservation_together":
      return ` أقرب فرع لك ${value1} ومتاح لخدمتك الان`;

    case "onley_ordering":
        return `اهلا وسهلا بك في ${value1} و متاح لخدمتك الان
`

    case "onleyreservation":
      return `	
اهلا وسهلا بك في ${value1} و هو الان متاح لخدمتك `;

    case "pickup":
      return `ما طريقة استلام ${value1} التي تفضلها ؟`;
  }
}
else{
    switch (key) {

    //  English Template ***

    case "product_details":
      return `Product details${value1}`;

    case "cartdetails":
      return `Cart details ${value1}`;

    case "added_details":
      return `Do you want additional services?`;

    case "orders_reservation_together":
      return `Welcome to ${value1} and it is available to serve you now`;

    case "onley_ordering":
        return `Welcome to ${value1} and available to serve you now`

    case "onleyreservation":
        return `Welcome to ${value1} and it is now available to serve you`
        
    case "pickup":
      return `What is your preferred way of receiving ${value1}?`;

    default:
      return "خطأ في التمبلت اتصل بخدمة العملاء wrong answer please call customer service ";
  }}
};

module.exports = template;
