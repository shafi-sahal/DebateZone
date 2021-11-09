'use-strict';
const Sequelize = require('sequelize');
require('../database/connection');

module.exports = sequelize.define('connection', {
  id: {
    type: Sequelize.INTEGER(11),
    allownull: false,
    autoIncrement: true,
    primaryKey: true
  },
  sender_id: {
    type: Sequelize.INTEGER(11),
    allownull: false
  },
  receiver_id: {
    type: Sequelize.INTEGER(11),
    allownull: false
  },
  status: {
    type: Sequelize.TINYINT(1)
    allownull: false
  }
});
