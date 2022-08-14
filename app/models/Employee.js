module.exports = (sequelize, Sequelize) => {
    const Employee = sequelize.define(
      "employees",
      {
        name_ar:Sequelize.STRING,
        name_en:Sequelize.STRING,
        phone:Sequelize.STRING,
        is_active:Sequelize.TINYINT,
        status:Sequelize.TINYINT,
        store_id:{
            type:Sequelize.INTEGER
        }
      },
      {
        timestamps: false,
      }
    );
    return Employee;
  };
  