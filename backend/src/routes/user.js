const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const userDataValidation = require('../middleware/user-data-validation');
const encryptPassword = require('../middleware/encrypt-password');

router.post('', UserController.login);
router.post('/signup', userDataValidation, encryptPassword, UserController.createUser);
router.get('/check-duplicate', UserController.isDuplicate);

module.exports = router;
