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
  const cart = await newCart("ghghgh", 5, 20);
  const all = await addToCart("ghghgh", { id: 1, price: 200, quantity: 1 });
  console.log("test: ", "all");
});

module.exports = router;
