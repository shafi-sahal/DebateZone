'use strict';
const express = require('express');
const router = express.Router();
const ConnectionController = require('../controllers/connection');
const checkAuth = require('../middleware/check-auth');

router.post('', checkAuth, ConnectionController.sendConnectionRequest);

module.exports = router;
