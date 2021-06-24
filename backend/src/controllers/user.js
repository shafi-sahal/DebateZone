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

exports.isDuplicateUsername = (req, res) => {
  User.findOne({ attributes: ['id'], where: { username: req.params.username } }).then(user =>{
    const isDuplicateUsername = !!user
    res.status(200).json({ isDuplicateUsername: isDuplicateUsername });
  });
}
