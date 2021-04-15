const UsersController = require('../controllers/userController');
const loginGoogle = require('../middleware/loginGoogle');
const router = require('express').Router();

router.route('/register').post(loginGoogle, UsersController.createUser);

module.exports = router;
