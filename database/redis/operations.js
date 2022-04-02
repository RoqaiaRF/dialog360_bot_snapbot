const redis = require("redis");
const client = redis.createClient();


//^ listen for connect events
/* //TODO: REMOVE THIS FUNCTION
const isConnect = () => {
  let isConnected = false;
  client.on("connect", function () {
    console.log("Connected!");
    isConnected = true;
  });
  return isConnected;
};
*/
//^ Checking the existence of keys

const isExists = (key) => {
  let isExistsed = false;
  client.exists(key, function (err, reply) {
    if (reply === 1) {
      console.log("Exists!");
      isExistsed = true;
    } else {
      console.log("Doesn't exist!");
      isExistsed = false;
    }
  });
  return isExistsed;
};

//^ Deleting keys

const deleteKeys = (key) => {
  return client.del(key, function (err, reply) {
    console.log(reply); // 1
    return reply;
  });
};

//^ give an expiration time to an existing key

const giveExpirationTime = (key, time) => {
  client.expire(key, time); //EX: client.expire('status', 300);
};

//TODO: Incrementing and decrementing

module.exports = {
//  isConnect,
  isExists,
  deleteKeys,
  giveExpirationTime,
};

/*
Dealing with server 
 * 1- sudo service redis-server stop //?: kILL EXISTING SERVER:
 * 2- redis-server //? RERUN REDIS-SERVER
 
To config redis in terminal:
 * 1- Open new terminal
 * 2- redis-cli 

*/
