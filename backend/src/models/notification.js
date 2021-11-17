'use-strict';
const Sequelize = require('sequelize');

module.exports = sequelize.define('notification',  {
  id: {
    type: Sequelize.INTEGER(11),
    allownull: false,
    autoIncrement: true,
    primaryKey: true
  },
  event_id: {
    type: Sequelize.INTEGER(11),
    allownull: false
  },
  event: {
    type: Sequelize.TINYINT(1),
    allownull: false
  }
})
