

const isReservation_Pay = (storObj) => {
 
    const reservations = storObj.reservations_policy
    const pay1 = storObj.pay_when_receiving
    const pay2 = storObj.pay_after_receiving
    //اذا كان المتجر يستخدم سياسة الطلب ارجع 1 واذا كان يستخدم سياسة الحجز ارجع 0
    if ((pay1 || pay2 ) && ( !reservations )) { // سياسة دفع فقط
      return "onlyPay"
    }
    else if ((!pay1 && !pay2) && (reservations)) {
      return "onlyReservation" 
     }
    else { return "Pay_Reservation_together" }
console.log("********store obj", storObj);
}

  module.exports = isReservation_Pay