module.exports = (res, error = 'Unknown Error', status = 500) => {
  console.log(error);
  res.status(status).end();
};
