const db = require("../../database/connection");
const feature = require("../models/Feature")(db.sequelize, db.Sequelize);
const redis = require("../../database/redis");

const getFeatures = async (sender, id) => {
  const features_list = await redis.getUserVars(sender, "features");
  if(features_list){
    return JSON.parse(features_list)
  }else{
  let list = await feature.findAll(
    {
      where : {
        product_id: id
      }
    },
    { attributes: ["name_ar", "product_id"] });
    await redis.setUserVars(
      sender,
      "features",
      JSON.stringify(list)
    );
  return list;
  }
};

module.exports = getFeatures;