const parsePhoneNumber = require('libphonenumber-js');
const errorHandler = require('../shared/error-handler');

module.exports = (req, res, next) => {
  const body = req.body;
  const name = body.name;
  const username = body.username;
  const email = body.email;
  const mobile = body.mobile;
  const password = body.password;
  const regexName = /^[a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`-]+[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'-]{4,}$/;
  const regexUsername = /^(?!.*__)(?!.*\.\.)[a-zA-Z0-9_][a-zA-Z0-9._]{4,29}(?<!\.)$/;
  const regexEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  const isValidMobile = isMobileValid(mobile);

  const isValidData = regexName.test(name) && regexUsername.test(username) && regexEmail.test(email) && isValidMobile && password
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
