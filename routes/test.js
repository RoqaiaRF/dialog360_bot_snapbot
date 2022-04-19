var express = require("express");
var router = express.Router();
const { setUserVars, getUserVars } = require("../database/redis");
/* const Redis = require("ioredis");
 */
// Create a Redis instance.
// By default, it will connect to localhost:6379.
// We are going to cover how to specify connection options soon.
/* const redis = new Redis(
  "rediss://default:AVNS_JjFT4eRfCGRaYIy@db-redis-fra1-80366-do-user-9392750-0.b.db.ondigitalocean.com:25061"
); */

/* const Redis = require("ioredis");
const redis = new Redis(
  "rediss://default:AVNS_JjFT4eRfCGRaYIy@db-redis-fra1-80366-do-user-9392750-0.b.db.ondigitalocean.com:25061"
); */
/* GET users listing. */
router.get("/", async (req, res, next) => {
  const key = await setUserVars("213554668588", "phase", "1");
  
  console.log("test: ", key);
});

module.exports = router;
