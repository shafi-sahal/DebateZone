'use strict';
const express = require('express');
const router = express.Router();
const ConnectionController = require('../controllers/connection');

router.post('', ConnectionController.sendConnectionRequest);

module.exports = router;
