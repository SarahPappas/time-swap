'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    metroAreaId: DataTypes.INTEGER,
    neighborhood: DataTypes.INTEGER,
    userWantTaskId: DataTypes.INTEGER,
    userNeedTaskId: DataTypes.INTEGER,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "Invalid email address"
        }
      }
    },
    facebookId: DataTypes.STRING,
    facebookToken: DataTypes.STRING,
    picture: DataTypes.TEXT

  }, {
    classMethods: {
      associate: function(models) {
        
      }
    }
  });
  return user;
};