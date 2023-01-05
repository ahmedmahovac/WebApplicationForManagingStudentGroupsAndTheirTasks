const Sequelize = require('sequelize')

module.exports = function(sequelize) {
   const vjezba = sequelize.define('vjezba')
    return vjezba
}