const router = require('express').Router();
const loginGoogle = require('../middleware/loginGoogle');
const UsersController = require('../controllers/userController');

//* Route to get a single user via query parameters
router.route('/').get(UsersController.getSingleUser);

//* Route to register user via Email/PW
router.route('/register').post(UsersController.createUser);

//* Route to login user via Email/PW and google
router.route('/login').post(loginGoogle, UsersController.loginUser);

//* Route to get session of the user
router.route('/me').get(UsersController.getMe);

module.exports = router;
