const parsePhoneNumber = require('libphonenumber-js');

module.exports = number => {
  if (!number) return false;
  const mobileParsed = parsePhoneNumber(number);
  if (!mobileParsed) return false;
  return mobileParsed.isValid();
}
