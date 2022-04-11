const db = require("../../database/connection");
const Store = require("../models/Store")(db.sequelize, db.Sequelize);

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
const storeDetails = async (phone) => {
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
  return store;
};


module.exports = storeDetails;