const Redis = require("ioredis");
const payment_PolicyController = require("./payment_PolicyController");
require("dotenv").config();

const { setUserVars, getUserVars } = require("../../database/redis");

const REDIS_URL = process.env.REDIS_URL;
const client = new Redis(REDIS_URL);

const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId({ length: 10 });

// helper to add new item to items array
const addItem = async (arr, item, sender, cart) => {
  // item doesn't exist in cart so add it
  const foundedIndex = arr.findIndex((ele) => ele.id == item.id);
  if (foundedIndex == -1) {
    arr.push(item); // ضيفها بكل
    return true;
  } else {
    // Checking array equality
    const oldFeature = arr[foundedIndex].features;
    const newFeature = item.features;
    let result;
    if (oldFeature.length === newFeature.length) {
      if (oldFeature.length == 0) {
        result = true;
      } else if (oldFeature[0].id === newFeature[0].id) {
        result = true;
      } else {
        result = false;
      }
    }

    //result = true => if incoming feature is equal to existing feature
    if (result) {
      if (arr[foundedIndex].qty === item.qty) {
        return false;
      } else {
        //  احذف الموجود واستبدله بالجديد
        const foundedIndex1 = arr.findIndex(
          (ele) => ele.id == item.id && ele.qty === item.qty
        );
        //  todo : اضافة خاصية الحذف من السله حسب شرط تساوي الكمية
        await removeFromCart(sender, cart.items[foundedIndex1]);
        await addToCart(sender, item);

        return false;
      }
    } else {
      arr.push(item);
      return true;
    }
  }
};

// helper to remove  item from items array

const removeItem = async (items, i) => {
  items.splice(i, 1);
  return items;
};
const calcTax = (tax, amount) => {
  const x = (amount * tax) / 100;
  return parseFloat(x);
};
const newCart = async (
  sender,
  branch_id,
  latitude,
  longitude,
  tax_parecent,
  fees = 0,
  receiver_id
) => {
  const storObj = JSON.parse(
    await client.get(`${receiver_id}:${sender}:store`)
  );
  console.log(receiver_id);
  console.log(sender);
  const payment_Policy = payment_PolicyController(storObj);

  const pickup_Policy = JSON.parse(
    await client.get(`${receiver_id}:${sender}:pickup_Policy`)
  );
  if (pickup_Policy) {
    fees = 0;
  }

  let cart = await client.get(`${receiver_id}:${sender}:cart`);
  if (cart) return false;
  cart = JSON.parse(cart);
  const obj = {
    id: sender,
    branch_id: branch_id,
    latitude: latitude,
    longitude: longitude,
    price: 0,
    fees,
    tax: 0,
    tax_parecent,
    total: this.tax + fees,
    pickup_policy: pickup_Policy,
    payment_Policy: payment_Policy,
    items: [],
    uuid: uid(),
  };
  await setUserVars(receiver_id, sender, "cart", JSON.stringify(obj));
  return cart;
};

// Add new Item to Cart
/**
 *
 * @param {*} sender // whatsapp id
 * @param {*} item  // product object
 * @returns // cart or flase
 */
const addToCart = async (receiver_id, sender, item) => {
  const isOrder = JSON.parse(await getUserVars(receiver_id, sender, "isorder"));
  const cart = JSON.parse(await client.get(`${receiver_id}:${sender}:cart`));
  if (cart.items.find((elm) => elm.uuid == item.uuid)) return false;
  if (cart) {
    const pickup_Policy1 = JSON.parse(
      await client.get(`${receiver_id}:${sender}:pickup_Policy`)
    );
    const itemAdded = addItem(cart.items, item, sender, cart);
    /*     cart.total += item.price * item.quantity;
    cart.price = cart.total - cart.tax; */
    const itemIDinCart = cart.items[cart.items.length - 1];
    let qty = parseInt(itemIDinCart.qty);
    let fee = cart.fees;
    if (pickup_Policy1) {
      fee = 0;
    }
    // اذا كان حجز فاجعل الكمية 1 لانه لازم دايما الكمية للحجز تكون 1
    if (isOrder == false) {
      qty = 1;
    }
    cart.price += parseFloat(itemIDinCart.price) * qty;

    cart.tax = calcTax(cart.tax_parecent, cart.price);

    cart.total = cart.price + cart.tax + fee;
    if (itemAdded) {
      await setUserVars(receiver_id, sender, "cart", JSON.stringify(cart));
      return cart;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

/*-------- Add Feature to Cart ----------------*/
const addFeatureToCart = async (receiver_id, sender, item, feature) => {
  console.log(feature);
  //console.log(item);
  item.features.push(feature);
  item.price = (parseFloat(item.price) + feature.price).toFixed(2);
  let quantity = parseInt(await getUserVars(receiver_id, sender, "quantity"));

  const isOrder = JSON.parse(await getUserVars(receiver_id, sender, "isorder"));

  // اذا كان حجز فاجعل الكمية 1 لانه لازم دايما الكمية للحجز تكون 1
  if (isOrder == false) {
    quantity = 1;
  }

  item.qty = quantity;

  await updateItemFromCartOrCreate({ receiver_id, sender_id: sender, item });
  return item;
};
// Remove item from Cart
/**
 *
 * @param {*} sender // whatsapp id
 * @param {*} item  // product object
 * @returns // cart or flase
 */
const removeFromCart = async (receiver_id, sender, item, productCartIndex) => {
  const cart = JSON.parse(await getUserVars(receiver_id, sender, "cart"));
  const isOrder = JSON.parse(await getUserVars(receiver_id, sender, "isorder"));

  if (cart) {
    const deletedItem = cart.items[productCartIndex];
    let qty = deletedItem.qty;
    const newItems = await removeItem(cart.items, productCartIndex);
    cart.items = newItems;
    if (cart.items.length == 0) {
      cart.total = 0;
      cart.fees = 0;
      cart.price = 0;
      cart.tax = 0;
    } else {
      // اذا كان حجز فاجعل الكمية 1 لانه لازم دايما الكمية للحجز تكون 1
      if (isOrder == false) {
        qty = 1;
      }

      cart.price -= deletedItem.price * qty;
      cart.tax = calcTax(cart.tax_parecent, cart.price);
      cart.total = cart.price + cart.tax + cart.fees;
    }
    await setUserVars(receiver_id, sender, "cart", JSON.stringify(cart));
    return cart;
  } else {
    return false;
  }
};

const updateItemFromCartOrCreate = async ({ receiver_id, sender_id, item }) => {
  const cartRes = await getUserVars(receiver_id, sender_id, "cart");
  let cartData = await JSON.parse(cartRes);
  let old_item =cartData.items.find((elm) => elm.uuid == item.uuid)
  if(cartData.total==null)
  cartData.total = 0;
  if (old_item){

    cartData.items = cartData.items.map((elm) =>
      elm.uuid == item.uuid ? item : elm
    );
    cartData.total = cartData.total+parseFloat(item.price-old_item.price); 
  }
  else {
    cartData.items.push(item);
    cartData.total+= parseFloat(item.price)
  }
  setUserVars(receiver_id, sender_id, "cart", await JSON.stringify(cartData));
};
module.exports = { removeFromCart, newCart, addToCart, addFeatureToCart };
