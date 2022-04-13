const db = require("../../database/connection");
const Store = require("../models/Store")(db.sequelize, db.Sequelize);
const redis = require("../../database/redis");

// define relationships
// Store hasMany branchs
Store.hasMany(Store, {
  as: "branchs",
  foreignKey: "parent_id",
  targetKey: "id",
});

Store.belongsTo(Store, {
  as: "parent",
  foreignKey: "parent_id",
  targetKey: "id",
});

//!    :)   لانه نفسه رقم الهاتف ...  فهمتني ؟ receiver_idملاحظات لعبدالله : انا غيرت هنا وحذفت ال 
// ! يعني ابقه هكذا كما هو 
// find store with phone number with branchs
const storeDetails = async (phone) => {
  const store = await redis.getUserVars(phone, "store");
  if (store) {
    console.log("from cache tset");
    return JSON.parse(store);
  } else {
    const store = await Store.findOne(
      {
        where: {
          phone: phone,
        },
        include: {
          model: Store,
          as: "branchs",
          include: {
            model: Store,
            as: "parent",
          },
        },
      },
      {
        attributes: [
          "name_ar",
          "name_en",
          "lat",
          "lat",
          "lng",
          "parent_id",
          "phone",
          "type",
        ],
      }
    );
    await redis.setUserVars(phone, "store", JSON.stringify(store));
    console.log("from db");
    return store;
  }
};

module.exports = storeDetails