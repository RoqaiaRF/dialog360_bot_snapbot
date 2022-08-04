module.exports = (sequelize, Sequelize) => {
    const EndUsers = sequelize.define(
      "end_users",
      {
        full_name:Sequelize.STRING,
        phone:Sequelize.STRING,
        store_id:{
            type:Sequelize.INTEGER
        }
      },
      {
        timestamps: false,
      }
    );
    return EndUsers;
  };
  