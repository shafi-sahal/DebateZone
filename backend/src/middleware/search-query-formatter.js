'use strict';

module.exports = (req, res, next) => {
  console.log(req.query.query);
  let query = req.query.query;
  const hasAmpersand = query.includes('@');
  if (hasAmpersand) query = query.replace('@','');
  const hasUnderscore = query.includes('_');
  const isQueryStartWithUnderscore = query.charAt(0) === '_';
  if (isQueryStartWithUnderscore) query = '\\' + query;
  const isQueryEndWithUnderscore = query.charAt(query.length - 1) === '_';
  if (isQueryEndWithUnderscore) query = query.slice(0, -1) + '\\_';
  req.query.query = query;
  req.isUsernameQuery = hasAmpersand || hasUnderscore;
  req.isQueryStartWithUnderscore = isQueryStartWithUnderscore;
  next();
}
