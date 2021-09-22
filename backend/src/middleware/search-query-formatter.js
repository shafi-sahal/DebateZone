'use strict';

module.exports = (req, res, next) => {
  console.log(req.query.query);
  let query = req.query.query;
  const hasAmpersand = query.includes('@');
  if (hasAmpersand) query = query.replace('@','');
  const hasUnderscore = query.includes('_');
  const isQueryStartsWithUnderscore = query.charAt(0) === '_';
  if (isQueryStartsWithUnderscore) query = '\\' + query;
  req.query.query = query;console.log(req.query.query);
  req.isUsernameQuery = hasAmpersand || hasUnderscore;
  req.isQueryStartsWithUnderscore = isQueryStartsWithUnderscore;
  next();
}
