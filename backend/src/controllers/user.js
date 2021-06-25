const errorHandler = require('../error-handler');
const User = require('../models/user');
const messages = require('../messages');

exports.isDuplicateUsername = (req, res) => {
  User.findOne({ attributes: ['id'], where: { username: req.params.username } }).then(user =>
    res.status(200).json({ isDuplicateUsername: !!user })
  );
}

/*exports.isDuplicateEmail = (req, res) => {
  User.findOne({ attributes: ['id'], where: { email: req.params.email } }).then(user => {})
}*/

exports.createUser = (req, res) => {
  User.create(req.body).then((response) => {
      res.status(200).json({
        message: 'User added'
      });
    })
    .catch(error => errorHandler(res, error)
  );
}
