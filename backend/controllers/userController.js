const { hashPassword } = require('../middleware/hashPassword');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

class UsersController {
  /**
  @desc We create a new user passing all data to Mongo
   */
  static async createUser(req, res, next) {
    try {
      const newUserData = req.body;
      if (!req.body.email) {
        return next(new ErrorResponse('Bad request', 400));
      }

      //* if user was registred via email/pw
      if (newUserData.password) {
        newUserData.password = await hashPassword(newUserData.password);
      }

      const {
        ops: [newUser],
      } = await User.createUser(newUserData);

      req.session.user = newUser;

      delete newUser.password;
      delete newUser.createdAt;
      delete newUser.updatedAt;

      res.status(201).json({ succes: true, data: newUser });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsersController;
