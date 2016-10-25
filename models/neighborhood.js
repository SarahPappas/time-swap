'use strict';
module.exports = function(sequelize, DataTypes) {
  var neighborhood = sequelize.define('neighborhood', {
    neighborhood: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        models.neighborhood.belongsTo(models.metroArea);
      }
    }
  });
  return neighborhood;
};