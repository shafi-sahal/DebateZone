const errorHandler = require('../shared/error-handler');
const regexes = require('../shared/regexes');
const isMobileFormatCorrect = require('../shared/check-mobile-format');

module.exports = (req, res, next) => {
  const body = req.body;
  const name = body.name;
  const username = body.username;
  const email = body.email;
  const mobile = body.mobile;
  const password = body.password;
  const isValidMobile = isMobileFormatCorrect(mobile);

  const isValidData = regexes.name.test(name) && regexes.username.test(username) && regexes.email.test(email) && isValidMobile && password
                      && password.length >= 8;
  if (!isValidData) return errorHandler(res);
  next();
}

