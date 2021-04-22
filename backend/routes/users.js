const router = require('express').Router();
const multer = require('multer');
const loginGoogle = require('../middleware/loginGoogle');
const UsersController = require('../controllers/userController');
const protectUser = require('../middleware/protect');
const updateUserSetting = require('../middleware/updateUserSetting');
const imageUploader = require('../middleware/uploadImg');

const imgUploader = multer();

router
  .route('/')
  //* Route to GET a single user via query parameters
  .get(UsersController.getSingleUser)
  //* Route to UPDATE a single user via query parameters
  //! Protected
  .put(
    protectUser(),
    imgUploader.array('photos', 4),
    imageUploader('photo', 'usersAvatars', { isUniqueName: true }),
    UsersController.updateUser,
  );

//* Route to update user core settings from settings tab
router
  .route('/settings')
  .put(protectUser(), updateUserSetting, UsersController.updateUser);

//* Route to register user via Email/PW
router.route('/register').post(UsersController.createUser);

//* Route to login user via Email/PW and google
router.route('/login').post(loginGoogle, UsersController.loginUser);

//* Route to logout user
router.route('/logout').put(UsersController.logOutUser);

//* Route to get session of the user
router.route('/me').get(UsersController.getMe);

module.exports = router;
