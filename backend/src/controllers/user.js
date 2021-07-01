const errorHandler = require('../error-handler');
const User = require('../models/user');
const messages = require('../messages');
const querystring = require('querystring');
const url = require('url');
const bcrypt = require('bcrypt');

exports.isDuplicate = (req, res) => {
  const query = req.query;
  if (query.username) {
    User.findOne({ attributes: ['id'], where: { username: query.username } }).then(user =>
      res.status(200).json({ isDuplicateUsername: !!user })
    );
  } else if (query.email) {
    User.findOne({ attributes: ['id'], where: { email: query.email } }).then(user =>
      res.status(200).json({ isDuplicateEmail: !!user })
    );
  } else if (query.mobile) {
    User.findOne({ attributes: ['id'], where: { mobile: query.mobile } }).then(user =>
      res.status(200).json({ isDuplicateMobile: !!user })
    );
  }
}

exports.createUser = (req, res) => {
  User.create(req.body).then((response) => {
      res.status(200).json({
        message: 'User added'
      });
    })
    .catch(error => errorHandler(res, error)
  );
}

exports.login = (req, res) => {
  const body = req.body;
  const password = body.password;
  const pepper = process.env.PEPPER;
  User.findOne({ attributes: ['password'], where: { email: body.email } }).then(user => {
    if (!user) {
      res.status(200).json({ message: 'Invalid login credentials' });
      return;
    }

    bcrypt.compare(password + pepper, user.password).then(isMatching => {
      if (isMatching) { res.status(200).json({ message: 'Login Successfull' }); }
      else { res.status(200).json({ message: 'Invalid login credentials' }); }
    });
  })
  .catch(error => errorHandler(res, error));
}

