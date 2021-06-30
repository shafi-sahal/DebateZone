const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const userDataValidation = require('../middleware/user-data-validation');
const encryptPassword = require('../middleware/encrypt-password');

router.post('', userDataValidation, encryptPassword, UserController.createUser);
router.get('', UserController.isDuplicate);

module.exports = router;
