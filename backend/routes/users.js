const router = require('express').Router();
const multer = require('multer');
const loginGoogle = require('../middleware/loginGoogle');
const UsersController = require('../controllers/userController');
const protect = require('../middleware/protect');
const imageUploader = require('../middleware/uploadImg');

const imgUploader = multer();

router
  .route('/')
  //* Route to GET a single user via query parameters
  .get(UsersController.getSingleUser)
  //* Route to UPDATE a single user via query parameters
  //! Protected
  .put(
    protect,
    imgUploader.array('photos', 4),
    imageUploader('photo', 'usersAvatars', { isUniqueName: true }),
    UsersController.updateUser,
  );

//* Route to register user via Email/PW
router.route('/register').post(UsersController.createUser);

//* Route to login user via Email/PW and google
router.route('/login').post(loginGoogle, UsersController.loginUser);

//* Route to get session of the user
router.route('/me').get(UsersController.getMe);

module.exports = router;
