const redis = require("redis");
const client = redis.createClient();


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


//^ Incrementing and decrementing for numeric keys

const incrementbyValue = (key, value) => {
  client.incrby(key, value, function(err, reply) {
    console.log(reply); 
  });
}

const decrementbyValue = (key, value) => {
  client.decrby(key, value, function(err, reply) {
    console.log(reply); 
  });
}


module.exports = {
//  isConnect,
  isExists,
  deleteKeys,
  giveExpirationTime,
  incrementbyValue,
  decrementbyValue
};

/*
Dealing with server 
 * 1- sudo service redis-server stop //?: kILL EXISTING SERVER:
 * 2- redis-server //? RERUN REDIS-SERVER
 
To config redis in terminal:
 * 1- Open new terminal
 * 2- redis-cli 

*/
