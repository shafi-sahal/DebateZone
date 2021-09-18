'use strict';
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const userSignUpDataValidation = require('../middleware/user-signup-data-validation');
const userUpdateDataValidation = require('../middleware/user-update-data-validation');
const encryptPassword = require('../middleware/encrypt-password');
const checkAuth = require('../middleware/check-auth');

router.post('', UserController.login);
router.post('/signup', userSignUpDataValidation, encryptPassword, UserController.createUser);
router.put('', userUpdateDataValidation, checkAuth, UserController.updateUser);
router.get('', checkAuth, UserController.fetchUser);
router.get('/is-duplicate', UserController.isDuplicate);
router.get('/search', UserController.fetchUsers);

module.exports = router;
