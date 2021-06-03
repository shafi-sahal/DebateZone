const errorHandler = (error, res, message = undefined) => {
  console.log(error);
  res.status(500).json({
    message: message
  });
};

module.exports = errorHandler;
