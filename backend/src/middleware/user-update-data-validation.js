'use strict';
const regexes = require('../shared/regexes');
const errorHandler = require('../shared/error-handler');
const isMobileFormatCorrect = require('../shared/check-mobile-format');

module.exports = (req, res, next) => {

  const mobile = req.body.mobile
  if (mobile) {
    if (!isMobileFormatCorrect(mobile)) return errorHandler(res, 'Invalid mobile');
    req.body = { mobile: mobile };
    return next();
  }

  try {
    for (const key of Object.keys(req.body)) {
      if (!regexes[key].test(req.body[key])) return errorHandler(res, 'Invalid ' + key);
    }
  } catch(error) {
    return errorHandler(res, new Error(error));
  }

  next();
}
