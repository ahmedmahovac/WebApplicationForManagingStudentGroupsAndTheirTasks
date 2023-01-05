const Sequelize = require('sequelize')

module.exports = function(sequelize) {
   const student = sequelize.define('student', {
       ime: Sequelize.STRING,
       prezime: Sequelize.STRING,
       index: Sequelize.STRING
   })
    return student
}