'use strict';
module.exports = function(sequelize, DataTypes) {
  var metroArea = sequelize.define('metroArea', {
    metroArea: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
          models.metroArea.hasMany(models.neighborhood);
      }
    }
  });
  return metroArea;
};