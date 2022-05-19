const Redis = require("ioredis");
const payment_PolicyController = require("./payment_PolicyController");
const client = new Redis( 
  "rediss://default:AVNS_JjFT4eRfCGRaYIy@db-redis-fra1-80366-do-user-9392750-0.b.db.ondigitalocean.com:25061"
);


//^ DONE!
// helper to add new item to items array
const addItem = async (arr, item, sender, cart) => {

  // item doesn't exist in cart so add it
  const foundedIndex = arr.findIndex((ele) => ele.id == item.id);
  if (foundedIndex == -1) {
    arr.push(item);
    return true;
  } else {
    
    // Checking array equality
    const oldFeature = arr[foundedIndex].features;
    const newFeature = item.features;
    let result;
    if (oldFeature.length === newFeature.length) {
      if(oldFeature.length == 0){
        result=  true;
      }
      else if(oldFeature[0].id === newFeature[0].id){
        result = true
        }
        else { result =  false; }

    }

    //result = true => if incoming feature is equal to existing feature
    if (result) {
    
      if (arr[foundedIndex].qty === item.qty) {

        return false;
      } else {
        // احذف الموجود واستبدله بالجديد
       // const foundedIndex1 = arr.findIndex((ele) => ele.id == item.id && ele.qty === item.qty);
      // todo : اضافة خاصية الحذف من السله حسب شرط تساوي الكمية 
       // await removeFromCart(sender, cart.items[foundedIndex1]) 
       // await addToCart(sender,item);

        return false;
      }
    }
    else {
      arr.push(item);
      return true;
    }
  }
}

// helper to remove  item from items array

const  removeItem  = async (items, i) => {

  items.splice(i, 1);
  return items;
}
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
  fees = 0
) => {
  const isOrder = JSON.parse( await client.get(`${sender}:isorder`));
  const storObj = JSON.parse( await client.get(`${sender}:store`));

  const payment_Policy = payment_PolicyController(storObj)
  console.log("********isOrder*********",isOrder);

  console.log("********payment_Policy*********",payment_Policy);
  const pickup_Policy = JSON.parse( await  client.get(`${sender}:pickup_Policy`));

  const cart = JSON.parse(await client.get(`${sender}:cart`));
  if (cart) return false;
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
    pickup_policy: pickup_Policy ,
    isOrder: isOrder,
    payment_Policy: payment_Policy,
    items: [],
  };
  console.log("cart: ",obj);
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
    const itemAdded = addItem(cart.items , item ,sender, cart);
    /*     cart.total += item.price * item.quantity;
    cart.price = cart.total - cart.tax; */
    const itemIDinCart = cart.items[cart.items.length -1]

    cart.price += parseFloat(itemIDinCart.price) * parseInt(itemIDinCart.qty);

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

/*-------- Add Feature to Cart ----------------*/
const addFeatureToCart = async (sender, item, feature) => {
  
  item.features = [feature]          
  item.price = (parseFloat(item.price) + feature.price ).toFixed(2);
  const quantity =  parseInt( await client.get(`${sender}:quantity`))
  item.qty = quantity

 await addToCart(sender, item)
  console.log("  ------------------------ item ---------------",item);
  
}
// Remove item from Cart
/**
 *
 * @param {*} sender // whatsapp id
 * @param {*} item  // product object
 * @returns // cart or flase
 */
const removeFromCart = async (sender, item, productCartIndex) => {
  const cart = JSON.parse(await client.get(`${sender}:cart`));
  if (cart) {
    const deletedItem =  cart.items[productCartIndex]
    const newItems = await removeItem(cart.items, productCartIndex);
    cart.items = newItems;
    if (cart.items.length == 0) {
      cart.total = 0;
      cart.fees = 0;
      cart.price = 0;
      cart.tax = 0;

    } else {
      cart.price -= deletedItem.price * deletedItem.qty;
      cart.tax = calcTax(cart.tax_parecent, cart.price);
      cart.total = cart.price + cart.tax + cart.fees;
    }
    await client.set(`${sender}:cart`, JSON.stringify(cart));
    return cart;
  } else {
    return false;
  }
};
module.exports = { removeFromCart, newCart, addToCart, addFeatureToCart };
