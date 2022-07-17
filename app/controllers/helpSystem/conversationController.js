const db = require("../../../database/connection");
const Conversations = require("../../models/Conversations")(
  db.sequelize,
  db.Sequelize
);
const Messages = require("../../models/Messages")(db.sequelize, db.Sequelize);

const findConversations = async (req, res) => {
  const { store } = req;
  const { page = 1 } = req.params;
  const { per_page = 12 } = req.params;
  const { phone } = store;
  const offset = (page - 1) * per_page;
  const limit = per_page;
  const data = await Conversations.findAll({
    where: { number_store: phone },
    include: { 
      model: Messages,
   
    },

  });
  if (data.length == 0) return res.status(204).json({ msg: "success", data });
  return res.status(200).json({ msg: "success", data });
};

const findMessages = async(req, res) => {
  const { store } = req;
  const { page = 1 } = req.params;
  const { per_page = 12 } = req.params;
  const { id } = req.params;
  const { phone } = store;
  const offset = (page - 1) * per_page;
  const limit = per_page;

  const data = await Conversations.findOne({
    where: {
      id,
      number_store: phone,
    },
    include:{
        model:Messages,
  
    } 
  });
  if(!data)
    return res.status(404).json({msg:'not found', err:'not found'});
  return res.status(200).json({msg:'success', data})
};

module.exports = {
    findConversations,
    findMessages
}
