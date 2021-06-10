const Sequelize = require('sequelize');
require('../database/connection')

module.exports = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER(11),
    allownull: false,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING(255),
    allownull: false
  },
  username: {
    type: Sequelize.STRING(30),
    allownull: false,
    unique: true
  },
  email: {
    type: Sequelize.STRING(255),
    allownull: false
  },
  country: {
    type: Sequelize.STRING(44),
    allownull: false
  },
  mobile: {
    type: Sequelize.STRING(20),
    allownull: false
  },
  password: {
    type: Sequelize.STRING(255),
    allownull: false
  }
});
