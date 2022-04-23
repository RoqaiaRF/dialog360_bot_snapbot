var express = require("express");
const Redis = require("ioredis");
const {
  removeFromCart,
  newCart,
  addToCart,
} = require("../app/controllers/cartController");
const client = new Redis();
// "rediss://default:AVNS_JjFT4eRfCGRaYIy@db-redis-fra1-80366-do-user-9392750-0.b.db.ondigitalocean.com:25061"
var router = express.Router();

router.get("/", async (req, res, next) => {
  const cart = await newCart("ghghgh", 2);
  const all = await removeFromCart("ghghgh", { id: 153, price: 30 });
  console.log("test: ", "all");
});

module.exports = router;
