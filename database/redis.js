//set data to the redis session
const redis = require("ioredis");
const client = redis.createClient();

exports.setUserVars = async (receiver_id, variable, value) => {
  await client.set(`${receiver_id}:${variable}`, value, "EX", 7200);
};

//get the stored data from the redis session
exports.getUserVars = async (receiver_id, variable) => {
  const myKeyValue = client.get(`${receiver_id}:${variable}`);
  return myKeyValue;
};
