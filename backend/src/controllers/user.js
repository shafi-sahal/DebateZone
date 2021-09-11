const Sequelize = require('sequelize');
const errorHandler = require('../shared/error-handler');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { createSigner } = require('fast-jwt');
const user = require('../models/user');

exports.isDuplicate = async (req, res) => {
  const query = req.query;
  if (!(query.username || query.email || query.mobile)) {
    return errorHandler(res, new Error('Username, email or mobile required to check for duplicate user'));
  }
  const user = await checkUserExistence(query);
  res.send(!!user);
}

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = generateToken({ userId: user.id });
    res.status(201).json({ token: token, user: { name: user.name, username: user.username }});
  } catch(error) {
    if (error.name !== 'SequelizeUniqueConstraintError') return errorHandler(res, new Error(error))
    message = handleDuplicateUserErrors(error);
    res.status(400).json({ message: message });
  }
}

exports.login = async (req, res) => {
  const loginKey = req.body.loginKey;
  const password = req.body.password;
  if (!loginKey || !password) return errorHandler(res, new Error('loginKey and password is required for login'));

  try {
    const user = await User.findOne({
      attributes: ['id', 'name', 'username', 'password'],
      where: {
        [Sequelize.Op.or]: [ { email: loginKey }, { username: loginKey }, { mobile: loginKey } ]
      }
    });

    if(!user) return errorHandler(res, new Error('Unauthorized (User does not exist)'), 401);
    const pepper = process.env.PEPPER;
    const isPasswordMatching = await bcrypt.compare(password + pepper, user.password);
    if (!isPasswordMatching) return errorHandler(res, new Error('Unauthorized (Password mismatch)'), 401);
    const token = generateToken({ userId: user.id });
    res.json({ token: token, user: { name: user.name, username: user.username } });
  } catch(error) {
    errorHandler(res, new Error(error));
  }
}

exports.fetchUser = async (req, res) => {
  try {
    const user = await User.findOne({ attributes: ['name', 'username', 'email', 'mobile'], where: { id: req.userId } });
    res.send(user);
  } catch(error) {
    errorHandler(res, new Error(error));
  }
}

exports.fetchUsers = (req, res) => {
  const query = req.query.query;
  let fetchedUsers = [];
  searchUsers('%' +query + '%')
    .then(users => {
      if (users.length === 9) return res.send(users);
      else {
        fetchedUsers.push(users);
        return searchUsers('% ' + query + '%');
      }
    })
    .then(users => {
      fetchedUsers.push(users);
      res.send(fetchedUsers);
    })
    .catch(error => errorHandler(res, new Error(error))
  );
}

exports.updateUser = async (req, res) => {
  try {
    await User.update(req.body, { where: { id: req.userId } });
    res.sendStatus(204);
  } catch(error) {
    if (error.name !== 'SequelizeUniqueConstraintError') return errorHandler(res, new Error(error))
    message = handleDuplicateUserErrors(error);
    res.status(400).json({ message: message });
  }
}

const handleDuplicateUserErrors = error => {
  console.log(new Error(error));
  const duplicateField = error.errors[0].path.split('.')[1];
  let message = ''
  if (duplicateField === 'username'){
    message = 'Username already exists. Try again';
  } else if (duplicateField === 'email') {
    message = 'An account with the same email already exists';
  } else if (duplicateField === 'mobile') {
    message = 'An account with same mobile number already exists'
  }

  return message;
}

const checkUserExistence = async query => {
  const conditionKey = Object.keys(query)[0];

  try {
    return await User.findOne({ attributes: ['id'], where: { [conditionKey]: query[conditionKey] } });
  } catch(error){
    errorHandler(res, new Error(error));
  }
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

const searchUsers = likeQuery => {
  return new Promise(resolve => {
    User.findAll({
      attributes: ['name', 'username'],
      where: {
        [Sequelize.Op.or]: [
           { name: { [Sequelize.Op.like]: likeQuery }}, { username: { [Sequelize.Op.like]: likeQuery } }
        ]
      },
      limit: 9
    })
    .then(users => resolve(users));
  });
}
