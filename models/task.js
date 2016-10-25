'use strict';
module.exports = function(sequelize, DataTypes) {
  var task = sequelize.define('task', {
    task: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        
      }
    }
  });
  return task;
}; 