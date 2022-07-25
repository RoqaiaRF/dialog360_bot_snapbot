//set data to the redis session

const Redis = require("ioredis");
require("dotenv").config();

//get the REDIS URL frim env file and connect to the server
const REDIS_URL = process.env.REDIS_URL;
const client = new Redis(REDIS_URL);
 
const setUserVars = async (store_phone, receiver_id, variable, value) => {
  //TODO: تغيير مدة موت الريديس الى 7200 يعني ساعتين
  store_phone = store_phone.replace('whatsapp:+','');
  await client.set(
    `${store_phone}:${receiver_id}:${variable}`,
    value,
    "EX",
    900
  );
};

const appendToArray = async (store_phone, receiver_id, variable, value) => {
  store_phone = store_phone.replace('whatsapp+:','');
  console.log(store_phone)
  await client.rpush(`${store_phone}:${receiver_id}:${variable}`, value);
};

//get the stored data from the redis session
const getUserVars = async (store_phone, receiver_id, variable) => {
  store_phone = store_phone.replace('whatsapp:+','');
  const myKeyValue = await client.get(
    `${store_phone}:${receiver_id}:${variable}`
  );
  if (myKeyValue) {
    return myKeyValue;
  } else {
    new Promise((resolve, reject) => {
      client.get(`${store_phone}:${receiver_id}:${variable}`, (err, data) => {
        if (data != null || data != undefined) {
         // console.log("Redis Success! but can't get data");
          return resolve(data);
        } else if (err) {

          return reject(err);
        }
      });
    });
  }
};

//delete the stored data from the redis session
const delUserVars = async (store_phone, receiver_id, variable) => {
  store_phone = store_phone.replace('whatsapp:+','');
  await client.del(`${store_phone}:${receiver_id}:${variable}`);
};

const delAllUserVars = async (receiver_id, sender) => {
  delUserVars(receiver_id, sender, "branch");
  delUserVars(receiver_id, sender, "cats");
  delUserVars(receiver_id, sender, "cart");
  delUserVars(receiver_id, sender, "subcategories");
  delUserVars(receiver_id, sender, "subcats");
  delUserVars(receiver_id, sender, "products");
  delUserVars(receiver_id, sender, "language");
  delUserVars(receiver_id, sender, "allbranches");
  delUserVars(receiver_id, sender, "productDetails");
  delUserVars(receiver_id, sender, "quantity");
  delUserVars(receiver_id, sender, "features");
  delUserVars(receiver_id, sender, "pickup_Policy");
  delUserVars(receiver_id, sender, "location");
  delUserVars(receiver_id, sender, "isorder");
  delUserVars(receiver_id, sender, "mode");
  delUserVars(receiver_id, sender, "store");
};
// delete all data from all databases in redis
const deleteAllKeys = async () => {
  await client.flushall();
};

const getAllListElements = async (store_phone, receiver_id, variable) => {
  store_phone = store_phone.replace('whatsapp:+','');
  receiver_id = receiver_id.replace('whatsapp:+','');

  const list = await client.lrange(
    `${store_phone}:${receiver_id}:${variable}`,
    0,
    -1
  );
  return list;
};

const publishToChannel = (
  storePhoneNumber,
  channel,
  type,
  content,
  userPhoneNumber,
  userName, 
  store_id,
  conversation_id
) => {
  // Publish to myChannel.

  const message = {
    data:{
      storePhoneNumber: storePhoneNumber,
      type: type,
      content: content,
      userPhoneNumber: userPhoneNumber,
      userName: userName,
      store_id : store_id,
      conversation_id: conversation_id
    }
      
  };

  
  // Message can be either a string Sor a buffer
  client.publish(`${channel}`, JSON.stringify(message), (error, count) => {
    if (error) {
        throw new Error(error);
    }
    console.log(`${channel}.${type}.${store_id}`);
    console.log(`Subscribed to ${count} channel. Listening for updates on the ${channel} channel.`);
    console.log("message", message)
});

};

module.exports = {
  setUserVars,
  delAllUserVars,
  getUserVars,
  delUserVars,
  deleteAllKeys,
  appendToArray,
  getAllListElements,
  publishToChannel
};
