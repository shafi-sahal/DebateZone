module.exports = (res, error = 'Unknown Error', status = 500) => {
  console.log('status: ' + status);
  console.log(new Error(error));
  res.sendStatus(status);
};
