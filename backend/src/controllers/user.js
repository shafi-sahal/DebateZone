'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
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
  try {
    const user = await checkUserExistence(query);
    res.send(!!user);
  } catch(error) {
    errorHandler(res, new Error(error));
  }
}

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = generateToken({ userId: user.id });
    res.status(201).json({ token: token, user: { name: user.name, username: user.username }});
  } catch(error) {
    if (error.name !== 'SequelizeUniqueConstraintError') return errorHandler(res, error)
    message = handleDuplicateUserErrors(error);
    res.status(400).json({ message: message });
  }
}

exports.login = async (req, res) => {
  const { loginKey, password } = req.body;
  if (!loginKey || !password) return errorHandler(res, new Error('loginKey and password is required for login'));

  let attribute = '';
  if (loginKey.includes('@')) attribute = 'email';
  else if(loginKey.includes('+')) attribute = 'mobile';
  else attribute = 'username';

  try {
    const user = await User.findOne({ attributes: ['id', 'name', 'username', 'password'], where: { [attribute]: loginKey } });

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

exports.fetchUsers = async (req, res) => {
  const query = req.query.query;
  const queryToSearchUsers = req.isUsernameQuery ? getQueryToSearchUsersByUsername(query) : getQueryToSearchUsers(query);
  const users = await sequelize.query(queryToSearchUsers, { model: User })
  res.send(users);
}

exports.updateUser = async (req, res) => {
  try {
    await User.update(req.body, { where: { id: req.userId } });
    res.sendStatus(204);
  } catch(error) {
    if (error.name !== 'SequelizeUniqueConstraintError') return errorHandler(res, error);
    const message = handleDuplicateUserErrors(error);
    res.status(400).json({ message: message });
  }
}

const handleDuplicateUserErrors = error => {
  console.log(error);
  const duplicateField = error.errors[0].path.split('.')[1];

  if (duplicateField === 'username') return 'Username already exists. Try again';
  if (duplicateField === 'email') return 'An account with the same email already exists';
  if (duplicateField === 'mobile') return 'An account with same mobile number already exists';
}

const checkUserExistence = async query => {
  const conditionKey = Object.keys(query)[0];
  const user = await User.findOne({ attributes: ['id'], where: { [conditionKey]: query[conditionKey] } });
  return user;
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

const getLikeQueriesToSearchUSers = query => {
  return {
    nameStartsWithQuery: `'${query}%'`,
    lastNameStartWithQuery: `'% ${query}%'`,
    partAfterUnderscoreStartsWithQuery: `'%\\_${query}%'`,
    partAfterFullStopStartsWithQuery: `'%.${query}%'`,
    namesWithQueryInBetween: `'%${query}%'`
  }
}

const getQueryToSearchUsers = query => {
  const likeQuerySnapshot = getLikeQueriesToSearchUSers(query);

  const likeQueries = [
    likeQuerySnapshot.nameStartsWithQuery,
    likeQuerySnapshot.lastNameStartWithQuery,
    likeQuerySnapshot.namesWithQueryInBetween
  ];

  let queryToSearchUsers = '';
  likeQueries.forEach((likeQuery, index) => {
    queryToSearchUsers += `SELECT name, username FROM users WHERE name LIKE ${likeQuery} OR username LIKE ${likeQuery} UNION `;
    if (index === 1) {
      queryToSearchUsers += `
        SELECT name, username FROM users
        WHERE username LIKE ${likeQuerySnapshot.partAfterUnderscoreStartsWithQuery}
        OR username LIKE ${likeQuerySnapshot.partAfterFullStopStartsWithQuery}
        UNION
      `;
    }
  });

  queryToSearchUsers += `
    SELECT name, username FROM users
    WHERE REPLACE(name, ' ', '') LIKE ${likeQuerySnapshot.namesWithQueryInBetween}
    OR REGEXP_REPLACE(username, '[_|\.]', '') LIKE ${likeQuerySnapshot.namesWithQueryInBetween}
    LIMIT 9;
  `;

  return queryToSearchUsers;
}

const getQueryToSearchUsersByUsername = query => {
  const likeQuerySnapshot = getLikeQueriesToSearchUSers(query);

  const likeQueries = [
    likeQuerySnapshot.nameStartsWithQuery,
    likeQuerySnapshot.partAfterUnderscoreStartsWithQuery,
    likeQuerySnapshot.partAfterFullStopStartsWithQuery,
    likeQuerySnapshot.namesWithQueryInBetween
  ];
  let queryToSearchUsers = '';
  likeQueries.forEach(likeQuery =>
    queryToSearchUsers += `SELECT name, username FROM users WHERE username LIKE ${likeQuery} UNION `
  );

  queryToSearchUsers += `
    SELECT name, username FROM users
    WHERE REGEXP_REPLACE(username, '[_|\.]', '') LIKE ${likeQuerySnapshot.namesWithQueryInBetween} LIMIT 9;
  `;

  return queryToSearchUsers;
}
