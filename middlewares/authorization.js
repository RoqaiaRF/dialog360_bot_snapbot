const db = require("../database/connection");
const TokenModel = require("../app/models/Token")(db.sequelize, db.Sequelize);
const StoreModel = require('../app/models/Store')(db.sequelize, db.Sequelize)
const authorizeToken = async(req, res, next) => {
  const bearerToken = req.header("Authorization");
  const token = bearerToken?.split(" ")[1];
  console.log(bearerToken)
  console.log(token)
  if (!token) return res.status(403).json({ msg: "invalid token" });

  const token_id = token?.split("|")[0];
  const authObject = await TokenModel.findOne({ 
    where: { token_id },
    include:StoreModel
  });
  if (!authObject.store) return res.status(403).json({ msg: "invalid token" });
  req.store = authObject.store;
  next();
  //    const authObject =
};
module.exports = {
  authorizeToken,
};
