const Redis = require("ioredis");
const client = new Redis();
// "rediss://default:AVNS_JjFT4eRfCGRaYIy@db-redis-fra1-80366-do-user-9392750-0.b.db.ondigitalocean.com:25061"

// helper to add new item to items array
function addItem(arr, item) {
  var index = arr.findIndex((ele) => ele.id == item.id);
  if (index === -1) {
    arr.push(item);
    return true;
  } else {
    return false;
  }
}

// helper to remove  item from items array

function removeItem(arr, item) {
  return arr.filter(function (ele) {
    return ele.id !== item.id;
  });
}
const calcTax = (tax, amount) => {
  const x = (amount * tax) / 100;
  return parseFloat(x);
};
const newCart = async (sender, tax_parecent, fees = 0) => {
  const cart = JSON.parse(await client.get(`${sender}:cart`));
  if (cart) return false;
  const obj = {
    id: sender,
    price: 0,
    fees,
    tax: 0,
    tax_parecent,
    total: this.tax + fees,
    items: [],
  };
  await client.set(`${sender}:cart`, JSON.stringify(obj));
  return cart;
};

// Add new Item to Cart
/**
 *
 * @param {*} sender // whatsapp id
 * @param {*} item  // product object
 * @returns // cart or flase
 */
const addToCart = async (sender, item) => {
  const cart = JSON.parse(await client.get(`${sender}:cart`));
  if (cart) {
    const itemAdded = addItem(cart.items, item);
    /*     cart.total += item.price * item.quantity;
    cart.price = cart.total - cart.tax; */
    cart.price += parseInt(item.price) * parseInt(item.quantity);
    console.log(parseInt(item.quantity));
    cart.tax = calcTax(cart.tax_parecent, cart.price);
    cart.total = cart.price + cart.tax + cart.fees;
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
// Remove item from Cart
/**
 *
 * @param {*} sender // whatsapp id
 * @param {*} item  // product object
 * @returns // cart or flase
 */
const removeFromCart = async (sender, item) => {
  const cart = JSON.parse(await client.get(`${sender}:cart`));
  if (cart) {
    const newItems = removeItem(cart.items, item);
    cart.items = newItems;
    if (cart.items.length == 0) {
      cart.total = 0;
      cart.price = 0;
    } else {
      cart.total -= item.price * item.quantity;
      cart.price = cart.total - cart.tax;
    }
    await client.set(`${sender}:cart`, JSON.stringify(cart));
    return cart;
  } else {
    return false;
  }
};
module.exports = { removeFromCart, newCart, addToCart };
