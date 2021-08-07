const regexes = require('../shared/regexes');
const errorHandler = require('../shared/error-handler');
module.exports = (req, res, next) => {
  for (const key of Object.keys(req.body)) {
    if (!regexes[key].test(req.body[key])) return errorHandler(res);
  }
  next();
}
