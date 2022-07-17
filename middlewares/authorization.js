const db = require('../database/connection')
const Tokens = require("../app/models/Token")(db.sequelize, db.Sequelize);
const Stores = require("../app/models/Store")(db.sequelize, db.Sequelize);
const authorizeToken = async (req, res, next) => {
  const bearerToken = req.header("Authorization");
  const token = bearerToken?.split(" ")[1];
  const token_id = token?.split("|")[0];
  console.log(bearerToken);
  console.log(token)
  console.log(token_id);
  if (!bearerToken) return res.status(403).json({ msg: "invalid token" });
  const authObject = await Tokens.findOne({
    where: {
      token_id,
    },
    include: {
      model: Stores,
    },
  });
  if (!authObject || !authObject.store)
    return res.status(403).json({ msg: "invalid token" });
  req.store = authObject.store
  next();
};

module.exports = {
    authorizeToken
}
