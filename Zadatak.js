const Sequelize = require('sequelize')

module.exports = function(sequelize) {
   const zadatak = sequelize.define('zadatak')
    return zadatak
}