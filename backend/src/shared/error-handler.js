'use strict';
module.exports = (res, error = new Error('Unknown error'), status = 500) => {
  console.error('status: ' + status);
  console.error(error);
  res.sendStatus(status);
};
