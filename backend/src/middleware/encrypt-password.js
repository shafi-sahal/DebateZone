'use strict';
const bcrypt = require('bcrypt');
const errorHandler = require('../shared/error-handler');

module.exports = async (req, res, next) => {
  const password = req.body.password;
  const saltRounds = 10;
  const pepper = process.env.PEPPER;
  try {
    req.body.password = await bcrypt.hash(password + pepper, saltRounds);
    next();
  } catch(error) {
    errorHandler(res, new Error(error));
  }
}
