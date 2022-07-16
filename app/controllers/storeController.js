const db = require("../../database/connection");
const Store = require("../models/Store")(db.sequelize, db.Sequelize);
const Region = require("../models/Region")(db.sequelize, db.Sequelize);
const redis = require("../../database/redis");
const { getCityName, getNearestLocation } = require("../helpers/location");

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

Store.hasMany(Region, {
  foreignKey: "store_id",
  targetKey: "id",
});
// find store with phone number with branchs
const storeDetails = async (sender, phone) => {

  const store = await redis.getUserVars(phone, sender, "store");
  console.log(sender);
  console.log(phone);
  if (store && store!='null') {
    console.log('store is not null')
    return JSON.parse(store);
  } else {
    console.log('store is null')
    const store = await Store.findOne(
      {
        where: {
          phone: phone,
          parent_id: null,
        },
      },
      {
        attributes: [
          "name_ar",
          "name_en",
          "lat",
          "lng",
          "parent_id",
          "phone",
          "type_id",
          "pay_when_receiving",
          "pay_after_receiving",
          "pickup_Policy",
          "is_order",
          "is_reservation",
        ],
      }
    );
    await redis.setUserVars(phone, sender, "store", JSON.stringify(store));
    return store;
  }
};
// جلب جميع الفروع عن طريق رقم الهاتف
const getAllBranchs = async (phone, sender) => {

  const branches = await redis.getUserVars(phone, sender, "allbranches");
  if (branches) {

    return JSON.parse(branches);
  } else {
    let list = await Store.findAll(
      {
        where: {
          phone: phone,
          deleted_at: null,
        },
      },
      {
        attributes: [
          "name_ar",
          "name_en",
          "lat",
          "lng",
          "parent_id",
          "phone",
          "type",
          "pay_when_receiving",
          "pay_after_receiving",
          "pickup_Policy",
          "is_order",
          "is_reservation",
        ],
      }
    );
    await redis.setUserVars(phone, sender, "allbranches", JSON.stringify(list));

    return list;
  }
};

// جلب عدد الفروع بحسب الهاتف واحدثيات المسخدم
const branchsCount = async (phone, lat, lng) => {
  const cityName = await getCityName(lat, lng);
  //return cityName;
  const count = await Store.count({
    where: {
      phone: phone,
    },
    include: {
      model: Region,
      where: {
        name_en: cityName,
      },
    },
  });
  return count;
};

// تجلب أقرب فرع الى المستخدم وان كان خارج نطاق التغطية تعيد القيمة 0

// تحتاج الى تمرير رقم الهاتف والاحداثيات
const getNearestBranch = async (sender, phone, lat, lng) => {
  const branch = await redis.getUserVars(phone, sender, "branch");
  if (branch) {
    return JSON.parse(branch);
  } else {
    const count = await branchsCount(phone, lat, lng);
    const branchs = await getAllBranchs(phone);
    //return branchs;
    if (count > 0) {
      const nearest = await getNearestLocation({ lat, lng }, branchs);
      await redis.setUserVars(phone, sender, "branch", JSON.stringify(nearest));

      return nearest;
    } else {
      return false;
    }
  }
};

const getFees = async (store_id, city_name) => {
  const region = await Region.findOne(
    {
      where: {
        store_id,
        name_en: city_name,
      },
    },
    {
      attributes: ["fees"],
    }
  );

  if (region == null || region == undefined) return -1;
  else return region.fees;
}; 
module.exports = { storeDetails, getNearestBranch, getAllBranchs, getFees };

