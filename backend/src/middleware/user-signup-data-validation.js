const parsePhoneNumber = require('libphonenumber-js');
const errorHandler = require('../shared/error-handler');
const regexes = require('../shared/regexes');

module.exports = (req, res, next) => {
  const body = req.body;
  const name = body.name;
  const username = body.username;
  const email = body.email;
  const mobile = body.mobile;
  const password = body.password;
  const isValidMobile = isMobileValid(mobile);

  const isValidData = regexes.name.test(name) && regexes.username.test(username) && regexes.email.test(email) && isValidMobile && password
                      && password.length >= 8;
  if (!isValidData) return errorHandler(res);
  next();
}

const isMobileValid = number => {
  if (!number) return false;
  const mobileParsed = parsePhoneNumber(number);
  if (!mobileParsed) return false;
  return mobileParsed.isValid();
}
