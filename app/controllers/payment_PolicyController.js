
const paymentPolicy = (storObj) => {
  const pay_when_receiving = storObj.pay_when_receiving;
  const pay_after_receiving = storObj.pay_after_receiving;
// 
  if (pay_when_receiving && !pay_after_receiving) {
    return "pay_when_receiving";//  فقط دفع قبل الاستلام
  } 
  else if (pay_after_receiving && !pay_when_receiving) {
    return "pay_after_receiving"; //  فقط دفع بعد الاستلام او الباكاب 
  } 
  else if (pay_after_receiving && pay_when_receiving) {
    return "before_and_after_payment"; // يوجد لديه خدمة الدفع قبل او بعد او الباكاب
  } 
 
  else {
    return "error";
  }
};
module.exports = paymentPolicy;

                                                                /*
 ----------------------------------------------------------
بعد الترحيب في المستخدم ويختار اللغه بنحكيله بدك نوصل لك لبيتك او بدك تيجي للمحل بنعملها بتمليت 
اذا بده نوصل اله لبيته بنقله لمرحلة اللوكيشن وبنمشي معه عليها واذا بده يشتري من عنا بناخذه للمرحله 
اللي بعد اللوكيشن وبنخزن اللوكيشن هو لوكيشن المتجر نفسه وبس هيك :) 
 ----------------------------------------------------------
                                                                */