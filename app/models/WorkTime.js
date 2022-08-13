let StoreModel = require("./Store");

module.exports = (sequelize, Sequelize) => {
  const workTime = sequelize.define(
    "work_times",
    {
      days: {
        type: Sequelize.TEXT,
        get: function () {
          return JSON.parse(this.getDataValue("value"));
        },
      },
      start_time: {
        type: Sequelize.DATE,
      },
      end_time: {
        type: Sequelize.DATE,
      },
      store_id: {
        type: Sequelize.BIGINT,
      },
    },
    {
      timestamps: false,
    }
  );
  Stores = StoreModel(sequelize, Sequelize);
  workTime.belongsTo(Stores, {
    foreignKey: "store_id",
    targetKey: "id",
  });
  return workTime;
};
