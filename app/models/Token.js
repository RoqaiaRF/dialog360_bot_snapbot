let StoreModel = require('./Store')
module.exports = (sequelize, Sequelize) => {
    const Token = sequelize.define(
      "token",
      {
        id:{
          type:Sequelize.INTEGER,
          primaryKey:true,
          autoIncrement:true
        },
        token: {
          type: Sequelize.STRING,
        },
        user_id: {
          type: Sequelize.INTEGER,
        },
        token_id:{
          type:Sequelize.INTEGER
        }
      },
      {
        timestamps: false,
      }
    );
      Stores = StoreModel(sequelize, Sequelize);
      Token.belongsTo(Stores,{
        foreignKey:'user_id',
        targetKey:'user_id'
      })
    return Token;

  };
  
