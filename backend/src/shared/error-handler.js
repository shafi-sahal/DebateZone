'use strict';
module.exports = (res, error = new Error('Unknown error'), status = 500) => {
  console.log('status: ' + status);
  console.log(error);
  res.sendStatus(status);
};
