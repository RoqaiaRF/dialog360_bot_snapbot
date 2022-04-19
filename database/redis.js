//set data to the redis session
const redis = require("ioredis");
require("dotenv").config();

const REDIS_USERNAME = process.env.REDIS_USERNAME;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const client = new Redis(
  "rediss://default:AVNS_JjFT4eRfCGRaYIy@db-redis-fra1-80366-do-user-9392750-0.b.db.ondigitalocean.com:25061"
);

const setUserVars = async (receiver_id, variable, value) => {
  await client.set(`${receiver_id}:${variable}`, value, "EX", 7200);
};

//get the stored data from the redis session
const getUserVars = async (receiver_id, variable) => {
  const myKeyValue = client.get(`${receiver_id}:${variable}`);
  return myKeyValue;
};

//delete the stored data from the redis session
const delUserVars = async (sender, variable) => {
  await client.del(`${sender}:${variable}`);
};
// delete all data from all databases in redis
const deleteAllKeys = async () => {
  await client.flushall();
};

module.exports = { setUserVars, getUserVars, delUserVars, deleteAllKeys };
