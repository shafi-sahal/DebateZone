const Sequelize = require('sequelize');
const config =  require('../../config/config.json');

const development = config.development;
const sequelize = new Sequelize(development.database, development.username, development.password, {
  host: development.host,
  dialect: development.dialect,
  logging: console.log
});

module.exports = sequelize;
global.sequelize = sequelize;
