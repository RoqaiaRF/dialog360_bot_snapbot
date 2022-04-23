const Redis = require("ioredis");
const client = new Redis();
// "rediss://default:AVNS_JjFT4eRfCGRaYIy@db-redis-fra1-80366-do-user-9392750-0.b.db.ondigitalocean.com:25061"
function addItem(a, item) {
  var index = a.findIndex((x) => x.id == item.id);
  if (index === -1) {
    a.push(item);
    return true;
  } else {
    return false;
    console.log("object already exists");
  }
}
const newCart = async (sender, tax) => {
  const cart = JSON.parse(await client.get(`${sender}:cart`));
  if (cart) return false;
  const obj = {
    id: sender,
    tax: tax,
    price: 0,
    total: tax,
    items: [],
  };
  await client.set(`${sender}:cart`, JSON.stringify(obj));
  return cart;
};
const addToCart = async (sender, item) => {
  const cart = JSON.parse(await client.get(`${sender}:cart`));
  if (cart) {
    const itemAdded = addItem(cart.items, item);
    cart.total += item.price;
    if (itemAdded) {
      await client.set(`${sender}:cart`, JSON.stringify(cart));
      return cart;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const removeFromCart = async (sender, item) => {
  const cart = JSON.parse(await client.get(`${sender}:cart`));
  if (cart) {
  } else {
    return false;
  }
};
module.exports = { newCart, addToCart };
