const Sequelize = require('sequelize')

module.exports = function(sequelize) {
   const grupa = sequelize.define('grupa', {
       naziv: Sequelize.STRING
   })
    return grupa
}