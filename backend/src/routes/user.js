const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

router.post('', UserController.createUser);

module.exports = router;
