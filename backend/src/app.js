const express = require('express');
const app = express();
require('./database/connection');
const userRoutes = require('./routes/user');
const path = require('path');

app.use(express.json());
app.use('/', express.static(path.join(__dirname, '../frontend')));

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
app.use((req, res) => res.sendFile(path.join(__dirname, '../frontend', 'index.html')));

module.exports = app;
