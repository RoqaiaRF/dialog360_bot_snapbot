//set data to the redis session

const Redis = require("ioredis");
require("dotenv").config();

//get the REDIS URL frim env file and connect to the server
const REDIS_URL = process.env.REDIS_URL;
const client = new Redis(REDIS_URL);
//REDIS_URL

const setUserVars = async (store_phone, receiver_id, variable, value) => {
  //TODO: تغيير مدة موت الريديس الى 7200 يعني ساعتين
  await client.set(
    `${store_phone}:${receiver_id}:${variable}`,
    value,
    "EX",
    900
  );
};

//get the stored data from the redis session
const getUserVars = async (store_phone, receiver_id, variable) => {
  const myKeyValue = await client.get(
    `${store_phone}:${receiver_id}:${variable}`
  );
  if (myKeyValue) {
    return myKeyValue;
  } else {
    new Promise((resolve, reject) => {
      client.get(`${store_phone}:${receiver_id}:${variable}`, (err, data) => {
        if (data != null || data != undefined) {
          console.log("Redis Success! but can't get data");
          return resolve(data);
        } else if (err) {
          console.log("Redis Failed!", reject(err));
          return reject(err);
        }
      });
    });
  }
};

//delete the stored data from the redis session
const delUserVars = async (store_phone, receiver_id, variable) => {
  await client.del(`${store_phone}:${receiver_id}:${variable}`);
};
// delete all data from all databases in redis
const deleteAllKeys = async () => {
  await client.flushall();
};

module.exports = { setUserVars, getUserVars, delUserVars, deleteAllKeys };
