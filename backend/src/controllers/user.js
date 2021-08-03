const Sequelize = require('sequelize');
const errorHandler = require('../shared/error-handler');
const User = require('../models/user');
const messages = require('../messages');
const querystring = require('querystring');
const url = require('url');
const bcrypt = require('bcrypt');
const { throwError } = require('rxjs');
const { createSigner } = require('fast-jwt');
const user = require('../models/user');

exports.isDuplicate = (req, res) => {
  const query = req.query;
  if (!(query.username || query.email || query.mobile)) return errorHandler(res);
  checkUserExistence(query).then(hasUser => res.status(200).json(hasUser));
}

exports.createUser = (req, res) => {
  User.create(req.body).then(user => {
    const token = generateToken({ userId: user.id });
    res.status(201).json({ token: token, user: { name: user.name, username: user.username }});
  })
  .catch(error => {
    if (!error.name === 'SequelizeUniqueConstraintError') return errorHandler(res, error)
    console.log(error);
    const duplicateField = error.errors[0].path.split('.')[1];
    let message = ''
    if (duplicateField === 'username'){
      message = 'Username already exists. Try again';
    } else if (duplicateField === 'email') {
      message = 'An account with the same email already exists';
    } else if (duplicateField === 'mobile') {
      message = 'An account with same mobile number already exists'
    }
    res.status(400).json({ message: message });
  });
}

exports.login = (req, res) => {
  const loginKey = req.body.loginKey;
  const password = req.body.password;
  if (!(loginKey && password)) return errorHandler(res);
  const pepper = process.env.PEPPER;
  let fetchedUser;

  User.findOne({
    attributes: ['id', 'name', 'username', 'password'],
    where: {
      [Sequelize.Op.or]: [ { email: loginKey }, { username: loginKey }, { mobile: loginKey } ]
    }
  })
  .then(user => {
    if (!user) throw(404);
    fetchedUser = user;
    const pepper = process.env.PEPPER;
    return bcrypt.compare(password + pepper, user.password)
  })
  .then(isMatching => {
    if (!isMatching) return res.sendStatus(401);
    const token = generateToken({ userId: fetchedUser.id });
    res.json({ token: token, user: { name: fetchedUser.name, username: fetchedUser.username } })
  })
  .catch(error => {
    /*
      A 404 error code is turned to 401 due to security reasons.
      The client should not be able to tell whether the username or password is wrong specifically to make it more difficult for
      unauthorized access.
      This behaviuor does not decrease user friendliness as users can login using their email, username or mobile.
    */
    if (error === 404) errorHandler(res, error, 401); else errorHandler(res, error);
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

const generateToken = payload => {
  const sign = createSigner({ key: process.env.JWT_SECRET });
  return sign(payload);
}
