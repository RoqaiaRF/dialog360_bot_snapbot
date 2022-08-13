// يرجع اوقات العمل المتاحه
const db = require("../../database/connection");
const WorkTime = require("../models/WorkTime")(db.sequelize, db.Sequelize);
const redis = require("../../database/redis");

const getWorkingTime = async (
  phone = "96566991500",
  sender = "962799849386",
  store_id = "26"
) => {
  const work_times = await redis.getUserVars(phone, sender, "work_times");
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
    await redis.setUserVars(
      phone,
      sender,
      "work_times",
      JSON.stringify(work_times)
    );
    console.log("work_times", result.dataValues);
    return result.dataValues;

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
};

const checkWithenHours = (
  start_time = "08:00:00",
  end_time = "00:00:00"
) => {
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
  if ( (now_time[0] > _start_time[0]) && (now_time[0] < _end_time[0]) ) {
    return true;
  }
  else {
    // مقارنة الوقت بالدقائق
    if ( (now_time[1] < _start_time[1]) && (now_time[1] < _end_time[1]) ){
      return true;
    }
    else {
      return false 
    }
  }

};

// معرفة اذا كان الوقت الان خارج مواقيت العمل او لا
// return true if the store within the working hours, and false otherwise.

const isWithinWorkingHoursDays = () => {

  const date = new Date();
  const todayIs = date.getDay(); // Sunday = 0, Monday = 1, ...
  console.log("todayIs: " + todayIs);
  const workingTime =  getWorkingTime();
 // let checkWithendays = workingTime.days.find(todayIs)
  console.log("workingTime.days: " + workingTime.days);
//   console.log(checkWithenHours( workingTime.start_time, workingTime.end_time));
//   return checkWithendays && checkWithenHours( workingTime.start_time, workingTime.end_time);
};

module.exports = isWithinWorkingHoursDays;
