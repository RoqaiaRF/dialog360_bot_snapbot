const isReservation_Pay = (storObj) => {
  console.log(storObj);
  const is_order = storObj.is_order;
  const is_reservation = storObj.is_reservation;

  //اذا كان المتجر يستخدم سياسة الطلب ارجع 1 واذا كان يستخدم سياسة الحجز ارجع 0
  if (is_order && !is_reservation) {
    // سياسة دفع فقط
    return "onlyOrders";
  } else if (is_reservation && !is_order) {
    return "onlyReservation";
  } else if (is_reservation && is_order) {
    return "Orders_Reservation_together";
  } else {
    return "error";
  }
};
module.exports = isReservation_Pay;
