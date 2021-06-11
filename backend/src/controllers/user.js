const errorHandler = require('../error-handler');
const User = require('../models/user');
const messages = require('../messages');

exports.createUser = (req, res) => {
  User.create(req.body).then((response) => {
      res.status(200).json({
        message: 'User added'
      });
    })
    .catch(error => errorHandler(res, error)
  );
}
