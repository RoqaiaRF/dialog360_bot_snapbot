module.exports = (sequelize, Sequelize) => {
  const store = sequelize.define(
    "store",
    {
      name_ar: {
        type: Sequelize.STRING,
      },
     
      lat: {
        type: Sequelize.DOUBLE,
      },
      lagitude: {
        type: Sequelize.DOUBLE,
      },
      parent_id: { 
        type: Sequelize.BIGINT
    },
    phone: { 
      type: Sequelize.INTEGER
    },  

    type: { 
      type: Sequelize.BIGINT
    }, 

    name_en: { 
      type: Sequelize.STRING
    }, 



  },
    {
      timestamps: false,
    }
  );
  return store;
};