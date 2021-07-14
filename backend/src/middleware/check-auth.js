const { createVerifier } = require('fast-jwt');
const errorHandler = require('../shared/error-handler');

module.exports = (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const verify = createVerifier({ key: process.env.JWT_SECRET });
    verify(token);
  } catch(error) {
    errorHandler(res, error);
  }
}
