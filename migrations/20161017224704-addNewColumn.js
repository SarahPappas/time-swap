'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn("users", "email", Sequelize.STRING).then(function() {
      return queryInterface.addColumn("users", "facebookId", Sequelize.STRING).then(function() {
        return queryInterface.addCoumn("users", "facebookToken", Sequelize.STRING)
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn("users", "facebookToken").then(function() {
      return queryInterface.removeColumn("users", "facebookId").then(function() {
        return queryInterface.removeColumn("users", "email")
      });
    });
  }
};
