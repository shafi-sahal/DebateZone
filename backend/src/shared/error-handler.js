const errorHandler = (res, error = 'Unknown Error') => {
  console.log(error);
  res.status(500).end();
};

module.exports = errorHandler;
