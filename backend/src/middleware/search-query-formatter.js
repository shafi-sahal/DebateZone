'use strict';
const errorHandler = require('../shared/error-handler');
const regexes = require('../shared/regexes');

module.exports = (req, res, next) => {
  let query = req.query.query;
  const hasAmpersand = query.includes('@');
  if (hasAmpersand) query = query.replace('@','');
  const hasUnderscore = query.includes('_');
  const hasFullStop = query.includes('.');
  const hasNumber = /\d/.test(query);
  const isUsernameQuery = hasAmpersand || hasUnderscore || hasFullStop || hasNumber;

  const regex = isUsernameQuery ? regexes.usernameSearchTerm : regexes.searchTerm;
  if (!regex.test(query)) return errorHandler(res, new Error('Bad search'));

  const isQueryStartWithUnderscore = query.charAt(0) === '_';
  if (isQueryStartWithUnderscore) query = '\\' + query;
  const isQueryEndWithUnderscore = query.charAt(query.length - 1) === '_';
  if (isQueryEndWithUnderscore) query = query.slice(0, -1) + '\\_';
  req.query.query = query;
  req.isUsernameQuery = isUsernameQuery;
  req.isQueryStartWithUnderscore = isQueryStartWithUnderscore;
  next();
}
