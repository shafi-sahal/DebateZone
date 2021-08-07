const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const userDataValidation = require('../middleware/user-data-validation');
const encryptPassword = require('../middleware/encrypt-password');
const checkAuth = require('../middleware/check-auth');

router.post('', UserController.login);
router.post('/signup', userDataValidation, encryptPassword, UserController.createUser);
router.put('', checkAuth, UserController.updateUser);
router.get('', checkAuth, UserController.fetchUser);
router.get('/is-duplicate', UserController.isDuplicate);

module.exports = router;
