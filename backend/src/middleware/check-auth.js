'use strict';
const { createVerifier } = require('fast-jwt');
const errorHandler = require('../shared/error-handler');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const verify = createVerifier({ key: process.env.JWT_SECRET });
    const payload = verify(token);
    req.userId = payload.userId;
    next();
  } catch(error) {
    errorHandler(res, new Error(error), 403);
  }
}
