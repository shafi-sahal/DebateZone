module.exports = (res, error = 'Unknown Error', status = 500) => {
  console.log(error.errors[0].path.split('.')[1]);
  res.send({error: error});
};
