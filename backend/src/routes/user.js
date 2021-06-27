const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const userDataValidation = require('../middleware/user-data-validation');

router.post('', userDataValidation, UserController.createUser);
router.get('', UserController.isDuplicate);

module.exports = router;
