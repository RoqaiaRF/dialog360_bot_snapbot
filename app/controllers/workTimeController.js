// يرجع اوقات العمل المتاحه
const db = require("../../database/connection");
const WorkTime = require("../models/WorkTime")(db.sequelize, db.Sequelize);
const redis = require("../../database/redis");

const getWorkingTime = async (phone, sender, store_id) => {
  var work_times = await redis.getUserVars(phone, sender, "work_times");

  if (work_times && work_times != "null") {
    return JSON.parse(work_times);
  } else {
    const result = await WorkTime.findOne(
      {
        where: {
          store_id: store_id,
        },
      },
      {
        attributes: ["start_time", "end_time", "store_id"],
      }
    );
    work_times = result.dataValues;

    await redis.setUserVars(
      phone,
      sender,
      "work_times",
      JSON.stringify(work_times)
    );

    /* EX: result.dataValues =
             {
                id: 5,
                days: [
                  '5', '1', '2',
                  '3', '6', '7',
                  '4'
                ],
                start_time: '08:00:00',
                end_time: '00:00:00',
                store_id: 26
              }
          
          */
  }
  return work_times;
};

const checkWithenHours = (start_time, end_time) => {
  // ---------------------------- get time now in UTC format

  let date = new Date();
  const now_time = [
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  ];
  // ------------------------------------------------------------------------------------

  // start_time = "08:00:00" => _start_time = [ 8, 0, 0 ]
  let _start_time = start_time.split(":").map(Number);
  let _end_time = end_time.split(":").map(Number);

  // ---------------------------- Check if the time now within the working hours.

  // مقارنة الوقت بالساعات
  if (now_time[0] > _start_time[0] && now_time[0] < _end_time[0]) {
    return true;
  } else {
    // مقارنة الوقت بالدقائق
    if (now_time[1] < _start_time[1] && now_time[1] < _end_time[1]) {
      return true;
    } else {
      return false;
    }
  }
};

// معرفة اذا كان الوقت الان خارج مواقيت العمل او لا
// return true if the store within the working hours, and false otherwise.

const isWithinWorkingHoursDays = async (phone, sender, storObj) => {
  const date = new Date();
  const todayIs = date.getDay() + ""; // Sunday = 0, Monday = 1, ...


  const workingTime = await getWorkingTime(phone, sender, storObj.id);
  const days = workingTime.days;

  // فحص اذا كان اليوم من ايام العمل او لا
  const checkWithenDays = days.indexOf(todayIs) > -1;
  const is_closed_bot = storObj.is_closed_bot;

  const checkHours = checkWithenHours(
    workingTime.start_time,
    workingTime.end_time
  );

  console.log("checkWithenDays", checkWithenDays);
  console.log("checkHours", checkHours);
  console.log("todayIs", todayIs);
  console.log("is_closed_bot", is_closed_bot);
  var result = 0;

  if (checkWithenDays && checkHours) {
    // اجعل البوت يمشي عادي لانه المتجر يعمل في هذا الوقت
    result = 0;
  } else {
    // اوقف البوت كليا وارسل رساله انه المتجر مغلق
    if ( !is_closed_bot )  {
      result = 1;
    }
    // اجعل البوت يستمر عادي فقط ارسل رسالة ان المتجر مغلق
    else {
      result = 2;
    }
  }
  return result;
};

module.exports = isWithinWorkingHoursDays;
