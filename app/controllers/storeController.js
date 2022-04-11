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

// find store with phone number with branchs
exports.storeDetails = async (receiver_id, phone) => {
  const store = await redis.getUserVars(receiver_id, "store");
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
    await redis.setUserVars(receiver_id, "store", JSON.stringify(store));
    console.log("from db");
    return store;
  }
};
