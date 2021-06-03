const express = require('express');
const app = express();
require('./database/connection');
const userRoutes = require('./routes/user');

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type'
  );
  res.setHeader('Acess-Control-Allow-Methods', 'GET, POST');
  next();
});

app.use('/api/user/', userRoutes);

module.exports = app;
