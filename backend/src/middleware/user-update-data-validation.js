const regexes = require('../shared/regexes');
const errorHandler = require('../shared/error-handler');
const isMobileFormatCorrect = require('../shared/check-mobile-format');

module.exports = (req, res, next) => {
  const mobile = req.body.mobile
  if (mobile) {
    const isValidMobile = isMobileFormatCorrect(mobile);
    if (!isValidMobile) return errorHandler(res);
    return next();
  }

  for (const key of Object.keys(req.body)) {
    if (!regexes[key].test(req.body[key])) return errorHandler(res);
  }
  next();
}
