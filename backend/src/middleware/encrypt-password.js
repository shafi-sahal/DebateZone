const bcrypt = require('bcrypt');

module.exports = (req, res, next) => {
  const password = req.body.password;
  const saltRounds = 10;
  const pepper = '13df/gu7;*sy%@dh*-/$#sfr.s!d&';

  bcrypt.hash(password + pepper, saltRounds).then(hash => { req.body.password = hash; next();} );
}
