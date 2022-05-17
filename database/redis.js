//set data to the redis session

const Redis = require("ioredis");
require("dotenv").config();

const client = new Redis( 
  "rediss://default:AVNS_JjFT4eRfCGRaYIy@db-redis-fra1-80366-do-user-9392750-0.b.db.ondigitalocean.com:25061"
);

const setUserVars = async (receiver_id, variable, value) => {
  //TODO: تغيير مدة موت الريديس الى 7200
  await client.set(`${receiver_id}:${variable}`, value, "EX", 50000000);
};

//get the stored data from the redis session
const getUserVars =  async(receiver_id, variable) => {
  const myKeyValue =  await client.get(`${receiver_id}:${variable}`);
  if (myKeyValue) {
    console.log("Success!: get data from redis!")
    console.log( myKeyValue)
    return myKeyValue;
  } else{  
     new Promise((resolve, reject) => {
     client.get(`${receiver_id}:${variable}`, (err, data) => {
      if (data != null || data != undefined) {
        console.log("Redis Success! but can't get data");
        return resolve(data);
      }  
      else if (err) {
        console.log("Redis Failed!",reject(err));
        return reject(err);
      }   
    }); 
  });}
  
}

//delete the stored data from the redis session
const delUserVars = async (sender, variable) => {
  await client.del(`${sender}:${variable}`);
};
// delete all data from all databases in redis
const deleteAllKeys = async () => {
  await client.flushall();
};

module.exports = { setUserVars, getUserVars, delUserVars, deleteAllKeys };
