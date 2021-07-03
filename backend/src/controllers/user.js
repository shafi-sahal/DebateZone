const Sequelize = require('sequelize');
const errorHandler = require('../error-handler');
const User = require('../models/user');
const messages = require('../messages');
const querystring = require('querystring');
const url = require('url');
const bcrypt = require('bcrypt');

exports.isDuplicate = (req, res) => {
  const query = req.query;
  if (!(query.username || query.email || query.mobile)) {
    errorHandler(res);
    return;
  }
  checkUserExistence(query).then(user => res.status(200).json(user));
}

exports.createUser = (req, res) => {
  User.create(req.body).then(() => res.status(200).json({ isSuccess: true })).catch(error => errorHandler(res, error));
}

exports.login = (req, res) => {
  const emailOrUsername = req.body.emailOrUsername;
  const password = req.body.password;
  if (!(emailOrUsername && password)) {
    errorHandler(res);
    return;
  }
  const pepper = process.env.PEPPER;
  User.findOne({
    attributes: ['password'],
    where: {
      [Sequelize.Op.or]: [ { email: emailOrUsername }, { username: emailOrUsername } ]
    }
  })
  .then(user => {
    if (!user) {
      res.status(200).json({ isSuccess: false });
      return;
    }
    bcrypt.compare(password + pepper, user.password).then(isMatching =>  res.status(200).json({ isSuccess: isMatching }));
  });
}

const checkUserExistence = query => {
  const conditionKey = Object.keys(query)[0];
  return new Promise(resolve => {
    User.findOne({ attributes: ['id'], where: { [conditionKey]: query[conditionKey] } }).then(user => {
      const resKey = 'isDuplicate' + capitalizeFirstLetter(conditionKey);
      resolve({ [resKey]: !!user });
    });
  });
}

const capitalizeFirstLetter = word => {
  const splitted = word.split('');
  splitted[0] = splitted[0].toUpperCase();
  return splitted.join('');
}
