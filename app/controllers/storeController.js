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
  const store = await redis.getUserVars(sender, "store");
  
  if (store) {
    return JSON.parse(store);
  } else {
    const store = await Store.findOne(
      {
        where: {
          phone: phone,
          parent_id: null,
        },
        /*         include: {
          model: Store,
          as: "branchs",
          include: {
            model: Store,
            as: "parent",
          },
        }, */
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
        ],
      } 
    );
    await redis.setUserVars(sender, "store", JSON.stringify(store));
    return store;
  }
};
// جلب جميع الفروع عن طريق رقم الهاتف
const getAllBranchs = async (phone) => {
  const branches = await redis.getUserVars(sender, "allbranches");
  if (branches) {
    console.log("from cache");
    return JSON.parse(branches);
  } 
  else{
    let list = await Store.findAll(
      {
        where: {
          phone: phone,
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
        ],
      }
    );
    await redis.setUserVars(sender, "allbranches", JSON.stringify(list));
    console.log("from db");
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
  const branch = await redis.getUserVars(sender, "branch");
  if (branch) {
    return JSON.parse(branch);
  } else {
    const count = await branchsCount(phone, lat, lng);
    const branchs = await getAllBranchs(phone);
    //return branchs;
    if (count > 0) {
      const nearest = await getNearestLocation({ lat, lng }, branchs);
      await redis.setUserVars(sender, "branch", JSON.stringify(nearest));
      return nearest;
    } else {
      return false;
    }
  }
};

const getFees = async(store_id, city_name) =>{
  
    const region = await Region.findOne(
      {
        where: {
          store_id,
          name_en: city_name,
        },
      },
      {
        attributes: [ 
          "fees",
        ],
      } 
    );
    return region.fees;
}
module.exports = { storeDetails, getNearestBranch, getAllBranchs, getFees };



