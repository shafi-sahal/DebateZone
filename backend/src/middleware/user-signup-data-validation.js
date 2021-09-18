'use strict';
const errorHandler = require('../shared/error-handler');
const regexes = require('../shared/regexes');
const isMobileFormatCorrect = require('../shared/check-mobile-format');

module.exports = (req, res, next) => {
  const { name, username, email, mobile, password } = req.body;

  try {
    for (const key of Object.keys(req.body).slice(0, -2)) {
      if (!regexes[key].test(req.body[key])) return errorHandler(res, new Error('Invalid ' + key));
    }
  } catch(error) {
    return errorHandler(res, new Error(error));
  }

  if (mobile && !isMobileFormatCorrect(mobile)) return errorHandler(res, new Error('Invalid mobile'));
  if (!password) return errorHandler(res, new Error('Password is required'));
  if (password.length < 8) return errorHandler(res, new Error('Password should be atleast 8 characters long'));
  next();
}

